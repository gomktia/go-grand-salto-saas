'use server'

import { createClient } from '@/utils/supabase/server'

// ============================================
// HELPERS
// ============================================

async function getAuthenticatedResponsavel() {
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

    // Verificar se é responsável (role = 'pai')
    if (perfil.role !== 'pai') {
        throw new Error('Acesso negado: apenas responsáveis')
    }

    // Buscar dados do responsável
    const { data: responsavel } = await supabase
        .from('responsaveis')
        .select('*')
        .eq('perfil_id', perfil.id)
        .single()

    if (!responsavel) {
        throw new Error('Responsável não encontrado')
    }

    return { user, perfil, responsavel, supabase }
}

// ============================================
// DADOS DOS ALUNOS VINCULADOS
// ============================================

export async function getAlunosVinculados() {
    const { responsavel, supabase } = await getAuthenticatedResponsavel()

    const { data, error } = await supabase
        .from('estudantes_responsaveis')
        .select(`
            id,
            is_principal,
            estudante:estudantes (
                id,
                data_nascimento,
                status_matricula,
                observacoes_medicas,
                perfil_id,
                perfis (
                    full_name,
                    avatar_url
                ),
                metricas_corpo (
                    busto,
                    cintura,
                    quadril,
                    altura,
                    torso,
                    data_medicao
                ),
                matriculas_turmas (
                    id,
                    status,
                    turma:turmas (
                        id,
                        nome,
                        nivel,
                        cor_etiqueta
                    )
                )
            )
        `)
        .eq('responsavel_id', responsavel.id)
        .eq('escola_id', responsavel.escola_id)

    if (error) throw new Error(`Erro ao buscar alunos: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// AGENDA / PRÓXIMAS AULAS
// ============================================

export async function getProximasAulas() {
    const { responsavel, supabase } = await getAuthenticatedResponsavel()

    // Primeiro buscar os IDs das turmas dos alunos vinculados
    const { data: vinculos } = await supabase
        .from('estudantes_responsaveis')
        .select(`
            estudante:estudantes (
                matriculas_turmas (
                    turma_id
                )
            )
        `)
        .eq('responsavel_id', responsavel.id)

    if (!vinculos || vinculos.length === 0) {
        return { data: [] }
    }

    // Extrair IDs das turmas
    const turmaIds = vinculos
        .flatMap(v => {
            const estudante = v.estudante as unknown as { matriculas_turmas: { turma_id: string }[] } | null
            return estudante?.matriculas_turmas || []
        })
        .map(m => m.turma_id)
        .filter(Boolean)

    if (turmaIds.length === 0) {
        return { data: [] }
    }

    // Buscar agenda das turmas
    const { data, error } = await supabase
        .from('agenda_aulas')
        .select(`
            *,
            turma:turmas (
                id,
                nome,
                nivel,
                cor_etiqueta
            )
        `)
        .in('turma_id', turmaIds)
        .order('dia_semana', { ascending: true })

    if (error) throw new Error(`Erro ao buscar agenda: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// FINANCEIRO DO RESPONSÁVEL
// ============================================

export async function getFinanceiroAlunos() {
    const { responsavel, supabase } = await getAuthenticatedResponsavel()

    // Buscar IDs dos estudantes vinculados
    const { data: vinculos } = await supabase
        .from('estudantes_responsaveis')
        .select('estudante_id')
        .eq('responsavel_id', responsavel.id)

    if (!vinculos || vinculos.length === 0) {
        return { data: { mensalidades: [], estatisticas: null } }
    }

    const estudanteIds = vinculos.map(v => v.estudante_id)

    // Buscar mensalidades
    const { data: mensalidades, error } = await supabase
        .from('mensalidades')
        .select(`
            *,
            estudante:estudantes (
                id,
                perfil_id,
                perfis (full_name)
            )
        `)
        .in('estudante_id', estudanteIds)
        .order('data_vencimento', { ascending: false })
        .limit(12)

    if (error) throw new Error(`Erro ao buscar mensalidades: ${error.message}`)

    // Calcular estatísticas
    const mesAtual = new Date().getMonth() + 1
    const anoAtual = new Date().getFullYear()

    const mensalidadesMes = mensalidades?.filter(
        m => m.mes_referencia === mesAtual && m.ano_referencia === anoAtual
    ) || []

    const totalPago = mensalidadesMes
        .filter(m => m.status === 'pago')
        .reduce((sum, m) => sum + Number(m.valor), 0)

    const totalPendente = mensalidadesMes
        .filter(m => m.status === 'pendente' || m.status === 'atrasado')
        .reduce((sum, m) => sum + Number(m.valor), 0)

    const proximoVencimento = mensalidades?.find(m => m.status === 'pendente')

    return {
        data: {
            mensalidades: mensalidades || [],
            estatisticas: {
                totalPago,
                totalPendente,
                proximoVencimento: proximoVencimento?.data_vencimento || null,
                statusGeral: totalPendente > 0 ? 'pendente' : 'em_dia',
            }
        }
    }
}

// ============================================
// PRESENÇA / CHECK-INS
// ============================================

export async function getPresencaAlunos(mes?: number, ano?: number) {
    const { responsavel, supabase } = await getAuthenticatedResponsavel()

    // Buscar IDs dos estudantes vinculados
    const { data: vinculos } = await supabase
        .from('estudantes_responsaveis')
        .select('estudante_id')
        .eq('responsavel_id', responsavel.id)

    if (!vinculos || vinculos.length === 0) {
        return { data: [] }
    }

    const estudanteIds = vinculos.map(v => v.estudante_id)

    // Definir período
    const mesRef = mes || new Date().getMonth() + 1
    const anoRef = ano || new Date().getFullYear()
    const dataInicio = new Date(anoRef, mesRef - 1, 1).toISOString()
    const dataFim = new Date(anoRef, mesRef, 0, 23, 59, 59).toISOString()

    // Buscar check-ins
    const { data, error } = await supabase
        .from('checkins')
        .select(`
            *,
            estudante:estudantes (
                id,
                perfil_id,
                perfis (full_name)
            ),
            turma:turmas (
                id,
                nome
            )
        `)
        .in('estudante_id', estudanteIds)
        .gte('created_at', dataInicio)
        .lte('created_at', dataFim)
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar presenças: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// GALERIA DE FOTOS
// ============================================

export async function getGaleriasDisponiveis() {
    const { responsavel, supabase } = await getAuthenticatedResponsavel()

    const { data, error } = await supabase
        .from('galerias_fotos')
        .select(`
            *,
            fotos:fotos(count)
        `)
        .eq('escola_id', responsavel.escola_id)
        .eq('is_public', true)
        .order('data_evento', { ascending: false })

    if (error) throw new Error(`Erro ao buscar galerias: ${error.message}`)

    return { data: data || [] }
}

export async function getFotosGaleria(galeriaId: string) {
    const { responsavel, supabase } = await getAuthenticatedResponsavel()

    const { data, error } = await supabase
        .from('fotos')
        .select('*')
        .eq('galeria_id', galeriaId)
        .eq('escola_id', responsavel.escola_id)
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar fotos: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// NOTIFICAÇÕES DO RESPONSÁVEL
// ============================================

export async function getNotificacoesResponsavel() {
    const { perfil, supabase } = await getAuthenticatedResponsavel()

    const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .or(`destinatario_id.eq.${perfil.id},destinatario_id.is.null`)
        .eq('escola_id', perfil.escola_id)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) throw new Error(`Erro ao buscar notificações: ${error.message}`)

    return { data: data || [] }
}

export async function marcarNotificacaoLida(notificacaoId: string) {
    const { perfil, supabase } = await getAuthenticatedResponsavel()

    const { error } = await supabase
        .from('notificacoes')
        .update({ lido: true })
        .eq('id', notificacaoId)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao marcar notificação: ${error.message}`)

    return { success: true }
}

// ============================================
// CALENDÁRIO DE EVENTOS
// ============================================

export async function getEventosCalendario() {
    const { responsavel, supabase } = await getAuthenticatedResponsavel()

    const { data, error } = await supabase
        .from('eventos_calendario')
        .select('*')
        .eq('escola_id', responsavel.escola_id)
        .eq('is_publico', true)
        .gte('data_inicio', new Date().toISOString())
        .order('data_inicio', { ascending: true })
        .limit(10)

    if (error) throw new Error(`Erro ao buscar eventos: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// PERFIL DO RESPONSÁVEL
// ============================================

export async function getPerfilResponsavel() {
    const { responsavel, perfil } = await getAuthenticatedResponsavel()

    return {
        data: {
            id: responsavel.id,
            nome_completo: responsavel.nome_completo,
            email: responsavel.email,
            telefone: responsavel.telefone,
            parentesco: responsavel.parentesco,
            avatar_url: perfil.avatar_url,
        }
    }
}
