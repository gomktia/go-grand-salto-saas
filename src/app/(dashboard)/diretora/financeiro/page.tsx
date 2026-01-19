import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    DollarSign,
    ArrowDownRight,
    TrendingUp,
    AlertCircle,
    Clock,
    CheckCircle2,
    Plus,
    ChevronRight,
    Wallet,
    Calendar,
    Filter
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getEstatisticasFinanceiras, getMensalidades } from '@/app/actions/financeiro'
import { ClientFinanceiroContent } from './client-content'

export const dynamic = 'force-dynamic'

export default async function FinanceiroPage() {
    // Fetch real data from database
    let stats = null
    let mensalidades = []
    let error = null

    try {
        const [statsResult, mensalidadesResult] = await Promise.all([
            getEstatisticasFinanceiras(),
            getMensalidades({
                mes: new Date().getMonth() + 1,
                ano: new Date().getFullYear()
            })
        ])

        stats = statsResult.data
        mensalidades = mensalidadesResult.data
    } catch (e: any) {
        error = e.message
        console.error('Erro ao carregar dados financeiros:', e)
    }

    // If error (schema not executed yet), show placeholder
    if (error) {
        return (
            <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
                <Card className="bg-amber-50 border-amber-200 rounded-3xl">
                    <CardHeader className="p-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            <CardTitle className="text-amber-900">Configuração Necessária</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                        <p className="text-sm text-amber-800">
                            O sistema financeiro ainda não está configurado no banco de dados.
                        </p>
                        <div className="bg-white rounded-xl p-4 border border-amber-200 space-y-2">
                            <p className="font-bold text-xs text-amber-900">Passos necessários:</p>
                            <ol className="text-xs text-amber-800 space-y-1 list-decimal list-inside">
                                <li>Execute o arquivo <code className="bg-amber-100 px-2 py-0.5 rounded">schema-financeiro-e-fotos-FIXED.sql</code> no Supabase</li>
                                <li>Crie o bucket <code className="bg-amber-100 px-2 py-0.5 rounded">fotos-venda</code> no Storage</li>
                                <li>Recarregue esta página</li>
                            </ol>
                        </div>
                        <p className="text-xs text-amber-700">
                            Consulte o arquivo <code>PROXIMOS-PASSOS-FINANCEIRO-FOTOS.md</code> para instruções detalhadas.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const financialStats = [
        {
            title: 'Faturamento Mensal',
            value: `R$ ${stats?.faturamentoMensal?.toFixed(2).replace('.', ',') || '0,00'}`,
            icon: DollarSign,
            trend: '+12%',
            color: 'text-emerald-500'
        },
        {
            title: 'Inadimplência',
            value: `${stats?.taxaInadimplencia || '0'}%`,
            icon: AlertCircle,
            trend: stats?.totalAtrasadas > 0 ? `${stats.totalAtrasadas} atrasadas` : 'Nenhuma',
            color: 'text-red-500'
        },
        {
            title: 'Pendentes',
            value: `${stats?.totalPendentes || 0}`,
            icon: Clock,
            trend: 'Aguardando',
            color: 'text-amber-500'
        },
        {
            title: 'Alunos Ativos',
            value: `${stats?.totalAlunos || 0}`,
            icon: TrendingUp,
            trend: 'Ativos',
            color: 'text-violet-500'
        },
    ]

    // Get recent payments (last 4 mensalidades)
    const recentMensalidades = mensalidades.slice(0, 4)

    return (
        <ClientFinanceiroContent
            financialStats={financialStats}
            recentMensalidades={recentMensalidades}
        />
    )
}
