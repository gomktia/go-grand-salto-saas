'use client'

import React, { useState, useEffect } from 'react'
import { getFinanceiroAlunos, getAlunosVinculados } from '@/app/actions/portal-responsavel'
import { toast } from 'sonner'
import {
    CreditCard,
    Calendar,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock,
    Download,
    Wallet,
    TrendingUp,
    FileText,
    ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'

type Mensalidade = {
    id: string
    valor: number
    status: string
    data_vencimento: string
    mes_referencia: number
    ano_referencia: number
    estudante: {
        id: string
        perfil_id: string
        perfis: {
            full_name: string
        }
    }
}

type Estatisticas = {
    totalPago: number
    totalPendente: number
    proximoVencimento: string | null
    statusGeral: string
}

const meses = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function ResponsavelFinanceiroPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [isLoading, setIsLoading] = useState(true)
    const [mensalidades, setMensalidades] = useState<Mensalidade[]>([])
    const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
    const [alunos, setAlunos] = useState<any[]>([])

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            setIsLoading(true)
            const [financeiroRes, alunosRes] = await Promise.all([
                getFinanceiroAlunos(),
                getAlunosVinculados()
            ])
            setMensalidades(financeiroRes.data.mensalidades as Mensalidade[])
            setEstatisticas(financeiroRes.data.estatisticas as Estatisticas)
            setAlunos(alunosRes.data as any[])
        } catch (error) {
            toast.error('Erro ao carregar dados financeiros')
        } finally {
            setIsLoading(false)
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
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pago':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            case 'pendente':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            case 'atrasado':
                return 'bg-red-500/10 text-red-600 border-red-500/20'
            default:
                return 'bg-muted text-muted-foreground'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pago':
                return <CheckCircle2 className="w-4 h-4" />
            case 'pendente':
                return <Clock className="w-4 h-4" />
            case 'atrasado':
                return <AlertCircle className="w-4 h-4" />
            default:
                return null
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Carregando dados financeiros...
                </p>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-6xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Area Financeira
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        <span style={{ color: primaryColor }}>Financeiro</span>
                    </h1>
                    <p className="text-muted-foreground font-bold text-sm">
                        Gerencie mensalidades e pagamentos
                    </p>
                </div>
                <Link href="/responsavel">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                        Voltar ao Dashboard
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Pago</p>
                                <p className="text-2xl font-black tracking-tighter">{formatCurrency(estatisticas?.totalPago || 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <Clock className="w-7 h-7 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pendente</p>
                                <p className="text-2xl font-black tracking-tighter">{formatCurrency(estatisticas?.totalPendente || 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: primaryColor + '20' }}>
                                <Calendar className="w-7 h-7" style={{ color: primaryColor }} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Proximo Vencimento</p>
                                <p className="text-lg font-black tracking-tighter">
                                    {estatisticas?.proximoVencimento
                                        ? formatDate(estatisticas.proximoVencimento)
                                        : 'Nenhum'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                <Button
                    onClick={() => toast.info('Geracao de carne em desenvolvimento')}
                    className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white"
                    style={{ backgroundColor: primaryColor }}
                >
                    <FileText className="w-5 h-5 mr-2" />
                    Gerar Carne Completo
                </Button>
                <Button
                    onClick={() => toast.info('Segunda via em desenvolvimento')}
                    variant="outline"
                    className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                >
                    <Download className="w-5 h-5 mr-2" />
                    Segunda Via de Boleto
                </Button>
            </div>

            {/* Mensalidades */}
            <Card className="bg-card border-border shadow-sm rounded-[3rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-inner">
                            <Wallet className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                                Historico de Mensalidades
                            </CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest">
                                Ultimas {mensalidades.length} mensalidades
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {mensalidades.length === 0 ? (
                        <div className="text-center py-12">
                            <CreditCard className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                            <p className="text-muted-foreground font-bold">Nenhuma mensalidade encontrada</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {mensalidades.map((mensalidade) => (
                                <div
                                    key={mensalidade.id}
                                    className="flex items-center justify-between p-6 hover:bg-muted/20 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black text-lg" style={{ color: primaryColor }}>
                                            {meses[mensalidade.mes_referencia - 1]?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-tight">
                                                {meses[mensalidade.mes_referencia - 1]} {mensalidade.ano_referencia}
                                            </p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                {mensalidade.estudante?.perfis?.full_name || 'Aluno'} • Vence em {formatDate(mensalidade.data_vencimento)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-xl font-black tracking-tighter">
                                            {formatCurrency(mensalidade.valor)}
                                        </p>
                                        <Badge className={`${getStatusColor(mensalidade.status)} font-black text-[10px] uppercase tracking-widest px-4 py-2`}>
                                            {getStatusIcon(mensalidade.status)}
                                            <span className="ml-2">{mensalidade.status}</span>
                                        </Badge>
                                        {mensalidade.status !== 'pago' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-10 h-10 rounded-xl"
                                                onClick={() => toast.info('Pagamento online em desenvolvimento')}
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
