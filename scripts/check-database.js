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

// Configuração do Supabase
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('📍 URL:', supabaseUrl)
console.log('🔑 Key:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'NÃO ENCONTRADA')

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente não configuradas')
    console.error('   Verifique o arquivo .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
    console.log('🔍 Verificando tabelas do banco de dados...\n')

    const tablesToCheck = [
        'escolas',
        'perfis',
        'estudantes',
        'turmas',
        'metricas_corpo',
        'planos_mensalidade',
        'mensalidades',
        'pagamentos',
        'galerias_fotos',
        'fotos',
        'albums_venda',
        'fotos_venda',
        'pedidos_fotos',
        'eventos_calendario',
        'videos_site',
        'posts_blog',
        'responsaveis',
        'estudantes_responsaveis',
    ]

    const results = []

    for (const table of tablesToCheck) {
        try {
            const { data, error, count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true })

            if (error) {
                if (error.code === '42P01') {
                    results.push({ table, status: '❌ NÃO EXISTE', count: '-' })
                } else if (error.code === '42501') {
                    results.push({ table, status: '🔒 SEM PERMISSÃO (RLS)', count: '?' })
                } else {
                    results.push({ table, status: `⚠️ ERRO: ${error.message}`, count: '-' })
                }
            } else {
                results.push({ table, status: '✅ OK', count: count || 0 })
            }
        } catch (e) {
            results.push({ table, status: `❌ ERRO: ${e.message}`, count: '-' })
        }
    }

    console.log('═══════════════════════════════════════════════════════════')
    console.log('  TABELA                      STATUS              REGISTROS')
    console.log('═══════════════════════════════════════════════════════════')

    for (const r of results) {
        const tablePadded = r.table.padEnd(25)
        const statusPadded = r.status.padEnd(20)
        console.log(`  ${tablePadded} ${statusPadded} ${r.count}`)
    }

    console.log('═══════════════════════════════════════════════════════════\n')

    // Verificar tabelas faltando
    const missing = results.filter(r => r.status.includes('NÃO EXISTE'))
    if (missing.length > 0) {
        console.log('⚠️  TABELAS FALTANDO:')
        missing.forEach(m => console.log(`   - ${m.table}`))
        console.log('\n📋 Execute os seguintes arquivos SQL no Supabase:')
        console.log('   1. supabase/schema.sql')
        console.log('   2. supabase/schema-financeiro-e-fotos-FIXED.sql')
        console.log('   3. supabase/schema-responsaveis.sql')
        console.log('\n🔗 Acesse: https://supabase.com/dashboard/project/oymqqxcmbesqczpkedya/sql/new')
    } else {
        console.log('✅ Todas as tabelas principais existem!')
    }
}

checkTables().catch(console.error)
