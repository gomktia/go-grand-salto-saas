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
        <div className="space-y-8 lg:space-y-10 p-4 lg:p-8 pb-20 max-w-[1600px] mx-auto font-sans">
            {/* Executive Welcome */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            Painel de Controle
                        </Badge>
                        <span className="text-xs font-medium text-neutral-400">v1.2.0</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Olá, <span style={{ color: primaryColor }}>{tenant?.nome || 'Diretora'}</span>
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-base max-w-xl leading-relaxed">
                        Bem-vinda de volta. Aqui está o resumo financeiro e operacional da sua escola hoje.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shadow-sm">
                    <Button variant="outline" className="h-11 px-6 rounded-xl border-neutral-200 dark:border-neutral-800 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all">
                        Relatórios
                    </Button>
                    <Link href="/diretora/turmas">
                        <Button className="h-11 px-6 rounded-xl font-bold text-sm shadow-lg shadow-black/5 border-none transition-all hover:translate-y-px active:translate-y-0.5 text-white" style={{ backgroundColor: primaryColor }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Turma
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Smart Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card className="bg-white dark:bg-neutral-900/50 border border-neutral-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 group rounded-3xl overflow-hidden hover:-translate-y-1">
                            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
                                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} bg-opacity-10 transition-colors`}>
                                    <stat.icon size={20} strokeWidth={2} />
                                </div>
                                <div className={`flex items-center text-[10px] font-bold ${stat.trendUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-red-600 bg-red-50'} px-2.5 py-1 rounded-full`}>
                                    {stat.trend} <ArrowUpRight size={12} className="ml-1" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                                    {stat.title}
                                </p>
                                <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Insights and Strategic View */}
                <Card className="lg:col-span-2 bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden group">
                    <CardHeader className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight flex gap-3 items-center text-neutral-900 dark:text-white">
                                <TrendingUp className="w-5 h-5" style={{ color: primaryColor }} />
                                Análise de Crescimento
                            </CardTitle>
                            <CardDescription className="text-xs font-medium text-neutral-500 mt-1">Evolução de matrículas e faturamento</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg h-8 px-3">Ver Gráfico Completo</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[300px] w-full bg-neutral-50/30 dark:bg-black/20 flex items-center justify-center p-8 relative">
                            {/* Visual Chart Bars */}
                            <div className="absolute inset-x-8 bottom-8 top-16 flex items-end justify-between gap-4 lg:gap-6">
                                {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: 'easeOut' }}
                                        className="flex-1 rounded-t-xl group relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                                        style={{ background: `linear-gradient(to top, ${primaryColor}60, ${primaryColor}10)` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 shadow-lg border border-neutral-100 dark:border-neutral-700 transition-all font-bold">
                                            R$ {h * 324}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="text-neutral-900/5 dark:text-white/5 font-black text-6xl lg:text-8xl select-none uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">DATA</div>
                        </div>
                        <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/30">
                            <div>
                                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Churn Rate</div>
                                <div className="text-xl font-bold mt-1 text-neutral-900 dark:text-white">2.4%</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">LTV Médio</div>
                                <div className="text-xl font-bold mt-1 text-neutral-900 dark:text-white">R$ 4.280</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">CAC</div>
                                <div className="text-xl font-bold mt-1 text-neutral-900 dark:text-white">R$ 145</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Saldo</div>
                                <div className="text-xl font-bold text-emerald-600 mt-1">R$ 18.240</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Automation & Status Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-neutral-400">
                                <Zap className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                Operação Inteligente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-4 space-y-4">
                            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 hover:border-[var(--primary)]/30 transition-all cursor-pointer group">
                                <div className="font-bold text-sm mb-1 text-neutral-900 dark:text-white group-hover:text-[var(--primary)] transition-colors">WhatsApp Marketing</div>
                                <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
                                    8 mensalidades vencem hoje. Disparo às 09:00.
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-neutral-800" />)}
                                        <div className="text-[9px] text-neutral-500 ml-4 flex items-center font-bold uppercase tracking-wider">+5</div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-7 text-[9px] font-bold uppercase bg-[var(--primary)]/10 text-[var(--primary)] px-3 rounded-lg hover:bg-[var(--primary)]/20">Ver Lista</Button>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 hover:border-[var(--primary)]/30 transition-all cursor-pointer group">
                                <div className="font-bold text-sm mb-1 text-neutral-900 dark:text-white group-hover:text-[var(--primary)] transition-colors">Site & Blog</div>
                                <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
                                    42 fotos novas detectadas. Posts automáticos.
                                </p>
                                <Link href="/diretora/galeria">
                                    <Button size="sm" className="w-full mt-4 text-white font-bold h-9 rounded-xl text-[10px] uppercase tracking-wide shadow-md transition-all border-none" style={{ backgroundColor: primaryColor }}>
                                        Revisar
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border border-neutral-800 shadow-xl rounded-3xl overflow-hidden group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                        <CardContent className="p-8 text-center relative z-10">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                                <DollarSign className="text-emerald-500" size={28} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1 tracking-tight">Meta do Mês</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[10px] px-1 font-bold uppercase tracking-wider">
                                    <span className="text-emerald-500">R$ 32.450</span>
                                    <span className="text-neutral-500">R$ 40.000</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '81%' }}
                                        transition={{ duration: 1.5, ease: 'circOut' }}
                                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    />
                                </div>
                            </div>
                            <Button className="w-full bg-white text-black hover:bg-neutral-100 font-bold h-10 rounded-xl tracking-tight text-xs border-none">Acelerar Resultados</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
