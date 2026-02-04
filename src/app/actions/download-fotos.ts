'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

// ============================================
// HELPERS
// ============================================

async function getAuthenticatedUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    const { data: perfil } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

    return { user, perfil }
}

// ============================================
// VERIFICAR PERMISSÃO DE DOWNLOAD
// ============================================

export async function verificarDownloadPermitido(pedidoId: string, token?: string) {
    const supabase = await createClient()
    const auth = await getAuthenticatedUser()
    const isDiretora = auth?.perfil && ['diretora', 'super_admin'].includes(auth.perfil.role)

    // Buscar pedido
    const { data: pedido, error } = await supabase
        .from('pedidos_fotos')
        .select('*')
        .eq('id', pedidoId)
        .single()

    if (error || !pedido) {
        return { permitido: false, motivo: 'Pedido não encontrado', pedido: null }
    }

    // Se não for diretora, o token é OBRIGATÓRIO e deve ser válido
    if (!isDiretora) {
        if (!token) {
            return { permitido: false, motivo: 'Token de acesso não fornecido', pedido: null }
        }
        if (pedido.download_token !== token) {
            return { permitido: false, motivo: 'Token de acesso inválido', pedido: null }
        }
    }

    // Verificar status de pagamento (diretoras podem ver mesmo se não estiver pago para testes, mas vamos manter rigoroso)
    if (pedido.status !== 'pago') {
        return { permitido: false, motivo: 'Pagamento não confirmado', pedido }
    }

    // Verificar se download está liberado
    if (!pedido.liberado_para_download) {
        return { permitido: false, motivo: 'Download não liberado pela administração', pedido }
    }

    // Verificar expiração (Diretoras ignoram expiração)
    if (!isDiretora && pedido.download_expira_em && new Date(pedido.download_expira_em) < new Date()) {
        return { permitido: false, motivo: 'Link de download expirado (duram 7 dias)', pedido }
    }

    return { permitido: true, motivo: 'Download permitido', pedido }
}

// ============================================
// BUSCAR FOTOS DO PEDIDO
// ============================================

export async function getFotosDownload(pedidoId: string, token?: string) {
    const supabase = await createClient()

    // Verificar permissão
    const { permitido, motivo, pedido } = await verificarDownloadPermitido(pedidoId, token)

    if (!permitido || !pedido) {
        return { error: motivo, data: null }
    }

    // Buscar itens do pedido com dados das fotos
    const { data: itens, error } = await supabase
        .from('itens_pedido_foto')
        .select(`
            id,
            preco_unitario,
            foto:fotos_venda(
                id,
                titulo,
                storage_path_original,
                url_watermark
            )
        `)
        .eq('pedido_id', pedidoId)

    if (error) {
        return { error: 'Erro ao buscar fotos do pedido', data: null }
    }

    // Mapear fotos - foto pode ser array ou objeto dependendo do Supabase
    const fotosProcessadas = itens?.map(item => {
        const foto = Array.isArray(item.foto) ? item.foto[0] : item.foto
        return {
            id: foto?.id,
            titulo: foto?.titulo,
            preco: item.preco_unitario,
            preview: foto?.url_watermark,
            storage_path: foto?.storage_path_original,
        }
    }).filter(f => f.id) || []

    return {
        error: null,
        data: {
            pedido,
            fotos: fotosProcessadas
        }
    }
}

// ============================================
// GERAR SIGNED URL PARA DOWNLOAD
// ============================================

