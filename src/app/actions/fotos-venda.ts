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

const albumVendaSchema = z.object({
    titulo: z.string().min(3),
    descricao: z.string().optional(),
    evento_data: z.string().optional(), // ISO date
    is_publico: z.boolean().default(false),
    is_venda_ativa: z.boolean().default(true),
    preco_padrao: z.number().positive().default(15),
})

const fotoVendaSchema = z.object({
    album_id: z.string().uuid(),
    storage_path_original: z.string(),
    storage_path_watermark: z.string(),
    url_watermark: z.string().url(),
    preco: z.number().positive().default(15),
    titulo: z.string().optional(),
    descricao: z.string().optional(),
})

const pedidoFotoSchema = z.object({
    fotos_ids: z.array(z.string().uuid()).min(1),
    nome_comprador: z.string().min(3),
    email_comprador: z.string().email(),
    telefone_comprador: z.string().optional(),
    metodo_pagamento: z.enum(['pix', 'cartao_credito']),
})

// ============================================
// ÁLBUNS DE VENDA
// ============================================

export async function getAlbunsVenda(isPublic: boolean = false) {
    const supabase = await createClient()

    let query = supabase
        .from('albums_venda')
        .select(`
            *,
            fotos:fotos_venda(count)
        `)
        .order('created_at', { ascending: false })

    if (isPublic) {
        query = query.eq('is_publico', true).eq('is_venda_ativa', true)
    } else {
        const { perfil } = await getAuthenticatedUser()
        requireDiretora(perfil.role)
        query = query.eq('escola_id', perfil.escola_id)
    }

    const { data, error } = await query

    if (error) throw new Error(`Erro ao buscar álbuns: ${error.message}`)

    return { data: data || [] }
}

export async function getAlbumVenda(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('albums_venda')
        .select(`
            *,
            fotos:fotos_venda(*)
        `)
        .eq('id', id)
        .single()

    if (error) throw new Error(`Erro ao buscar álbum: ${error.message}`)

    return { data }
}

export async function createAlbumVenda(rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = albumVendaSchema.parse(rawData)

    const { data, error } = await supabase
        .from('albums_venda')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao criar álbum: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { data }
}

export async function updateAlbumVenda(id: string, rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = albumVendaSchema.partial().parse(rawData)

    const { data, error } = await supabase
        .from('albums_venda')
        .update(validated)
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) throw new Error(`Erro ao atualizar álbum: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { data }
}

export async function deleteAlbumVenda(id: string) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { error } = await supabase
        .from('albums_venda')
        .delete()
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao deletar álbum: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { success: true }
}

// ============================================
// FOTOS PARA VENDA
// ============================================

export async function getFotosVenda(albumId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('fotos_venda')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: true })

    if (error) throw new Error(`Erro ao buscar fotos: ${error.message}`)

    return { data: data || [] }
}

export async function createFotoVenda(rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = fotoVendaSchema.parse(rawData)

    const { data, error } = await supabase
        .from('fotos_venda')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao criar foto: ${error.message}`)

    return { data }
}

export async function deleteFotoVenda(id: string) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    // Buscar foto para deletar do storage
    const { data: foto } = await supabase
        .from('fotos_venda')
        .select('storage_path_original, storage_path_watermark')
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (foto) {
        // Deletar arquivos do storage
        await supabase.storage.from('fotos-venda').remove([
            foto.storage_path_original,
            foto.storage_path_watermark
        ])
    }

    const { error } = await supabase
        .from('fotos_venda')
        .delete()
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao deletar foto: ${error.message}`)

    return { success: true }
}

// ============================================
// PEDIDOS DE FOTOS
// ============================================

export async function criarPedidoFotos(rawData: unknown) {
    const supabase = await createClient()

    const validated = pedidoFotoSchema.parse(rawData)

    // Buscar fotos selecionadas
    const { data: fotos, error: fotosError } = await supabase
        .from('fotos_venda')
        .select('id, preco, escola_id')
        .in('id', validated.fotos_ids)

    if (fotosError || !fotos || fotos.length === 0) {
        throw new Error('Fotos não encontradas')
    }

    const escola_id = fotos[0].escola_id
    const valor_total = fotos.reduce((sum, f) => sum + Number(f.preco), 0)

    // Criar pedido
    const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos_fotos')
        .insert({
            escola_id,
            perfil_id: null, // Pode ser anônimo
            nome_comprador: validated.nome_comprador,
            email_comprador: validated.email_comprador,
            telefone_comprador: validated.telefone_comprador,
            valor_total,
            quantidade_fotos: fotos.length,
            status: 'pendente',
            metodo_pagamento: validated.metodo_pagamento,
        })
        .select()
        .single()

    if (pedidoError) throw new Error(`Erro ao criar pedido: ${pedidoError.message}`)

    // Criar itens do pedido
    const itens = fotos.map(foto => ({
        pedido_id: pedido.id,
        foto_id: foto.id,
        preco_unitario: foto.preco,
    }))

    const { error: itensError } = await supabase
        .from('itens_pedido_foto')
        .insert(itens)

    if (itensError) {
        console.error('Erro ao criar itens do pedido:', itensError)
    }

    // Gerar QR Code PIX (simulação - integrar com gateway real)
    const pixData = {
        qr_code: 'SIMULACAO_QR_CODE_PIX_' + pedido.id,
        qr_code_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        copy_paste: '00020126580014br.gov.bcb.pix...',
    }

    return {
        data: {
            pedido,
            pixData,
            valor_total,
        }
    }
}

export async function getPedidosFotos(filters?: { status?: string }) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    let query = supabase
        .from('pedidos_fotos')
        .select(`
            *,
            itens:itens_pedido_foto(
                id,
                foto:fotos_venda(id, titulo, url_watermark, preco)
            )
        `)
        .eq('escola_id', perfil.escola_id)
        .order('created_at', { ascending: false })

    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) throw new Error(`Erro ao buscar pedidos: ${error.message}`)

    return { data: data || [] }
}

export async function confirmarPagamentoPedido(pedidoId: string, transactionId: string) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    // Atualizar pedido
    const { data: pedido, error } = await supabase
        .from('pedidos_fotos')
        .update({
            status: 'pago',
            liberado_para_download: true,
            download_expira_em: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
        })
        .eq('id', pedidoId)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) throw new Error(`Erro ao confirmar pagamento: ${error.message}`)

    // Incrementar contador de vendas das fotos
    const { data: itens } = await supabase
        .from('itens_pedido_foto')
        .select('foto_id')
        .eq('pedido_id', pedidoId)

    if (itens) {
        for (const item of itens) {
            await supabase.rpc('increment_vendas_foto', { foto_id: item.foto_id })
        }
    }

    return { data: pedido }
}

// ============================================
// VÍDEOS DO SITE
// ============================================

export async function getVideosSite() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('videos_site')
        .select('*')
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar vídeos: ${error.message}`)

    return { data: data || [] }
}

