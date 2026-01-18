-- ============================================
-- FIX ENUM + SCHEMA COMPLETO
-- Execute este arquivo no Supabase SQL Editor
-- ============================================

-- 1. Adicionar 'super_admin' ao enum user_role (se não existir)
do $$
begin
  -- Verificar se super_admin já existe no enum
  if not exists (
    select 1 from pg_enum
    where enumlabel = 'super_admin'
    and enumtypid = (select oid from pg_type where typname = 'user_role')
  ) then
    alter type user_role add value 'super_admin';
  end if;
end $$;

-- 2. Criar tabelas (se não existirem)

create table if not exists public.escolas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nome text not null,
  slug text unique not null,
  custom_domain text unique,
  logo_url text,
  plano text default 'free',
  configuracoes jsonb default '{}'::jsonb
);

create table if not exists public.perfis (
  id uuid primary key references auth.users on delete cascade,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  full_name text,
  role user_role default 'estudante'::user_role,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.estudantes (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid references public.perfis(id) on delete cascade,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  data_nascimento date,
  nome_responsavel text,
  contato_responsavel text,
  status_matricula text default 'ativo',
  observacoes_medicas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.metricas_corpo (
  id uuid primary key default gen_random_uuid(),
  estudante_id uuid references public.estudantes(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  busto decimal(5,2),
  cintura decimal(5,2),
  quadril decimal(5,2),
  altura decimal(5,2),
  torso decimal(5,2),
  data_medicao date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.estoque_figurinos (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  nome text not null,
  descricao text,
  tamanho_padrao text,
  quantidade_total integer default 1,
  quantidade_disponivel integer default 1,
  status_limpeza text default 'limpo',
  preco_locacao decimal(10,2),
  img_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.posts_blog (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  titulo text not null,
  slug text not null,
  conteudo_markdown text,
  resumo_seo text,
  keywords_seo text[],
  imagem_capa_url text,
  status text default 'rascunho',
  autor_id uuid references public.perfis(id),
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.galerias_fotos (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  evento_nome text not null,
  descricao text,
  data_evento date,
  capa_url text,
  is_public boolean default false,
  share_token uuid default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.fotos (
  id uuid primary key default gen_random_uuid(),
  galeria_id uuid references public.galerias_fotos(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  storage_path text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.fotos_favoritas (
  id uuid primary key default gen_random_uuid(),
  foto_id uuid references public.fotos(id) on delete cascade not null,
  perfil_id uuid references public.perfis(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(foto_id, perfil_id)
);

create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  professor_id uuid references public.perfis(id),
  nome text not null,
  nivel text,
  vagas_max integer default 15,
  cor_etiqueta text default '#ec4899',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.agenda_aulas (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid references public.turmas(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  dia_semana integer not null,
  hora_inicio time not null,
  hora_fim time not null,
  sala text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.matriculas_turmas (
  id uuid primary key default gen_random_uuid(),
  estudante_id uuid references public.estudantes(id) on delete cascade not null,
  turma_id uuid references public.turmas(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  data_matricula date default current_date,
  status text default 'ativo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(estudante_id, turma_id)
);

create table if not exists public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  remetente_id uuid references public.perfis(id),
  destinatario_id uuid references public.perfis(id),
  titulo text not null,
  mensagem text not null,
  tipo text default 'informativo',
  canal text default 'app',
  lido boolean default false,
  scheduled_for timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  estudante_id uuid references public.estudantes(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  turma_id uuid references public.turmas(id) on delete cascade,
  metodo text default 'manual',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.escolas enable row level security;
alter table public.perfis enable row level security;
alter table public.estudantes enable row level security;
alter table public.metricas_corpo enable row level security;
alter table public.estoque_figurinos enable row level security;
alter table public.posts_blog enable row level security;
alter table public.galerias_fotos enable row level security;
alter table public.fotos enable row level security;
alter table public.fotos_favoritas enable row level security;
alter table public.checkins enable row level security;
alter table public.notificacoes enable row level security;
alter table public.turmas enable row level security;
alter table public.agenda_aulas enable row level security;
alter table public.matriculas_turmas enable row level security;

-- 4. Helper Function
create or replace function public.is_diretora() returns boolean as $$
begin
  return exists (
    select 1 from public.perfis
    where id = auth.uid() and role in ('diretora', 'super_admin')
  );
end;
$$ language plpgsql security definer;

-- 5. Remover políticas antigas
drop policy if exists "School members can view school" on public.escolas;
drop policy if exists "Diretora can update school" on public.escolas;
drop policy if exists "Diretora sees all students" on public.estudantes;
drop policy if exists "Students can see their own registry" on public.estudantes;
drop policy if exists "Diretora manages metrics" on public.metricas_corpo;
drop policy if exists "School members view costumes" on public.estoque_figurinos;
drop policy if exists "Diretora manages costumes" on public.estoque_figurinos;
drop policy if exists "Diretora manages content" on public.posts_blog;
drop policy if exists "Diretora manages galleries" on public.galerias_fotos;
drop policy if exists "Viewers can see photos" on public.fotos;
drop policy if exists "School members can view classes" on public.turmas;
drop policy if exists "Diretora manages classes" on public.turmas;
drop policy if exists "School members can view agenda" on public.agenda_aulas;
drop policy if exists "Diretora manages agenda" on public.agenda_aulas;
drop policy if exists "Diretora manages enrollments" on public.matriculas_turmas;
drop policy if exists "Students view their enrollments" on public.matriculas_turmas;
drop policy if exists "Diretora manage notifications" on public.notificacoes;
drop policy if exists "Users view their notifications" on public.notificacoes;
drop policy if exists "Users can create their own profile" on public.perfis;
drop policy if exists "Users can manage their favorites" on public.fotos_favoritas;
drop policy if exists "Public can view published posts" on public.posts_blog;
drop policy if exists "Public can view shared galleries" on public.galerias_fotos;

-- 6. Criar políticas
create policy "School members can view school" on public.escolas
  for select using (id in (select escola_id from public.perfis where id = auth.uid()));

create policy "Diretora can update school" on public.escolas
  for update using (is_diretora());

create policy "Diretora sees all students" on public.estudantes
  for all using (is_diretora());

create policy "Students can see their own registry" on public.estudantes
  for select using (perfil_id = auth.uid());

create policy "Diretora manages metrics" on public.metricas_corpo
  for all using (is_diretora());

create policy "School members view costumes" on public.estoque_figurinos
  for select using (escola_id in (select escola_id from public.perfis where id = auth.uid()));

create policy "Diretora manages costumes" on public.estoque_figurinos
  for all using (is_diretora());

create policy "Diretora manages content" on public.posts_blog
  for all using (is_diretora());

create policy "Diretora manages galleries" on public.galerias_fotos
  for all using (is_diretora());

create policy "Viewers can see photos" on public.fotos
  for select using (escola_id in (select escola_id from public.perfis where id = auth.uid()));

create policy "School members can view classes" on public.turmas
  for select using (escola_id in (select escola_id from public.perfis where id = auth.uid()));

create policy "Diretora manages classes" on public.turmas
  for all using (is_diretora());

create policy "School members can view agenda" on public.agenda_aulas
  for select using (escola_id in (select escola_id from public.perfis where id = auth.uid()));

create policy "Diretora manages agenda" on public.agenda_aulas
  for all using (is_diretora());

create policy "Diretora manages enrollments" on public.matriculas_turmas
  for all using (is_diretora());

create policy "Students view their enrollments" on public.matriculas_turmas
  for select using (estudante_id in (select id from public.estudantes where perfil_id = auth.uid()));

create policy "Diretora manage notifications" on public.notificacoes
  for all using (is_diretora());

create policy "Users view their notifications" on public.notificacoes
  for select using (destinatario_id = auth.uid() or destinatario_id is null);

create policy "Users can create their own profile" on public.perfis
  for insert with check (id = auth.uid());

create policy "Users can manage their favorites" on public.fotos_favoritas
  for all using (perfil_id = auth.uid());

create policy "Public can view published posts" on public.posts_blog
  for select using (status = 'publicado' or is_diretora());

create policy "Public can view shared galleries" on public.galerias_fotos
  for select using (is_public = true or is_diretora());

-- 7. Índices
create index if not exists idx_estudantes_escola on public.estudantes(escola_id);
create index if not exists idx_estudantes_perfil on public.estudantes(perfil_id);
create index if not exists idx_checkins_estudante on public.checkins(estudante_id);
create index if not exists idx_checkins_escola on public.checkins(escola_id);
create index if not exists idx_metricas_estudante on public.metricas_corpo(estudante_id);
create index if not exists idx_turmas_escola on public.turmas(escola_id);
create index if not exists idx_turmas_professor on public.turmas(professor_id);
create index if not exists idx_fotos_galeria on public.fotos(galeria_id);
create index if not exists idx_posts_escola on public.posts_blog(escola_id);
create index if not exists idx_posts_status on public.posts_blog(status);
create index if not exists idx_galerias_escola on public.galerias_fotos(escola_id);
create index if not exists idx_galerias_share_token on public.galerias_fotos(share_token);
create index if not exists idx_perfis_escola on public.perfis(escola_id);
create index if not exists idx_perfis_role on public.perfis(role);

-- 8. Verificação
select 'ENUM ATUALIZADO:' as status;
select enumlabel from pg_enum
where enumtypid = (select oid from pg_type where typname = 'user_role')
order by enumsortorder;

select 'TABELAS CRIADAS:' as status;
select table_name from information_schema.tables
where table_schema = 'public'
and table_name in ('escolas', 'perfis', 'estudantes', 'turmas', 'agenda_aulas', 'matriculas_turmas')
order by table_name;

select 'POLÍTICAS RLS:' as status;
select count(*) as total_policies from pg_policies where schemaname = 'public';

-- ✅ SCHEMA PRINCIPAL INSTALADO!
