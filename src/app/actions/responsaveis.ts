'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPERS
// ============================================

async function getAuthenticatedUser() {
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

    return { user, perfil, supabase }
}

function requireDiretora(role: string) {
    if (!['diretora', 'super_admin'].includes(role)) {
        throw new Error('Acesso negado: apenas diretoras')
    }
}

// ============================================
// SCHEMAS DE VALIDAÇÃO
// ============================================

const responsavelSchema = z.object({
    nome_completo: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(10, 'Telefone inválido').optional().or(z.literal('')),
    cpf: z.string().optional().or(z.literal('')),
    parentesco: z.enum(['pai', 'mae', 'avo', 'tio', 'responsavel']).default('responsavel'),
    portal_habilitado: z.boolean().default(true),
})

const responsavelUpdateSchema = responsavelSchema.partial().extend({
    id: z.string().uuid(),
})

const vinculoSchema = z.object({
    estudante_id: z.string().uuid(),
    responsavel_id: z.string().uuid(),
    is_principal: z.boolean().default(false),
    pode_buscar: z.boolean().default(true),
    recebe_notificacoes: z.boolean().default(true),
})

// ============================================
// RESPONSÁVEIS - CRUD
// ============================================

export async function getResponsaveis() {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { data, error } = await supabase
        .from('responsaveis')
        .select(`
            *,
            estudantes_responsaveis (
                id,
                estudante_id,
                is_principal,
                estudante:estudantes (
                    id,
                    perfil_id,
                    perfis (full_name)
                )
            )
        `)
        .eq('escola_id', perfil.escola_id)
        .order('nome_completo', { ascending: true })

    if (error) throw new Error(`Erro ao buscar responsáveis: ${error.message}`)

    return { data: data || [] }
}

export async function getResponsavelById(id: string) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { data, error } = await supabase
        .from('responsaveis')
        .select(`
            *,
            estudantes_responsaveis (
                id,
                estudante_id,
                is_principal,
                pode_buscar,
                recebe_notificacoes,
                estudante:estudantes (
                    id,
                    perfil_id,
                    perfis (full_name)
                )
            ),
            permissoes_responsavel (*)
        `)
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (error) throw new Error(`Erro ao buscar responsável: ${error.message}`)

    return { data }
}

export async function createResponsavel(rawData: unknown) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = responsavelSchema.parse(rawData)

    // Verificar se já existe um responsável com este email
    const { data: existing } = await supabase
        .from('responsaveis')
        .select('id')
        .eq('email', validated.email)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (existing) {
        throw new Error('Já existe um responsável cadastrado com este email')
    }

    // Criar responsável
    const { data, error } = await supabase
        .from('responsaveis')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao criar responsável: ${error.message}`)

    // Criar permissões padrão
    await supabase
        .from('permissoes_responsavel')
        .insert({
            responsavel_id: data.id,
            escola_id: perfil.escola_id,
        })

    revalidatePath('/diretora/alunos')
    return { data }
}

export async function updateResponsavel(rawData: unknown) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = responsavelUpdateSchema.parse(rawData)
    const { id, ...updateData } = validated

    const { data, error } = await supabase
        .from('responsaveis')
        .update(updateData)
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) throw new Error(`Erro ao atualizar responsável: ${error.message}`)

    revalidatePath('/diretora/alunos')
    return { data }
}

export async function deleteResponsavel(id: string) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { error } = await supabase
        .from('responsaveis')
        .delete()
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao deletar responsável: ${error.message}`)

    revalidatePath('/diretora/alunos')
    return { success: true }
}

// ============================================
// VÍNCULOS ESTUDANTE-RESPONSÁVEL
// ============================================

export async function getResponsaveisByEstudante(estudanteId: string) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { data, error } = await supabase
        .from('estudantes_responsaveis')
        .select(`
            *,
            responsavel:responsaveis (
                id,
                nome_completo,
                email,
                telefone,
                parentesco,
                portal_habilitado,
                ativo
            )
        `)
        .eq('estudante_id', estudanteId)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao buscar responsáveis do estudante: ${error.message}`)

    return { data: data || [] }
}

export async function vincularResponsavel(rawData: unknown) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = vinculoSchema.parse(rawData)

    // Verificar se vínculo já existe
    const { data: existing } = await supabase
        .from('estudantes_responsaveis')
        .select('id')
        .eq('estudante_id', validated.estudante_id)
        .eq('responsavel_id', validated.responsavel_id)
        .single()

    if (existing) {
        throw new Error('Este responsável já está vinculado a este aluno')
    }

    // Se for principal, remover o principal anterior
    if (validated.is_principal) {
        await supabase
            .from('estudantes_responsaveis')
            .update({ is_principal: false })
            .eq('estudante_id', validated.estudante_id)
            .eq('escola_id', perfil.escola_id)
    }

    const { data, error } = await supabase
        .from('estudantes_responsaveis')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao vincular responsável: ${error.message}`)

    revalidatePath('/diretora/alunos')
    return { data }
}

