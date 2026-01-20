/**
 * Cliente para API do Asaas
 * Documentação: https://docs.asaas.com/reference
 *
 * Configuração:
 * - ASAAS_API_KEY: Chave de API (obter em Minha Conta > Integrações > API)
 * - ASAAS_ENVIRONMENT: 'sandbox' ou 'production'
 * - ASAAS_WEBHOOK_TOKEN: Token para validar webhooks (gere um UUID)
 */

const ASAAS_API_KEY = process.env.ASAAS_API_KEY
const ASAAS_ENVIRONMENT = process.env.ASAAS_ENVIRONMENT || 'sandbox'
const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN

const BASE_URL = ASAAS_ENVIRONMENT === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3'

// ============================================
// TIPOS
// ============================================

export interface AsaasCustomer {
    id?: string
    name: string
    email: string
    phone?: string
    cpfCnpj?: string
    postalCode?: string
    address?: string
    addressNumber?: string
    complement?: string
    province?: string
    externalReference?: string
    notificationDisabled?: boolean
    additionalEmails?: string
    municipalInscription?: string
    stateInscription?: string
    groupName?: string
}

export interface AsaasPayment {
    id?: string
    customer: string // Customer ID
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'DEBIT_CARD'
    value: number
    dueDate: string // YYYY-MM-DD
    description?: string
    externalReference?: string
    installmentCount?: number
    installmentValue?: number
    discount?: {
        value: number
        dueDateLimitDays: number
        type: 'FIXED' | 'PERCENTAGE'
    }
    interest?: {
        value: number
    }
    fine?: {
        value: number
    }
    postalService?: boolean
}

export interface AsaasPixQrCode {
    encodedImage: string // Base64 do QR Code
    payload: string // Código copia e cola
    expirationDate: string
}

export interface AsaasPaymentResponse {
    id: string
    dateCreated: string
    customer: string
    value: number
    netValue: number
    originalValue: number
    interestValue: number
    description: string
    billingType: string
    confirmedDate: string | null
    pixTransaction: string | null
    status: AsaasPaymentStatus
    dueDate: string
    originalDueDate: string
    paymentDate: string | null
    clientPaymentDate: string | null
    installmentNumber: number | null
    invoiceUrl: string
    invoiceNumber: string
    externalReference: string | null
    deleted: boolean
    postalService: boolean
    anticipated: boolean
    anticipable: boolean
    creditDate: string | null
    estimatedCreditDate: string | null
    transactionReceiptUrl: string | null
    nossoNumero: string | null
    bankSlipUrl: string | null
}

export type AsaasPaymentStatus =
    | 'PENDING'           // Aguardando pagamento
    | 'RECEIVED'          // Recebido (saldo já creditado)
    | 'CONFIRMED'         // Pagamento confirmado (saldo ainda não creditado)
    | 'OVERDUE'           // Vencido
    | 'REFUNDED'          // Estornado
    | 'RECEIVED_IN_CASH'  // Recebido em dinheiro
    | 'REFUND_REQUESTED'  // Estorno solicitado
    | 'REFUND_IN_PROGRESS'// Estorno em processamento
    | 'CHARGEBACK_REQUESTED' // Recebido chargeback
    | 'CHARGEBACK_DISPUTE'   // Em disputa de chargeback
    | 'AWAITING_CHARGEBACK_REVERSAL' // Aguardando reversão chargeback
    | 'DUNNING_REQUESTED' // Em recuperação
    | 'DUNNING_RECEIVED'  // Recuperado
    | 'AWAITING_RISK_ANALYSIS' // Aguardando análise de risco

export interface AsaasWebhookPayload {
    event: string
    payment?: AsaasPaymentResponse
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

async function asaasRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    if (!ASAAS_API_KEY) {
        throw new Error('ASAAS_API_KEY não configurada')
    }

    const url = `${BASE_URL}${endpoint}`

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'access_token': ASAAS_API_KEY,
            ...options.headers,
        },
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Asaas API Error:', errorData)
        throw new Error(
            errorData.errors?.[0]?.description ||
            `Erro na API do Asaas: ${response.status}`
        )
    }

    return response.json()
}

