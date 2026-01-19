'use client'

import React, { useEffect, useState } from 'react'
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
import { getStats } from '@/app/actions/admin'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#f43f5e'
    const [realStats, setRealStats] = useState({ totalStudents: 0, totalTurmas: 0 })

    useEffect(() => {
        loadStats()
    }, [])

    async function loadStats() {
        try {
            const result = await getStats()
            setRealStats(result.data)
        } catch (err) {
            console.error('Erro ao carregar stats:', err)
        }
    }

    const stats = [
        {
            title: 'Alunos Ativos',
            value: realStats.totalStudents.toString(),
            description: 'Total de matrículas vigentes',
            icon: Users,
            trend: '+12%',
            trendUp: true,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10'
        },
        {
            title: 'Turmas Ativas',
            value: realStats.totalTurmas.toString(),
            description: 'Classes em andamento',
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
        <div className="space-y-8 lg:space-y-12">
            {/* Executive Welcome */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none">
                            CENTRO DE COMANDO
                        </Badge>
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Real-time Data</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
                        Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Diretoria</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-2xl font-medium leading-relaxed">
                        Bem-vinda, <span className="text-zinc-900 dark:text-zinc-100 font-bold">{tenant?.nome || 'Gestora'}</span>. Visualize os indicadores estratégicos e a saúde financeira da sua escola de artes hoje.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all uppercase tracking-widest">
                        Extrair PDF
                    </Button>
                    <Link href="/diretora/turmas">
                        <Button className="h-12 px-8 rounded-2xl font-black text-xs text-white shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest" style={{ backgroundColor: primaryColor }}>
                            <Plus className="w-4 h-4 mr-1" />
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-white dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 shadow-sm hover:border-rose-500/30 transition-all duration-300 group rounded-[2rem] overflow-hidden relative">
                            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} bg-opacity-10 border border-current/10`}>
                                    <stat.icon size={20} strokeWidth={2.5} />
                                </div>
                                <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${stat.trendUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'} px-2.5 py-1.5 rounded-xl border border-current/10`}>
                                    {stat.trend} <ArrowUpRight size={12} className="ml-1" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-3">
                                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">
                                    {stat.title}
                                </p>
                                <div className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">{stat.value}</div>
                                <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-2 font-bold uppercase tracking-wide">{stat.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Insights and Strategic View */}
                <Card className="lg:col-span-2 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase flex items-center gap-3">
                                <TrendingUp className="w-6 h-6" style={{ color: primaryColor }} />
                                Curva de Performance
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-zinc-500">Métricas consolidadas do fluxo acadêmico e financeiro.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl h-10 px-5 transition-all">Relatório Detalhado</Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col">
                        <div className="flex-1 min-h-[350px] w-full bg-zinc-50/50 dark:bg-black/20 flex items-center justify-center p-12 relative overflow-hidden">
                            {/* Visual Chart Bars */}
                            <div className="absolute inset-x-12 bottom-12 top-16 flex items-end justify-between gap-3 lg:gap-6 z-10">
                                {[40, 65, 45, 90, 60, 85, 100].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: 0.3 + i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex-1 rounded-t-2xl group relative cursor-pointer"
                                        style={{ background: `linear-gradient(to top, ${primaryColor}, ${primaryColor}40)` }}
                                    >
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 shadow-2xl transition-all font-black uppercase tracking-widest whitespace-nowrap z-20 scale-90 group-hover:scale-100">
                                            R$ {(h * 324 * 1.5).toFixed(0)}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="text-zinc-900/5 dark:text-white/5 font-black text-[12vw] select-none uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none leading-none">
                                REVELLE
                            </div>
                        </div>
                        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
                            {[
                                { label: 'Churn Rate', val: '2.4%', color: 'text-zinc-600 dark:text-zinc-300' },
                                { label: 'LTV Médio', val: 'R$ 4.2k', color: 'text-zinc-900 dark:text-white' },
                                { label: 'CAC', val: 'R$ 145', color: 'text-zinc-600 dark:text-zinc-300' },
                                { label: 'Liquidez', val: '92%', color: 'text-emerald-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-[0.2em]">{item.label}</div>
                                    <div className={`text-2xl font-black tracking-tight ${item.color}`}>{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Automation & Status Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-400">
                                <Zap className="w-4 h-4" style={{ color: primaryColor }} />
                                Operação Inteligente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            <div className="p-5 rounded-[1.75rem] bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-rose-500/20 transition-all cursor-pointer group">
                                <div className="font-black text-sm mb-1 text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors">WhatsApp Marketing</div>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                    8 mensalidades vencem today. Disparo agendado para as 09:00.
                                </p>
                                <div className="mt-5 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900" />)}
                                        <div className="text-[10px] text-zinc-400 ml-5 flex items-center font-black">+14</div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black uppercase bg-rose-500/10 text-rose-500 px-4 rounded-xl hover:bg-rose-500 hover:text-white transition-all">Ver Lista</Button>
                                </div>
                            </div>

                            <div className="p-5 rounded-[1.75rem] bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-rose-500/20 transition-all cursor-pointer group">
                                <div className="font-black text-sm mb-1 text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors">Site & Blog IA</div>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                    42 fotos novas detectadas via IA. Posts SEO gerados com sucesso.
                                </p>
                                <Link href="/diretora/galeria">
                                    <Button size="sm" className="w-full mt-5 text-white font-black h-11 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/10 transition-all border-none" style={{ backgroundColor: primaryColor }}>
                                        Revisar Conteúdo
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 text-white border-none rounded-[2.5rem] shadow-2xl overflow-hidden group relative">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rose-500/20 to-transparent pointer-events-none" />
                        <CardContent className="p-10 text-center relative z-10">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 group-hover:rotate-12 transition-transform shadow-xl shadow-emerald-500/10">
                                <DollarSign className="text-emerald-500" size={32} />
                            </div>
                            <h3 className="text-white font-black text-xl mb-1 uppercase tracking-tighter">Meta Mensal</h3>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Receita Bruta Esperada</p>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest px-1">
                                    <span className="text-emerald-500">R$ 32.4k</span>
                                    <span className="text-white">81%</span>
                                    <span className="text-zinc-600">R$ 40k</span>
                                </div>
                                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '81%' }}
                                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                    />
                                </div>
                            </div>
                            <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-black h-12 rounded-2xl tracking-widest uppercase text-xs border-none shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                                Impulsionar
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
