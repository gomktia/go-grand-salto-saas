-- ATENÇÃO: Este script cria usuários na tabela auth.users (login) e public.perfis (dados)
-- VERSÃO COMPATÍVEL (v2) - Sem ON CONFLICT na tabela auth.users

-- 1. Habilitar extensão de criptografia (necessária para gerar senhas)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Bloco anônimo para execução segura
DO $$
DECLARE
    escola_id UUID := '00000000-0000-0000-0000-000000000001'; -- ID do Espaço Revelle
    diretora_uid UUID;
    professor_uid UUID;
    aluno_uid UUID;
    encrypted_pw TEXT;
BEGIN
    -- Gerar hash da senha 'revelle123'
    encrypted_pw := crypt('revelle123', gen_salt('bf'));

    -- =================================================================
    -- USUÁRIO 1: DIRETORA
    -- =================================================================
    
    -- Verificar se já existe
    SELECT id INTO diretora_uid FROM auth.users WHERE email = 'diretora@espacorevelle.com.br';

    -- Se não existir, criar
    IF diretora_uid IS NULL THEN
        diretora_uid := gen_random_uuid();
        
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
            created_at, updated_at
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000', 
            diretora_uid, 
            'authenticated', 
            'authenticated', 
            'diretora@espacorevelle.com.br', 
            encrypted_pw, 
            now(), 
            '{"provider":"email","providers":["email"]}', 
            '{"name":"Maria Silva"}', 
            now(), 
            now()
        );
    END IF;

    -- Garantir Perfil
    INSERT INTO public.perfis (id, escola_id, full_name, role)
    VALUES (diretora_uid, escola_id, 'Maria Silva', 'diretora')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'diretora', escola_id = EXCLUDED.escola_id;

    -- =================================================================
    -- USUÁRIO 2: PROFESSOR
    -- =================================================================

    SELECT id INTO professor_uid FROM auth.users WHERE email = 'professor@espacorevelle.com.br';

    IF professor_uid IS NULL THEN
        professor_uid := gen_random_uuid();

        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
            created_at, updated_at
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000', 
            professor_uid, 
            'authenticated', 
            'authenticated', 
            'professor@espacorevelle.com.br', 
            encrypted_pw, 
            now(), 
            '{"provider":"email","providers":["email"]}', 
            '{"name":"João Santos"}', 
            now(), 
            now()
        );
    END IF;

    INSERT INTO public.perfis (id, escola_id, full_name, role)
    VALUES (professor_uid, escola_id, 'João Santos', 'professor')
    ON CONFLICT (id) DO NOTHING;

    -- =================================================================
    -- USUÁRIO 3: ALUNO
    -- =================================================================

    SELECT id INTO aluno_uid FROM auth.users WHERE email = 'aluno@espacorevelle.com.br';

    IF aluno_uid IS NULL THEN
        aluno_uid := gen_random_uuid();

        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
            created_at, updated_at
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000', 
            aluno_uid, 
            'authenticated', 
            'authenticated', 
            'aluno@espacorevelle.com.br', 
            encrypted_pw, 
            now(), 
            '{"provider":"email","providers":["email"]}', 
            '{"name":"Ana Costa"}', 
            now(), 
            now()
        );
    END IF;

    INSERT INTO public.perfis (id, escola_id, full_name, role)
    VALUES (aluno_uid, escola_id, 'Ana Costa', 'estudante')
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '✅ Usuários verificados/criados com sucesso!';
    RAISE NOTICE '📧 LOGIN: diretora@espacorevelle.com.br | SENHA: revelle123';
END $$;
