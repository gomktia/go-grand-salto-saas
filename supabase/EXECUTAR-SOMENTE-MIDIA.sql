-- ============================================
-- SISTEMA DE MÍDIA PARA TURMAS
-- Execute este arquivo no Supabase SQL Editor
-- Pode ser executado múltiplas vezes sem problemas
-- ============================================

-- PARTE 1: CRIAR TABELAS
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
  arquivo_url text,
  arquivo_nome text,
  arquivo_tamanho bigint,
  arquivo_mime text,

  -- URL externa (para tipo 'link')
  url_externa text,

  -- Metadados
  duracao integer,
  thumbnail_url text,

  -- Controle de acesso
  is_publico boolean default false,
  ordem integer default 0,

  -- Estatísticas
  visualizacoes integer default 0,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabela de Progresso de Visualização
create table if not exists public.progresso_recursos (
  id uuid primary key default gen_random_uuid(),
  recurso_id uuid references public.recursos_turmas(id) on delete cascade not null,
  estudante_id uuid references public.estudantes(id) on delete cascade not null,

  progresso_segundos integer default 0,
  completado boolean default false,
  ultima_visualizacao timestamp with time zone default timezone('utc'::text, now()) not null,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(recurso_id, estudante_id)
);

-- 4. Row Level Security
alter table public.recursos_turmas enable row level security;
alter table public.progresso_recursos enable row level security;

-- Remover políticas antigas (se existirem)
drop policy if exists "Diretora e Professor criam recursos" on public.recursos_turmas;
drop policy if exists "Diretora e Professor atualizam recursos" on public.recursos_turmas;
drop policy if exists "Diretora e Professor deletam recursos" on public.recursos_turmas;
drop policy if exists "Membros veem recursos públicos" on public.recursos_turmas;
drop policy if exists "Estudantes registram progresso" on public.progresso_recursos;
drop policy if exists "Estudantes atualizam progresso" on public.progresso_recursos;
drop policy if exists "Estudantes veem progresso" on public.progresso_recursos;
drop policy if exists "Professores veem todo progresso" on public.progresso_recursos;

-- Políticas para recursos_turmas
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
create policy "Estudantes registram progresso" on public.progresso_recursos
  for insert
  with check (
    exists (
      select 1 from public.estudantes e
      where e.id = progresso_recursos.estudante_id
      and e.perfil_id = auth.uid()
    )
  );

create policy "Estudantes atualizam progresso" on public.progresso_recursos
  for update
  using (
    exists (
      select 1 from public.estudantes e
      where e.id = progresso_recursos.estudante_id
      and e.perfil_id = auth.uid()
    )
  );

create policy "Estudantes veem progresso" on public.progresso_recursos
  for select
  using (
    exists (
      select 1 from public.estudantes e
      where e.id = progresso_recursos.estudante_id
      and e.perfil_id = auth.uid()
    )
  );

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

-- 5. Índices
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

-- 7. Função RPC para incrementar visualizações
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


-- PARTE 2: CRIAR BUCKETS DE STORAGE
-- ============================================

-- Bucket para vídeos (500MB max)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'turmas-videos',
    'turmas-videos',
    false,
    524288000,
    array['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
)
on conflict (id) do nothing;

-- Bucket para áudios (50MB max)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'turmas-audios',
    'turmas-audios',
    false,
    52428800,
    array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac']
)
on conflict (id) do nothing;

-- Bucket para documentos (20MB max)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'turmas-documentos',
    'turmas-documentos',
    false,
    20971520,
    array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;


-- PARTE 3: POLÍTICAS DE STORAGE
-- ============================================

-- Remover políticas antigas de storage
drop policy if exists "Professores podem upload vídeos" on storage.objects;
drop policy if exists "Autenticados veem vídeos" on storage.objects;
drop policy if exists "Professores deletam vídeos" on storage.objects;
drop policy if exists "Professores podem upload áudios" on storage.objects;
drop policy if exists "Autenticados veem áudios" on storage.objects;
drop policy if exists "Professores deletam áudios" on storage.objects;
drop policy if exists "Professores podem upload documentos" on storage.objects;
drop policy if exists "Autenticados veem documentos" on storage.objects;
drop policy if exists "Professores deletam documentos" on storage.objects;

-- TURMAS-VIDEOS
create policy "Professores podem upload vídeos"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'turmas-videos'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'professor', 'super_admin')
    )
);

create policy "Autenticados veem vídeos"
on storage.objects for select
to authenticated
using (bucket_id = 'turmas-videos');

create policy "Professores deletam vídeos"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'turmas-videos'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'professor', 'super_admin')
    )
);

-- TURMAS-AUDIOS
create policy "Professores podem upload áudios"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'turmas-audios'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'professor', 'super_admin')
    )
);

create policy "Autenticados veem áudios"
on storage.objects for select
to authenticated
using (bucket_id = 'turmas-audios');

create policy "Professores deletam áudios"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'turmas-audios'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'professor', 'super_admin')
    )
);

-- TURMAS-DOCUMENTOS
create policy "Professores podem upload documentos"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'turmas-documentos'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'professor', 'super_admin')
    )
);

create policy "Autenticados veem documentos"
on storage.objects for select
to authenticated
using (bucket_id = 'turmas-documentos');

create policy "Professores deletam documentos"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'turmas-documentos'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'professor', 'super_admin')
    )
);


-- PARTE 4: VERIFICAÇÃO
-- ============================================

-- Verificar tabelas criadas
select 'TABELAS CRIADAS:' as status;
select table_name from information_schema.tables
where table_schema = 'public'
and table_name in ('recursos_turmas', 'progresso_recursos');

-- Verificar buckets criados
select 'BUCKETS CRIADOS:' as status;
select id, name, public, file_size_limit / 1048576 as max_mb
from storage.buckets
where id in ('turmas-videos', 'turmas-audios', 'turmas-documentos');

-- Verificar políticas RLS
select 'POLÍTICAS RLS:' as status;
select count(*) as total
from pg_policies
where tablename in ('recursos_turmas', 'progresso_recursos');

-- Verificar políticas Storage
select 'POLÍTICAS STORAGE:' as status;
select count(*) as total
from pg_policies
where tablename = 'objects'
and policyname like '%turmas%';

-- ============================================
-- ✅ CONCLUÍDO!
-- ============================================
-- Sistema de Mídia instalado com sucesso!
-- Acesse: Dashboard Diretora > Turmas > Menu > Biblioteca de Mídia
