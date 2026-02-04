'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Globe,
    Shield,
    Activity,
    Database,
    Server,
    Zap,
    TrendingUp,
    Users,
    ChevronRight,
    Search,
    Loader2,
    GraduationCap,
    Settings,
    ExternalLink
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { getEstatisticasGlobais, getEscolas } from '@/app/actions/superadmin'

type Escola = {
    id: string
    nome: string
    slug: string
    status: string
    plano: string
    created_at: string
    perfis: { count: number }[]
    estudantes: { count: number }[]
    turmas: { count: number }[]
}

type Estatisticas = {
    totalEscolas: number
    totalAlunos: number
    totalProfessores: number
    totalTurmas: number
    mrrGlobal: number
}

export default function SuperAdminDashboard() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
    const [escolas, setEscolas] = useState<Escola[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const filteredEscolas = escolas.filter(escola =>
        escola.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escola.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    async function loadData() {
        try {
            setIsLoading(true)
            const [statsRes, escolasRes] = await Promise.all([
                getEstatisticasGlobais(),
                getEscolas()
            ])
            setEstatisticas(statsRes.data)
            setEscolas(escolasRes.data as Escola[])
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            toast.error('Erro ao carregar dados do painel')
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
        }).format(value)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Sincronizando Sistema Global...
                </p>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-10 space-y-10 pb-24 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-neutral-900 p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Zap size={140} />
                </div>
                <div className="relative z-10 space-y-3">
                    <Badge className="bg-violet-600 text-white border-none px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px] rounded-full">
                        MODO ROOT: SISTEMA GLOBAL
                    </Badge>
                    <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        Painel <span className="text-violet-500">Grand Salto</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm lg:text-lg">Monitoramento de infraestrutura e performance de todos os tenants.</p>
                </div>
                <div className="flex gap-3 relative z-10">
                    <Button
                        onClick={() => router.push('/superadmin/logs')}
                        variant="outline"
                        className="h-14 border-white/10 bg-white/5 text-white hover:bg-white/10 px-8 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                    >
                        Logs do Sistema
                    </Button>
                    <Button
                        onClick={() => router.push('/superadmin/config')}
                        className="h-14 bg-violet-600 hover:bg-violet-500 text-white px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-violet-600/20"
                    >
                        Configuracoes Globais
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Escolas Ativas', value: estatisticas?.totalEscolas || 0, icon: Globe, color: 'text-blue-500', trend: 'Tenants ativos' },
                    { label: 'MRR Global', value: formatCurrency(estatisticas?.mrrGlobal || 0), icon: TrendingUp, color: 'text-emerald-500', trend: 'Receita mensal' },
                    { label: 'Total Alunos', value: estatisticas?.totalAlunos || 0, icon: GraduationCap, color: 'text-violet-500', trend: 'Matriculados' },
                    { label: 'Professores', value: estatisticas?.totalProfessores || 0, icon: Users, color: 'text-orange-500', trend: 'No sistema' },
                    { label: 'Turmas Ativas', value: estatisticas?.totalTurmas || 0, icon: Activity, color: 'text-pink-500', trend: 'Grade global' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-neutral-900 border-white/5 shadow-xl rounded-[2rem] hover:border-white/10 transition-all group">
                        <CardHeader className="pb-2 p-6">
                            <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center justify-between">
                                {stat.label}
                                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="text-2xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                            <div className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{stat.trend}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-neutral-900 border-white/5 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">Escolas Cadastradas</CardTitle>
                            <CardDescription className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-1">Gerenciamento de Instancias • Clique em uma escola para acessar</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <Input
                                    placeholder="Buscar escola..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-10 pl-11 w-64 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-neutral-500"
                                />
                            </div>
                            <Button
                                onClick={() => router.push('/superadmin/escolas')}
                                className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest h-10"
                            >
                                Nova Escola
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredEscolas.length === 0 ? (
                        <div className="p-12 text-center">
                            <Globe className="w-12 h-12 mx-auto text-neutral-700 mb-4" />
                            <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest">
                                {escolas.length === 0 ? 'Nenhuma escola cadastrada' : 'Nenhuma escola encontrada'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {filteredEscolas.map((escola) => (
                                <div
                                    key={escola.id}
                                    className="p-8 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
                                    onClick={() => router.push(`/superadmin/escola/${escola.id}`)}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white uppercase text-xs group-hover:bg-violet-500/20 group-hover:border-violet-500/30 transition-all">
                                            {escola.nome.substring(0, 2)}
                                        </div>
                                        <div>
                                            <div className="font-black text-white uppercase tracking-tight group-hover:text-violet-400 transition-colors">{escola.nome}</div>
                                            <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{escola.slug}.grandsalto.ia</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden md:block">
                                            <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Alunos</div>
                                            <div className="text-white font-black">{escola.estudantes?.[0]?.count || 0}</div>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Turmas</div>
                                            <div className="text-white font-black">{escola.turmas?.[0]?.count || 0}</div>
                                        </div>
                                        <Badge className="bg-neutral-800 text-neutral-300 border-none uppercase text-[9px] font-black tracking-widest px-3 py-1">
                                            {escola.plano || 'Basic'}
                                        </Badge>
                                        <Badge className={escola.status === 'ativo' ? "bg-emerald-500/10 text-emerald-500 border-none uppercase text-[9px] font-black tracking-widest px-3 py-1" : "bg-orange-500/10 text-orange-500 border-none uppercase text-[9px] font-black tracking-widest px-3 py-1"}>
                                            {escola.status === 'ativo' ? 'Ativo' : escola.status}
                                        </Badge>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-neutral-500 hover:text-white hover:bg-violet-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/superadmin/escola/${escola.id}`)
                                            }}
                                        >
                                            <Settings className="w-4 h-4 mr-2" />
                                            Gerenciar
                                        </Button>
                                        <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
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
