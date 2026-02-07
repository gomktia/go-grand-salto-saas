'use client'

import React, { useState, useEffect } from 'react'
import {
    getPerfilMonitora,
    getEstatisticasMonitora,
    getMinhasTurmasMonitora,
    getProximasAulasMonitora
} from '@/app/actions/monitora'
import { toast } from 'sonner'
import {
    Users,
    Calendar,
    Clock,
    CheckCircle2,
    Loader2,
    Sparkles,
    ChevronRight,
    ClipboardCheck,
    GraduationCap,
    MapPin,
    Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'

const diasSemana = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado']

export default function MonitoraDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [isLoading, setIsLoading] = useState(true)
    const [perfil, setPerfil] = useState<any>(null)
    const [estatisticas, setEstatisticas] = useState<any>(null)
    const [turmas, setTurmas] = useState<any[]>([])
    const [aulasHoje, setAulasHoje] = useState<any[]>([])

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            setIsLoading(true)
            const [perfilRes, statsRes, turmasRes, aulasRes] = await Promise.all([
                getPerfilMonitora(),
                getEstatisticasMonitora(),
                getMinhasTurmasMonitora(),
                getProximasAulasMonitora()
            ])
            setPerfil(perfilRes.data)
            setEstatisticas(statsRes.data)
            setTurmas(turmasRes.data)
            setAulasHoje(aulasRes.data)
        } catch (error: any) {
            toast.error(error.message || 'Erro ao carregar dados')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Carregando seu painel...
                </p>
            </div>
        )
    }

    const primeiroNome = perfil?.nome?.split(' ')[0] || 'Monitora'

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-24">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div
                            className="absolute -inset-1 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000"
                            style={{ background: `linear-gradient(to right, ${primaryColor}, #f59e0b)` }}
                        />
                        <Avatar className="h-20 w-20 lg:h-24 lg:w-24 border-4 border-background relative">
                            <AvatarImage src={perfil?.avatar_url} />
                            <AvatarFallback className="bg-muted font-black text-2xl uppercase" style={{ color: primaryColor }}>
                                {primeiroNome.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-card border-2 border-border rounded-xl flex items-center justify-center shadow-lg">
                            <Heart className="w-5 h-5" style={{ color: primaryColor }} fill={primaryColor} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                            Monitora / Estagiaria
                        </Badge>
                        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                            Ola, <span style={{ color: primaryColor }}>{primeiroNome}!</span>
                        </h1>
                        <p className="text-muted-foreground font-bold text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            {tenant?.nome} • Voce cuida de <strong className="text-foreground">{estatisticas?.totalAlunos || 0} alunos</strong>
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Link href="/monitor/chamada">
                        <Button
                            className="h-14 px-8 rounded-2xl font-black uppercase tracking-tighter text-sm shadow-2xl transition-all hover:scale-105 active:scale-95 text-white"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <ClipboardCheck className="w-5 h-5 mr-2" />
                            Fazer Chamada
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-lg transition-all">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: primaryColor + '20' }}>
                                <Users className="w-7 h-7" style={{ color: primaryColor }} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Minhas Turmas</p>
                                <p className="text-3xl font-black tracking-tighter">{estatisticas?.totalTurmas || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-lg transition-all">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center shadow-sm">
                                <GraduationCap className="w-7 h-7 text-violet-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total de Alunos</p>
                                <p className="text-3xl font-black tracking-tighter">{estatisticas?.totalAlunos || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-lg transition-all">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Chamadas Hoje</p>
                                <p className="text-3xl font-black tracking-tighter">{estatisticas?.chamadasHoje || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Aulas de Hoje */}
                <Card className="lg:col-span-2 bg-card border-border shadow-sm rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-border/50 bg-muted/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-inner">
                                <Calendar className="w-6 h-6" style={{ color: primaryColor }} />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                                    Aulas de Hoje
                                </CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest">
                                    {diasSemana[new Date().getDay()]} • {new Date().toLocaleDateString('pt-BR')}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        {aulasHoje.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                                <p className="text-muted-foreground font-bold">Nenhuma aula agendada para hoje</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {aulasHoje.map((aula) => (
                                    <div
                                        key={aula.id}
                                        className="flex items-center justify-between p-6 rounded-[2rem] bg-muted/20 border-2 border-border/50 hover:border-[var(--primary)]/20 transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black shadow-lg"
                                                style={{ backgroundColor: (Array.isArray(aula.turma) ? aula.turma[0]?.cor_etiqueta : aula.turma?.cor_etiqueta) || primaryColor }}
                                            >
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg uppercase tracking-tight group-hover:text-[var(--primary)] transition-colors">
                                                    {Array.isArray(aula.turma) ? aula.turma[0]?.nome : aula.turma?.nome}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1 font-bold">
                                                        <Clock className="w-4 h-4" />
                                                        {aula.hora_inicio?.slice(0, 5)} - {aula.hora_fim?.slice(0, 5)}
                                                    </span>
                                                    {aula.sala && (
                                                        <span className="flex items-center gap-1 font-bold">
                                                            <MapPin className="w-4 h-4" />
                                                            {aula.sala}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Link href="/monitor/chamada">
                                            <Button
                                                className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                Chamada
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <Card className="bg-card border-border shadow-sm rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-6 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                Acoes Rapidas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-3">
                            <Link href="/monitor/turmas" className="block">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border hover:border-[var(--primary)]/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5" style={{ color: primaryColor }} />
                                        <span className="font-bold text-sm">Ver Minhas Turmas</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                            <Link href="/monitor/chamada" className="block">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border hover:border-[var(--primary)]/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <ClipboardCheck className="w-5 h-5" style={{ color: primaryColor }} />
                                        <span className="font-bold text-sm">Fazer Chamada</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Minhas Turmas Preview */}
                    <Card className="bg-card border-border shadow-sm rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-6 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                    Minhas Turmas
                                </CardTitle>
                                <Link href="/monitor/turmas">
                                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest">
                                        Ver Todas
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-3">
                            {turmas.length === 0 ? (
                                <p className="text-center text-muted-foreground text-sm py-4">Nenhuma turma vinculada</p>
                            ) : (
                                turmas.slice(0, 3).map((vinculo: any) => (
                                    <div
                                        key={vinculo.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                            style={{ backgroundColor: (Array.isArray(vinculo.turma) ? vinculo.turma[0]?.cor_etiqueta : vinculo.turma?.cor_etiqueta) || primaryColor }}
                                        >
                                            {(Array.isArray(vinculo.turma) ? vinculo.turma[0]?.nome : vinculo.turma?.nome)?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{Array.isArray(vinculo.turma) ? vinculo.turma[0]?.nome : vinculo.turma?.nome}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                                {(Array.isArray(vinculo.turma) ? vinculo.turma[0]?.matriculas_turmas : vinculo.turma?.matriculas_turmas)?.length || 0} alunos
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
