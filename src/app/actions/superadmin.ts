'use server'

import { createClient } from '@/utils/supabase/server'

async function getAuthenticatedSuperAdmin() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        throw new Error('Não autenticado')
    }

    const { data: perfil } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!perfil) {
        throw new Error('Perfil não encontrado')
    }

    // Verificar se é superadmin
    if (perfil.role !== 'superadmin') {
        throw new Error('Acesso negado: apenas superadmins')
    }

    return { user, perfil, supabase }
}

// ============================================
// ESTATÍSTICAS GLOBAIS DO SISTEMA
// ============================================

export async function getEstatisticasGlobais() {
    const { supabase } = await getAuthenticatedSuperAdmin()

    // Buscar total de escolas ativas
    const { count: totalEscolas } = await supabase
        .from('escolas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo')

    // Buscar total de alunos ativos no sistema
    const { count: totalAlunos } = await supabase
        .from('estudantes')
        .select('*', { count: 'exact', head: true })
        .eq('status_matricula', 'ativo')

    // Buscar total de professores
    const { count: totalProfessores } = await supabase
        .from('perfis')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'professor')

    // Buscar total de turmas
    const { count: totalTurmas } = await supabase
        .from('turmas')
        .select('*', { count: 'exact', head: true })

    // Buscar MRR (soma das mensalidades pagas no mês atual)
    const mesAtual = new Date().getMonth() + 1
    const anoAtual = new Date().getFullYear()

    const { data: mensalidades } = await supabase
        .from('mensalidades')
        .select('valor')
        .eq('status', 'pago')
        .eq('mes_referencia', mesAtual)
        .eq('ano_referencia', anoAtual)

    const mrrGlobal = mensalidades?.reduce((sum, m) => sum + Number(m.valor), 0) || 0

    return {
        data: {
            totalEscolas: totalEscolas || 0,
            totalAlunos: totalAlunos || 0,
            totalProfessores: totalProfessores || 0,
            totalTurmas: totalTurmas || 0,
            mrrGlobal,
        }
    }
}

// ============================================
// LISTA DE ESCOLAS/TENANTS
// ============================================

