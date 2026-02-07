'use client'

import React, { useEffect, useState, useCallback } from 'react'
import AdminStats from '@/components/dashboard/admin-stats'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Sparkles,
    ChevronRight,
    Zap,
    Shirt,
    Camera,
    Clock,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Users,
    CreditCard,
    Receipt,
    Target,
    Loader2,
    Wallet,
    CheckCircle2,
    XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { getEstatisticasFinanceiras } from '@/app/actions/financeiro'

const ease = [0.16, 1, 0.3, 1] as const

interface FinanceData {
    faturamentoMensal: number
    totalPendentes: number
    totalAtrasadas: number
    taxaInadimplencia: number
    taxaRecebimento: number
    totalAlunos: number
    valorPendente: number
    totalLeads: number
    leadsConvertidos: number
    taxaConversao: number
}

export default function DiretoraDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#c72d1c'
    const [finance, setFinance] = useState<FinanceData | null>(null)
    const [financeLoading, setFinanceLoading] = useState(true)

    const loadFinance = useCallback(async () => {
        try {
            setFinanceLoading(true)
            const result = await getEstatisticasFinanceiras()
            setFinance(result.data as FinanceData)
        } catch {
            // Finance tables may not exist yet
            setFinance(null)
        } finally {
            setFinanceLoading(false)
        }
    }, [])

    useEffect(() => {
        loadFinance()
    }, [loadFinance])

    const formatBRL = (v: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

    return (
        <div className="space-y-6 pb-12">
            {/* Header with Stats */}
            <AdminStats />

            {/* ─── Saúde Financeira Card ──────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
            >
                <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="p-5 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-800/20">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Wallet className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                                        Saúde Financeira
                                    </CardTitle>
                                    <CardDescription className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">
                                        Espaço Revelle &middot; {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/diretora/financeiro">
                                <Button variant="outline" className="h-9 px-4 rounded-lg border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 font-bold text-[10px] uppercase tracking-widest transition-all">
                                    VER DETALHES <ChevronRight className="ml-2 w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5">
                        {financeLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Main KPIs Row */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Faturamento */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05, ease }}
                                        className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                            </div>
                                            <Badge className="text-[7px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 px-1.5 py-0 tracking-widest">
                                                ESTE MÊS
                                            </Badge>
                                        </div>
                                        <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-1">
                                            Faturamento
                                        </p>
                                        <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                                            {formatBRL(finance?.faturamentoMensal || 0)}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1.5">
                                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-500">
                                                {finance?.taxaRecebimento || 0}% recebido
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* Pendentes */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, ease }}
                                        className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-1.5 rounded-lg bg-amber-500/10">
                                                <Receipt className="w-3.5 h-3.5 text-amber-500" />
                                            </div>
                                            <Badge className="text-[7px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 px-1.5 py-0 tracking-widest">
                                                ATENÇÃO
                                            </Badge>
                                        </div>
                                        <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-1">
                                            Pendentes
                                        </p>
                                        <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                                            {formatBRL(finance?.valorPendente || 0)}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1.5">
                                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                                            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
                                                {finance?.totalPendentes || 0} mensalidades
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* Inadimplência */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15, ease }}
                                        className={`p-4 rounded-xl border ${
                                            (finance?.taxaInadimplencia || 0) > 15
                                                ? 'bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/10'
                                                : 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-1.5 rounded-lg ${
                                                (finance?.taxaInadimplencia || 0) > 15
                                                    ? 'bg-red-500/10'
                                                    : 'bg-zinc-200 dark:bg-zinc-700'
                                            }`}>
                                                {(finance?.taxaInadimplencia || 0) > 15
                                                    ? <XCircle className="w-3.5 h-3.5 text-red-500" />
                                                    : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                }
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-1">
                                            Inadimplência
                                        </p>
                                        <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                                            {finance?.taxaInadimplencia || 0}%
                                        </p>
                                        <div className="flex items-center gap-1 mt-1.5">
                                            <span className={`text-[9px] font-bold ${
                                                (finance?.taxaInadimplencia || 0) > 15
                                                    ? 'text-red-500'
                                                    : 'text-emerald-500'
                                            }`}>
                                                {finance?.totalAtrasadas || 0} atrasadas de {finance?.totalAlunos || 0}
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* Conversão de Leads */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, ease }}
                                        className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-1.5 rounded-lg bg-blue-500/10">
                                                <Target className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <Badge className="text-[7px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0 px-1.5 py-0 tracking-widest">
                                                CRM
                                            </Badge>
                                        </div>
                                        <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-1">
                                            Conversão Leads
                                        </p>
                                        <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                                            {finance?.taxaConversao || 0}%
                                        </p>
                                        <div className="flex items-center gap-1 mt-1.5">
                                            <Users className="w-3 h-3 text-blue-500" />
                                            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
                                                {finance?.leadsConvertidos || 0}/{finance?.totalLeads || 0} leads
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Progress Bar - Recebimento do Mês */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, ease }}
                                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                                            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.15em]">
                                                Taxa de Recebimento do Mês
                                            </span>
                                        </div>
                                        <span className="text-sm font-black text-zinc-900 dark:text-white">
                                            {finance?.taxaRecebimento || 0}%
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(finance?.taxaRecebimento || 0, 100)}%` }}
                                            transition={{ duration: 1.2, ease }}
                                            className={`h-full rounded-full ${
                                                (finance?.taxaRecebimento || 0) >= 80
                                                    ? 'bg-emerald-500'
                                                    : (finance?.taxaRecebimento || 0) >= 50
                                                        ? 'bg-amber-500'
                                                        : 'bg-red-500'
                                            }`}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500">
                                            {formatBRL(finance?.faturamentoMensal || 0)} recebido
                                        </span>
                                        <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500">
                                            {formatBRL((finance?.faturamentoMensal || 0) + (finance?.valorPendente || 0))} esperado
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Integration Status */}
                                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50/50 dark:bg-zinc-800/10 border border-zinc-100/50 dark:border-zinc-800/30">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em]">
                                            Asaas (PIX, Boleto, Cartão) &middot; Integrado
                                        </span>
                                    </div>
                                    <Link href="/diretora/financeiro">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.1em] hover:underline" style={{ color: primaryColor }}>
                                            Cobrar Agora
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* ─── Cards Row: Figurinos + Content Hub ─────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Gestao de Figurinos */}
                <Card className="xl:col-span-2 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden flex flex-col">
                    <CardHeader className="p-4 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-800/20 shrink-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-white uppercase tracking-tight">
                                    <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                        <Shirt className="w-4 h-4 text-rose-500" />
                                    </div>
                                    Ateliê de Figurinos
                                </CardTitle>
                                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                    Monitoramento estratégico de acervo e medidas.
                                </CardDescription>
                            </div>
                            <Link href="/diretora/estoque">
                                <Button variant="outline" className="h-9 px-4 rounded-lg border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 font-bold text-[10px] uppercase tracking-widest transition-all">
                                    VER INVENTÁRIO <ChevronRight className="ml-2 w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { name: 'Tutu Profissional Cisne Negro', stock: 12, status: 'Processando', last: 'Há 2h', type: 'Premium' },
                                { name: 'Collant Floral Prime Baby I', stock: 45, status: 'Disponível', last: 'Há 1d', type: 'Estoque' },
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 hover:border-rose-500/30 transition-all cursor-pointer group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="space-y-0.5">
                                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-[0.2em] border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 px-1.5 py-0">
                                                {item.type}
                                            </Badge>
                                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block group-hover:text-rose-500 transition-colors">
                                                {item.name}
                                            </span>
                                            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" /> {item.last}
                                            </span>
                                        </div>
                                        <Badge className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border
                                            ${item.status === 'Processando'
                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-200/50 dark:border-zinc-700/50 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                                            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                                                {item.stock} <span className="text-zinc-400 dark:text-zinc-600 font-medium">UNIDADES</span>
                                            </span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all shadow-sm">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 blur-2xl rounded-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* IA Content Hub */}
                <Card className="bg-zinc-950 text-white border-none shadow-2xl rounded-xl overflow-hidden relative flex flex-col group transition-all">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <CardHeader className="p-6 relative z-10 shrink-0">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
                                <Sparkles className="w-5 h-5 text-rose-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-black tracking-tight uppercase leading-none">Content Hub</CardTitle>
                                <CardDescription className="text-rose-400/80 text-[9px] font-black uppercase tracking-[0.2em]">
                                    Inteligência Criativa
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 space-y-4 relative z-10 flex-1 flex flex-col">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 space-y-4 flex-1 flex flex-col justify-center hover:bg-white/10 transition-all group/inner border-dashed">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-rose-500 text-white border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20">
                                    LIVE EVENT
                                </Badge>
                                <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest italic animate-pulse">Monitoring...</span>
                            </div>

                            <div className="space-y-3 text-center py-2">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-violet-600 p-0.5 mx-auto group-hover/inner:scale-105 transition-transform">
                                    <div className="w-full h-full bg-zinc-900 rounded-[0.9rem] flex items-center justify-center">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-white font-black text-sm tracking-tight uppercase">Espetáculo Winter</p>
                                    <p className="text-rose-400/80 text-[8px] font-black uppercase tracking-[0.15em]">42 novos registros</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={() => toast.info('Análise em andamento. Os registros serão liberados assim que a IA concluir o processamento.')}
                                    variant="ghost"
                                    className="h-9 rounded-xl bg-white/5 text-white font-black text-[9px] uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all"
                                >
                                    Revisar
                                </Button>
                                <Button
                                    onClick={() => toast.success('Conteúdo aprovado e agendado para publicação!')}
                                    variant="ghost"
                                    className="h-9 rounded-xl bg-white/5 text-white font-black text-[9px] uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all"
                                >
                                    Aprovar
                                </Button>
                            </div>
                        </div>

                        <Link href="/diretora/galeria" className="shrink-0">
                            <Button className="w-full h-11 rounded-xl font-black text-[10px] uppercase tracking-widest text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-rose-500/20 border-none group/btn"
                                style={{ backgroundColor: primaryColor }}>
                                <Zap className="w-4 h-4 fill-current group-hover:animate-pulse" />
                                GERAR POSTS SEO
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
