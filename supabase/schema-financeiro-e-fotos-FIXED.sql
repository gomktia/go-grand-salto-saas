-- ============================================
-- SISTEMA FINANCEIRO + VENDA DE FOTOS (CORRIGIDO)
-- Grand Salto SaaS - Espaço Revelle
-- ============================================

-- PARTE 1: ENUMS
-- ============================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'status_pagamento') then
    create type status_pagamento as enum ('pendente', 'pago', 'atrasado', 'cancelado');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'metodo_pagamento') then
    create type metodo_pagamento as enum ('pix', 'cartao_credito', 'cartao_debito', 'boleto', 'dinheiro');
  end if;
end $$;


-- PARTE 2: TABELAS FINANCEIRAS
-- ============================================

create table if not exists public.planos_mensalidade (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  nome text not null,
  descricao text,
  valor decimal(10,2) not null,
  dia_vencimento integer default 10,
  ativo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.mensalidades (
  id uuid primary key default gen_random_uuid(),
  estudante_id uuid references public.estudantes(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  plano_id uuid references public.planos_mensalidade(id) on delete set null,

  valor decimal(10,2) not null,
  mes_referencia integer not null,
  ano_referencia integer not null,
  data_vencimento date not null,

  status status_pagamento default 'pendente',
  metodo_pagamento metodo_pagamento,
  data_pagamento date,

  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(estudante_id, mes_referencia, ano_referencia)
);

create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  estudante_id uuid references public.estudantes(id) on delete set null,
  mensalidade_id uuid references public.mensalidades(id) on delete set null,

  valor decimal(10,2) not null,
  metodo_pagamento metodo_pagamento not null,
  status status_pagamento default 'pendente',

  transaction_id text,
  pix_qr_code text,
  pix_qr_code_base64 text,
  pix_copy_paste text,

  data_pagamento timestamp with time zone,
  comprovante_url text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- PARTE 3: TABELAS DE VENDA DE FOTOS
-- ============================================

create table if not exists public.albums_venda (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  galeria_id uuid references public.galerias_fotos(id) on delete cascade,

  titulo text not null,
  descricao text,
  evento_data date,
  capa_url text,

  is_publico boolean default false,
  is_venda_ativa boolean default true,
  preco_padrao decimal(10,2) default 15.00,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.fotos_venda (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.albums_venda(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,

  storage_path_original text not null,
  storage_path_watermark text not null,
  url_watermark text not null,

  preco decimal(10,2) default 15.00,
  titulo text,
  descricao text,

  visualizacoes integer default 0,
  vendas integer default 0,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.pedidos_fotos (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  perfil_id uuid references public.perfis(id) on delete set null,

  nome_comprador text not null,
  email_comprador text not null,
  telefone_comprador text,

  valor_total decimal(10,2) not null,
  quantidade_fotos integer not null,

  status status_pagamento default 'pendente',
  metodo_pagamento metodo_pagamento,
  pagamento_id uuid references public.pagamentos(id),

  liberado_para_download boolean default false,
  download_url text,
  download_expira_em timestamp with time zone,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.itens_pedido_foto (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid references public.pedidos_fotos(id) on delete cascade not null,
  foto_id uuid references public.fotos_venda(id) on delete cascade not null,

  preco_unitario decimal(10,2) not null,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(pedido_id, foto_id)
);


-- PARTE 4: TABELAS SITE
-- ============================================

create table if not exists public.videos_site (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,

  titulo text not null,
  descricao text,
  url_video text not null,
  thumbnail_url text,

  tipo text default 'youtube',
  ordem integer default 0,
  is_destaque boolean default false,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.eventos_calendario (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,

  titulo text not null,
  descricao text,
  data_inicio timestamp with time zone not null,
  data_fim timestamp with time zone,

  local text,
  tipo text default 'evento',
  cor text default '#ec4899',

  is_publico boolean default true,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- PARTE 5: ROW LEVEL SECURITY
-- ============================================

alter table public.planos_mensalidade enable row level security;
alter table public.mensalidades enable row level security;
alter table public.pagamentos enable row level security;
alter table public.albums_venda enable row level security;
alter table public.fotos_venda enable row level security;
alter table public.pedidos_fotos enable row level security;
alter table public.itens_pedido_foto enable row level security;
alter table public.videos_site enable row level security;
alter table public.eventos_calendario enable row level security;

-- Remover políticas antigas
drop policy if exists "Diretora manages planos" on public.planos_mensalidade;
drop policy if exists "Diretora manages mensalidades" on public.mensalidades;
drop policy if exists "Estudantes veem suas mensalidades" on public.mensalidades;
drop policy if exists "Diretora manages pagamentos" on public.pagamentos;
drop policy if exists "Diretora manages albums_venda" on public.albums_venda;
drop policy if exists "Public can view public albums" on public.albums_venda;
drop policy if exists "Public can view watermark photos" on public.fotos_venda;
drop policy if exists "Diretora manages fotos_venda" on public.fotos_venda;
drop policy if exists "Users manage their pedidos" on public.pedidos_fotos;
drop policy if exists "Diretora manages videos_site" on public.videos_site;
drop policy if exists "Public can view videos_site" on public.videos_site;
drop policy if exists "Diretora manages eventos_calendario" on public.eventos_calendario;
drop policy if exists "Public can view eventos_calendario" on public.eventos_calendario;

-- Políticas Financeiro
create policy "Diretora manages planos" on public.planos_mensalidade
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = planos_mensalidade.escola_id
      and perfis.role in ('diretora', 'super_admin')
      limit 1
    )
  );

create policy "Diretora manages mensalidades" on public.mensalidades
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = mensalidades.escola_id
      and perfis.role in ('diretora', 'super_admin')
      limit 1
    )
  );

create policy "Estudantes veem suas mensalidades" on public.mensalidades
  for select using (
    exists (
      select 1 from public.estudantes
      where estudantes.id = mensalidades.estudante_id
      and estudantes.perfil_id = auth.uid()
      limit 1
    )
  );

create policy "Diretora manages pagamentos" on public.pagamentos
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = pagamentos.escola_id
      and perfis.role in ('diretora', 'super_admin')
      limit 1
    )
  );

-- Políticas Venda de Fotos
create policy "Diretora manages albums_venda" on public.albums_venda
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = albums_venda.escola_id
      and perfis.role in ('diretora', 'super_admin')
      limit 1
    )
  );

