'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Heart,
    CreditCard,
    Bell,
    Calendar,
    Clock,
    MapPin,
    Star,
    Sparkles,
    ChevronRight,
    Camera,
    Download,
    Wallet,
    Loader2,
    AlertCircle,
    CheckCircle2,
    User,
    BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    getAlunosVinculados,
    getProximasAulas,
    getFinanceiroAlunos,
    getNotificacoesResponsavel,
    marcarNotificacaoLida,
    getPerfilResponsavel
} from '@/app/actions/portal-responsavel'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'

type Aluno = {
    id: string
    is_principal: boolean
    estudante: {
        id: string
        data_nascimento: string
        status_matricula: string
        observacoes_medicas?: string
        perfil_id: string
        perfis: {
            full_name: string
            avatar_url?: string
        }
        metricas_corpo: Array<{
            busto: number
            cintura: number
            quadril: number
            altura: number
            torso: number
            data_medicao: string
        }>
        matriculas_turmas: Array<{
            id: string
            status: string
            turma: {
                id: string
                nome: string
                nivel: string
                cor_etiqueta: string
            }
        }>
    }
}

type Aula = {
    id: string
    dia_semana: number
    hora_inicio: string
    hora_fim: string
    sala?: string
    turma: {
        id: string
        nome: string
        nivel: string
        cor_etiqueta: string
    }
}

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

type Notificacao = {
    id: string
    titulo: string
    mensagem: string
    tipo: string
    lido: boolean
    created_at: string
}

