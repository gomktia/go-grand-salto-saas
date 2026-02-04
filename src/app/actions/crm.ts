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

// Solicitação de Aula Experimental - SEM autenticação (visitante do site)
export async function solicitarAulaExperimental(data: {
    nome_aluno: string
    idade_aluno: string
    nome_responsavel?: string
    whatsapp: string
    email: string
    modalidade: string
    observacoes?: string
}) {
    const supabase = await createClient()

    // Escola ID fixo do Espaço Revelle (ou buscar pelo domínio)
    // Por enquanto vamos usar um ID fixo ou buscar a primeira escola
    const { data: escola } = await supabase
        .from('escolas')
        .select('id')
        .eq('slug', 'espaco-revelle')
        .single()

    const escolaId = escola?.id || '00000000-0000-0000-0000-000000000001'

    const { error } = await supabase
        .from('leads')
        .insert([{
            nome: data.nome_aluno,
            interesse: data.modalidade,
            contato: data.whatsapp,
            email: data.email,
            escola_id: escolaId,
            status: 'Aula Experimental',
            prioridade: 'Alta',
            observacoes: JSON.stringify({
                idade_aluno: data.idade_aluno,
                nome_responsavel: data.nome_responsavel,
                observacoes: data.observacoes,
                origem: 'Site - Aula Experimental',
                data_solicitacao: new Date().toISOString()
            })
        }])

    if (error) {
        console.error('Erro ao criar solicitação:', error)
        throw new Error(`Erro ao enviar solicitação: ${error.message}`)
    }

    revalidatePath('/diretora/crm')
    return { success: true, message: 'Solicitação enviada com sucesso!' }
}