create policy "Public can view public albums" on public.albums_venda
  for select using (is_publico = true);

create policy "Diretora manages fotos_venda" on public.fotos_venda
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = fotos_venda.escola_id
      and perfis.role in ('diretora', 'super_admin')
      limit 1
    )
  );

create policy "Public can view watermark photos" on public.fotos_venda
  for select using (true);

create policy "Users manage their pedidos" on public.pedidos_fotos
  for all using (
    perfil_id = auth.uid()
    or exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = pedidos_fotos.escola_id
      and perfis.role in ('diretora', 'super_admin')
      limit 1
    )
  );

-- Políticas Site
create policy "Diretora manages videos_site" on public.videos_site
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = videos_site.escola_id
      and perfis.role in ('diretora', 'super_admin')
      limit 1
    )
  );

create policy "Public can view videos_site" on public.videos_site
  for select using (true);

create policy "Diretora manages eventos_calendario" on public.eventos_calendario
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = eventos_calendario.escola_id
      and perfis.role in ('diretora', 'super_admin')
      limit 1
    )
  );

create policy "Public can view eventos_calendario" on public.eventos_calendario
  for select using (is_publico = true);


-- PARTE 6: ÍNDICES
-- ============================================

create index if not exists idx_mensalidades_estudante on public.mensalidades(estudante_id);
create index if not exists idx_mensalidades_escola on public.mensalidades(escola_id);
create index if not exists idx_mensalidades_status on public.mensalidades(status);
create index if not exists idx_mensalidades_data_vencimento on public.mensalidades(data_vencimento);
create index if not exists idx_pagamentos_escola on public.pagamentos(escola_id);
create index if not exists idx_pagamentos_estudante on public.pagamentos(estudante_id);
create index if not exists idx_pagamentos_status on public.pagamentos(status);
create index if not exists idx_albums_venda_escola on public.albums_venda(escola_id);
create index if not exists idx_fotos_venda_album on public.fotos_venda(album_id);
create index if not exists idx_pedidos_fotos_escola on public.pedidos_fotos(escola_id);
create index if not exists idx_pedidos_fotos_perfil on public.pedidos_fotos(perfil_id);
create index if not exists idx_pedidos_fotos_status on public.pedidos_fotos(status);
create index if not exists idx_eventos_calendario_escola on public.eventos_calendario(escola_id);
create index if not exists idx_eventos_calendario_data on public.eventos_calendario(data_inicio);


-- PARTE 7: VERIFICAÇÃO
-- ============================================

select 'TABELAS CRIADAS:' as status;
select table_name from information_schema.tables
where table_schema = 'public'
and table_name in (
  'planos_mensalidade',
  'mensalidades',
  'pagamentos',
  'albums_venda',
  'fotos_venda',
  'pedidos_fotos',
  'itens_pedido_foto',
  'videos_site',
  'eventos_calendario'
)
order by table_name;

select 'ENUMS CRIADOS:' as status;
select typname from pg_type
where typname in ('status_pagamento', 'metodo_pagamento');

-- ✅ SISTEMA FINANCEIRO E VENDA DE FOTOS INSTALADO COM SUCESSO!
