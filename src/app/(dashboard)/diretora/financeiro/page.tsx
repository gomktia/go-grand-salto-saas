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
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Inteligência Financeira
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Gestão <span style={{ color: primaryColor }}>Econômica</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm lg:text-lg">Fluxo de caixa e réguas de cobrança automatizadas para o <strong className="text-foreground">{tenant?.nome}</strong>.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 border-border font-black text-[10px] uppercase tracking-widest bg-card hover:bg-muted transition-all">
                        Relatórios
                    </Button>
                    <Button className="h-16 px-10 rounded-2xl font-black uppercase tracking-tighter text-lg shadow-2xl shadow-[var(--primary)]/30 border-none transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: primaryColor }}>
                        <Plus className="w-5 h-5 mr-1" />
                        Nova Cobrança
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {financialStats.map((stat, i) => (
                    <Card key={i} className="bg-card border-border shadow-sm rounded-[2rem] hover:border-[var(--primary)]/20 transition-all group overflow-hidden relative">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-xl bg-muted/50 ${stat.color}`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
                            <div className={`text-[9px] items-center flex gap-1 mt-2 font-bold uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                {stat.trend} <span className="text-muted-foreground opacity-60">vs. mês anterior</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Pagamentos Recentes */}
                <Card className="lg:col-span-2 bg-card border-border rounded-[2.5rem] shadow-sm overflow-hidden">
                    <CardHeader className="p-10 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter">Entradas Recentes</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Acompanhamento de fluxo em tempo real</CardDescription>
                        </div>
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-[var(--primary)]">
                            Ver Extrato Completo <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                            {recentPayments.map((pay, i) => (
                                <div key={i} className="flex items-center justify-between p-8 hover:bg-muted/30 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-border group-hover:scale-110 transition-transform ${pay.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-600' :
                                            pay.status === 'Pendente' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'
                                            }`}>
                                            {pay.student.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-base uppercase tracking-tight">{pay.student}</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{pay.method} • <span className="text-foreground/40">{pay.date}</span></div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div className="font-black text-lg tracking-tighter">{pay.value}</div>
                                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest h-6 px-4 rounded-full ${pay.status === 'Pago' ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5' :
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
                <Card className="bg-card border-border rounded-[2.5rem] shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-10 rounded-full" style={{ backgroundColor: primaryColor }} />
                    <CardHeader className="p-10 pb-6">
                        <div className="p-4 w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <Wallet className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                        <CardTitle className="text-xl font-black uppercase tracking-tighter">Régua de Cobrança</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Automação Inteligente Grand Salto</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 pt-0 space-y-8">
                        <div className="space-y-4">
                            {[
                                { title: 'Lembrete Antecipado', detail: 'WhatsApp (-3 dias)', icon: CheckCircle2, status: 'Ativo', color: 'text-emerald-500' },
                                { title: 'Aviso de Vencimento', detail: 'E-mail + Push (Dia 0)', icon: Clock, status: 'Ativo', color: 'text-amber-500' },
                                { title: 'Ação de Bloqueio', detail: 'Galeria (+5 dias)', icon: AlertCircle, status: 'Regra Crítica', color: 'text-red-500' },
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border group/step hover:bg-muted/50 transition-all">
                                    <step.icon className={`w-6 h-6 shrink-0 ${step.color}`} />
                                    <div className="flex-1">
                                        <span className="block font-black uppercase tracking-tight text-xs">{step.title}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{step.detail}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter border-none bg-background px-2">
                                        {step.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-foreground text-background hover:bg-neutral-800 transition-all">
                            Personalizar Régua
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