export async function gerarSignedUrlDownload(
    pedidoId: string,
    fotoId: string,
    token?: string
) {
    const supabase = await createClient()

    // Verificar permissão
    const { permitido, motivo, pedido } = await verificarDownloadPermitido(pedidoId, token)

    if (!permitido || !pedido) {
        return { error: motivo, url: null }
    }

    // Verificar se a foto pertence ao pedido
    const { data: item, error: itemError } = await supabase
        .from('itens_pedido_foto')
        .select(`
            id,
            foto:fotos_venda(
                id,
                storage_path_original,
                titulo
            )
        `)
        .eq('pedido_id', pedidoId)
        .eq('foto_id', fotoId)
        .single()

    // Normalizar foto (pode ser array ou objeto)
    const foto = Array.isArray(item?.foto) ? item.foto[0] : item?.foto

    if (itemError || !item || !foto) {
        return { error: 'Foto não encontrada no pedido', url: null }
    }

    // Gerar Signed URL (válida por 1 hora)
    const { data: signedUrlData, error: signedError } = await supabase.storage
        .from('fotos-venda')
        .createSignedUrl(foto.storage_path_original, 3600) // 1 hora

    if (signedError || !signedUrlData) {
        console.error('Erro ao gerar signed URL:', signedError)
        return { error: 'Erro ao gerar link de download', url: null }
    }

    // Registrar log de download
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await supabase
        .from('download_logs')
        .insert({
            pedido_id: pedidoId,
            foto_id: fotoId,
            ip_address: ip,
            user_agent: userAgent,
        })

    return {
        error: null,
        url: signedUrlData.signedUrl,
        filename: foto.titulo || `foto_${fotoId}.jpg`
    }
}

// ============================================
// GERAR TODAS AS SIGNED URLs DO PEDIDO
// ============================================

export async function gerarTodasSignedUrls(pedidoId: string, token?: string) {
    const supabase = await createClient()

    // Verificar permissão
    const { permitido, motivo, pedido } = await verificarDownloadPermitido(pedidoId, token)

    if (!permitido || !pedido) {
        return { error: motivo, urls: [] }
    }

    // Buscar todas as fotos do pedido
    const { data: itens, error: itemsError } = await supabase
        .from('itens_pedido_foto')
        .select(`
            id,
            foto:fotos_venda(
                id,
                storage_path_original,
                titulo
            )
        `)
        .eq('pedido_id', pedidoId)

    if (itemsError || !itens) {
        return { error: 'Erro ao buscar fotos do pedido', urls: [] }
    }

    // Gerar signed URLs para cada foto
    const urls: { fotoId: string; url: string; filename: string }[] = []

    for (const item of itens) {
        // Normalizar foto (pode ser array ou objeto)
        const foto = Array.isArray(item.foto) ? item.foto[0] : item.foto
        if (!foto?.storage_path_original) continue

        const { data: signedUrlData } = await supabase.storage
            .from('fotos-venda')
            .createSignedUrl(foto.storage_path_original, 3600)

        if (signedUrlData) {
            urls.push({
                fotoId: foto.id,
                url: signedUrlData.signedUrl,
                filename: foto.titulo || `foto_${foto.id}.jpg`
            })
        }
    }

    // Registrar log de download (apenas um para todas)
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await supabase
        .from('download_logs')
        .insert({
            pedido_id: pedidoId,
            foto_id: null,
            ip_address: ip,
            user_agent: userAgent,
        })

    return { error: null, urls }
}

// ============================================
// BUSCAR PEDIDO POR TOKEN (para link de e-mail)
// ============================================

export async function getPedidoPorToken(token: string) {
    const supabase = await createClient()

    const { data: pedido, error } = await supabase
        .from('pedidos_fotos')
        .select(`
            *,
            itens:itens_pedido_foto(
                id,
                preco_unitario,
                foto:fotos_venda(
                    id,
                    titulo,
                    url_watermark
                )
            )
        `)
        .eq('download_token', token)
        .single()

    if (error || !pedido) {
        return { error: 'Pedido não encontrado', data: null }
    }

    return { error: null, data: pedido }
}

// ============================================
// REENVIAR E-MAIL DE DOWNLOAD (para diretora)
// ============================================

export async function reenviarEmailDownload(pedidoId: string) {
    const auth = await getAuthenticatedUser()

    if (!auth?.perfil || !['diretora', 'super_admin'].includes(auth.perfil.role)) {
        return { error: 'Acesso negado' }
    }

    const supabase = await createClient()

    // Buscar pedido
    const { data: pedido, error } = await supabase
        .from('pedidos_fotos')
        .select('*')
        .eq('id', pedidoId)
        .single()

    if (error || !pedido) {
        return { error: 'Pedido não encontrado' }
    }

    if (pedido.status !== 'pago') {
        return { error: 'Pedido não está pago' }
    }

    // TODO: Implementar envio de e-mail real
    // Por enquanto, retorna o link de download
    const downloadLink = `/download/${pedidoId}?token=${pedido.download_token}`

    return {
        error: null,
        message: 'Link de download gerado',
        downloadLink
    }
}
