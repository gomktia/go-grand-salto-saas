'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

// ============================================
// HELPERS
// ============================================

async function getAuthenticatedUser() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        throw new Error(`Erro de autenticação: ${error.message}`)
    }

    if (!user) {
        throw new Error('Não autenticado - faça login novamente')
    }

    const { data: perfil, error: perfilError } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

    if (perfilError) {
        throw new Error(`Erro ao buscar perfil: ${perfilError.message}`)
    }

    if (!perfil) {
        throw new Error('Perfil não encontrado')
    }

    return { user, perfil }
}

function requireDiretora(role: string) {
    if (!['diretora', 'super_admin'].includes(role)) {
        throw new Error('Acesso negado: apenas diretoras')
    }
}

// ============================================
// SCHEMAS DE VALIDAÇÃO
// ============================================

const mensalidadeSchema = z.object({
    estudante_id: z.string().uuid(),
    plano_id: z.string().uuid().optional(),
    valor: z.number().positive(),
    mes_referencia: z.number().min(1).max(12),
    ano_referencia: z.number().min(2024),
    data_vencimento: z.string(), // ISO date
    observacoes: z.string().optional(),
})

const pagamentoSchema = z.object({
    mensalidade_id: z.string().uuid().optional(),
    estudante_id: z.string().uuid().optional(),
    valor: z.number().positive(),
    metodo_pagamento: z.enum(['pix', 'cartao_credito', 'cartao_debito', 'boleto', 'dinheiro']),
    data_pagamento: z.string().optional(), // ISO datetime
    comprovante_url: z.string().url().optional(),
})

const planoMensalidadeSchema = z.object({
    nome: z.string().min(3),
    descricao: z.string().optional(),
    valor: z.number().positive(),
    dia_vencimento: z.number().min(1).max(31).default(10),
})

// ============================================
// PLANOS DE MENSALIDADE
// ============================================

export async function getPlanosMensalidade() {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { data, error } = await supabase
        .from('planos_mensalidade')
        .select('*')
        .eq('escola_id', perfil.escola_id)
        .eq('ativo', true)
        .order('valor', { ascending: true })

    if (error) throw new Error(`Erro ao buscar planos: ${error.message}`)

    return { data: data || [] }
}

export async function createPlanoMensalidade(rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = planoMensalidadeSchema.parse(rawData)

    const { data, error } = await supabase
        .from('planos_mensalidade')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao criar plano: ${error.message}`)

    return { data }
}

// ============================================
// MENSALIDADES
// ============================================

export async function getMensalidades(filters?: {
    estudante_id?: string
    mes?: number
    ano?: number
    status?: string
}) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    let query = supabase
        .from('mensalidades')
        .select(`
            *,
            estudante:estudantes(id, nome_responsavel, perfil_id),
            plano:planos_mensalidade(nome, valor)
        `)
        .eq('escola_id', perfil.escola_id)
        .order('data_vencimento', { ascending: false })

    if (filters?.estudante_id) {
        query = query.eq('estudante_id', filters.estudante_id)
    }

    if (filters?.mes) {
        query = query.eq('mes_referencia', filters.mes)
    }

    if (filters?.ano) {
        query = query.eq('ano_referencia', filters.ano)
    }

    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) throw new Error(`Erro ao buscar mensalidades: ${error.message}`)

    return { data: data || [] }
}

export async function createMensalidade(rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = mensalidadeSchema.parse(rawData)

    const { data, error } = await supabase
        .from('mensalidades')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao criar mensalidade: ${error.message}`)

    return { data }
}

export async function updateMensalidade(id: string, rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = mensalidadeSchema.partial().parse(rawData)

    const { data, error } = await supabase
        .from('mensalidades')
        .update(validated)
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) throw new Error(`Erro ao atualizar mensalidade: ${error.message}`)

    return { data }
}