// ============================================
// CLIENTES
// ============================================

export async function criarCliente(data: AsaasCustomer): Promise<AsaasCustomer> {
    return asaasRequest<AsaasCustomer>('/customers', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function buscarClientePorEmail(email: string): Promise<AsaasCustomer | null> {
    const response = await asaasRequest<{ data: AsaasCustomer[] }>(
        `/customers?email=${encodeURIComponent(email)}`
    )
    return response.data[0] || null
}

export async function buscarOuCriarCliente(data: AsaasCustomer): Promise<AsaasCustomer> {
    // Primeiro, tentar encontrar cliente existente pelo email
    const existente = await buscarClientePorEmail(data.email)
    if (existente) {
        return existente
    }

    // Se não existe, criar novo
    return criarCliente(data)
}

// ============================================
// COBRANÇAS
// ============================================

export async function criarCobranca(data: AsaasPayment): Promise<AsaasPaymentResponse> {
    return asaasRequest<AsaasPaymentResponse>('/payments', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function buscarCobranca(paymentId: string): Promise<AsaasPaymentResponse> {
    return asaasRequest<AsaasPaymentResponse>(`/payments/${paymentId}`)
}

export async function cancelarCobranca(paymentId: string): Promise<AsaasPaymentResponse> {
    return asaasRequest<AsaasPaymentResponse>(`/payments/${paymentId}`, {
        method: 'DELETE',
    })
}

export async function listarCobrancas(filters?: {
    customer?: string
    status?: AsaasPaymentStatus
    externalReference?: string
}): Promise<{ data: AsaasPaymentResponse[] }> {
    const params = new URLSearchParams()
    if (filters?.customer) params.append('customer', filters.customer)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.externalReference) params.append('externalReference', filters.externalReference)

    const query = params.toString() ? `?${params.toString()}` : ''
    return asaasRequest<{ data: AsaasPaymentResponse[] }>(`/payments${query}`)
}

// ============================================
// PIX
// ============================================

export async function gerarQrCodePix(paymentId: string): Promise<AsaasPixQrCode> {
    return asaasRequest<AsaasPixQrCode>(`/payments/${paymentId}/pixQrCode`)
}

export async function criarCobrancaPix(params: {
    customerName: string
    customerEmail: string
    customerPhone?: string
    customerCpfCnpj?: string
    value: number
    description: string
    externalReference?: string
    dueDate?: string // Se não informado, usa hoje
}): Promise<{
    payment: AsaasPaymentResponse
    pixQrCode: AsaasPixQrCode
}> {
    // 1. Buscar ou criar cliente
    const cliente = await buscarOuCriarCliente({
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone,
        cpfCnpj: params.customerCpfCnpj,
    })

    if (!cliente.id) {
        throw new Error('Erro ao criar/buscar cliente no Asaas')
    }

    // 2. Criar cobrança PIX
    const hoje = new Date().toISOString().split('T')[0]
    const payment = await criarCobranca({
        customer: cliente.id,
        billingType: 'PIX',
        value: params.value,
        dueDate: params.dueDate || hoje,
        description: params.description,
        externalReference: params.externalReference,
    })

    // 3. Gerar QR Code
    const pixQrCode = await gerarQrCodePix(payment.id)

    return { payment, pixQrCode }
}

// ============================================
// WEBHOOK
// ============================================

export function validarWebhookToken(token: string): boolean {
    if (!ASAAS_WEBHOOK_TOKEN) {
        console.warn('ASAAS_WEBHOOK_TOKEN não configurado - webhook não validado')
        return true // Em desenvolvimento, aceitar qualquer coisa
    }
    return token === ASAAS_WEBHOOK_TOKEN
}

export function isPagamentoConfirmado(status: AsaasPaymentStatus): boolean {
    return ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(status)
}

// ============================================
// UTILITÁRIOS
// ============================================

export function formatarValorBRL(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor)
}

export function getAsaasEnvironment(): 'sandbox' | 'production' {
    return ASAAS_ENVIRONMENT as 'sandbox' | 'production'
}

export function isAsaasConfigured(): boolean {
    return !!ASAAS_API_KEY
}
