'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import {
    criarCobrancaPix,
    buscarCobranca,
    isPagamentoConfirmado,
    isAsaasConfigured,
    AsaasPaymentResponse,
    AsaasPixQrCode
} from '@/lib/asaas'

// ============================================
// TIPOS
// ============================================

interface CriarPedidoFotosInput {
    fotos_ids: string[]
    nome_comprador: string
    email_comprador: string
    telefone_comprador?: string
    cpf_comprador?: string
}

interface PedidoFotosResult {
    pedido: {
        id: string
        valor_total: number
        quantidade_fotos: number
        status: string
    }
    pix: {
        qr_code_base64: string
        copia_cola: string
        expiracao: string
    }
    asaas_payment_id?: string
}

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
// CRIAR PEDIDO COM PIX REAL
// ============================================

export async function criarPedidoFotosComPix(
    input: CriarPedidoFotosInput
): Promise<{ error?: string; data?: PedidoFotosResult }> {
    const supabase = await createClient()

    try {
        // 1. Validar input
        if (!input.fotos_ids || input.fotos_ids.length === 0) {
            return { error: 'Selecione pelo menos uma foto' }
        }

        if (!input.nome_comprador || input.nome_comprador.length < 3) {
            return { error: 'Nome do comprador é obrigatório' }
        }

        if (!input.email_comprador || !input.email_comprador.includes('@')) {
            return { error: 'E-mail inválido' }
        }

        // 2. Buscar fotos selecionadas
        const { data: fotos, error: fotosError } = await supabase
            .from('fotos_venda')
            .select('id, preco, escola_id, album_id')
            .in('id', input.fotos_ids)

        if (fotosError || !fotos || fotos.length === 0) {
            return { error: 'Fotos não encontradas' }
        }

        const escola_id = fotos[0].escola_id
        const valor_total = fotos.reduce((sum, f) => sum + Number(f.preco), 0)

        // 3. Criar pedido no banco (status pendente)
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos_fotos')
            .insert({
                escola_id,
                perfil_id: null,
                nome_comprador: input.nome_comprador,
                email_comprador: input.email_comprador,
                telefone_comprador: input.telefone_comprador,
                valor_total,
                quantidade_fotos: fotos.length,
                status: 'pendente',
                metodo_pagamento: 'pix',
            })
            .select()
            .single()

        if (pedidoError || !pedido) {
            console.error('Erro ao criar pedido:', pedidoError)
            return { error: 'Erro ao criar pedido' }
        }

        // 4. Criar itens do pedido
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

        // 5. Gerar cobrança PIX (real ou simulada)
        let pixData: {
            qr_code_base64: string
            copia_cola: string
            expiracao: string
        }
        let asaas_payment_id: string | undefined

        if (isAsaasConfigured()) {
            // Integração real com Asaas
            try {
                const { payment, pixQrCode } = await criarCobrancaPix({
                    customerName: input.nome_comprador,
                    customerEmail: input.email_comprador,
                    customerPhone: input.telefone_comprador,
                    customerCpfCnpj: input.cpf_comprador,
                    value: valor_total,
                    description: `Fotos - Pedido #${pedido.id.slice(0, 8)}`,
                    externalReference: pedido.id,
                })

                pixData = {
                    qr_code_base64: `data:image/png;base64,${pixQrCode.encodedImage}`,
                    copia_cola: pixQrCode.payload,
                    expiracao: pixQrCode.expirationDate,
                }
                asaas_payment_id = payment.id

                // Salvar ID do pagamento Asaas no pedido
                await supabase
                    .from('pedidos_fotos')
                    .update({ pagamento_id: payment.id })
                    .eq('id', pedido.id)

            } catch (asaasError) {
                console.error('Erro Asaas:', asaasError)
                // Fallback para simulação se Asaas falhar
                pixData = gerarPixSimulado(pedido.id, valor_total)
            }
        } else {
            // Modo de simulação (sem Asaas configurado)
            pixData = gerarPixSimulado(pedido.id, valor_total)
        }

        return {
            data: {
                pedido: {
                    id: pedido.id,
                    valor_total,
                    quantidade_fotos: fotos.length,
                    status: 'pendente',
                },
                pix: pixData,
                asaas_payment_id,
            }
        }

    } catch (error) {
        console.error('Erro ao criar pedido:', error)
        return { error: 'Erro interno ao processar pedido' }
    }
}

