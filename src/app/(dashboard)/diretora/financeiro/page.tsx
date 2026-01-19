import React from 'react'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import { getEstatisticasFinanceiras, getMensalidades } from '@/app/actions/financeiro'
import { getStudents } from '@/app/actions/admin'
import { ClientFinanceiroContent } from './client-content'

export const dynamic = 'force-dynamic'

export default async function FinanceiroPage() {
    // Fetch real data from database
    let stats = null
    let mensalidades = []
    let students = []
    let error = null

    try {
        const [statsResult, mensalidadesResult, studentsResult] = await Promise.all([
            getEstatisticasFinanceiras(),
            getMensalidades({
                mes: new Date().getMonth() + 1,
                ano: new Date().getFullYear()
            }),
            getStudents()
        ])

        stats = statsResult.data
        mensalidades = mensalidadesResult.data
        students = studentsResult.data
    } catch (e: any) {
        error = e.message || 'Erro desconhecido'
    }

    const financialStats = [
        {
            title: 'Faturamento Mensal',
            value: `R$ ${stats?.faturamentoMensal?.toFixed(2).replace('.', ',') || '0,00'}`,
            iconName: 'DollarSign' as const,
            trend: '+12%',
            color: 'text-emerald-500'
        },
        {
            title: 'Inadimplência',
            value: `${stats?.taxaInadimplencia || '0'}%`,
            iconName: 'AlertCircle' as const,
            trend: (stats?.totalAtrasadas || 0) > 0 ? `${stats?.totalAtrasadas} atrasadas` : 'Nenhuma',
            color: 'text-red-500'
        },
        {
            title: 'Pendentes',
            value: `${stats?.totalPendentes || 0}`,
            iconName: 'Clock' as const,
            trend: 'Aguardando',
            color: 'text-amber-500'
        },
        {
            title: 'Alunos Ativos',
            value: `${stats?.totalAlunos || 0}`,
            iconName: 'TrendingUp' as const,
            trend: 'Ativos',
            color: 'text-violet-500'
        },
    ]

    // Get recent payments (last 4 mensalidades)
    const recentMensalidades = mensalidades.slice(0, 4)

    return (
        <div className="space-y-6 pb-24">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Gestão de Receitas e Fluxo
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Painel <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Financeiro</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="h-10 px-4 rounded-xl font-bold text-[10px] border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <Filter className="w-3.5 h-3.5 mr-2" />
                        Filtros
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest">
                    Erro ao carregar dados: {error}
                </div>
            )}

            <ClientFinanceiroContent
                financialStats={financialStats}
                recentMensalidades={recentMensalidades}
                students={students}
            />
        </div>
    )
}
