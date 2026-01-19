-- Schema para Portal do Responsável - Grand Salto
-- Permite que responsáveis acessem o portal para ver financeiro, presença, fotos, etc.

-- ============================================
-- 1. TABELA DE RESPONSÁVEIS
-- ============================================

-- Tabela para armazenar os responsáveis dos alunos
create table if not exists public.responsaveis (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,

  -- Dados pessoais
  nome_completo text not null,
  email text not null,
  telefone text,
  cpf text,
  parentesco text default 'responsavel', -- 'pai', 'mae', 'avo', 'tio', 'responsavel'

  -- Acesso ao portal (vinculado ao auth.users do Supabase)
  perfil_id uuid references public.perfis(id) on delete set null,

  -- Status
  ativo boolean default true,
  portal_habilitado boolean default true,

  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Constraints
  unique(email, escola_id)
);

-- ============================================
-- 2. TABELA DE VÍNCULO ESTUDANTE-RESPONSÁVEL
-- ============================================

-- Permite múltiplos responsáveis por aluno e múltiplos alunos por responsável
create table if not exists public.estudantes_responsaveis (
  id uuid primary key default gen_random_uuid(),
  estudante_id uuid references public.estudantes(id) on delete cascade not null,
  responsavel_id uuid references public.responsaveis(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,

  -- Tipo de vínculo
  is_principal boolean default false, -- Responsável principal para comunicações
  pode_buscar boolean default true, -- Autorizado a buscar na escola
  recebe_notificacoes boolean default true,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Constraint para evitar duplicatas
  unique(estudante_id, responsavel_id)
);

-- ============================================
-- 3. PERMISSÕES DE ACESSO DO RESPONSÁVEL
-- ============================================

-- Define o que cada responsável pode ver no portal
create table if not exists public.permissoes_responsavel (
  id uuid primary key default gen_random_uuid(),
  responsavel_id uuid references public.responsaveis(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,

  -- Permissões específicas
  ver_financeiro boolean default true,
  ver_presenca boolean default true,
  ver_galeria boolean default true,
  ver_notas boolean default true,
  ver_calendario boolean default true,
  ver_comunicados boolean default true,
  baixar_fotos boolean default false, -- Pode baixar fotos ou apenas ver

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(responsavel_id)
);

-- ============================================
-- 4. HISTÓRICO DE ACESSOS DO RESPONSÁVEL
-- ============================================

create table if not exists public.acessos_responsavel (
  id uuid primary key default gen_random_uuid(),
  responsavel_id uuid references public.responsaveis(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,

  -- Dados do acesso
  ip_address text,
  user_agent text,
  pagina_acessada text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 5. RLS POLICIES
-- ============================================

alter table public.responsaveis enable row level security;
alter table public.estudantes_responsaveis enable row level security;
alter table public.permissoes_responsavel enable row level security;
alter table public.acessos_responsavel enable row level security;

-- Helper: Verificar se é responsável
create or replace function public.is_responsavel() returns boolean as $$
begin
  return exists (
    select 1 from public.perfis
    where id = auth.uid() and role = 'pai'
  );
end;
$$ language plpgsql security definer;

-- Helper: Buscar responsável pelo perfil_id
create or replace function public.get_responsavel_id() returns uuid as $$
begin
  return (
    select id from public.responsaveis
    where perfil_id = auth.uid()
    limit 1
  );
end;
$$ language plpgsql security definer;

-- RESPONSAVEIS: Diretora gerencia, responsável vê o próprio
create policy "Diretora manages responsaveis" on public.responsaveis
  for all using (is_diretora());

create policy "Responsavel sees own data" on public.responsaveis
  for select using (perfil_id = auth.uid());

-- ESTUDANTES_RESPONSAVEIS: Diretora gerencia, responsável vê seus vínculos
create policy "Diretora manages vinculos" on public.estudantes_responsaveis
  for all using (is_diretora());

create policy "Responsavel sees own vinculos" on public.estudantes_responsaveis
  for select using (responsavel_id = get_responsavel_id());

-- PERMISSOES_RESPONSAVEL: Diretora gerencia, responsável vê suas permissões
create policy "Diretora manages permissoes" on public.permissoes_responsavel
  for all using (is_diretora());

create policy "Responsavel sees own permissoes" on public.permissoes_responsavel
  for select using (responsavel_id = get_responsavel_id());

-- ACESSOS_RESPONSAVEL: Diretora vê tudo, responsável vê seus acessos
create policy "Diretora views acessos" on public.acessos_responsavel
  for select using (is_diretora());

create policy "Responsavel sees own acessos" on public.acessos_responsavel
  for select using (responsavel_id = get_responsavel_id());

create policy "System inserts acessos" on public.acessos_responsavel
  for insert with check (true);

-- ============================================
-- 6. PERMITIR RESPONSÁVEL VER DADOS DO ALUNO
-- ============================================

-- Atualizar política de estudantes para permitir responsável ver seus alunos vinculados
drop policy if exists "Responsavel sees their students" on public.estudantes;
create policy "Responsavel sees their students" on public.estudantes
  for select using (
    id in (
      select estudante_id from public.estudantes_responsaveis
      where responsavel_id = get_responsavel_id()
    )
  );

-- Permitir responsável ver métricas dos seus alunos
drop policy if exists "Responsavel sees students metrics" on public.metricas_corpo;
create policy "Responsavel sees students metrics" on public.metricas_corpo
  for select using (
    estudante_id in (
      select estudante_id from public.estudantes_responsaveis
      where responsavel_id = get_responsavel_id()
    )
  );

-- Permitir responsável ver checkins dos seus alunos
drop policy if exists "Responsavel sees students checkins" on public.checkins;
create policy "Responsavel sees students checkins" on public.checkins
  for select using (
    estudante_id in (
      select estudante_id from public.estudantes_responsaveis
      where responsavel_id = get_responsavel_id()
    )
  );

-- ============================================
-- 7. ÍNDICES DE PERFORMANCE
-- ============================================

create index if not exists idx_responsaveis_escola on public.responsaveis(escola_id);
create index if not exists idx_responsaveis_perfil on public.responsaveis(perfil_id);
create index if not exists idx_responsaveis_email on public.responsaveis(email);
create index if not exists idx_estudantes_responsaveis_estudante on public.estudantes_responsaveis(estudante_id);
create index if not exists idx_estudantes_responsaveis_responsavel on public.estudantes_responsaveis(responsavel_id);
create index if not exists idx_acessos_responsavel_responsavel on public.acessos_responsavel(responsavel_id);

-- ============================================
-- 8. TRIGGER PARA UPDATED_AT
-- ============================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_responsaveis_updated_at on public.responsaveis;
create trigger set_responsaveis_updated_at
  before update on public.responsaveis
  for each row execute function public.handle_updated_at();

-- ============================================
-- 9. ADICIONAR POLÍTICAS FINANCEIRAS PARA RESPONSÁVEL
-- ============================================

-- Permitir responsável ver mensalidades dos seus alunos
drop policy if exists "Responsavel sees students mensalidades" on public.mensalidades;
create policy "Responsavel sees students mensalidades" on public.mensalidades
  for select using (
    estudante_id in (
      select estudante_id from public.estudantes_responsaveis
      where responsavel_id = get_responsavel_id()
    )
  );

-- Permitir responsável ver pagamentos dos seus alunos
drop policy if exists "Responsavel sees students pagamentos" on public.pagamentos;
create policy "Responsavel sees students pagamentos" on public.pagamentos
  for select using (
    estudante_id in (
      select estudante_id from public.estudantes_responsaveis
      where responsavel_id = get_responsavel_id()
    )
  );

-- ============================================
-- COMENTÁRIOS
-- ============================================

comment on table public.responsaveis is 'Tabela de responsáveis dos alunos com acesso ao portal';
comment on table public.estudantes_responsaveis is 'Vínculo N:N entre estudantes e responsáveis';
comment on table public.permissoes_responsavel is 'Permissões específicas de cada responsável no portal';
comment on table public.acessos_responsavel is 'Log de acessos do responsável ao portal';
