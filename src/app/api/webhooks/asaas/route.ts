import { NextRequest, NextResponse } from 'next/server'
import { validarWebhookToken } from '@/lib/asaas'
import { processarWebhookAsaas } from '@/app/actions/pagamento'

/**
 * Webhook do Asaas para notificações de pagamento
 *
 * Configure no Asaas:
 * URL: https://seu-dominio.com/api/webhooks/asaas
 * Token: Use o mesmo valor de ASAAS_WEBHOOK_TOKEN
 *
 * Eventos suportados:
 * - PAYMENT_RECEIVED: Pagamento recebido
 * - PAYMENT_CONFIRMED: Pagamento confirmado
 */

export async function POST(request: NextRequest) {
    try {
        // 1. Validar token do webhook (header asaas-access-token)
        const token = request.headers.get('asaas-access-token') || ''

        if (!validarWebhookToken(token)) {
            console.warn('Webhook Asaas: Token inválido')
            return NextResponse.json(
                { error: 'Token inválido' },
                { status: 401 }
            )
        }

        // 2. Parsear payload
        const payload = await request.json()

        console.log('Webhook Asaas recebido:', {
            event: payload.event,
            paymentId: payload.payment?.id,
            status: payload.payment?.status,
            externalReference: payload.payment?.externalReference,
        })

        // 3. Processar evento
        const result = await processarWebhookAsaas(payload)

        if (!result.success) {
            console.error('Erro ao processar webhook:', result.message)
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            )
        }

        console.log('Webhook processado:', result.message)

        return NextResponse.json({ success: true, message: result.message })

    } catch (error) {
        console.error('Erro no webhook Asaas:', error)
        return NextResponse.json(
            { error: 'Erro interno ao processar webhook' },
            { status: 500 }
        )
    }
}

// GET para verificar se o endpoint está funcionando
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Webhook Asaas endpoint ativo',
        timestamp: new Date().toISOString(),
    })
}
