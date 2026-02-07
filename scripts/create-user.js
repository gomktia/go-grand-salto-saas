const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// Usuários de teste para cada perfil
const testUsers = [
    {
        email: 'superadmin@grandsalto.com.br',
        password: 'admin123',
        full_name: 'Super Admin',
        role: 'super_admin',
        needsSchool: false
    },
    {
        email: 'diretora@espacorevelle.com.br',
        password: 'revelle123',
        full_name: 'Diretora Revelle',
        role: 'diretora',
        needsSchool: true
    },
    {
        email: 'professor@espacorevelle.com.br',
        password: 'revelle123',
        full_name: 'Professor Teste',
        role: 'professor',
        needsSchool: true
    },
    {
        email: 'pai@espacorevelle.com.br',
        password: 'revelle123',
        full_name: 'Pai/Responsável Teste',
        role: 'responsavel',
        needsSchool: true
    },
    {
        email: 'aluno@espacorevelle.com.br',
        password: 'revelle123',
        full_name: 'Aluno Teste',
        role: 'estudante',
        needsSchool: true
    }
]

async function ensureSchoolExists() {
    // Verificar se escola Revelle já existe
    const { data: existingSchool } = await supabase
        .from('escolas')
        .select('id')
        .ilike('nome', '%revelle%')
        .single()

    if (existingSchool) {
        console.log('Escola encontrada:', existingSchool.id)
        return existingSchool.id
    }

    // Criar escola (sem campo status)
    const { data: newSchool, error } = await supabase
        .from('escolas')
        .insert({
            nome: 'Espaço Revelle',
            slug: 'espaco-revelle'
        })
        .select('id')
        .single()

    if (error) {
        console.error('Erro ao criar escola:', error.message)
        // Tentar listar todas as escolas para pegar uma existente
        const { data: allSchools } = await supabase.from('escolas').select('id').limit(1)
        if (allSchools && allSchools.length > 0) {
            console.log('Usando escola existente:', allSchools[0].id)
            return allSchools[0].id
        }
        return null
    }

    console.log('Escola criada:', newSchool.id)
    return newSchool.id
}

async function createOrUpdateUser(userData, escolaId) {
    const { email, password, full_name, role, needsSchool } = userData

    console.log(`\n--- Processando: ${email} (${role}) ---`)

    // Verificar se usuário já existe
    const { data: users } = await supabase.auth.admin.listUsers()
    const existingUser = users?.users?.find(u => u.email === email)

    let userId

    if (existingUser) {
        console.log('Usuário já existe, atualizando senha...')
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password }
        )
        if (updateError) {
            console.error('Erro ao atualizar:', updateError.message)
            return
        }
        userId = existingUser.id
        console.log('Senha atualizada!')
    } else {
        // Criar novo usuário
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        })

        if (authError) {
            console.error('Erro ao criar usuário:', authError.message)
            return
        }
        userId = authData.user.id
        console.log('Usuário criado!')
    }

    // Verificar se perfil já existe
    const { data: existingProfile } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single()

    if (existingProfile) {
        console.log('Perfil já existe')
        return
    }

    // Criar perfil
    const profileData = {
        id: userId,
        full_name,
        role,
        escola_id: needsSchool ? escolaId : null
    }

    // Super admin pode não precisar de escola_id, mas se a coluna for NOT NULL, usar escolaId
    if (!needsSchool && escolaId) {
        profileData.escola_id = escolaId
    }

    const { data: perfil, error: perfilError } = await supabase
        .from('perfis')
        .insert(profileData)
        .select()
        .single()

    if (perfilError) {
        console.error('Erro ao criar perfil:', perfilError.message)
        // Tentar com escola_id obrigatório
        if (perfilError.message.includes('not-null')) {
            profileData.escola_id = escolaId
            const { error: retry } = await supabase.from('perfis').insert(profileData)
            if (retry) {
                console.error('Retry falhou:', retry.message)
            } else {
                console.log('Perfil criado (com escola)!')
            }
        }
        return
    }

    console.log('Perfil criado!')
}

async function main() {
    console.log('=== Criando usuários de teste ===\n')

    // Garantir que escola existe
    const escolaId = await ensureSchoolExists()
    if (!escolaId) {
        console.error('Não foi possível obter/criar escola. Abortando.')
        return
    }

    // Criar cada usuário
    for (const user of testUsers) {
        await createOrUpdateUser(user, escolaId)
    }

    console.log('\n=== Processo finalizado! ===')
    console.log('\nCredenciais de acesso:')
    console.log('------------------------')
    testUsers.forEach(u => {
        console.log(`${u.role.toUpperCase().padEnd(12)} | ${u.email} | ${u.password}`)
    })
}

main().catch(console.error)
