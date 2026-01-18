'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    Zap,
    Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'

export default function AdminDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    const stats = [
        {
            title: 'Alunos Ativos',
            value: '248',
            description: 'Total de matrículas vigentes',
            icon: Users,
            trend: '+12%',
            trendUp: true,
            color: 'text-[var(--primary)]',
            bg: 'bg-[var(--primary)]/10'
        },
        {
            title: 'Receita Mensal (MRR)',
            value: 'R$ 32.450',
            description: 'Previsão de faturamento',
            icon: DollarSign,
            trend: '+8.4%',
            trendUp: true,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            title: 'Taxa de Retenção',
            value: '94%',
            description: 'Alunas que permanecem',
            icon: TrendingUp,
            trend: '+1.2%',
            trendUp: true,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Novas Matrículas',
            value: '18',
            description: 'Conversão este mês',
            icon: Zap,
            trend: '+5%',
            trendUp: true,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        }
    ]

    return (
        <div className="space-y-8 lg:space-y-12 p-4 lg:p-10 pb-24 max-w-[1600px] mx-auto">
            {/* Executive Welcome */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-black rounded-full">
                        Modo Administração
                    </Badge>
                    <h1 className="text-3xl lg:text-6xl font-black tracking-tighter text-foreground uppercase">
                        Sua Escola: <span style={{ color: primaryColor }}>{tenant?.nome || 'Escola'}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm lg:text-lg max-w-2xl font-medium leading-relaxed">
                        Olá, Diretora! Aqui está o pulso estratégico do seu negócio em tempo real.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-border font-bold uppercase tracking-widest text-[10px] hover:bg-muted transition-all">
                        Relatório Estratégico
                    </Button>
                    <Link href="/diretora/turmas">
                        <Button className="h-14 px-10 rounded-2xl font-black uppercase tracking-tighter text-lg shadow-2xl shadow-[var(--primary)]/30 border-none transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: primaryColor }}>
                            <Plus className="w-5 h-5 mr-1" />
                            Nova Turma
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Smart Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-card border-border shadow-sm hover:shadow-2xl hover:border-[var(--primary)]/30 transition-all duration-500 group rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`p-4 rounded-[1.5rem] ${stat.bg} ${stat.color} group-hover:rotate-6 transition-transform shadow-sm`}>
                                        <stat.icon size={26} strokeWidth={2.5} />
                                    </div>
                                    <div className={`flex items-center text-xs font-black ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'} bg-muted/50 px-3 py-1 rounded-full`}>
                                        {stat.trend} <ArrowUpRight size={14} className="ml-1" />
                                    </div>
                                </div>
                                <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                    {stat.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
                                <p className="text-[11px] text-muted-foreground mt-2 font-bold leading-none">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Insights and Strategic View */}
                <Card className="lg:col-span-2 bg-card border-border shadow-sm rounded-[2.5rem] overflow-hidden border-2 border-transparent hover:border-border transition-all">
                    <CardHeader className="p-10 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter flex gap-3 items-center">
                                <TrendingUp className="w-6 h-6" style={{ color: primaryColor }} />
                                Análise de Crescimento
                            </CardTitle>
                            <CardDescription className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-1">Evolução de matrículas e faturamento</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] hover:bg-muted p-4">Ver Gráfico Completo</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[350px] w-full bg-muted/20 flex items-center justify-center p-10 relative">
                            {/* Visual Chart Bars */}
                            <div className="absolute inset-x-10 bottom-10 top-20 flex items-end justify-between gap-6 lg:gap-8">
                                {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: 'easeOut' }}
                                        className="flex-1 rounded-t-2xl group relative cursor-pointer"
                                        style={{ background: `linear-gradient(to top, ${primaryColor}40, ${primaryColor}10)` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card text-foreground text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 shadow-2xl border border-border transition-all font-black">
                                            R$ {h * 324}
                                        </div>
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
                                    </motion.div>
                                ))}
                            </div>
                            <div className="text-muted-foreground/5 font-black text-8xl lg:text-9xl select-none uppercase tracking-tighter">DATA ANALYTICS</div>
                        </div>
                        <div className="p-10 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-border/50 bg-muted/5">
                            <div>
                                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Churn Rate</div>
                                <div className="text-2xl font-black mt-1">2.4%</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">LTV Médio</div>
                                <div className="text-2xl font-black mt-1">R$ 4.280</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">CAC</div>
                                <div className="text-2xl font-black mt-1">R$ 145</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Saldo</div>
                                <div className="text-2xl font-black text-emerald-500 mt-1">R$ 18.240</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Automation & Status Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-card border-border shadow-sm rounded-[2.5rem] overflow-hidden border-2 border-transparent hover:border-border transition-all">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground">
                                <Zap className="w-4 h-4" style={{ color: primaryColor }} />
                                Operação Inteligente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-5">
                            <div className="p-6 rounded-[2rem] bg-muted/30 border border-border hover:border-[var(--primary)]/30 transition-all cursor-pointer group">
                                <div className="font-black text-sm uppercase tracking-tight mb-2 group-hover:text-[var(--primary)] transition-colors">WhatsApp Marketing</div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                    8 mensalidades vencem hoje. Disparo programado para as 09:00.
                                </p>
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-muted border-2 border-card" />)}
                                        <div className="text-[10px] text-muted-foreground ml-5 flex items-center font-black uppercase tracking-widest">+5 pais</div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black uppercase bg-[var(--primary)]/5 text-[var(--primary)] px-4 rounded-full">Ver Lista</Button>
                                </div>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-muted/30 border border-border hover:border-[var(--primary)]/30 transition-all cursor-pointer group">
                                <div className="font-black text-sm uppercase tracking-tight mb-2 group-hover:text-[var(--primary)] transition-colors">Site & Blog</div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                    42 fotos novas detectadas. Posts automáticos prontos para revisão.
                                </p>
                                <Link href="/diretora/galeria">
                                    <Button size="sm" className="w-full mt-6 text-white font-black h-11 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl transition-all" style={{ backgroundColor: primaryColor }}>
                                        Revisar Agendamentos
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-none shadow-2xl rounded-[2.5rem] overflow-hidden group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                        <CardContent className="p-10 text-center relative z-10">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 group-hover:rotate-12 transition-transform shadow-xl shadow-emerald-500/10">
                                <DollarSign className="text-emerald-500" size={38} />
                            </div>
                            <h3 className="text-white font-black text-2xl mb-2 tracking-tighter uppercase">Meta do Mês</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-[11px] px-2 font-black uppercase tracking-[0.2em]">
                                    <span className="text-emerald-500">R$ 32.450</span>
                                    <span className="text-neutral-500">R$ 40.000</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '81%' }}
                                        transition={{ duration: 1.5, ease: 'circOut' }}
                                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                    />
                                </div>
                            </div>
                            <Button className="w-full bg-white text-black hover:bg-neutral-100 font-black h-14 rounded-2xl tracking-tight uppercase text-xs">Acelerar Resultados</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
