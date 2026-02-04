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

const postBlogSchema = z.object({
    titulo: z.string().min(3),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
    descricao_curta: z.string().optional(),
    conteudo: z.string().min(10),
    imagem_capa: z.string().url().optional(),
    autor: z.string().optional(),
    categoria: z.string().optional(),
    tags: z.array(z.string()).optional(),
    is_publicado: z.boolean().default(false),
    is_destaque: z.boolean().default(false),
    data_publicacao: z.string().optional(), // ISO datetime
})

// ============================================
// POSTS DO BLOG
// ============================================

export async function getPostsBlog(options?: {
    isPublic?: boolean
    limit?: number
    categoria?: string
    tag?: string
}) {
    const supabase = await createClient()

    let query = supabase
        .from('posts_blog')
        .select('*')
        .order('data_publicacao', { ascending: false })

    if (options?.isPublic) {
        query = query.eq('is_publicado', true)
    } else {
        const { perfil } = await getAuthenticatedUser()
        requireDiretora(perfil.role)
        query = query.eq('escola_id', perfil.escola_id)
    }

    if (options?.categoria) {
        query = query.eq('categoria', options.categoria)
    }

    if (options?.tag) {
        query = query.contains('tags', [options.tag])
    }

    if (options?.limit) {
        query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw new Error(`Erro ao buscar posts: ${error.message}`)

    return { data: data || [] }
}

export async function getPostBlog(slugOrId: string, isPublic: boolean = false) {
    const supabase = await createClient()

    // Try to find by slug first
    let query = supabase
        .from('posts_blog')
        .select('*')

    // Check if it's a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId)

    if (isUUID) {
        query = query.eq('id', slugOrId)
    } else {
        query = query.eq('slug', slugOrId)
    }

    if (isPublic) {
        query = query.eq('is_publicado', true)
    }

    const { data, error } = await query.single()

    if (error) throw new Error(`Erro ao buscar post: ${error.message}`)

    // Increment views
    if (isPublic && data) {
        await supabase.rpc('increment_visualizacoes_post', { post_id: data.id })
    }

    return { data }
}

export async function createPostBlog(rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = postBlogSchema.parse(rawData)

    const { data, error } = await supabase
        .from('posts_blog')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
            autor: validated.autor || perfil.full_name,
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao criar post: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { data }
}

export async function updatePostBlog(id: string, rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = postBlogSchema.partial().parse(rawData)

    const { data, error } = await supabase
        .from('posts_blog')
        .update(validated)
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) throw new Error(`Erro ao atualizar post: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { data }
}

export async function deletePostBlog(id: string) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { error } = await supabase
        .from('posts_blog')
        .delete()
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao deletar post: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { success: true }
}

export async function getPostsDestaque(limit: number = 2) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('posts_blog')
        .select('*')
        .eq('is_publicado', true)
        .eq('is_destaque', true)
        .order('data_publicacao', { ascending: false })
        .limit(limit)

    if (error) throw new Error(`Erro ao buscar posts em destaque: ${error.message}`)

    return { data: data || [] }
}
