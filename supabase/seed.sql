-- Seed Data for Grand Salto Development
-- Execute este script no SQL Editor do Supabase após rodar schema.sql

-- IMPORTANTE: Este script cria dados de teste e usuários de demonstração
-- Não executar em produção!

-- 1. Criar Escola de Teste (Espaço Revelle)
INSERT INTO public.escolas (id, nome, slug, custom_domain, plano, configuracoes)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Espaço Revelle',
    'espaco-revelle',
    'espacorevelle.com.br',
    'pro',
    '{"primaryColor": "#c72d1c", "secondaryColor": "#c29493", "accentColor": "#7d3e37"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar Usuários de Teste no Auth (você precisa fazer isso via Supabase Dashboard ou API)
-- Por enquanto, vamos criar os perfis para IDs que você criará manualmente

-- INSTRUÇÕES PARA CRIAR USUÁRIOS:
-- 1. Vá para Authentication > Users no Supabase Dashboard
-- 2. Crie os seguintes usuários:
--    - Email: diretora@espacorevelle.com.br | Senha: revelle123
--    - Email: professor@espacorevelle.com.br | Senha: revelle123
--    - Email: aluno@espacorevelle.com.br | Senha: revelle123
--    - Email: pai@espacorevelle.com.br | Senha: revelle123

-- 3. Copie os UUIDs gerados e substitua abaixo

-- Exemplo de perfis (substitua os IDs pelos reais após criar usuários)
-- INSERT INTO public.perfis (id, escola_id, full_name, role)
-- VALUES
--     ('UUID-DA-DIRETORA', '00000000-0000-0000-0000-000000000001', 'Maria Silva', 'diretora'),
--     ('UUID-DO-PROFESSOR', '00000000-0000-0000-0000-000000000001', 'João Santos', 'professor'),
--     ('UUID-DO-ALUNO', '00000000-0000-0000-0000-000000000001', 'Ana Costa', 'estudante'),
--     ('UUID-DO-PAI', '00000000-0000-0000-0000-000000000001', 'Carlos Costa', 'pai');

-- 3. Criar Estudantes de Exemplo
INSERT INTO public.estudantes (escola_id, data_nascimento, nome_responsavel, contato_responsavel, status_matricula, observacoes_medicas)
VALUES
    ('00000000-0000-0000-0000-000000000001', '2015-03-15', 'Carla Mendes', '(55) 99999-1111', 'ativo', 'Alergia a látex'),
    ('00000000-0000-0000-0000-000000000001', '2014-07-22', 'Roberto Lima', '(55) 99999-2222', 'ativo', NULL),
    ('00000000-0000-0000-0000-000000000001', '2016-01-10', 'Paula Souza', '(55) 99999-3333', 'ativo', NULL),
    ('00000000-0000-0000-0000-000000000001', '2015-11-05', 'Marcos Rocha', '(55) 99999-4444', 'inativo', 'Asma controlada'),
    ('00000000-0000-0000-0000-000000000001', '2014-05-18', 'Juliana Alves', '(55) 99999-5555', 'ativo', NULL)
ON CONFLICT DO NOTHING;

-- 4. Adicionar Métricas Corporais
INSERT INTO public.metricas_corpo (estudante_id, escola_id, busto, cintura, quadril, altura, torso, data_medicao)
SELECT
    e.id,
    e.escola_id,
    CASE
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 6 AND 8 THEN 60 + (random() * 5)::numeric(5,2)
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 9 AND 11 THEN 65 + (random() * 8)::numeric(5,2)
        ELSE 70 + (random() * 10)::numeric(5,2)
    END as busto,
    CASE
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 6 AND 8 THEN 55 + (random() * 5)::numeric(5,2)
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 9 AND 11 THEN 58 + (random() * 7)::numeric(5,2)
        ELSE 62 + (random() * 10)::numeric(5,2)
    END as cintura,
    CASE
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 6 AND 8 THEN 65 + (random() * 8)::numeric(5,2)
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 9 AND 11 THEN 72 + (random() * 10)::numeric(5,2)
        ELSE 78 + (random() * 12)::numeric(5,2)
    END as quadril,
    CASE
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 6 AND 8 THEN 120 + (random() * 15)::numeric(5,2)
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 9 AND 11 THEN 135 + (random() * 20)::numeric(5,2)
        ELSE 150 + (random() * 25)::numeric(5,2)
    END as altura,
    CASE
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 6 AND 8 THEN 50 + (random() * 10)::numeric(5,2)
        WHEN EXTRACT(YEAR FROM AGE(e.data_nascimento)) BETWEEN 9 AND 11 THEN 58 + (random() * 12)::numeric(5,2)
        ELSE 65 + (random() * 15)::numeric(5,2)
    END as torso,
    CURRENT_DATE - interval '15 days' as data_medicao
FROM public.estudantes e
WHERE e.escola_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT DO NOTHING;

-- 5. Criar Turmas
INSERT INTO public.turmas (escola_id, nome, nivel, vagas_max, cor_etiqueta)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Baby Class I', 'Baby', 12, '#f59e0b'),
    ('00000000-0000-0000-0000-000000000001', 'Iniciante A', 'Iniciante', 15, '#ec4899'),
    ('00000000-0000-0000-0000-000000000001', 'Intermediário B', 'Intermediário', 12, '#8b5cf6'),
    ('00000000-0000-0000-0000-000000000001', 'Avançado', 'Avançado', 10, '#06b6d4'),
    ('00000000-0000-0000-0000-000000000001', 'Jazz Teens', 'Intermediário', 15, '#f97316')
