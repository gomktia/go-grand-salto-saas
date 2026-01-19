const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carregar .env.local manualmente
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim()
    }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function checkUsers() {
    console.log('🔍 Verificando usuários e perfis...\n')

    // Buscar todos os usuários do auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
        console.error('❌ Erro ao buscar usuários auth:', authError.message)
        return
    }

    console.log('═══════════════════════════════════════════════════════════════════════════')
    console.log('  USUÁRIOS CADASTRADOS NO SUPABASE AUTH')
    console.log('═══════════════════════════════════════════════════════════════════════════\n')

    if (!authUsers?.users || authUsers.users.length === 0) {
        console.log('  ⚠️  Nenhum usuário encontrado no auth.users!')
        console.log('  📋 Você precisa criar usuários no Supabase Dashboard ou via script.\n')
        return
    }

    for (const user of authUsers.users) {
        console.log(`  📧 Email: ${user.email}`)
        console.log(`     ID: ${user.id}`)
        console.log(`     Criado em: ${new Date(user.created_at).toLocaleString('pt-BR')}`)
        console.log(`     Último login: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'Nunca'}`)

        // Buscar perfil correspondente
        const { data: perfil } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', user.id)
            .single()

        if (perfil) {
            console.log(`     ✅ Perfil: ${perfil.full_name} (${perfil.role})`)
        } else {
            console.log(`     ❌ SEM PERFIL - Este usuário não pode acessar o sistema!`)
        }
        console.log('')
    }

    console.log('═══════════════════════════════════════════════════════════════════════════')
    console.log('  PERFIS SEM USUÁRIO AUTH')
    console.log('═══════════════════════════════════════════════════════════════════════════\n')

    // Buscar perfis que não têm usuário auth correspondente
    const { data: perfis } = await supabase
        .from('perfis')
        .select('*')

    const authUserIds = authUsers.users.map(u => u.id)
    const orphanPerfis = perfis?.filter(p => !authUserIds.includes(p.id)) || []

    if (orphanPerfis.length === 0) {
        console.log('  ✅ Todos os perfis têm usuários auth correspondentes!\n')
    } else {
        for (const perfil of orphanPerfis) {
            console.log(`  ⚠️  ${perfil.full_name} (${perfil.role})`)
            console.log(`     ID: ${perfil.id}`)
            console.log(`     Este perfil NÃO tem um usuário no auth.users!`)
            console.log('')
        }
    }

    console.log('═══════════════════════════════════════════════════════════════════════════')
    console.log('  CREDENCIAIS PARA LOGIN')
    console.log('═══════════════════════════════════════════════════════════════════════════\n')

    console.log('  Para logar como Diretora, use:')
    console.log('  📧 Email: diretora@espacorevelle.com.br')
    console.log('  🔑 Senha: (a senha que foi definida ao criar o usuário)')
    console.log('')
    console.log('  Se não souber a senha, você pode resetá-la no Supabase Dashboard:')
    console.log('  🔗 https://supabase.com/dashboard/project/oymqqxcmbesqczpkedya/auth/users')
    console.log('')
}

checkUsers().catch(console.error)
