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
    // Listar todos os usuários
    const { data: users } = await supabase.auth.admin.listUsers()

    console.log('=== USUÁRIOS AUTH ===')
    users?.users?.forEach(u => {
        console.log(`${u.email} -> ${u.id}`)
    })

    // Listar todos os perfis
    const { data: perfis, error } = await supabase
        .from('perfis')
        .select('*')

    console.log('\n=== PERFIS ===')
    if (error) {
        console.error('Erro:', error.message)
    } else {
        perfis?.forEach(p => {
            console.log(`${p.id} | ${p.full_name} | ${p.role}`)
        })
    }

    // Verificar diretora especificamente
    const diretora = users?.users?.find(u => u.email === 'diretora@espacorevelle.com.br')
    if (diretora) {
        console.log('\n=== VERIFICANDO DIRETORA ===')
        console.log('Auth ID:', diretora.id)

        const { data: perfilDiretora, error: perfilError } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', diretora.id)
            .single()

        if (perfilError) {
            console.error('Erro ao buscar perfil:', perfilError.message)
        } else {
            console.log('Perfil:', perfilDiretora)
        }
    }
}

main().catch(console.error)