ON CONFLICT DO NOTHING;

-- 6. Criar Agenda de Aulas
INSERT INTO public.agenda_aulas (turma_id, escola_id, dia_semana, hora_inicio, hora_fim, sala)
SELECT
    t.id,
    t.escola_id,
    2, -- Terça
    '14:00'::time,
    '15:30'::time,
    'Sala Principal'
FROM public.turmas t
WHERE t.nome = 'Baby Class I'
UNION ALL
SELECT
    t.id,
    t.escola_id,
    4, -- Quinta
    '14:00'::time,
    '15:30'::time,
    'Sala Principal'
FROM public.turmas t
WHERE t.nome = 'Baby Class I'
UNION ALL
SELECT
    t.id,
    t.escola_id,
    2, -- Terça
    '16:00'::time,
    '17:30'::time,
    'Sala Principal'
FROM public.turmas t
WHERE t.nome = 'Iniciante A'
UNION ALL
SELECT
    t.id,
    t.escola_id,
    5, -- Sexta
    '16:00'::time,
    '17:30'::time,
    'Sala Principal'
FROM public.turmas t
WHERE t.nome = 'Iniciante A'
ON CONFLICT DO NOTHING;

-- 7. Criar Figurinos no Estoque
INSERT INTO public.estoque_figurinos (escola_id, nome, descricao, tamanho_padrao, quantidade_total, quantidade_disponivel, status_limpeza, preco_locacao)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Tutu Profissional Cisne Negro', 'Tutu clássico preto para apresentações', 'M', 12, 10, 'limpo', 150.00),
    ('00000000-0000-0000-0000-000000000001', 'Collant Rosa Baby', 'Collant rosa para Baby Class', 'P', 25, 25, 'limpo', 45.00),
    ('00000000-0000-0000-0000-000000000001', 'Tutu Branco Giselle', 'Tutu romântico branco', 'M', 8, 6, 'lavando', 180.00),
    ('00000000-0000-0000-0000-000000000001', 'Figurino La Bayadère', 'Conjunto completo oriental', 'G', 6, 5, 'limpo', 220.00),
    ('00000000-0000-0000-0000-000000000001', 'Collant Preto Básico', 'Collant preto manga longa', 'M', 30, 28, 'limpo', 40.00),
    ('00000000-0000-0000-0000-000000000001', 'Saia de Tule Rosa', 'Saia romântica para ensaios', 'Único', 15, 12, 'sujo', 35.00)
ON CONFLICT DO NOTHING;

-- 8. Criar Galeria de Fotos
INSERT INTO public.galerias_fotos (escola_id, evento_nome, descricao, data_evento, is_public)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Espetáculo de Natal 2025', 'Apresentação de final de ano com todas as turmas', '2025-12-15', true),
    ('00000000-0000-0000-0000-000000000001', 'Workshop Técnica de Pontas', 'Aulas especiais com professora convidada', '2025-11-20', false),
    ('00000000-0000-0000-0000-000000000001', 'Ensaio Fotográfico Primavera', 'Sessão de fotos temática', '2025-10-10', true)
ON CONFLICT DO NOTHING;

-- 9. Criar Posts de Blog
INSERT INTO public.posts_blog (escola_id, titulo, slug, conteudo_markdown, resumo_seo, keywords_seo, status, published_at)
VALUES
    ('00000000-0000-0000-0000-000000000001',
     'Os Benefícios do Ballet para Crianças',
     'beneficios-ballet-criancas',
     '# Os Benefícios do Ballet para Crianças\n\nO ballet clássico oferece inúmeros benefícios para o desenvolvimento infantil...',
     'Descubra como o ballet clássico contribui para o desenvolvimento físico e emocional das crianças.',
     ARRAY['ballet santa maria', 'ballet infantil', 'dança para crianças'],
     'publicado',
     CURRENT_TIMESTAMP - interval '10 days'
    ),
    ('00000000-0000-0000-0000-000000000001',
     'Preparação para o Espetáculo de Natal',
     'preparacao-espetaculo-natal',
     '# Preparação para o Espetáculo de Natal\n\nNossas alunas estão trabalhando intensamente...',
     'Veja os bastidores da preparação do nosso espetáculo de final de ano.',
     ARRAY['espetáculo de ballet', 'natal', 'espaço revelle'],
     'publicado',
     CURRENT_TIMESTAMP - interval '5 days'
    )
ON CONFLICT DO NOTHING;

-- Mensagem de Conclusão
DO $$
BEGIN
    RAISE NOTICE '✅ Seed data inserido com sucesso!';
    RAISE NOTICE '📝 IMPORTANTE: Você ainda precisa criar os usuários manualmente no Supabase Dashboard:';
    RAISE NOTICE '   - diretora@espacorevelle.com.br (senha: revelle123)';
    RAISE NOTICE '   - professor@espacorevelle.com.br (senha: revelle123)';
    RAISE NOTICE '   - aluno@espacorevelle.com.br (senha: revelle123)';
    RAISE NOTICE '   - pai@espacorevelle.com.br (senha: revelle123)';
    RAISE NOTICE '📊 Total de estudantes criados: 5';
    RAISE NOTICE '📚 Total de turmas criadas: 5';
    RAISE NOTICE '👗 Total de figurinos no estoque: 6';
    RAISE NOTICE '📸 Total de galerias criadas: 3';
    RAISE NOTICE '📝 Total de posts de blog: 2';
END $$;