export async function deleteMensalidade(id: string) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { error } = await supabase
        .from('mensalidades')
        .delete()
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao deletar mensalidade: ${error.message}`)

    return { success: true }
}

// Gerar mensalidades do mês para todos os alunos ativos
export async function gerarMensalidadesMes(mes: number, ano: number) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    // Buscar todos os alunos ativos
    const { data: alunos, error: alunosError } = await supabase
        .from('estudantes')
        .select('id')
        .eq('escola_id', perfil.escola_id)
        .eq('status_matricula', 'ativo')

    if (alunosError) throw new Error(`Erro ao buscar alunos: ${alunosError.message}`)

    // Criar mensalidade para cada aluno que ainda não tem
    const mensalidades = alunos.map(aluno => ({
        estudante_id: aluno.id,
        escola_id: perfil.escola_id,
        valor: 280.00, // Valor padrão, ajustar depois
        mes_referencia: mes,
        ano_referencia: ano,
        data_vencimento: new Date(ano, mes - 1, 10).toISOString().split('T')[0], // Dia 10 do mês
        status: 'pendente' as const,
    }))

    const { data, error } = await supabase
        .from('mensalidades')
        .upsert(mensalidades, {
            onConflict: 'estudante_id,mes_referencia,ano_referencia',
            ignoreDuplicates: true,
        })
        .select()

    if (error) throw new Error(`Erro ao gerar mensalidades: ${error.message}`)

    return { data: data || [], count: data?.length || 0 }
}

// ============================================
// PAGAMENTOS
// ============================================

export async function getPagamentos(filters?: {
    estudante_id?: string
    mes?: number
    ano?: number
    status?: string
}) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    let query = supabase
        .from('pagamentos')
        .select(`
            *,
            estudante:estudantes(id, nome_responsavel),
            mensalidade:mensalidades(mes_referencia, ano_referencia, valor)
        `)
        .eq('escola_id', perfil.escola_id)
        .order('created_at', { ascending: false })

    if (filters?.estudante_id) {
        query = query.eq('estudante_id', filters.estudante_id)
    }

    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) throw new Error(`Erro ao buscar pagamentos: ${error.message}`)

    return { data: data || [] }
}

export async function registrarPagamento(rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = pagamentoSchema.parse(rawData)

    // Criar pagamento
    const { data: pagamento, error: pagamentoError } = await supabase
        .from('pagamentos')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
            status: 'pago',
            data_pagamento: validated.data_pagamento || new Date().toISOString(),
        })
        .select()
        .single()

    if (pagamentoError) throw new Error(`Erro ao registrar pagamento: ${pagamentoError.message}`)

    // Se tem mensalidade_id, atualizar status da mensalidade
    if (validated.mensalidade_id) {
        const { error: mensalidadeError } = await supabase
            .from('mensalidades')
            .update({
                status: 'pago',
                metodo_pagamento: validated.metodo_pagamento,
                data_pagamento: validated.data_pagamento || new Date().toISOString().split('T')[0],
            })
            .eq('id', validated.mensalidade_id)

        if (mensalidadeError) {
            console.error('Erro ao atualizar mensalidade:', mensalidadeError)
        }
    }

    return { data: pagamento }
}

// ============================================
// ESTATÍSTICAS FINANCEIRAS
// ============================================

export async function getEstatisticasFinanceiras() {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const mesAtual = new Date().getMonth() + 1
    const anoAtual = new Date().getFullYear()

    // Total faturado no mês
    const { data: faturamento } = await supabase
        .from('pagamentos')
        .select('valor')
        .eq('escola_id', perfil.escola_id)
        .eq('status', 'pago')
        .gte('data_pagamento', new Date(anoAtual, mesAtual - 1, 1).toISOString())
        .lte('data_pagamento', new Date(anoAtual, mesAtual, 0, 23, 59, 59).toISOString())

    const totalFaturamento = faturamento?.reduce((sum, p) => sum + Number(p.valor), 0) || 0

    // Mensalidades pendentes/atrasadas
    const { count: totalPendentes } = await supabase
        .from('mensalidades')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)
        .in('status', ['pendente', 'atrasado'])

    const { count: totalAtrasadas } = await supabase
        .from('mensalidades')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)
        .eq('status', 'atrasado')

    // Total de alunos ativos
    const { count: totalAlunos } = await supabase
        .from('estudantes')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)
        .eq('status_matricula', 'ativo')

    const taxaInadimplencia = totalAlunos ? ((totalAtrasadas || 0) / totalAlunos) * 100 : 0

    return {
        data: {
            faturamentoMensal: totalFaturamento,
            totalPendentes: totalPendentes || 0,
            totalAtrasadas: totalAtrasadas || 0,
            taxaInadimplencia: taxaInadimplencia.toFixed(1),
            totalAlunos: totalAlunos || 0,
        }
    }
}
