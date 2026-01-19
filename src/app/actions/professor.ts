'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function getAuthenticatedUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) throw new Error('Não autenticado')

    const { data: perfil } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!perfil) throw new Error('Perfil não encontrado')
    return { user, perfil }
}

export async function getMinhasTurmas() {
    const { user, perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

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
            agenda_aulas (*)
        `)
        .eq('professor_id', user.id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao buscar turmas: ${error.message}`)
    return { data: data || [] }
}

export async function registrarFrequencia(params: {
    turma_id: string
    presencas: { estudante_id: string; presente: boolean }[]
}) {
    const { user, perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    // Criar registros de checkin apenas para os presentes
    const checkins = params.presencas
        .filter(p => p.presente)
        .map(p => ({
            estudante_id: p.estudante_id,
            turma_id: params.turma_id,
            escola_id: perfil.escola_id,
            metodo: 'professor_app'
        }))

    if (checkins.length > 0) {
        const { error } = await supabase
            .from('checkins')
            .insert(checkins)

        if (error) throw new Error(`Erro ao registrar frequência: ${error.message}`)
    }

    // Opcional: Notificar pais (placeholder logic)

    revalidatePath('/professor')
    return { success: true }
}
