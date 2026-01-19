const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carregar .env.local
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

// ALTERE A SENHA AQUI:
const NOVA_SENHA = 'Diretora123!'

async function resetPassword() {
    const email = 'diretora@espacorevelle.com.br'

    console.log(`\n🔐 Resetando senha para: ${email}`)
    console.log(`🔑 Nova senha: ${NOVA_SENHA}\n`)

    // Buscar usuário
    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users?.users?.find(u => u.email === email)

    if (!user) {
        console.error('❌ Usuário não encontrado!')
        return
    }

    // Atualizar senha
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password: NOVA_SENHA
    })

    if (error) {
        console.error('❌ Erro ao resetar senha:', error.message)
        return
    }

    console.log('✅ Senha resetada com sucesso!')
    console.log('\n═══════════════════════════════════════════')
    console.log('  CREDENCIAIS DE ACESSO')
    console.log('═══════════════════════════════════════════')
    console.log(`  📧 Email: ${email}`)
    console.log(`  🔑 Senha: ${NOVA_SENHA}`)
    console.log('═══════════════════════════════════════════\n')
    console.log('🌐 Acesse: http://localhost:3000/login')
}

resetPassword().catch(console.error)
