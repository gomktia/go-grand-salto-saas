const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oymqqxcmbesqczpkedya.supabase.co'
const supabaseServiceKey = 'sb_secret_lA6PNKpIq7Wb14ut3N2C8w_1M1U2qZJ'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    db: {
        schema: 'public'
    }
})

async function main() {
    // Buscar usuário
    const { data: users } = await supabase.auth.admin.listUsers()
    const paiUser = users?.users?.find(u => u.email === 'pai@espacorevelle.com.br')

    if (!paiUser) {
        console.error('Usuário não encontrado')
        return
    }

    console.log('Usuário:', paiUser.id)

    // Buscar escola
    const { data: escola } = await supabase
        .from('escolas')
        .select('id')
        .limit(1)
        .single()

    console.log('Escola:', escola?.id)

    // Verificar valores do enum via query
    const { data: enumValues, error: enumError } = await supabase
        .from('perfis')
        .select('role')
        .limit(5)

    console.log('Roles existentes:', enumValues?.map(e => e.role))

    // Criar perfil com responsavel
    const { data, error } = await supabase
        .from('perfis')
        .insert({
            id: paiUser.id,
            full_name: 'Pai/Responsável Teste',
            role: 'responsavel',
            escola_id: escola.id
        })
        .select()

    if (error) {
        console.error('Erro:', error.message)
        console.log('\nVerifique se executou corretamente:')
        console.log("ALTER TYPE user_role ADD VALUE 'responsavel';")
    } else {
        console.log('Perfil criado:', data)
    }
}

main().catch(console.error)
