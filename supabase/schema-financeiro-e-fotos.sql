-- ============================================
-- SISTEMA FINANCEIRO + VENDA DE FOTOS
-- Grand Salto SaaS - Espaço Revelle
-- ============================================

-- PARTE 1: SISTEMA FINANCEIRO (Mensalidades e Pagamentos)
-- ============================================

-- Tipo de status de pagamento
do $$
begin
  if not exists (select 1 from pg_type where typname = 'status_pagamento') then
    create type status_pagamento as enum ('pendente', 'pago', 'atrasado', 'cancelado');
  end if;
end $$;

-- Tipo de método de pagamento
do $$
begin
  if not exists (select 1 from pg_type where typname = 'metodo_pagamento') then
    create type metodo_pagamento as enum ('pix', 'cartao_credito', 'cartao_debito', 'boleto', 'dinheiro');
  end if;
end $$;

-- 1. Planos de Mensalidade
create table if not exists public.planos_mensalidade (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  nome text not null, -- Ex: "Plano Baby II", "Plano Jazz Adulto"
  descricao text,
  valor decimal(10,2) not null,
  dia_vencimento integer default 10, -- Dia do mês (1-31)
  ativo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Mensalidades (Cobranças Recorrentes)
create table if not exists public.mensalidades (
  id uuid primary key default gen_random_uuid(),
  estudante_id uuid references public.estudantes(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  plano_id uuid references public.planos_mensalidade(id) on delete set null,

  valor decimal(10,2) not null,
  mes_referencia integer not null, -- 1-12
  ano_referencia integer not null,
  data_vencimento date not null,

  status status_pagamento default 'pendente',
  metodo_pagamento metodo_pagamento,
  data_pagamento date,

  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(estudante_id, mes_referencia, ano_referencia)
);

-- 3. Pagamentos (Registro de Transações)
create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  estudante_id uuid references public.estudantes(id) on delete set null,
  mensalidade_id uuid references public.mensalidades(id) on delete set null,

  valor decimal(10,2) not null,
  metodo_pagamento metodo_pagamento not null,
  status status_pagamento default 'pendente',

  -- Dados de Pagamento
  transaction_id text, -- ID externo (gateway)
  pix_qr_code text,
  pix_qr_code_base64 text,
  pix_copy_paste text,

  data_pagamento timestamp with time zone,
  comprovante_url text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- PARTE 2: SISTEMA DE VENDA DE FOTOS
-- ============================================

-- 4. Álbuns de Fotos (Públicos ou Privados para Venda)
create table if not exists public.albums_venda (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  galeria_id uuid references public.galerias_fotos(id) on delete cascade,

  titulo text not null,
  descricao text,
  evento_data date,
  capa_url text,

  is_publico boolean default false, -- Se false, requer login para ver
  is_venda_ativa boolean default true, -- Se está habilitado para venda
  preco_padrao decimal(10,2) default 15.00,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Fotos para Venda (com watermark)
create table if not exists public.fotos_venda (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.albums_venda(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,

  -- URLs
  storage_path_original text not null, -- Arquivo original (protegido)
  storage_path_watermark text not null, -- Arquivo com marca d'água (público)
  url_watermark text not null, -- URL pública com watermark

  -- Metadados
  preco decimal(10,2) default 15.00,
  titulo text,
  descricao text,

  -- Estatísticas
  visualizacoes integer default 0,
  vendas integer default 0,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Pedidos de Fotos
create table if not exists public.pedidos_fotos (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  perfil_id uuid references public.perfis(id) on delete set null,

  -- Dados do Comprador (pode ser não autenticado)
  nome_comprador text not null,
  email_comprador text not null,
  telefone_comprador text,

  -- Valores
  valor_total decimal(10,2) not null,
  quantidade_fotos integer not null,

  -- Pagamento
  status status_pagamento default 'pendente',
  metodo_pagamento metodo_pagamento,
  pagamento_id uuid references public.pagamentos(id),

  -- Download
  liberado_para_download boolean default false,
  download_url text, -- URL temporária para download
  download_expira_em timestamp with time zone,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Itens do Pedido (Fotos Compradas)
create table if not exists public.itens_pedido_foto (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid references public.pedidos_fotos(id) on delete cascade not null,
  foto_id uuid references public.fotos_venda(id) on delete cascade not null,

  preco_unitario decimal(10,2) not null,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(pedido_id, foto_id)
);


-- PARTE 3: BLOG DINÂMICO E CALENDÁRIO
-- ============================================

-- 8. Vídeos Destacados no Site
create table if not exists public.videos_site (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,

  titulo text not null,
  descricao text,
  url_video text not null, -- YouTube, Vimeo ou Storage
  thumbnail_url text,

  tipo text default 'youtube', -- 'youtube', 'vimeo', 'storage'
  ordem integer default 0,
  is_destaque boolean default false,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Eventos do Calendário
create table if not exists public.eventos_calendario (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,

  titulo text not null,
  descricao text,
  data_inicio timestamp with time zone not null,
  data_fim timestamp with time zone,

  local text,
  tipo text default 'evento', -- 'evento', 'aula_aberta', 'recital', 'feriado'
  cor text default '#ec4899',

  is_publico boolean default true, -- Se aparece no site público

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- PARTE 4: ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
alter table public.planos_mensalidade enable row level security;
alter table public.mensalidades enable row level security;
alter table public.pagamentos enable row level security;
alter table public.albums_venda enable row level security;
alter table public.fotos_venda enable row level security;
alter table public.pedidos_fotos enable row level security;
alter table public.itens_pedido_foto enable row level security;
alter table public.videos_site enable row level security;
alter table public.eventos_calendario enable row level security;

-- Remover políticas antigas (se existirem)
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
    )
  );

create policy "Diretora manages mensalidades" on public.mensalidades
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = mensalidades.escola_id
      and perfis.role in ('diretora', 'super_admin')
    )
  );

create policy "Estudantes veem suas mensalidades" on public.mensalidades
  for select using (
    exists (
      select 1 from public.estudantes
      where estudantes.id = mensalidades.estudante_id
      and estudantes.perfil_id = auth.uid()
    )
  );

create policy "Diretora manages pagamentos" on public.pagamentos
  for all using (
    exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = pagamentos.escola_id
      and perfis.role in ('diretora', 'super_admin')
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
    )
  );

create policy "Public can view watermark photos" on public.fotos_venda
  for select using (true); -- Todos podem ver watermark

create policy "Users manage their pedidos" on public.pedidos_fotos
  for all using (
    perfil_id = auth.uid()
    or exists (
      select 1 from public.perfis
      where perfis.id = auth.uid()
      and perfis.escola_id = pedidos_fotos.escola_id
      and perfis.role in ('diretora', 'super_admin')
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
    )
  );

create policy "Public can view eventos_calendario" on public.eventos_calendario
  for select using (is_publico = true);


-- PARTE 5: ÍNDICES
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


-- PARTE 6: FUNÇÕES ÚTEIS
-- ============================================

-- Gerar mensalidades automaticamente para o próximo mês
create or replace function gerar_mensalidades_mes_corrente(escola_uuid uuid)
returns void
language plpgsql
security definer
as $$
declare
  mes_atual integer;
  ano_atual integer;
begin
  mes_atual := extract(month from current_date);
  ano_atual := extract(year from current_date);

  -- Inserir mensalidades para todos os alunos ativos da escola
  insert into public.mensalidades (estudante_id, escola_id, plano_id, valor, mes_referencia, ano_referencia, data_vencimento)
  select
    e.id,
    e.escola_id,
    null, -- Pode vincular a um plano depois
    280.00, -- Valor padrão, ajustar depois
    mes_atual,
    ano_atual,
    (date_trunc('month', current_date) + interval '10 days')::date
  from public.estudantes e
  where e.escola_id = escola_uuid
    and e.status_matricula = 'ativo'
    and not exists (
      select 1 from public.mensalidades m
      where m.estudante_id = e.id
        and m.mes_referencia = mes_atual
        and m.ano_referencia = ano_atual
    );
end;
$$;

-- Atualizar status de mensalidades atrasadas
create or replace function atualizar_status_mensalidades_atrasadas()
returns void
language plpgsql
security definer
as $$
begin
  update public.mensalidades
  set status = 'atrasado'
  where status = 'pendente'
    and data_vencimento < current_date;
end;
$$;


-- PARTE 7: VERIFICAÇÃO
-- ============================================

select 'TABELAS FINANCEIRAS CRIADAS:' as status;
select table_name from information_schema.tables
where table_schema = 'public'
and table_name in ('planos_mensalidade', 'mensalidades', 'pagamentos', 'albums_venda', 'fotos_venda', 'pedidos_fotos', 'videos_site', 'eventos_calendario')
order by table_name;

select 'ENUMS CRIADOS:' as status;
select enumlabel from pg_enum
where enumtypid = (select oid from pg_type where typname in ('status_pagamento', 'metodo_pagamento'))
order by enumsortorder;

-- ✅ SISTEMA FINANCEIRO E VENDA DE FOTOS INSTALADO!