// ============================================
// VERIFICAR STATUS DO PAGAMENTO
// ============================================

export async function verificarStatusPagamento(pedidoId: string): Promise<{
    error?: string
    status?: string
    pago?: boolean
    download_token?: string
}> {
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

    // Se já está pago no banco, retornar
    if (pedido.status === 'pago') {
        return {
            status: 'pago',
            pago: true,
            download_token: pedido.download_token
        }
    }

    // Se tem ID do Asaas, verificar status lá
    if (pedido.pagamento_id && isAsaasConfigured()) {
        try {
            const payment = await buscarCobranca(pedido.pagamento_id)

            if (isPagamentoConfirmado(payment.status)) {
                // Atualizar pedido no banco
                await confirmarPagamentoPedido(pedidoId, payment.id)

                // Buscar o pedido atualizado para pegar o token (ou apenas retornar do objeto que já temos)
                return {
                    status: 'pago',
                    pago: true,
                    download_token: pedido.download_token
                }
            }

            return { status: payment.status.toLowerCase(), pago: false }
        } catch (asaasError) {
            console.error('Erro ao verificar Asaas:', asaasError)
        }
    }

    return { status: pedido.status, pago: false }
}

// ============================================
// CONFIRMAR PAGAMENTO (INTERNO)
// ============================================

async function confirmarPagamentoPedido(pedidoId: string, transactionId: string) {
    const supabase = await createClient()

    // Atualizar pedido
    const { error } = await supabase
        .from('pedidos_fotos')
        .update({
            status: 'pago',
            liberado_para_download: true,
            download_expira_em: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', pedidoId)

    if (error) {
        console.error('Erro ao confirmar pagamento:', error)
        throw error
    }

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

    revalidatePath('/espaco-revelle/galeria')
    revalidatePath('/diretora/pedidos-fotos')
}

// ============================================
// PROCESSAR WEBHOOK DO ASAAS
// ============================================

export async function processarWebhookAsaas(payload: {
    event: string
    payment?: AsaasPaymentResponse
}): Promise<{ success: boolean; message: string }> {
    const supabase = await createClient()

    // Eventos de pagamento confirmado
    const eventosConfirmacao = [
        'PAYMENT_RECEIVED',
        'PAYMENT_CONFIRMED',
    ]

    if (!eventosConfirmacao.includes(payload.event)) {
        return { success: true, message: 'Evento ignorado' }
    }

    if (!payload.payment) {
        return { success: false, message: 'Payload sem dados de pagamento' }
    }

    const { payment } = payload

    // Buscar pedido pelo externalReference (que é o ID do pedido)
    const pedidoId = payment.externalReference

    if (!pedidoId) {
        // Tentar buscar pelo pagamento_id
        const { data: pedido } = await supabase
            .from('pedidos_fotos')
            .select('id')
            .eq('pagamento_id', payment.id)
            .single()

        if (!pedido) {
            return { success: false, message: 'Pedido não encontrado' }
        }

        await confirmarPagamentoPedido(pedido.id, payment.id)
        return { success: true, message: 'Pagamento confirmado' }
    }

    await confirmarPagamentoPedido(pedidoId, payment.id)
    return { success: true, message: 'Pagamento confirmado' }
}

// ============================================
// HELPERS
// ============================================

function gerarPixSimulado(pedidoId: string, valor: number): {
    qr_code_base64: string
    copia_cola: string
    expiracao: string
} {
    // QR Code placeholder (1x1 pixel transparente)
    const placeholderQR = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

    // Código PIX simulado
    const codigoSimulado = `00020126580014br.gov.bcb.pix0136${pedidoId}5204000053039865802BR5913ESPACO REVELLE6008SAOPAULO62070503***6304`

    return {
        qr_code_base64: `data:image/png;base64,${placeholderQR}`,
        copia_cola: codigoSimulado,
        expiracao: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
    }
}

// ============================================
// UTILITÁRIOS PARA O FRONTEND
// ============================================

export async function getAsaasStatus(): Promise<{
    configured: boolean
    environment: string
}> {
    return {
        configured: isAsaasConfigured(),
        environment: process.env.ASAAS_ENVIRONMENT || 'sandbox',
    }
}
