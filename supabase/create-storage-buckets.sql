-- Criar buckets para recursos de turmas
-- Execute este script no SQL Editor do Supabase Dashboard

-- ============================================
-- 1. CRIAR BUCKETS
-- ============================================

-- Bucket para vídeos (max 500MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'turmas-videos',
    'turmas-videos',
    false, -- não público (requer autenticação)
    524288000, -- 500MB em bytes
    array['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
)
on conflict (id) do nothing;

-- Bucket para áudios (max 50MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'turmas-audios',
    'turmas-audios',
    false,
    52428800, -- 50MB em bytes
    array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac']
)
on conflict (id) do nothing;

-- Bucket para documentos (max 20MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'turmas-documentos',
    'turmas-documentos',
    false,
    20971520, -- 20MB em bytes
    array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

-- ============================================
-- 2. POLÍTICAS DE ACESSO (RLS)
-- ============================================

-- TURMAS-VIDEOS
-- --------------

-- Permitir upload para diretoras e professores autenticados
create policy "Diretoras e professores podem fazer upload de vídeos"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'turmas-videos'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'professor')
    )
);

-- Permitir leitura para usuários autenticados da mesma escola
create policy "Usuários autenticados podem visualizar vídeos da sua escola"
on storage.objects for select
to authenticated
using (
    bucket_id = 'turmas-videos'
    and exists (
        select 1 from public.perfis p1
        join public.recursos_turmas rt on rt.arquivo_url like '%' || (storage.objects.name) || '%'
        join public.perfis p2 on p2.id = auth.uid()
        where p1.escola_id = p2.escola_id
    )
);

-- Permitir deletar para diretoras
create policy "Diretoras podem deletar vídeos"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'turmas-videos'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role = 'diretora'
    )
);

-- TURMAS-AUDIOS
-- --------------

create policy "Diretoras e professores podem fazer upload de áudios"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'turmas-audios'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'professor')
    )
);

create policy "Usuários autenticados podem visualizar áudios da sua escola"
on storage.objects for select
to authenticated
using (
    bucket_id = 'turmas-audios'
    and exists (
        select 1 from public.perfis p1
        join public.recursos_turmas rt on rt.arquivo_url like '%' || (storage.objects.name) || '%'
        join public.perfis p2 on p2.id = auth.uid()
        where p1.escola_id = p2.escola_id
    )
);

create policy "Diretoras podem deletar áudios"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'turmas-audios'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role = 'diretora'
    )
);

-- TURMAS-DOCUMENTOS
-- ------------------

create policy "Diretoras e professores podem fazer upload de documentos"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'turmas-documentos'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'professor')
    )
);

create policy "Usuários autenticados podem visualizar documentos da sua escola"
on storage.objects for select
to authenticated
using (
    bucket_id = 'turmas-documentos'
    and exists (
        select 1 from public.perfis p1
        join public.recursos_turmas rt on rt.arquivo_url like '%' || (storage.objects.name) || '%'
        join public.perfis p2 on p2.id = auth.uid()
        where p1.escola_id = p2.escola_id
    )
);

create policy "Diretoras podem deletar documentos"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'turmas-documentos'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role = 'diretora'
    )
);

-- ============================================
-- 3. VERIFICAÇÃO
-- ============================================

-- Verificar se os buckets foram criados
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('turmas-videos', 'turmas-audios', 'turmas-documentos');

-- Verificar políticas criadas
select policyname, tablename, cmd, qual
from pg_policies
where tablename = 'objects'
and policyname like '%turmas%';