type Perfil = {
    id: string
    nome_completo: string
    email: string
    telefone?: string
    parentesco: string
    avatar_url?: string
}

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function ResponsavelDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [aulas, setAulas] = useState<Aula[]>([])
    const [financeiro, setFinanceiro] = useState<{
        mensalidades: Mensalidade[]
        estatisticas: {
            totalPago: number
            totalPendente: number
            proximoVencimento: string | null
            statusGeral: string
        } | null
    }>({ mensalidades: [], estatisticas: null })
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [perfil, setPerfil] = useState<Perfil | null>(null)
    const [showNotificacoes, setShowNotificacoes] = useState(false)
    const [showAgenda, setShowAgenda] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            setIsLoading(true)
            setError(null)

            const [alunosRes, aulasRes, financeiroRes, notificacoesRes, perfilRes] = await Promise.all([
                getAlunosVinculados(),
                getProximasAulas(),
                getFinanceiroAlunos(),
                getNotificacoesResponsavel(),
                getPerfilResponsavel()
            ])

            setAlunos(alunosRes.data as unknown as Aluno[])
            setAulas(aulasRes.data as unknown as Aula[])
            setFinanceiro(financeiroRes.data as typeof financeiro)
            setNotificacoes(notificacoesRes.data as unknown as Notificacao[])
            setPerfil(perfilRes.data as unknown as Perfil)
        } catch (err) {
            console.error('Erro ao carregar dados:', err)
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
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
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
    }

    const getProximaAula = () => {
        const hoje = new Date().getDay()
        const aulaHoje = aulas.find(a => a.dia_semana === hoje)
        if (aulaHoje) return { ...aulaHoje, isHoje: true }

        // Procurar próxima aula
        for (let i = 1; i <= 7; i++) {
            const dia = (hoje + i) % 7
            const aula = aulas.find(a => a.dia_semana === dia)
            if (aula) return { ...aula, isHoje: false }
        }
        return null
    }

    const proximaAula = getProximaAula()
    const alunoPrincipal = alunos.find(a => a.is_principal)?.estudante || alunos[0]?.estudante

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Carregando Portal do Responsável...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-8">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-red-600 dark:text-red-400 font-bold text-center">{error}</p>
                <Button onClick={loadData} variant="outline" className="rounded-2xl h-12 px-8 font-bold uppercase text-[10px] tracking-widest">
                    Tentar Novamente
                </Button>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-10 space-y-10 pb-24 max-w-7xl mx-auto">
            {/* Header com Contexto Familiar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2.5rem] bg-card border-2 border-border flex items-center justify-center shadow-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent" style={{ '--primary': primaryColor } as React.CSSProperties} />
                        <Heart className="w-10 h-10 transition-transform group-hover:scale-110" style={{ color: primaryColor }} fill={primaryColor} />
                    </div>
                    <div className="space-y-1">
                        <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                            Portal do Responsável
                        </Badge>
                        <h1 className="text-3xl lg:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
                            Olá, <span style={{ color: primaryColor }}>{perfil?.nome_completo?.split(' ')[0] || 'Responsável'}</span>
                        </h1>
                        <p className="text-muted-foreground font-black uppercase text-xs tracking-widest flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Bem-vindo ao <strong className="text-foreground">{tenant?.nome}</strong>
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowNotificacoes(true)}
                        className="h-14 px-6 rounded-2xl border-2 border-border font-black uppercase tracking-widest text-[10px] bg-card hover:bg-muted transition-all"
                    >
                        <Bell className="w-5 h-5 mr-3" style={{ color: primaryColor }} />
                        Notificações
                        {notificacoes.filter(n => !n.lido).length > 0 && (
                            <Badge className="ml-2 bg-red-500 text-white text-[10px]">
                                {notificacoes.filter(n => !n.lido).length}
                            </Badge>
                        )}
                    </Button>
                    <Button
                        onClick={() => toast.info('A galeria de fotos completa será liberada na próxima atualização.')}
                        className="h-14 px-8 rounded-2xl font-black uppercase tracking-tighter text-sm shadow-2xl shadow-[var(--primary)]/30 border-none transition-all hover:scale-105 active:scale-95 text-white"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Camera className="w-5 h-5 mr-2" />
                        Galeria de Fotos
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Coluna Principal: Alunos Vinculados e Agenda */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Aluno em Destaque */}
                    {alunoPrincipal ? (
                        <Card className="bg-card border-border overflow-hidden rounded-[3rem] shadow-sm relative group border-2 border-transparent hover:border-border transition-all">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                <Sparkles size={240} />
                            </div>
                            <CardHeader className="p-12 pb-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16 border-2 border-background shadow-xl ring-4 ring-[var(--primary)]/10" style={{ '--primary': primaryColor } as React.CSSProperties}>
                                            <AvatarImage src={alunoPrincipal.perfis?.avatar_url} />
                                            <AvatarFallback className="bg-muted font-black text-xl" style={{ color: primaryColor }}>
                                                {alunoPrincipal.perfis?.full_name?.charAt(0) || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter">
                                                {alunoPrincipal.perfis?.full_name || 'Aluno'}
                                            </h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                {alunoPrincipal.matriculas_turmas?.[0]?.turma?.nivel || 'Sem turma'} • {alunoPrincipal.matriculas_turmas?.[0]?.turma?.nome || ''}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className={`uppercase text-[10px] font-black tracking-widest px-6 py-2 rounded-full shadow-sm border-2
                                        ${alunoPrincipal.status_matricula === 'ativo'
                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                        }`}>
                                        {alunoPrincipal.status_matricula === 'ativo' ? 'Ativo no Portal' : alunoPrincipal.status_matricula}
                                    </Badge>
                                </div>
                                <CardTitle className="text-4xl font-black uppercase tracking-tighter">Próxima Aula</CardTitle>
                            </CardHeader>
                            <CardContent className="px-12 pb-12">
                                {proximaAula ? (
                                    <div className="flex flex-col md:flex-row items-stretch gap-6">
                                        <div className="flex-1 flex items-center gap-8 p-10 bg-muted/20 rounded-[2.5rem] border-2 border-border/50 group/item hover:border-[var(--primary)]/20 transition-all">
                                            <div className="p-8 rounded-[2rem] text-white shadow-2xl transition-all group-hover/item:scale-110 flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor, boxShadow: `0 25px 30px -10px ${primaryColor}60` }}>
                                                <Clock size={42} strokeWidth={2.5} />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-3xl font-black uppercase tracking-tighter">
                                                    {proximaAula.hora_inicio?.slice(0, 5)}
                                                </div>
                                                <div className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] flex flex-wrap gap-4">
                                                    <span className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-foreground/40" />
                                                        {proximaAula.isHoje ? 'Hoje' : diasSemana[proximaAula.dia_semana]}
                                                    </span>
                                                    {proximaAula.sala && (
                                                        <span className="flex items-center gap-2">
                                                            <MapPin size={14} className="text-foreground/40" />
                                                            {proximaAula.sala}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm font-bold text-foreground mt-2">
                                                    {proximaAula.turma?.nome}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setShowAgenda(true)}
                                            className="h-auto md:w-48 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] border-2 border-border bg-card text-foreground hover:bg-muted transition-all flex flex-col items-center justify-center gap-3 p-8 group/btn"
                                        >
                                            <Calendar className="w-8 h-8 opacity-40 group-hover/btn:text-[var(--primary)] group-hover/btn:opacity-100 transition-all" />
                                            Ver Agenda
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-muted/20 rounded-[2.5rem] border-2 border-border/50">
                                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                                        <p className="text-muted-foreground font-bold">Nenhuma aula agendada</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-card border-border overflow-hidden rounded-[3rem] shadow-sm p-12 text-center">
                            <User className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Nenhum aluno vinculado</h3>
                            <p className="text-muted-foreground text-sm">Entre em contato com a escola para vincular seus filhos ao portal.</p>
                        </Card>
                    )}

                    {/* Todos os Alunos Vinculados */}
                    {alunos.length > 1 && (
                        <Card className="bg-card border-border shadow-sm rounded-[3rem] overflow-hidden group">
                            <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
                                <CardTitle className="flex items-center gap-4 font-black text-2xl uppercase tracking-tighter">
                                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-inner">
                                        <User className="w-6 h-6" style={{ color: primaryColor }} />
                                    </div>
                                    Meus Filhos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {alunos.map((aluno) => (
                                        <div
                                            key={aluno.id}
                                            className="flex items-center gap-4 p-6 bg-muted/20 rounded-2xl border-2 border-border/50 hover:border-[var(--primary)]/20 transition-all"
                                        >
                                            <Avatar className="h-14 w-14 border-2 border-background">
                                                <AvatarImage src={aluno.estudante.perfis?.avatar_url} />
                                                <AvatarFallback className="bg-muted font-black" style={{ color: primaryColor }}>
                                                    {aluno.estudante.perfis?.full_name?.charAt(0) || 'A'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h4 className="font-black uppercase tracking-tight text-sm">
                                                    {aluno.estudante.perfis?.full_name}
                                                </h4>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {aluno.estudante.matriculas_turmas?.[0]?.turma?.nivel || 'Sem turma'}
                                                </p>
                                            </div>
                                            {aluno.is_principal && (
                                                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[8px] font-black">
                                                    Principal
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Favoritos do Palco / Galeria */}
                    <Card className="bg-card border-border shadow-sm rounded-[3rem] overflow-hidden group">
                        <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-4 font-black text-2xl uppercase tracking-tighter">
                                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-inner">
                                        <Heart className="w-6 h-6 fill-current" style={{ color: primaryColor }} />
                                    </div>
                                    Favoritos do Palco
                                </CardTitle>
                                <Button
                                    onClick={() => toast.info('A galeria de fotos completa será liberada na próxima atualização.')}
                                    variant="ghost"
                                    className="font-black text-[10px] uppercase tracking-widest group-hover:text-[var(--primary)] transition-all"
                                >
                                    Ver Galeria Completa <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                                        className="aspect-[4/5] bg-muted/50 rounded-[2.5rem] border-2 border-border overflow-hidden relative group/photo cursor-pointer"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Camera className="w-10 h-10 text-muted-foreground/30" />
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover/photo:opacity-100 transition-all flex flex-col justify-end p-8 gap-4">
                                            <p className="text-white font-black text-[10px] uppercase tracking-widest">Em breve</p>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toast.info('O download de fotos originais será liberado na próxima atualização.')
                                                    }}
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-white hover:bg-[var(--primary)] h-12 w-12 p-0 bg-white/10 backdrop-blur-md rounded-2xl transition-all border border-white/10"
                                                >
                                                    <Download size={20} />
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toast.success('Foto favoritada com sucesso!')
                                                    }}
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-white hover:bg-pink-500 h-12 w-12 p-0 bg-white/10 backdrop-blur-md rounded-2xl transition-all border border-white/10"
                                                >
                                                    <Heart size={20} className="fill-current" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Sidebar Financeira */}
                <div className="space-y-10">
                    <Card className="bg-card border-border shadow-2xl rounded-[3rem] overflow-hidden relative group">
                        <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: primaryColor }} />
                        <CardHeader className="p-10">
                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-muted-foreground">
                                <Wallet className="w-5 h-5" style={{ color: primaryColor }} />
                                Financeiro & Mensalidade
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-10">
                            <div className="p-10 bg-muted/20 rounded-[2.5rem] border-2 border-border relative overflow-hidden">
                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status Atual</span>
                                        <Badge className={`py-2 px-6 font-black uppercase text-[10px] tracking-widest rounded-full shadow-lg border-none
                                            ${financeiro.estatisticas?.statusGeral === 'em_dia'
                                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                                : 'bg-amber-500 text-white shadow-amber-500/20'
                                            }`}>
                                            {financeiro.estatisticas?.statusGeral === 'em_dia' ? 'Em Dia' : 'Pendente'}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                            {financeiro.estatisticas?.totalPendente ? 'Total Pendente' : 'Última Mensalidade'}
                                        </span>
                                        <div className="text-5xl font-black tracking-tighter leading-none">
                                            {financeiro.estatisticas?.totalPendente
                                                ? formatCurrency(financeiro.estatisticas.totalPendente).replace('R$', 'R$ ').split(',')[0]
                                                : formatCurrency(financeiro.mensalidades[0]?.valor || 0).replace('R$', 'R$ ').split(',')[0]
                                            }
                                            <span className="text-xl opacity-30">,00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`absolute -bottom-4 -right-4 w-24 h-24 blur-3xl rounded-full
                                    ${financeiro.estatisticas?.statusGeral === 'em_dia' ? 'bg-emerald-500/5' : 'bg-amber-500/5'}`} />
                            </div>
                            <Button
                                onClick={() => toast.info('A geração de carnê integrado está em processamento pelo setor financeiro.')}
                                className="w-full h-20 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl transition-all hover:scale-[1.02] border-none text-white focus:outline-none"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Gerar Carnê Integrado
                            </Button>
                            {financeiro.estatisticas?.proximoVencimento && (
                                <p className="text-[10px] text-center font-black uppercase tracking-widest text-muted-foreground opacity-40">
                                    Próximo vencimento em {formatDate(financeiro.estatisticas.proximoVencimento)}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Mural de Avisos */}
                    <Card className="bg-muted/10 border-border rounded-[3rem] p-12 border-dashed border-2 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shadow-sm ring-1 ring-violet-500/20">
                                <Bell size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-lg uppercase tracking-tighter leading-none">Mural de Avisos</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                                    {notificacoes.filter(n => !n.lido).length > 0
                                        ? `${notificacoes.filter(n => !n.lido).length} não lidos`
                                        : 'Tudo em dia'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {notificacoes.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm font-bold">Nenhum aviso no momento</p>
                                </div>
                            ) : (
                                notificacoes.slice(0, 2).map((notificacao) => (
                                    <div
                                        key={notificacao.id}
                                        className={`p-6 bg-card border-2 rounded-[2rem] relative overflow-hidden group/notice hover:border-violet-500/30 transition-all cursor-pointer
                                            ${notificacao.lido ? 'border-border' : 'border-violet-500/30'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge className={`font-black text-[8px] px-3 uppercase border-none
                                                ${notificacao.tipo === 'evento' ? 'bg-violet-500/10 text-violet-600' :
                                                    notificacao.tipo === 'financeiro' ? 'bg-amber-500/10 text-amber-600' :
                                                        'bg-blue-500/10 text-blue-600'
                                                }`}>
                                                {notificacao.tipo}
                                            </Badge>
                                            {!notificacao.lido && (
                                                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                                            )}
                                        </div>
                                        <p className="font-black uppercase tracking-tight text-sm mb-1 group-hover/notice:text-violet-500 transition-colors">
                                            {notificacao.titulo}
                                        </p>
                                        <p className="text-muted-foreground font-bold text-[11px] leading-relaxed line-clamp-2">
                                            {notificacao.mensagem}
                                        </p>
                                        <ChevronRight className="w-4 h-4 ml-auto mt-3 opacity-20 group-hover/notice:translate-x-1 group-hover/notice:opacity-100 transition-all text-violet-500" />
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            <Dialog open={showNotificacoes} onOpenChange={setShowNotificacoes}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase tracking-tighter text-2xl">Mural de Avisos</DialogTitle>
                        <DialogDescription className="font-bold text-[10px] uppercase tracking-widest">Suas últimas comunicações</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {notificacoes.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground font-bold">Nenhum aviso</p>
                        ) : notificacoes.map(n => (
                            <div key={n.id} className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
                                <div className="flex justify-between items-center">
                                    <Badge className="text-[8px] font-black uppercase">{n.tipo}</Badge>
                                    <span className="text-[8px] text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-black text-sm uppercase tracking-tight">{n.titulo}</h4>
                                <p className="text-xs text-muted-foreground">{n.mensagem}</p>
                                {!n.lido && (
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto text-[10px] font-bold text-rose-500 uppercase tracking-widest"
                                        onClick={async () => {
                                            await marcarNotificacaoLida(n.id)
                                            loadData()
                                        }}
                                    >
                                        Marcar como lido
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showAgenda} onOpenChange={setShowAgenda}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase tracking-tighter text-2xl">Agenda Completa</DialogTitle>
                        <DialogDescription className="font-bold text-[10px] uppercase tracking-widest">Horários das turmas vinculadas</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {aulas.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground font-bold">Nenhum horário definido</p>
                        ) : aulas.map(a => (
                            <div key={a.id} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white" style={{ backgroundColor: a.turma.cor_etiqueta }}>
                                    {diasSemana[a.dia_semana].charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-sm uppercase tracking-tight">{a.turma.nome}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{diasSemana[a.dia_semana]} • {a.hora_inicio.slice(0, 5)} - {a.hora_fim.slice(0, 5)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
