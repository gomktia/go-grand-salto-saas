-- ============================================
-- RECURSOS DE MÍDIA PARA TURMAS
-- Vídeos e Áudios para aulas
-- ============================================

-- 1. Criar ENUM para tipos de mídia
do $$
begin
  if not exists (select 1 from pg_type where typname = 'tipo_recurso') then
    create type tipo_recurso as enum ('video', 'audio', 'documento', 'link');
  end if;
end $$;

-- 2. Tabela de Recursos de Turmas
create table if not exists public.recursos_turmas (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid references public.turmas(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  criador_id uuid references public.perfis(id) on delete set null,

  -- Informações do recurso
  titulo text not null,
  descricao text,
  tipo tipo_recurso not null,

  -- Storage (Supabase Storage)
  arquivo_url text, -- URL do arquivo no Supabase Storage
  arquivo_nome text, -- Nome original do arquivo
  arquivo_tamanho bigint, -- Tamanho em bytes
  arquivo_mime text, -- MIME type (video/mp4, audio/mpeg, etc)

  -- URL externa (para tipo 'link')
  url_externa text,

  -- Metadados
  duracao integer, -- Duração em segundos (para vídeo/áudio)
  thumbnail_url text, -- Miniatura do vídeo

  -- Controle de acesso
  is_publico boolean default false, -- Se alunos podem ver
  ordem integer default 0, -- Ordem de exibição

  -- Estatísticas
  visualizacoes integer default 0,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabela de Progresso de Visualização (tracking)
create table if not exists public.progresso_recursos (
  id uuid primary key default gen_random_uuid(),
  recurso_id uuid references public.recursos_turmas(id) on delete cascade not null,
  estudante_id uuid references public.estudantes(id) on delete cascade not null,

  -- Progresso
  progresso_segundos integer default 0, -- Até onde assistiu/ouviu
  completado boolean default false,
  ultima_visualizacao timestamp with time zone default timezone('utc'::text, now()) not null,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Constraint: um registro por estudante por recurso
  unique(recurso_id, estudante_id)
);

-- 4. Row Level Security (RLS)
alter table public.recursos_turmas enable row level security;
alter table public.progresso_recursos enable row level security;

-- Políticas para recursos_turmas

-- Diretora e Professor podem criar recursos para suas turmas
create policy "Diretora e Professor criam recursos" on public.recursos_turmas
  for insert
  with check (
    exists (
      select 1 from public.perfis p
      where p.id = auth.uid()
      and p.escola_id = recursos_turmas.escola_id
      and p.role in ('diretora', 'professor', 'super_admin')
    )
  );

-- Diretora e Professor podem atualizar seus recursos
create policy "Diretora e Professor atualizam recursos" on public.recursos_turmas
  for update
  using (
    exists (
      select 1 from public.perfis p
      where p.id = auth.uid()
      and p.escola_id = recursos_turmas.escola_id
      and p.role in ('diretora', 'professor', 'super_admin')
    )
  );

-- Diretora e Professor podem deletar recursos
create policy "Diretora e Professor deletam recursos" on public.recursos_turmas
  for delete
  using (
    exists (
      select 1 from public.perfis p
      where p.id = auth.uid()
      and p.escola_id = recursos_turmas.escola_id
      and p.role in ('diretora', 'professor', 'super_admin')
    )
  );

-- Todos da escola podem ver recursos públicos de suas turmas
create policy "Membros veem recursos públicos" on public.recursos_turmas
  for select
  using (
    exists (
      select 1 from public.perfis p
      where p.id = auth.uid()
      and p.escola_id = recursos_turmas.escola_id
    )
    and (
      is_publico = true
      or exists (
        select 1 from public.perfis p2
        where p2.id = auth.uid()
        and p2.role in ('diretora', 'professor', 'super_admin')
      )
    )
  );

-- Políticas para progresso_recursos

-- Estudantes podem inserir seu próprio progresso
create policy "Estudantes registram progresso" on public.progresso_recursos
  for insert
  with check (
    exists (
      select 1 from public.estudantes e
      where e.id = progresso_recursos.estudante_id
      and e.perfil_id = auth.uid()
    )
  );

-- Estudantes podem atualizar seu próprio progresso
create policy "Estudantes atualizam progresso" on public.progresso_recursos
  for update
  using (
    exists (
      select 1 from public.estudantes e
      where e.id = progresso_recursos.estudante_id
      and e.perfil_id = auth.uid()
    )
  );

-- Estudantes podem ver seu próprio progresso
create policy "Estudantes veem progresso" on public.progresso_recursos
  for select
  using (
    exists (
      select 1 from public.estudantes e
      where e.id = progresso_recursos.estudante_id
      and e.perfil_id = auth.uid()
    )
  );

-- Professores e Diretoras podem ver progresso de todos os alunos
create policy "Professores veem todo progresso" on public.progresso_recursos
  for select
  using (
    exists (
      select 1 from public.recursos_turmas rt
      join public.perfis p on p.escola_id = rt.escola_id
      where rt.id = progresso_recursos.recurso_id
      and p.id = auth.uid()
      and p.role in ('diretora', 'professor', 'super_admin')
    )
  );

-- 5. Índices para performance
create index if not exists idx_recursos_turmas_turma on public.recursos_turmas(turma_id);
create index if not exists idx_recursos_turmas_escola on public.recursos_turmas(escola_id);
create index if not exists idx_recursos_turmas_tipo on public.recursos_turmas(tipo);
create index if not exists idx_recursos_turmas_publico on public.recursos_turmas(is_publico);
create index if not exists idx_progresso_recursos_recurso on public.progresso_recursos(recurso_id);
create index if not exists idx_progresso_recursos_estudante on public.progresso_recursos(estudante_id);

-- 6. Trigger para updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_recursos_turmas_updated_at on public.recursos_turmas;
create trigger update_recursos_turmas_updated_at
  before update on public.recursos_turmas
  for each row
  execute function update_updated_at_column();

-- 7. Storage Buckets (executar via Supabase Dashboard ou API)
-- Criar buckets:
-- - turmas-videos (privado, max 500MB por arquivo)
-- - turmas-audios (privado, max 50MB por arquivo)
-- - turmas-documentos (privado, max 20MB por arquivo)

-- Políticas de Storage (exemplo):
-- INSERT: Apenas diretora e professor
-- SELECT: Todos da mesma escola
-- UPDATE/DELETE: Apenas criador do arquivo

COMMENT ON TABLE public.recursos_turmas IS 'Biblioteca de mídia para turmas: vídeos, áudios, documentos e links';
COMMENT ON TABLE public.progresso_recursos IS 'Tracking de progresso de visualização de recursos pelos alunos';
COMMENT ON COLUMN public.recursos_turmas.tipo IS 'Tipo do recurso: video, audio, documento, link';
COMMENT ON COLUMN public.recursos_turmas.arquivo_url IS 'URL do arquivo no Supabase Storage';
COMMENT ON COLUMN public.recursos_turmas.duracao IS 'Duração em segundos (para vídeo e áudio)';
COMMENT ON COLUMN public.recursos_turmas.is_publico IS 'Se true, alunos podem visualizar. Se false, apenas professores/diretoras';
COMMENT ON COLUMN public.progresso_recursos.progresso_segundos IS 'Posição em segundos até onde o aluno assistiu/ouviu';

-- 8. Função RPC para incrementar visualizações
create or replace function incrementar_visualizacoes_recurso(recurso_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.recursos_turmas
  set visualizacoes = visualizacoes + 1
  where id = recurso_id;
end;
$$;