export async function getEscolas() {
    const { supabase } = await getAuthenticatedSuperAdmin()

    const { data, error } = await supabase
        .from('escolas')
        .select(`
            *,
            perfis:perfis(count),
            estudantes:estudantes(count),
            turmas:turmas(count)
        `)
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar escolas: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// DETALHES DE UMA ESCOLA
// ============================================

export async function getEscolaDetalhes(escolaId: string) {
    const { supabase } = await getAuthenticatedSuperAdmin()

    const { data, error } = await supabase
        .from('escolas')
        .select(`
            *,
            perfis:perfis(count),
            estudantes:estudantes(count),
            turmas:turmas(count)
        `)
        .eq('id', escolaId)
        .single()

    if (error) throw new Error(`Erro ao buscar escola: ${error.message}`)

    return { data }
}

// ============================================
// CRIAR NOVA ESCOLA
// ============================================

export async function criarEscola(dados: {
    nome: string
    slug: string
    plano?: string
}) {
    const { supabase } = await getAuthenticatedSuperAdmin()

    const { data, error } = await supabase
        .from('escolas')
        .insert({
            nome: dados.nome,
            slug: dados.slug,
            plano: dados.plano || 'basic',
            status: 'ativo',
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao criar escola: ${error.message}`)

    return { data }
}

// ============================================
// ATUALIZAR STATUS DA ESCOLA
// ============================================

export async function atualizarStatusEscola(escolaId: string, status: string) {
    const { supabase } = await getAuthenticatedSuperAdmin()

    const { error } = await supabase
        .from('escolas')
        .update({ status })
        .eq('id', escolaId)

    if (error) throw new Error(`Erro ao atualizar escola: ${error.message}`)

    return { success: true }
}

// ============================================
// DETALHES COMPLETOS DA ESCOLA (PARA SUPORTE)
// ============================================

export async function getEscolaParaSuporte(escolaId: string) {
    const { supabase } = await getAuthenticatedSuperAdmin()

    // Buscar escola com todas as informações
    const { data: escola, error } = await supabase
        .from('escolas')
        .select('*')
        .eq('id', escolaId)
        .single()

    if (error) throw new Error(`Erro ao buscar escola: ${error.message}`)

    // Buscar estatísticas da escola
    const [
        { count: totalAlunos },
        { count: totalProfessores },
        { count: totalTurmas },
        { count: totalResponsaveis }
    ] = await Promise.all([
        supabase.from('estudantes').select('*', { count: 'exact', head: true }).eq('escola_id', escolaId).eq('status_matricula', 'ativo'),
        supabase.from('perfis').select('*', { count: 'exact', head: true }).eq('escola_id', escolaId).eq('role', 'professor'),
        supabase.from('turmas').select('*', { count: 'exact', head: true }).eq('escola_id', escolaId),
        supabase.from('responsaveis').select('*', { count: 'exact', head: true }).eq('escola_id', escolaId)
    ])

    // Buscar administradores da escola
    const { data: admins } = await supabase
        .from('perfis')
        .select('id, full_name, email, avatar_url, created_at')
        .eq('escola_id', escolaId)
        .eq('role', 'admin')

    // Buscar MRR da escola
    const mesAtual = new Date().getMonth() + 1
    const anoAtual = new Date().getFullYear()

    const { data: mensalidades } = await supabase
        .from('mensalidades')
        .select('valor')
        .eq('escola_id', escolaId)
        .eq('status', 'pago')
        .eq('mes_referencia', mesAtual)
        .eq('ano_referencia', anoAtual)

    const mrr = mensalidades?.reduce((sum, m) => sum + Number(m.valor), 0) || 0

    return {
        data: {
            escola,
            estatisticas: {
                totalAlunos: totalAlunos || 0,
                totalProfessores: totalProfessores || 0,
                totalTurmas: totalTurmas || 0,
                totalResponsaveis: totalResponsaveis || 0,
                mrr
            },
            admins: admins || []
        }
    }
}

// ============================================
// ATUALIZAR CONFIGURAÇÕES DA ESCOLA
// ============================================

export async function atualizarConfiguracaoEscola(escolaId: string, dados: {
    nome?: string
    slug?: string
    dominio_customizado?: string
    plano?: string
    status?: string
    cor_primaria?: string
    logo_url?: string
    endereco?: string
    telefone?: string
    email?: string
    instagram?: string
    facebook?: string
    whatsapp?: string
}) {
    const { supabase } = await getAuthenticatedSuperAdmin()

    const { error } = await supabase
        .from('escolas')
        .update(dados)
        .eq('id', escolaId)

    if (error) throw new Error(`Erro ao atualizar escola: ${error.message}`)

    return { success: true }
}

// ============================================
// LISTAR USUÁRIOS DE UMA ESCOLA
// ============================================

export async function getUsuariosEscola(escolaId: string) {
    const { supabase } = await getAuthenticatedSuperAdmin()

    const { data, error } = await supabase
        .from('perfis')
        .select('id, full_name, email, role, avatar_url, created_at, last_sign_in_at')
        .eq('escola_id', escolaId)
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar usuários: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// LISTAR TURMAS DE UMA ESCOLA
// ============================================

export async function getTurmasEscola(escolaId: string) {
    const { supabase } = await getAuthenticatedSuperAdmin()

    const { data, error } = await supabase
        .from('turmas')
        .select(`
            *,
            perfis:perfis!turmas_professor_id_fkey (full_name),
            matriculas_turmas (count)
        `)
        .eq('escola_id', escolaId)
        .order('nome', { ascending: true })

    if (error) throw new Error(`Erro ao buscar turmas: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// LOGS DE ATIVIDADE DA ESCOLA
// ============================================

export async function getLogsEscola(escolaId: string, limite: number = 50) {
    const { supabase } = await getAuthenticatedSuperAdmin()

    // Buscar últimos check-ins como proxy de atividade
    const { data: checkins } = await supabase
        .from('checkins')
        .select(`
            id,
            created_at,
            metodo,
            estudantes (
                perfil_id,
                perfis (full_name)
            )
        `)
        .eq('escola_id', escolaId)
        .order('created_at', { ascending: false })
        .limit(limite)

    return { data: checkins || [] }
}
