'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    DollarSign,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    AlertCircle,
    Clock,
    CheckCircle2,
    Calendar,
    Plus,
    ChevronRight,
    PieChart,
    Wallet
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'

const financialStats = [
    { title: 'Faturamento Mensal', value: 'R$ 15.420,00', icon: DollarSign, trend: '+12%', color: 'text-emerald-500' },
    { title: 'Inadimplência', value: '8.5%', icon: AlertCircle, trend: '-2%', color: 'text-red-500' },
    { title: 'Custos Fixos', value: 'R$ 4.200,00', icon: ArrowDownRight, trend: 'Estável', color: 'text-neutral-400' },
    { title: 'Lucro Líquido', value: 'R$ 11.220,00', icon: TrendingUp, trend: '+15%', color: 'text-violet-500' },
]

const recentPayments = [
    { student: 'Valentina Rossi', value: 'R$ 350,00', date: 'Hoje', status: 'Pago', method: 'Cartão' },
    { student: 'Isadora Lima', value: 'R$ 280,00', date: 'Hoje', status: 'Pendente', method: 'Boleto' },
    { student: 'Beatriz Costa', value: 'R$ 310,00', date: 'Ontem', status: 'Pago', method: 'Pix' },
    { student: 'Helena Souza', value: 'R$ 280,00', date: 'Ontem', status: 'Atrasado', method: 'Cartão' },
]

export default function FinanceiroPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    return (
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
                    <Button variant="outline" className="h-10 px-4 rounded-xl border border-border font-bold text-xs bg-card hover:bg-muted transition-all">
                        Relatórios
                    </Button>
                    <Button className="h-10 px-6 rounded-xl font-bold text-xs shadow-lg shadow-[var(--primary)]/20 border-none transition-all hover:scale-105 active:scale-95 text-white" style={{ backgroundColor: primaryColor }}>
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
                            <div className={`text-[10px] items-center flex gap-1 mt-1 font-bold uppercase tracking-wide ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend.startsWith('-') ? 'text-red-500' : 'text-neutral-500'}`}>
                                {stat.trend} <span className="text-muted-foreground opacity-60 normal-case">vs. mês anterior</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pagamentos Recentes */}
                <Card className="lg:col-span-2 bg-card border-border rounded-3xl shadow-sm overflow-hidden">
                    <CardHeader className="p-6 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold uppercase tracking-tight">Entradas Recentes</CardTitle>
                            <CardDescription className="text-xs font-semibold text-muted-foreground mt-0.5">Acompanhamento de fluxo</CardDescription>
                        </div>
                        <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-[var(--primary)] h-8">
                            Ver Extrato <ChevronRight className="ml-1 w-3.5 h-3.5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                            {recentPayments.map((pay, i) => (
                                <div key={i} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border border-border group-hover:scale-105 transition-transform ${pay.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-600' :
                                            pay.status === 'Pendente' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'
                                            }`}>
                                            {pay.student.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm tracking-tight">{pay.student}</div>
                                            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mt-0.5">{pay.method} • <span className="opacity-70">{pay.date}</span></div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="font-bold text-sm tracking-tight">{pay.value}</div>
                                        <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-wider h-5 px-2.5 rounded-full border ${pay.status === 'Pago' ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5' :
                                            pay.status === 'Pendente' ? 'border-amber-500/30 text-amber-600 bg-amber-500/5' : 'border-red-500/30 text-red-600 bg-red-500/5'
                                            }`}>
                                            {pay.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
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
    )
}

