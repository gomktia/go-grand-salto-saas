-- Migration: Sistema de Notificações Automáticas
-- Adiciona tabela de controle de alertas de faltas consecutivas
-- e funções auxiliares para o sistema de notificações

-- ============================================
-- 1. TABELA DE CONTROLE DE ALERTAS DE FALTAS
-- ============================================

-- Rastreia quais alertas já foram enviados para evitar duplicatas
create table if not exists public.alertas_faltas (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  estudante_id uuid references public.estudantes(id) on delete cascade not null,
  turma_id uuid references public.turmas(id) on delete cascade not null,
  faltas_consecutivas integer not null default 3,
  notificacao_enviada boolean default false,
  resolvido boolean default false, -- true quando aluno retorna
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolvido_em timestamp with time zone
);

alter table public.alertas_faltas enable row level security;

create policy "Diretora manages alertas" on public.alertas_faltas
  for all using (is_diretora());

create policy "Staff views alertas" on public.alertas_faltas
  for select using (
    escola_id in (select escola_id from public.perfis where id = auth.uid())
  );

-- Índices para performance
create index if not exists idx_alertas_faltas_escola on public.alertas_faltas(escola_id);
create index if not exists idx_alertas_faltas_estudante on public.alertas_faltas(estudante_id);
create index if not exists idx_alertas_faltas_resolvido on public.alertas_faltas(resolvido) where resolvido = false;

-- ============================================
-- 2. ADICIONAR CAMPO remetente_tipo À NOTIFICAÇÕES
-- ============================================

-- Para identificar notificações automáticas vs manuais
alter table public.notificacoes
  add column if not exists subtipo text,
  add column if not exists referencia_id uuid,
  add column if not exists automatica boolean default false;

-- Índice para buscar notificações não lidas
create index if not exists idx_notificacoes_destinatario_lido
  on public.notificacoes(destinatario_id, lido) where lido = false;

create index if not exists idx_notificacoes_tipo
  on public.notificacoes(tipo, subtipo);

-- ============================================
-- 3. CONFIGURAÇÕES DE NOTIFICAÇÃO POR ESCOLA
-- ============================================

create table if not exists public.config_notificacoes (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null unique,

  -- Faltas
  faltas_consecutivas_alerta integer default 3,
  notificar_responsavel_falta boolean default true,
  notificar_diretora_falta boolean default true,
  notificar_professora_falta boolean default true,

  -- Financeiro
  notificar_responsavel_vencimento boolean default true,
  dias_antes_vencimento integer default 3,
  notificar_responsavel_atraso boolean default true,
  notificar_diretora_atraso boolean default true,

  -- Pedagógico
  notificar_responsavel_avaliacao boolean default true,
  notificar_responsavel_evento boolean default true,

  -- Canais
  canal_padrao text default 'app', -- 'app', 'email', 'whatsapp'

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.config_notificacoes enable row level security;

create policy "Diretora manages config notificacoes" on public.config_notificacoes
  for all using (is_diretora());

create policy "Staff views config notificacoes" on public.config_notificacoes
  for select using (
    escola_id in (select escola_id from public.perfis where id = auth.uid())
  );

-- Inserir configuração padrão para escolas existentes
insert into public.config_notificacoes (escola_id)
  select id from public.escolas
  on conflict (escola_id) do nothing;

-- ============================================
-- 4. ÍNDICES ADICIONAIS PARA CHECKINS (PERFORMANCE)
-- ============================================

create index if not exists idx_checkins_estudante_turma
  on public.checkins(estudante_id, turma_id);

create index if not exists idx_checkins_created_at
  on public.checkins(created_at desc);

create index if not exists idx_checkins_escola_turma
  on public.checkins(escola_id, turma_id, created_at desc);
