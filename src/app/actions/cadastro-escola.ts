'use server'

import { createClient } from '@/utils/supabase/server'

interface DadosCadastroEscola {
    // Dados da escola
    nomeFantasia: string
    razaoSocial: string
    cnpj: string
    inscricaoEstadual?: string
    inscricaoMunicipal?: string

    // Endereço
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string

    // Contato
    telefone?: string
    whatsapp?: string
    emailEscola?: string
    website?: string

    // Responsável
    nomeResponsavel: string
    cpfResponsavel: string
    emailResponsavel: string
    telefoneResponsavel: string

    // Acesso
    senha: string

    // Plano
    plano: string
    periodoCobranca: 'mensal' | 'anual'
}

function gerarSlug(nome: string): string {
    return nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export async function cadastrarEscola(dados: DadosCadastroEscola): Promise<{
    success: boolean
    slug?: string
    error?: string
}> {
    const supabase = await createClient()

    try {
        // 1. Gerar slug único
        let slug = gerarSlug(dados.nomeFantasia)

        // Verificar se slug já existe
        const { data: existeSlug } = await supabase
            .from('escolas')
            .select('id')
            .eq('slug', slug)
            .single()

        if (existeSlug) {
            // Adicionar sufixo numérico
            const timestamp = Date.now().toString().slice(-4)
            slug = `${slug}-${timestamp}`
        }

        // 2. Verificar se CNPJ já está cadastrado
        const { data: existeCnpj } = await supabase
            .from('escolas')
            .select('id')
            .eq('cnpj', dados.cnpj)
            .single()

        if (existeCnpj) {
            return {
                success: false,
                error: 'Este CNPJ já está cadastrado no sistema'
            }
        }

        // 3. Verificar se email já está em uso
        const { data: existeEmail } = await supabase
            .from('perfis')
            .select('id')
            .eq('email', dados.emailResponsavel)
            .single()

        if (existeEmail) {
            return {
                success: false,
                error: 'Este email já está cadastrado no sistema'
            }
        }

        // 4. Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: dados.emailResponsavel,
            password: dados.senha,
            options: {
                data: {
                    full_name: dados.nomeResponsavel,
                    role: 'diretora'
                }
            }
        })

        if (authError) {
            console.error('Erro ao criar usuário:', authError)
            return {
                success: false,
                error: `Erro ao criar conta: ${authError.message}`
            }
        }

        if (!authData.user) {
            return {
                success: false,
                error: 'Erro ao criar usuário'
            }
        }

        // 5. Calcular data de fim do trial (7 dias)
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 7)

        // 6. Criar a escola
        const { data: escola, error: escolaError } = await supabase
            .from('escolas')
            .insert({
                nome: dados.nomeFantasia,
                slug: slug,
                razao_social: dados.razaoSocial,
                cnpj: dados.cnpj,
                inscricao_estadual: dados.inscricaoEstadual || null,
                inscricao_municipal: dados.inscricaoMunicipal || null,
                cep: dados.cep,
                logradouro: dados.logradouro,
                numero: dados.numero,
                complemento: dados.complemento || null,
                bairro: dados.bairro,
                cidade: dados.cidade,
                estado: dados.estado,
                telefone: dados.telefone || null,
                whatsapp: dados.whatsapp || null,
                email: dados.emailEscola || dados.emailResponsavel,
                website: dados.website || null,
                plano: dados.plano,
                periodo_cobranca: dados.periodoCobranca,
                status: 'trial',
                trial_end_date: trialEndDate.toISOString(),
                configuracoes: {
                    cor_primaria: '#F59E0B',
                    cor_secundaria: '#1F2937'
                }
            })
            .select()
            .single()

        if (escolaError) {
            console.error('Erro ao criar escola:', escolaError)
            // Tentar deletar usuário criado
            await supabase.auth.admin.deleteUser(authData.user.id)
            return {
                success: false,
                error: `Erro ao criar escola: ${escolaError.message}`
            }
        }

        // 7. Criar perfil do responsável como diretora
        const { error: perfilError } = await supabase
            .from('perfis')
            .insert({
                id: authData.user.id,
                escola_id: escola.id,
                full_name: dados.nomeResponsavel,
                email: dados.emailResponsavel,
                telefone: dados.telefoneResponsavel,
                cpf: dados.cpfResponsavel,
                role: 'diretora',
                is_owner: true
            })

        if (perfilError) {
            console.error('Erro ao criar perfil:', perfilError)
            // Tentar fazer rollback
            await supabase.from('escolas').delete().eq('id', escola.id)
            await supabase.auth.admin.deleteUser(authData.user.id)
            return {
                success: false,
                error: `Erro ao criar perfil: ${perfilError.message}`
            }
        }

        // 8. Criar registro de assinatura
        const { error: assinaturaError } = await supabase
            .from('assinaturas')
            .insert({
                escola_id: escola.id,
                plano: dados.plano,
                periodo: dados.periodoCobranca,
                status: 'trial',
                trial_start: new Date().toISOString(),
                trial_end: trialEndDate.toISOString(),
                valor_mensal: dados.plano === 'starter' ? 97
                    : dados.plano === 'professional' ? 197
                    : 397,
                valor_anual: dados.plano === 'starter' ? 970
                    : dados.plano === 'professional' ? 1970
                    : 3970
            })

        if (assinaturaError) {
            console.error('Erro ao criar assinatura:', assinaturaError)
            // Não é crítico, continuar
        }

        // 9. Enviar email de boas-vindas (em background)
        // TODO: Implementar envio de email

        return {
            success: true,
            slug: slug
        }

    } catch (error) {
        console.error('Erro no cadastro:', error)
        return {
            success: false,
            error: 'Erro interno ao processar cadastro'
        }
    }
}

// Verificar disponibilidade de slug
export async function verificarSlugDisponivel(nome: string): Promise<{
    disponivel: boolean
    slug: string
}> {
    const supabase = await createClient()
    const slug = gerarSlug(nome)

    const { data } = await supabase
        .from('escolas')
        .select('id')
        .eq('slug', slug)
        .single()

    return {
        disponivel: !data,
        slug
    }
}

// Verificar disponibilidade de CNPJ
export async function verificarCnpjDisponivel(cnpj: string): Promise<boolean> {
    const supabase = await createClient()
    const cnpjLimpo = cnpj.replace(/\D/g, '')

    const { data } = await supabase
        .from('escolas')
        .select('id')
        .eq('cnpj', cnpjLimpo)
        .single()

    return !data
}

// Verificar disponibilidade de email
export async function verificarEmailDisponivel(email: string): Promise<boolean> {
    const supabase = await createClient()

    const { data } = await supabase
        .from('perfis')
        .select('id')
        .eq('email', email)
        .single()

    return !data
}
