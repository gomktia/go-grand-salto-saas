-- =============================================
-- CRIAR USUÁRIO SUPERADMIN DO SAAS
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- IMPORTANTE: Após rodar este script, você PRECISA criar o usuário
-- manualmente no Supabase Dashboard > Authentication > Users
-- com o email e senha abaixo, e depois copiar o UUID gerado.

-- =============================================
-- PASSO 1: Criar usuário no Supabase Dashboard
-- =============================================
-- 1. Vá em Authentication > Users > Add User
-- 2. Email: admin@grandsalto.ia
-- 3. Password: GrandSalto@2026
-- 4. Clique em "Create User"
-- 5. Copie o UUID do usuário criado
-- 6. Substitua 'SEU_UUID_AQUI' abaixo pelo UUID copiado

-- =============================================
-- PASSO 2: Criar perfil do superadmin
-- =============================================
-- Substitua 'SEU_UUID_AQUI' pelo UUID real do usuário criado

INSERT INTO public.perfis (
    id,
    escola_id,
    full_name,
    email,
    role,
    is_owner,
    created_at
) VALUES (
    'SEU_UUID_AQUI'::uuid,  -- << SUBSTITUIR pelo UUID do usuário criado
    NULL,                    -- Superadmin não pertence a nenhuma escola
    'Administrador Grand Salto',
    'admin@grandsalto.ia',
    'superadmin',
    true,
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = 'superadmin',
    full_name = 'Administrador Grand Salto';

-- =============================================
-- ALTERNATIVA: Script automático (se tiver extensão pgcrypto)
-- =============================================
-- Este script cria o usuário automaticamente se você tiver
-- as permissões necessárias no banco

/*
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Verificar se já existe
    SELECT id INTO new_user_id
    FROM auth.users
    WHERE email = 'admin@grandsalto.ia';

    IF new_user_id IS NULL THEN
        -- Inserir na tabela auth.users
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role,
            aud
        ) VALUES (
            gen_random_uuid(),
            '00000000-0000-0000-0000-000000000000',
            'admin@grandsalto.ia',
            crypt('GrandSalto@2026', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Administrador Grand Salto"}',
            false,
            'authenticated',
            'authenticated'
        )
        RETURNING id INTO new_user_id;

        RAISE NOTICE 'Usuário criado com ID: %', new_user_id;
    ELSE
        RAISE NOTICE 'Usuário já existe com ID: %', new_user_id;
    END IF;

    -- Criar perfil
    INSERT INTO public.perfis (id, escola_id, full_name, email, role, is_owner)
    VALUES (new_user_id, NULL, 'Administrador Grand Salto', 'admin@grandsalto.ia', 'superadmin', true)
    ON CONFLICT (id) DO UPDATE SET role = 'superadmin';

    RAISE NOTICE 'Superadmin configurado com sucesso!';
END $$;
*/

-- =============================================
-- VERIFICAR SE FOI CRIADO
-- =============================================
-- SELECT * FROM perfis WHERE role = 'superadmin';