export async function createVideoSite(rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = z.object({
        titulo: z.string().min(3),
        descricao: z.string().optional(),
        url_video: z.string().url(),
        thumbnail_url: z.string().url().optional(),
        tipo: z.enum(['youtube', 'vimeo', 'storage']).default('youtube'),
        ordem: z.number().int().default(0),
        is_destaque: z.boolean().default(false),
    }).parse(rawData)

    const { data, error } = await supabase
        .from('videos_site')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
        })
        .select()
        .single()

    revalidatePath('/espaco-revelle')
    return { data }
}

export async function updateVideoSite(id: string, rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = z.object({
        titulo: z.string().min(3),
        descricao: z.string().optional(),
        url_video: z.string().url(),
        thumbnail_url: z.string().url().optional(),
        tipo: z.enum(['youtube', 'vimeo', 'storage']).default('youtube'),
        ordem: z.number().int().default(0),
        is_destaque: z.boolean().default(false),
    }).partial().parse(rawData)

    const { data, error } = await supabase
        .from('videos_site')
        .update(validated)
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) throw new Error(`Erro ao atualizar vídeo: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { data }
}

export async function deleteVideoSite(id: string) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { error } = await supabase
        .from('videos_site')
        .delete()
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao deletar vídeo: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { success: true }
}

// ============================================
// EVENTOS DO CALENDÁRIO
// ============================================

export async function getEventosCalendario(isPublic: boolean = false) {
    const supabase = await createClient()

    let query = supabase
        .from('eventos_calendario')
        .select('*')
        .order('data_inicio', { ascending: true })

    if (isPublic) {
        query = query.eq('is_publico', true)
    } else {
        const { perfil } = await getAuthenticatedUser()
        requireDiretora(perfil.role)
        query = query.eq('escola_id', perfil.escola_id)
    }

    const { data, error } = await query

    if (error) throw new Error(`Erro ao buscar eventos: ${error.message}`)

    return { data: data || [] }
}

export async function createEventoCalendario(rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = z.object({
        titulo: z.string().min(3),
        descricao: z.string().optional(),
        data_inicio: z.string(), // ISO datetime
        data_fim: z.string().optional(),
        local: z.string().optional(),
        tipo: z.enum(['evento', 'aula_aberta', 'recital', 'feriado']).default('evento'),
        cor: z.string().default('#ec4899'),
        is_publico: z.boolean().default(true),
    }).parse(rawData)

    const { data, error } = await supabase
        .from('eventos_calendario')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
        })
        .select()
        .single()

    if (error) throw new Error(`Erro ao criar evento: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { data }
}

export async function updateEventoCalendario(id: string, rawData: unknown) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = z.object({
        titulo: z.string().min(3),
        descricao: z.string().optional(),
        data_inicio: z.string(), // ISO datetime
        data_fim: z.string().optional(),
        local: z.string().optional(),
        tipo: z.enum(['evento', 'aula_aberta', 'recital', 'feriado']).default('evento'),
        cor: z.string().default('#ec4899'),
        is_publico: z.boolean().default(true),
    }).partial().parse(rawData)

    const { data, error } = await supabase
        .from('eventos_calendario')
        .update(validated)
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) throw new Error(`Erro ao atualizar evento: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { data }
}

export async function deleteEventoCalendario(id: string) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const { error } = await supabase
        .from('eventos_calendario')
        .delete()
        .eq('id', id)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao deletar evento: ${error.message}`)

    revalidatePath('/espaco-revelle')
    return { success: true }
}
