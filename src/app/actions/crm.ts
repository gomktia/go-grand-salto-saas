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

export async function getLeads() {
    const { perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('escola_id', perfil.escola_id)
        .order('created_at', { ascending: false })

    if (error) {
        // Se a tabela não existir, retornar o mock por enquanto para não quebrar a página
        console.warn('Tabela leads não encontrada, usando mock')
        return {
            data: [
                { id: '1', nome: 'Carolina Mendes', status: 'Novo', interesse: 'Ballet Baby', created_at: new Date().toISOString(), prioridade: 'Alta' },
                { id: '2', nome: 'Pedro Rocha', status: 'Aula Experimental', interesse: 'Jazz Juvenil', created_at: new Date().toISOString(), prioridade: 'Média' },
            ]
        }
    }
    return { data: data || [] }
}

export async function createLead(data: {
    nome: string
    interesse: string
    contato?: string
    prioridade?: string
}) {
    const { perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    const { error } = await supabase
        .from('leads')
        .insert([{
            ...data,
            escola_id: perfil.escola_id,
            status: 'Novo'
        }])

    if (error) throw new Error(`Erro ao criar lead: ${error.message}`)

    revalidatePath('/diretora/crm')
    return { success: true }
}

export async function updateLeadStatus(id: string, status: string) {
    const { perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao atualizar lead: ${error.message}`)

    revalidatePath('/diretora/crm')
    return { success: true }
}