export async function desvincularResponsavel(vinculoId: string) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { error } = await supabase
        .from('estudantes_responsaveis')
        .delete()
        .eq('id', vinculoId)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao desvincular responsável: ${error.message}`)

    revalidatePath('/diretora/alunos')
    return { success: true }
}

export async function atualizarVinculo(vinculoId: string, updates: Partial<z.infer<typeof vinculoSchema>>) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { data, error } = await supabase
        .from('estudantes_responsaveis')
        .update(updates)
        .eq('id', vinculoId)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) throw new Error(`Erro ao atualizar vínculo: ${error.message}`)

    revalidatePath('/diretora/alunos')
    return { data }
}

// ============================================
// CRIAR RESPONSÁVEL E VINCULAR AO ESTUDANTE
// ============================================

export async function criarResponsavelComVinculo(rawData: {
    estudante_id: string
    nome_completo: string
    email: string
    telefone?: string
    cpf?: string
    parentesco?: 'pai' | 'mae' | 'avo' | 'tio' | 'responsavel'
    is_principal?: boolean
    criar_acesso_portal?: boolean
}) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const {
        estudante_id,
        nome_completo,
        email,
        telefone,
        cpf,
        parentesco = 'responsavel',
        is_principal = true,
        criar_acesso_portal = false,
    } = rawData

    // Verificar se já existe responsável com este email
    let responsavelId: string

    const { data: existingResponsavel } = await supabase
        .from('responsaveis')
        .select('id')
        .eq('email', email)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (existingResponsavel) {
        responsavelId = existingResponsavel.id
    } else {
        // Criar novo responsável
        const { data: novoResponsavel, error: createError } = await supabase
            .from('responsaveis')
            .insert({
                escola_id: perfil.escola_id,
                nome_completo,
                email,
                telefone: telefone || null,
                cpf: cpf || null,
                parentesco,
                portal_habilitado: criar_acesso_portal,
            })
            .select()
            .single()

        if (createError) throw new Error(`Erro ao criar responsável: ${createError.message}`)
        responsavelId = novoResponsavel.id

        // Criar permissões padrão
        await supabase
            .from('permissoes_responsavel')
            .insert({
                responsavel_id: responsavelId,
                escola_id: perfil.escola_id,
            })
    }

    // Verificar se vínculo já existe
    const { data: existingVinculo } = await supabase
        .from('estudantes_responsaveis')
        .select('id')
        .eq('estudante_id', estudante_id)
        .eq('responsavel_id', responsavelId)
        .single()

    if (existingVinculo) {
        throw new Error('Este responsável já está vinculado a este aluno')
    }

    // Se for principal, remover o principal anterior
    if (is_principal) {
        await supabase
            .from('estudantes_responsaveis')
            .update({ is_principal: false })
            .eq('estudante_id', estudante_id)
            .eq('escola_id', perfil.escola_id)
    }

    // Criar vínculo
    const { data: vinculo, error: vinculoError } = await supabase
        .from('estudantes_responsaveis')
        .insert({
            estudante_id,
            responsavel_id: responsavelId,
            escola_id: perfil.escola_id,
            is_principal,
            pode_buscar: true,
            recebe_notificacoes: true,
        })
        .select(`
            *,
            responsavel:responsaveis (*)
        `)
        .single()

    if (vinculoError) throw new Error(`Erro ao vincular responsável: ${vinculoError.message}`)

    // Se criar_acesso_portal, criar usuário no Supabase Auth (futuro)
    // Por enquanto, apenas marcamos portal_habilitado = true

    revalidatePath('/diretora/alunos')
    return { data: vinculo }
}

// ============================================
// HABILITAR PORTAL DO RESPONSÁVEL
// ============================================

export async function habilitarPortalResponsavel(responsavelId: string, senha: string) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    // Buscar responsável
    const { data: responsavel, error: fetchError } = await supabase
        .from('responsaveis')
        .select('*')
        .eq('id', responsavelId)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (fetchError || !responsavel) {
        throw new Error('Responsável não encontrado')
    }

    // Criar usuário no Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: responsavel.email,
        password: senha,
        email_confirm: true,
        user_metadata: {
            full_name: responsavel.nome_completo,
        },
    })

    if (authError) {
        // Se o usuário já existe, buscar o ID
        if (authError.message.includes('already exists')) {
            throw new Error('Este email já possui uma conta. Entre em contato com o suporte.')
        }
        throw new Error(`Erro ao criar conta: ${authError.message}`)
    }

    // Criar perfil
    const { data: novoPerfil, error: perfilError } = await supabase
        .from('perfis')
        .insert({
            id: authUser.user.id,
            escola_id: perfil.escola_id,
            full_name: responsavel.nome_completo,
            role: 'responsavel',
        })
        .select()
        .single()

    if (perfilError) {
        throw new Error(`Erro ao criar perfil: ${perfilError.message}`)
    }

    // Atualizar responsável com o perfil_id
    const { error: updateError } = await supabase
        .from('responsaveis')
        .update({
            perfil_id: novoPerfil.id,
            portal_habilitado: true,
        })
        .eq('id', responsavelId)

    if (updateError) {
        throw new Error(`Erro ao atualizar responsável: ${updateError.message}`)
    }

    revalidatePath('/diretora/alunos')
    return { success: true }
}

// ============================================
// BUSCAR RESPONSÁVEIS PARA SELECT/AUTOCOMPLETE
// ============================================

export async function searchResponsaveis(query: string) {
    const { perfil, supabase } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { data, error } = await supabase
        .from('responsaveis')
        .select('id, nome_completo, email, telefone, parentesco')
        .eq('escola_id', perfil.escola_id)
        .or(`nome_completo.ilike.%${query}%,email.ilike.%${query}%`)
        .order('nome_completo', { ascending: true })
        .limit(10)

    if (error) throw new Error(`Erro ao buscar responsáveis: ${error.message}`)

    return { data: data || [] }
}
