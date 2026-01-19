-- ============================================
-- BLOG POSTS PARA SITE PÚBLICO (FIXED)
-- Grand Salto SaaS - Espaço Revelle
-- ============================================

-- Drop existing table if it exists (clean install)
drop table if exists public.posts_blog cascade;

-- Tabela de Posts do Blog
create table public.posts_blog (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,

  titulo text not null,
  slug text not null,
  descricao_curta text,
  conteudo text not null,

  imagem_capa text,
  autor text,

  categoria text,
  tags text[],

  is_publicado boolean default false,
  is_destaque boolean default false,

  data_publicacao timestamp with time zone,
  visualizacoes integer default 0,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(escola_id, slug)
);

-- Enable RLS
alter table public.posts_blog enable row level security;

-- Políticas RLS
create policy "Diretora manages posts_blog" on public.posts_blog
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = posts_blog.escola_id
      and perfis.role in ('diretora', 'super_admin')
      limit 1
    )
  );

create policy "Public can view published posts" on public.posts_blog
  for select using (is_publicado = true);

-- Índices
create index idx_posts_blog_escola on public.posts_blog(escola_id);
create index idx_posts_blog_slug on public.posts_blog(slug);
create index idx_posts_blog_publicado on public.posts_blog(is_publicado);
create index idx_posts_blog_destaque on public.posts_blog(is_destaque);
create index idx_posts_blog_data_publicacao on public.posts_blog(data_publicacao);

-- Função para atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger para atualizar updated_at
create trigger update_posts_blog_updated_at
  before update on public.posts_blog
  for each row
  execute function update_updated_at_column();

-- Incrementar visualizações
create or replace function increment_visualizacoes_post(post_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.posts_blog
  set visualizacoes = visualizacoes + 1
  where id = post_id;
end;
$$;

-- Verificação
select 'TABELA POSTS_BLOG CRIADA:' as status;
select table_name from information_schema.tables
where table_schema = 'public'
and table_name = 'posts_blog';

-- ✅ BLOG POSTS INSTALADO COM SUCESSO!
