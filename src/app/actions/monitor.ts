'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function getAuthenticatedMonitor() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) throw new Error('Não autenticado')

    const { data: perfil } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!perfil) throw new Error('Perfil não encontrado')
    if (perfil.role !== 'monitor') throw new Error('Acesso negado: apenas monitores')

    return { user, perfil, supabase }
}

/**
 * Busca APENAS as turmas onde o monitor está alocado (RLS garante isso)
 */
export async function getMinhasTurmasMonitor() {
    const { user, perfil, supabase } = await getAuthenticatedMonitor()

    const { data, error } = await supabase
        .from('turmas')
        .select(`
            *,
            matriculas_turmas (
                id,
                estudantes (
                    id,
                    nome_responsavel,
                    perfis (
                        full_name,
                        avatar_url
                    )
                )
            ),
            agenda_aulas (*),
            perfis!turmas_professor_id_fkey (
                full_name
            )
        `)
        .eq('monitor_id', user.id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao buscar turmas: ${error.message}`)
    return { data: data || [] }
}

/**
 * Monitor pode registrar frequência nas turmas onde está alocado
 */
export async function registrarFrequenciaMonitor(params: {
    turma_id: string
    presencas: { estudante_id: string; presente: boolean }[]
}) {
    const { perfil, supabase } = await getAuthenticatedMonitor()

    const checkins = params.presencas
        .filter(p => p.presente)
        .map(p => ({
            estudante_id: p.estudante_id,
            turma_id: params.turma_id,
            escola_id: perfil.escola_id,
            metodo: 'monitor_app'
        }))

    if (checkins.length > 0) {
        const { error } = await supabase
            .from('checkins')
            .insert(checkins)

        if (error) throw new Error(`Erro ao registrar frequência: ${error.message}`)
    }

    revalidatePath('/monitor')
    return { success: true }
}
