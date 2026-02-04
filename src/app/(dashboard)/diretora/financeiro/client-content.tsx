'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    AlertCircle,
    Clock,
    CheckCircle2,
    Plus,
    ChevronRight,
    Wallet,
    DollarSign,
    Calendar,
    Zap,
    X,
    TrendingUp
} from 'lucide-react'

// Map icon names to actual icon components
const iconMap = {
    DollarSign,
    AlertCircle,
    Clock,
    TrendingUp,
} as const
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { registrarPagamento, gerarMensalidadesMes } from '@/app/actions/financeiro'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type FinancialStat = {
    title: string
    value: string
    iconName: keyof typeof iconMap
    trend: string
    color: string
}

type Mensalidade = {
    id: string
    estudante_id: string
    valor: number
    data_vencimento: string
    status: string
    estudante?: {
        id: string
        nome_responsavel: string
        perfil_id?: string
    }
    mes_referencia: number
    ano_referencia: number
}

type Props = {
    financialStats: FinancialStat[]
    recentMensalidades: Mensalidade[]
    students: any[]
}

export function ClientFinanceiroContent({ financialStats, recentMensalidades, students }: Props) {
    const tenant = useTenant()
    const router = useRouter()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [selectedMensalidade, setSelectedMensalidade] = useState<Mensalidade | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [paymentData, setPaymentData] = useState<{
        metodo_pagamento: 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'dinheiro';
        data_pagamento: string;
        estudante_id: string;
        valor: string;
    }>({
        metodo_pagamento: 'pix',
        data_pagamento: new Date().toISOString().split('T')[0],
        estudante_id: '',
        valor: '',
    })

    const handleRegisterPayment = async () => {
        if (!selectedMensalidade) return

        setIsSubmitting(true)
        try {
            await registrarPagamento({
                mensalidade_id: selectedMensalidade?.id,
                estudante_id: selectedMensalidade?.estudante_id || paymentData.estudante_id,
                valor: selectedMensalidade?.valor || parseFloat(paymentData.valor),
                metodo_pagamento: paymentData.metodo_pagamento,
                data_pagamento: new Date(paymentData.data_pagamento).toISOString(),
            })

            toast.success('Pagamento registrado com sucesso!')
            setShowPaymentModal(false)
            setSelectedMensalidade(null)
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao registrar pagamento')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGenerateMonthlyFees = async () => {
        const now = new Date()
        const mes = now.getMonth() + 1
        const ano = now.getFullYear()

        setIsSubmitting(true)
        try {
            const result = await gerarMensalidadesMes(mes, ano)
            toast.success(`${result.count} mensalidades geradas com sucesso!`)
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao gerar mensalidades')
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00')
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pago':
                return 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5'
            case 'pendente':
                return 'border-amber-500/30 text-amber-600 bg-amber-500/5'
            case 'atrasado':
                return 'border-red-500/30 text-red-600 bg-red-500/5'
            default:
                return 'border-neutral-500/30 text-neutral-600 bg-neutral-500/5'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pago':
                return 'bg-emerald-500/10 text-emerald-600'
            case 'pendente':
                return 'bg-amber-500/10 text-amber-600'
            case 'atrasado':
                return 'bg-red-500/10 text-red-600'
            default:
                return 'bg-neutral-500/10 text-neutral-600'
        }
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header Section removed from here since it's already in page.tsx */}

            {/* Action Bar */}
            <div className="flex flex-wrap gap-2 mb-6">
                <Button
                    variant="outline"
                    onClick={handleGenerateMonthlyFees}
                    disabled={isSubmitting}
                    className="h-10 px-5 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold text-[10px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all uppercase tracking-widest text-zinc-600 dark:text-zinc-400"
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    GERAR MENSALIDADES
                </Button>
                <Button
                    onClick={() => {
                        setShowPaymentModal(true)
                        setSelectedMensalidade(null)
                    }}
                    className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none"
                    style={{ backgroundColor: primaryColor }}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    NOVA COBRANÇA
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {financialStats.map((stat, i) => {
                    const IconComponent = iconMap[stat.iconName]
                    return (
                        <Card key={i} className="bg-white dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden relative group hover:border-emerald-500/30 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-1 p-4">
                                <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-1.5 rounded-lg ${stat.color} bg-current/10 border border-current/20`}>
                                    <IconComponent className="w-3.5 h-3.5" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Transactions List */}
                <Card className="xl:col-span-2 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                    <CardHeader className="p-5 border-b border-zinc-50 dark:border-zinc-800 shrink-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg font-bold tracking-tight uppercase text-zinc-900 dark:text-zinc-100">
                                    Fluxo de Recebimentos
                                </CardTitle>
                            </div>
                            <Button
                                onClick={() => toast.info('O relatório financeiro detalhado está sendo processado.')}
                                variant="ghost"
                                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-600/10 h-8 px-4 rounded-xl transition-all"
                            >
                                Ver Relatório <ChevronRight className="ml-1 w-3 h-3" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2">
                        {recentMensalidades.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <DollarSign className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                                </div>
                                <p className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Nenhum registro encontrado</p>
                                <p className="text-sm text-zinc-500 mt-2 max-w-xs mx-auto font-medium">
                                    Gere as mensalidades do mês para começar a acompanhar o fluxo financeiro.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {recentMensalidades.map((mensalidade, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800/50">
                                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                            <div className="relative">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-md overflow-hidden shrink-0"
                                                    style={{ backgroundColor: primaryColor }}
                                                >
                                                    {mensalidade.estudante?.nome_responsavel?.charAt(0) || '?'}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center ${getStatusIcon(mensalidade.status).split(' ')[1]}`}>
                                                    <div className="w-1 h-1 rounded-full bg-current" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 transition-colors uppercase tracking-tight text-xs">
                                                    {mensalidade.estudante?.nome_responsavel || 'Aluno não identificado'}
                                                </div>
                                                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500 mt-0.5 flex items-center gap-2">
                                                    <span>Ref: {mensalidade.mes_referencia}/{mensalidade.ano_referencia}</span>
                                                    <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                                                    <span>Vencimento: {formatDate(mensalidade.data_vencimento)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-4 pl-12 sm:pl-0">
                                            <div className="text-right">
                                                <div className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                                                    {formatCurrency(mensalidade.valor)}
                                                </div>
                                                <Badge variant="outline" className={`text-[8px] font-bold uppercase tracking-widest h-4 px-2 rounded-full border ${getStatusColor(mensalidade.status)} mt-0.5`}>
                                                    {mensalidade.status}
                                                </Badge>
                                            </div>
                                            {mensalidade.status !== 'pago' ? (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedMensalidade(mensalidade)
                                                        setShowPaymentModal(true)
                                                    }}
                                                    className="h-8 px-4 rounded-lg font-bold text-[9px] uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all border-none"
                                                >
                                                    REGISTRAR
                                                </Button>
                                            ) : (
                                                <div className="w-[80px] flex justify-center">
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Automation Rules */}
                <Card className="bg-zinc-950 text-white border-none rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="p-8 relative z-10">
                        <div className="p-3 w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6 shadow-xl group-hover:rotate-6 transition-transform">
                            <Wallet className="w-7 h-7 text-rose-400" />
                        </div>
                        <CardTitle className="text-xl font-black tracking-tight uppercase">Régua Inteligente</CardTitle>
                        <CardDescription className="text-rose-400/80 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                            Automação de Cobrança
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-4 relative z-10">
                        {[
                            { title: 'Aviso Prévio', detail: 'WhatsApp (-3 dias)', icon: CheckCircle2, status: 'On', color: 'text-emerald-400' },
                            { title: 'Dia do Vencimento', detail: 'Push + E-mail', icon: Clock, status: 'On', color: 'text-amber-400' },
                            { title: 'Ação de Bloqueio', detail: 'Portal (+5 dias)', icon: AlertCircle, status: 'Regra', color: 'text-rose-400' },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                <div className={`p-2 rounded-xl bg-white/5 ${step.color}`}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <span className="block font-bold text-sm tracking-tight">{step.title}</span>
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{step.detail}</span>
                                </div>
                                <div className="text-[10px] font-black text-rose-400 px-2 py-1 bg-rose-400/10 rounded-lg">
                                    {step.status}
                                </div>
                            </div>
                        ))}
                        <Button
                            onClick={() => toast.info('O ajuste de réguas de cobrança será liberado na próxima atualização.')}
                            className="w-full h-14 mt-4 rounded-2xl font-black uppercase tracking-widest text-xs bg-white text-black hover:bg-zinc-200 transition-all border-none shadow-xl"
                        >
                            AJUSTAR REGRAS
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Registration Modal */}
            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Registrar Pagamento</DialogTitle>
                        <DialogDescription>
                            {selectedMensalidade
                                ? `Registrar pagamento de ${selectedMensalidade.estudante?.nome_responsavel}`
                                : 'Registrar novo pagamento avulso'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {selectedMensalidade && (
                            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Valor:</span>
                                    <span className="font-bold">{formatCurrency(selectedMensalidade.valor)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Referência:</span>
                                    <span className="font-bold">{selectedMensalidade.mes_referencia}/{selectedMensalidade.ano_referencia}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Vencimento:</span>
                                    <span className="font-bold">{formatDate(selectedMensalidade.data_vencimento)}</span>
                                </div>
                            </div>
                        )}

                        {!selectedMensalidade && (
                            <>
                                <div className="space-y-2">
                                    <Label>Estudante</Label>
                                    <Select
                                        value={paymentData.estudante_id}
                                        onValueChange={(value) => setPaymentData({ ...paymentData, estudante_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o aluno" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students?.map((student) => (
                                                <SelectItem key={student.id} value={student.id}>
                                                    {student.nome_responsavel}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Valor do Pagamento</Label>
                                    <Input
                                        type="number"
                                        placeholder="0,00"
                                        value={paymentData.valor}
                                        onChange={(e) => setPaymentData({ ...paymentData, valor: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="metodo">Método de Pagamento</Label>
                            <Select
                                value={paymentData.metodo_pagamento}
                                onValueChange={(value: 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'dinheiro') => setPaymentData({ ...paymentData, metodo_pagamento: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pix">PIX</SelectItem>
                                    <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                                    <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                                    <SelectItem value="boleto">Boleto</SelectItem>
                                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="data">Data do Pagamento</Label>
                            <Input
                                id="data"
                                type="date"
                                value={paymentData.data_pagamento}
                                onChange={(e) => setPaymentData({ ...paymentData, data_pagamento: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowPaymentModal(false)}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleRegisterPayment}
                            disabled={isSubmitting || (!selectedMensalidade && (!paymentData.estudante_id || !paymentData.valor))}
                            className="flex-1"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {isSubmitting ? 'Registrando...' : 'Confirmar Pagamento'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
