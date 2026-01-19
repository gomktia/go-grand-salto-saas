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
    X
} from 'lucide-react'
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
    icon: any
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
        perfis?: {
            full_name: string
        }
    }
    mes_referencia: number
    ano_referencia: number
}

type Props = {
    financialStats: FinancialStat[]
    recentMensalidades: Mensalidade[]
}

export function ClientFinanceiroContent({ financialStats, recentMensalidades }: Props) {
    const tenant = useTenant()
    const router = useRouter()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [selectedMensalidade, setSelectedMensalidade] = useState<Mensalidade | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [paymentData, setPaymentData] = useState({
        metodo_pagamento: 'pix' as const,
        data_pagamento: new Date().toISOString().split('T')[0],
    })

    const handleRegisterPayment = async () => {
        if (!selectedMensalidade) return

        setIsSubmitting(true)
        try {
            await registrarPagamento({
                mensalidade_id: selectedMensalidade.id,
                estudante_id: selectedMensalidade.estudante_id,
                valor: selectedMensalidade.valor,
                metodo_pagamento: paymentData.metodo_pagamento,
                data_pagamento: new Date(paymentData.data_pagamento).toISOString(),
            })

            toast.success('Pagamento registrado com sucesso!')
            setShowPaymentModal(false)
            setSelectedMensalidade(null)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Erro ao registrar pagamento')
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
        } catch (error: any) {
            toast.error(error.message || 'Erro ao gerar mensalidades')
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
        <>
            <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full mb-2">
                            Inteligência Financeira
                        </Badge>
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                            Gestão <span style={{ color: primaryColor }}>Econômica</span>
                        </h1>
                        <p className="text-muted-foreground text-sm">Fluxo de caixa e réguas de cobrança automatizadas para o <strong className="text-foreground">{tenant?.nome}</strong>.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleGenerateMonthlyFees}
                            disabled={isSubmitting}
                            className="h-10 px-4 rounded-xl border border-border font-bold text-xs bg-card hover:bg-muted transition-all"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Gerar Mensalidades
                        </Button>
                        <Button
                            onClick={() => {
                                setShowPaymentModal(true)
                                setSelectedMensalidade(null)
                            }}
                            className="h-10 px-6 rounded-xl font-bold text-xs shadow-lg shadow-[var(--primary)]/20 border-none transition-all hover:scale-105 active:scale-95 text-white"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Cobrança
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {financialStats.map((stat, i) => (
                        <Card key={i} className="bg-card border-border shadow-sm rounded-3xl hover:border-[var(--primary)]/20 transition-all group overflow-hidden relative">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-xl bg-muted/50 ${stat.color}`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                                <div className={`text-[10px] items-center flex gap-1 mt-1 font-bold uppercase tracking-wide ${stat.color}`}>
                                    {stat.trend} <span className="text-muted-foreground opacity-60 normal-case">este mês</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Mensalidades Recentes */}
                    <Card className="lg:col-span-2 bg-card border-border rounded-3xl shadow-sm overflow-hidden">
                        <CardHeader className="p-6 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold uppercase tracking-tight">Mensalidades Recentes</CardTitle>
                                <CardDescription className="text-xs font-semibold text-muted-foreground mt-0.5">Últimas cobranças do mês</CardDescription>
                            </div>
                            <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-[var(--primary)] h-8">
                                Ver Todas <ChevronRight className="ml-1 w-3.5 h-3.5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recentMensalidades.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm font-medium">Nenhuma mensalidade cadastrada</p>
                                    <p className="text-xs mt-1">Clique em "Gerar Mensalidades" para criar cobranças do mês</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/50">
                                    {recentMensalidades.map((mensalidade, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border border-border group-hover:scale-105 transition-transform ${getStatusIcon(mensalidade.status)}`}>
                                                    {mensalidade.estudante?.perfis?.full_name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm tracking-tight">
                                                        {mensalidade.estudante?.perfis?.full_name || 'Sem nome'}
                                                    </div>
                                                    <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mt-0.5">
                                                        {mensalidade.mes_referencia}/{mensalidade.ano_referencia} • Venc: {formatDate(mensalidade.data_vencimento)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right space-y-1">
                                                    <div className="font-bold text-sm tracking-tight">{formatCurrency(mensalidade.valor)}</div>
                                                    <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-wider h-5 px-2.5 rounded-full border ${getStatusColor(mensalidade.status)}`}>
                                                        {mensalidade.status}
                                                    </Badge>
                                                </div>
                                                {mensalidade.status !== 'pago' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setSelectedMensalidade(mensalidade)
                                                            setShowPaymentModal(true)
                                                        }}
                                                        className="h-8 px-3 text-[10px] font-bold"
                                                    >
                                                        Registrar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Régua de Cobrança */}
                    <Card className="bg-card border-border rounded-3xl shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <CardHeader className="p-6 pb-4">
                            <div className="p-3 w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                                <Wallet className="w-5 h-5" style={{ color: primaryColor }} />
                            </div>
                            <CardTitle className="text-lg font-bold uppercase tracking-tight">Régua de Cobrança</CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Automação Inteligente</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-6">
                            <div className="space-y-3">
                                {[
                                    { title: 'Lembrete Antecipado', detail: 'WhatsApp (-3 dias)', icon: CheckCircle2, status: 'Ativo', color: 'text-emerald-500' },
                                    { title: 'Aviso de Vencimento', detail: 'E-mail + Push (Dia 0)', icon: Clock, status: 'Ativo', color: 'text-amber-500' },
                                    { title: 'Ação de Bloqueio', detail: 'Galeria (+5 dias)', icon: AlertCircle, status: 'Regra Crítica', color: 'text-red-500' },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border group/step hover:bg-muted/50 transition-all">
                                        <step.icon className={`w-5 h-5 shrink-0 ${step.color}`} />
                                        <div className="flex-1">
                                            <span className="block font-bold text-xs">{step.title}</span>
                                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{step.detail}</span>
                                        </div>
                                        <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-wide border-border/50 bg-background px-1.5 h-5">
                                            {step.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full h-11 rounded-xl font-bold uppercase tracking-wide text-[10px] bg-foreground text-background hover:bg-foreground/90 transition-all">
                                Personalizar Régua
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Payment Registration Modal */}
            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Registrar Pagamento</DialogTitle>
                        <DialogDescription>
                            {selectedMensalidade
                                ? `Registrar pagamento de ${selectedMensalidade.estudante?.perfis?.full_name}`
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

                        <div className="space-y-2">
                            <Label htmlFor="metodo">Método de Pagamento</Label>
                            <Select
                                value={paymentData.metodo_pagamento}
                                onValueChange={(value: any) => setPaymentData({ ...paymentData, metodo_pagamento: value })}
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
                            disabled={!selectedMensalidade || isSubmitting}
                            className="flex-1"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {isSubmitting ? 'Registrando...' : 'Confirmar Pagamento'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
