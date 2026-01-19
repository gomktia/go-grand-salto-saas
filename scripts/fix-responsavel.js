const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oymqqxcmbesqczpkedya.supabase.co'
const supabaseServiceKey = 'sb_secret_lA6PNKpIq7Wb14ut3N2C8w_1M1U2qZJ'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function main() {
    console.log('Adicionando "responsavel" ao enum user_role...')

    // Adicionar valor ao enum
    const { error: enumError } = await supabase.rpc('exec_sql', {
        sql: `
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum
                    WHERE enumlabel = 'responsavel'
                    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
                ) THEN
                    ALTER TYPE user_role ADD VALUE 'responsavel';
                END IF;
            END $$;
        `
    })

    if (enumError) {
        console.log('Tentando via query direta...')
        // Tentar criar perfil direto com query raw
    }

    // Buscar usuário pai
    const { data: users } = await supabase.auth.admin.listUsers()
    const paiUser = users?.users?.find(u => u.email === 'pai@espacorevelle.com.br')

    if (!paiUser) {
        console.error('Usuário pai não encontrado')
        return
    }

    console.log('Usuário encontrado:', paiUser.id)

    // Buscar escola
    const { data: escola } = await supabase
        .from('escolas')
        .select('id')
        .limit(1)
        .single()

    if (!escola) {
        console.error('Escola não encontrada')
        return
    }

    // Tentar criar com 'pai' primeiro (valor original do schema)
    const { data: perfil, error: perfilError } = await supabase
        .from('perfis')
        .insert({
            id: paiUser.id,
            full_name: 'Pai/Responsável Teste',
            role: 'pai',
            escola_id: escola.id
        })
        .select()
        .single()

    if (perfilError) {
        console.error('Erro com "pai":', perfilError.message)

        // Se falhar, o enum não tem 'pai', precisamos adicionar
        console.log('\nO enum não tem "pai". Execute este SQL no Supabase Dashboard:')
        console.log('ALTER TYPE user_role ADD VALUE \'pai\';')
        console.log('\nOu adicione "responsavel":')
        console.log('ALTER TYPE user_role ADD VALUE \'responsavel\';')
        return
    }

    console.log('Perfil criado com sucesso!')
}

main().catch(console.error)
