/**
 * Script para criar buckets de storage no Supabase
 * Execute com: node scripts/create-buckets.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidas no .env.local')
    process.exit(1)
}

// Cliente admin do Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const buckets = [
    {
        id: 'turmas-videos',
        name: 'turmas-videos',
        public: false,
        fileSizeLimit: 524288000, // 500MB
        allowedMimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    },
    {
        id: 'turmas-audios',
        name: 'turmas-audios',
        public: false,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac']
    },
    {
        id: 'turmas-documentos',
        name: 'turmas-documentos',
        public: false,
        fileSizeLimit: 20971520, // 20MB
        allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
    }
]

async function createBuckets() {
    console.log('🚀 Iniciando criação dos buckets...\n')

    for (const bucket of buckets) {
        console.log(`📦 Criando bucket: ${bucket.id}`)

        // Verificar se já existe
        const { data: existing } = await supabase.storage.getBucket(bucket.id)

        if (existing) {
            console.log(`   ⚠️  Bucket ${bucket.id} já existe, pulando...\n`)
            continue
        }

        // Criar bucket
        const { data, error } = await supabase.storage.createBucket(bucket.id, {
            public: bucket.public,
            fileSizeLimit: bucket.fileSizeLimit,
            allowedMimeTypes: bucket.allowedMimeTypes
        })

        if (error) {
            console.error(`   ❌ Erro ao criar bucket ${bucket.id}:`, error.message)
        } else {
            console.log(`   ✅ Bucket ${bucket.id} criado com sucesso!`)
            console.log(`      - Tamanho máximo: ${(bucket.fileSizeLimit / 1024 / 1024).toFixed(0)}MB`)
            console.log(`      - Tipos permitidos: ${bucket.allowedMimeTypes.join(', ')}\n`)
        }
    }

    console.log('🎉 Processo concluído!\n')
    console.log('⚠️  IMPORTANTE: As políticas RLS devem ser criadas manualmente no Supabase SQL Editor')
    console.log('   Execute o arquivo: supabase/create-storage-buckets.sql\n')
}

createBuckets().catch(console.error)
