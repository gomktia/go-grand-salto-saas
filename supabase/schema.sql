-- Database Schema Expanded for Grand Salto - Ballet School SaaS v2
-- Focus: Retention, Body Metrics, Smart Inventory, and Refined RLS

-- 1. Schools (Multi-tenant Root)
create table if not exists public.escolas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nome text not null,
  slug text unique not null,
  custom_domain text unique, -- Domínio próprio do cliente (ex: espacorevelle.com.br)
  logo_url text,
  plano text default 'free', -- 'free', 'pro', 'enterprise'
  configuracoes jsonb default '{}'::jsonb
);

-- 2. Profiles (Standardized roles)
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('diretora', 'professor', 'estudante', 'pai', 'super_admin');
  end if;
end $$;

create table if not exists public.perfis (
  id uuid primary key references auth.users on delete cascade,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  full_name text,
  role user_role default 'estudante'::user_role,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Students Table (Specific Ballet Data)
create table if not exists public.estudantes (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid references public.perfis(id) on delete cascade,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  data_nascimento date,
  nome_responsavel text,
  contato_responsavel text,
  status_matricula text default 'ativo', -- 'ativo', 'inativo', 'pendente'
  observacoes_medicas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Body Metrics (Métricas de Corpo)
create table if not exists public.metricas_corpo (
  id uuid primary key default gen_random_uuid(),
  estudante_id uuid references public.estudantes(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  busto decimal(5,2),
  cintura decimal(5,2),
  quadril decimal(5,2),
  altura decimal(5,2),
  torso decimal(5,2), -- Medida importante para collants/tutus
  data_medicao date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Costume Inventory (Estoque de Figurinos)
create table if not exists public.estoque_figurinos (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  nome text not null,
  descricao text,
  tamanho_padrao text, -- 'P', 'M', 'G', 'PP', 'GG'
  quantidade_total integer default 1,
  quantidade_disponivel integer default 1,
  status_limpeza text default 'limpo', -- 'limpo', 'lavando', 'sujo'
  preco_locacao decimal(10,2),
  img_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Blog Posts (IA Optimized)
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

-- 7. Photo Galleries (Momento do Palco)
create table if not exists public.galerias_fotos (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  evento_nome text not null,
  descricao text,
  data_evento date,
  capa_url text,
  is_public boolean default false,
  share_token uuid default gen_random_uuid(), -- For secure shared links
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Photos and Favorites
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

-- 9. Turmas (Classes)
create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  professor_id uuid references public.perfis(id),
  nome text not null,
  nivel text, -- 'Baby', 'Iniciante', 'Intermediário', 'Avançado'
  vagas_max integer default 15,
  cor_etiqueta text default '#ec4899', -- Cor para visualização no calendário
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Agenda de Aulas (Schedule)
create table if not exists public.agenda_aulas (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid references public.turmas(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  dia_semana integer not null, -- 0 (Domingo) a 6 (Sábado)
  hora_inicio time not null,
  hora_fim time not null,
  sala text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Matrículas em Turmas (Enrollments)
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

-- 12. Notificações e Alertas (Communication)
create table if not exists public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid references public.escolas(id) on delete cascade not null,
  remetente_id uuid references public.perfis(id),
  destinatario_id uuid references public.perfis(id), -- Null para notificações globais ou via filtros
  titulo text not null,
  mensagem text not null,
  tipo text default 'informativo', -- 'alerta', 'financeiro', 'pedagogico', 'feriado'
  canal text default 'app', -- 'app', 'whatsapp', 'email'
  lido boolean default false,
  scheduled_for timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. Check-ins (Updated with link to Turma)
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  estudante_id uuid references public.estudantes(id) on delete cascade not null,
  escola_id uuid references public.escolas(id) on delete cascade not null,
  turma_id uuid references public.turmas(id) on delete cascade,
  metodo text default 'manual',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --- RLS POLICIES (REFINED) ---

-- Enable RLS
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

-- Global Policy Helper: Is Diretora?
create or replace function public.is_diretora() returns boolean as $$
begin
  return exists (
    select 1 from public.perfis 
    where id = auth.uid() and role = 'diretora'
  );
end;
$$ language plpgsql security definer;

-- 1. ESCOLAS: Diretora can edit, everyone in school can view
create policy "School members can view school" on public.escolas
  for select using (id in (select escola_id from public.perfis where id = auth.uid()));

create policy "Diretora can update school" on public.escolas
  for update using (is_diretora());

-- 2. ESTUDANTES: Diretora sees all, Professors see their students (linked via classes/enrollments - simplified here for MVP)
create policy "Diretora sees all students" on public.estudantes
  for all using (is_diretora());

create policy "Students can see their own registry" on public.estudantes
  for select using (perfil_id = auth.uid());

-- 3. METRICAS_CORPO: Diretora only for editing, students for viewing theirs
create policy "Diretora manages metrics" on public.metricas_corpo
  for all using (is_diretora());

-- 4. ESTOQUE_FIGURINOS: Diretora manages, anyone in school views
create policy "School members view costumes" on public.estoque_figurinos
  for select using (escola_id in (select escola_id from public.perfis where id = auth.uid()));

create policy "Diretora manages costumes" on public.estoque_figurinos
  for all using (is_diretora());

-- 5. BLOG & GALERIAS: Diretora manages, public or school members view
create policy "Diretora manages content" on public.posts_blog
  for all using (is_diretora());

create policy "Diretora manages galleries" on public.galerias_fotos
  for all using (is_diretora());

create policy "Viewers can see photos" on public.fotos
  for select using (escola_id in (select escola_id from public.perfis where id = auth.uid()));

-- 6. FAVORITES: Personal access
alter table public.notificacoes enable row level security;
alter table public.turmas enable row level security;
alter table public.agenda_aulas enable row level security;
alter table public.matriculas_turmas enable row level security;

-- 7. TURMAS & AGENDA: Diretora manages, everyone in school views
create policy "School members can view classes" on public.turmas
  for select using (escola_id in (select escola_id from public.perfis where id = auth.uid()));

create policy "Diretora manages classes" on public.turmas
  for all using (is_diretora());

create policy "School members can view agenda" on public.agenda_aulas
  for select using (escola_id in (select escola_id from public.perfis where id = auth.uid()));

create policy "Diretora manages agenda" on public.agenda_aulas
  for all using (is_diretora());

-- 8. MATRICULAS: Diretora manages, Students see their own
create policy "Diretora manages enrollments" on public.matriculas_turmas
  for all using (is_diretora());

create policy "Students view their enrollments" on public.matriculas_turmas
  for select using (estudante_id in (select id from public.estudantes where perfil_id = auth.uid()));

-- 9. NOTIFICACOES: Diretora manages, Users see notifications addressed to them
create policy "Diretora manage notifications" on public.notificacoes
  for all using (is_diretora());

create policy "Users view their notifications" on public.notificacoes
  for select using (destinatario_id = auth.uid() or destinatario_id is null);
