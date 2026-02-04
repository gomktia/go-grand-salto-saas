'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPERS
// ============================================

async function getAuthenticatedDiretora() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) throw new Error('Não autenticado')

    const { data: perfil } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!perfil) throw new Error('Perfil não encontrado')

    if (perfil.role !== 'diretora' && perfil.role !== 'super_admin') {
        throw new Error('Acesso negado: apenas diretoras')
    }

    return { user, perfil, supabase }
}

// ============================================
// LISTAR MONITORAS DA ESCOLA
// ============================================

export async function getMonitorasEscola() {
    const { perfil, supabase } = await getAuthenticatedDiretora()

    const { data, error } = await supabase
        .from('monitoras_turmas')
        .select(`
            id,
            pode_chamada,
            pode_avaliar,
            pode_ver_observacoes,
            pode_enviar_recados,
            data_inicio,
            ativo,
            perfil:perfis!monitoras_turmas_perfil_id_fkey (
                id,
                full_name,
                avatar_url,
                role
            ),
            turma:turmas (
                id,
                nome,
                nivel,
                cor_etiqueta
            )
        `)
        .eq('escola_id', perfil.escola_id)
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar monitoras: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// LISTAR ALUNAS ELEGÍVEIS PARA MONITORIA
// ============================================

export async function getAlunasElegiveis() {
    const { perfil, supabase } = await getAuthenticatedDiretora()

    // Buscar alunas da escola que podem ser monitoras
    // Geralmente são alunas mais velhas ou avançadas
    const { data, error } = await supabase
        .from('perfis')
        .select(`
            id,
            full_name,
            avatar_url,
            role,
            estudantes (
                id,
                status_matricula,
                data_nascimento
            )
        `)
        .eq('escola_id', perfil.escola_id)
        .in('role', ['aluno', 'monitora']) // Alunas ou já monitoras
        .order('full_name', { ascending: true })

    if (error) throw new Error(`Erro ao buscar alunas: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// VINCULAR MONITORA A UMA TURMA
// ============================================

export async function vincularMonitoraTurma(params: {
    perfil_id: string
    turma_id: string
    pode_chamada?: boolean
    pode_avaliar?: boolean
    pode_ver_observacoes?: boolean
    pode_enviar_recados?: boolean
}) {
    const { perfil, supabase } = await getAuthenticatedDiretora()

    // Verificar se já existe vínculo
    const { data: existente } = await supabase
        .from('monitoras_turmas')
        .select('id')
        .eq('perfil_id', params.perfil_id)
        .eq('turma_id', params.turma_id)
        .single()

    if (existente) {
        throw new Error('Esta pessoa já está vinculada a esta turma')
    }

    // Criar vínculo
    const { data, error } = await supabase
        .from('monitoras_turmas')
        .insert({
            perfil_id: params.perfil_id,
            turma_id: params.turma_id,
            escola_id: perfil.escola_id,
            pode_chamada: params.pode_chamada ?? true,
            pode_avaliar: params.pode_avaliar ?? false,
            pode_ver_observacoes: params.pode_ver_observacoes ?? false,
            pode_enviar_recados: params.pode_enviar_recados ?? false,
            ativo: true
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao vincular monitora: ${error.message}`)

    // Verificar se precisa criar perfil secundário
    const { data: perfilMonitora } = await supabase
        .from('perfis')
        .select('role')
        .eq('id', params.perfil_id)
        .single()

    // Se a pessoa é aluna, criar perfil secundário de monitora
    if (perfilMonitora?.role === 'aluno') {
        const { data: perfilSecundario } = await supabase
            .from('perfis_secundarios')
            .select('id')
            .eq('perfil_principal_id', params.perfil_id)
            .eq('role_secundario', 'monitora')
            .single()

        if (!perfilSecundario) {
            await supabase
                .from('perfis_secundarios')
                .insert({
                    perfil_principal_id: params.perfil_id,
                    role_secundario: 'monitora',
                    escola_id: perfil.escola_id,
                    ativo: true
                })
        }
    }

    revalidatePath('/diretora/turmas')
    return { data }
}

// ============================================
// ATUALIZAR PERMISSÕES DA MONITORA
// ============================================

export async function atualizarPermissoesMonitora(params: {
    vinculo_id: string
    pode_chamada?: boolean
    pode_avaliar?: boolean
    pode_ver_observacoes?: boolean
    pode_enviar_recados?: boolean
}) {
    const { perfil, supabase } = await getAuthenticatedDiretora()

    const { data, error } = await supabase
        .from('monitoras_turmas')
        .update({
            pode_chamada: params.pode_chamada,
            pode_avaliar: params.pode_avaliar,
            pode_ver_observacoes: params.pode_ver_observacoes,
            pode_enviar_recados: params.pode_enviar_recados,
            updated_at: new Date().toISOString()
        })
        .eq('id', params.vinculo_id)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) throw new Error(`Erro ao atualizar permissões: ${error.message}`)

    revalidatePath('/diretora/turmas')
    return { data }
}

// ============================================
// DESVINCULAR MONITORA DE UMA TURMA
// ============================================

export async function desvincularMonitoraTurma(vinculoId: string) {
    const { perfil, supabase } = await getAuthenticatedDiretora()

    // Soft delete - marcar como inativo
    const { error } = await supabase
        .from('monitoras_turmas')
        .update({
            ativo: false,
            data_fim: new Date().toISOString().split('T')[0]
        })
        .eq('id', vinculoId)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao desvincular monitora: ${error.message}`)

    revalidatePath('/diretora/turmas')
    return { success: true }
}

// ============================================
// LISTAR MONITORAS DE UMA TURMA ESPECÍFICA
// ============================================

export async function getMonitorasDaTurma(turmaId: string) {
    const { perfil, supabase } = await getAuthenticatedDiretora()

    const { data, error } = await supabase
        .from('monitoras_turmas')
        .select(`
            id,
            pode_chamada,
            pode_avaliar,
            pode_ver_observacoes,
            pode_enviar_recados,
            data_inicio,
            perfil:perfis!monitoras_turmas_perfil_id_fkey (
                id,
                full_name,
                avatar_url
            )
        `)
        .eq('turma_id', turmaId)
        .eq('escola_id', perfil.escola_id)
        .eq('ativo', true)

    if (error) throw new Error(`Erro ao buscar monitoras: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// ESTATÍSTICAS DE MONITORAS
// ============================================

export async function getEstatisticasMonitoras() {
    const { perfil, supabase } = await getAuthenticatedDiretora()

    // Total de monitoras ativas
    const { count: totalMonitoras } = await supabase
        .from('monitoras_turmas')
        .select('perfil_id', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)
        .eq('ativo', true)

    // Turmas com monitoras
    const { data: turmasComMonitoras } = await supabase
        .from('monitoras_turmas')
        .select('turma_id')
        .eq('escola_id', perfil.escola_id)
        .eq('ativo', true)

    const turmasUnicas = new Set(turmasComMonitoras?.map(t => t.turma_id)).size

    // Total de turmas
    const { count: totalTurmas } = await supabase
        .from('turmas')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)

    return {
        data: {
            totalMonitoras: totalMonitoras || 0,
            turmasComMonitoras: turmasUnicas,
            totalTurmas: totalTurmas || 0,
            cobertura: totalTurmas ? Math.round((turmasUnicas / totalTurmas) * 100) : 0
        }
    }
}
