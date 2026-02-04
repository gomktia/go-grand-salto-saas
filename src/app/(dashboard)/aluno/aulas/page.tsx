'use client'

import React, { useState, useEffect } from 'react'
import { getAgendaAluno, getPerfilAluno } from '@/app/actions/portal-aluno'
import { toast } from 'sonner'
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Loader2,
    BookOpen,
    ChevronRight,
    CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'

const diasSemana = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado']

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
        perfis?: {
            full_name: string
        }
    }
}

export default function AlunoAulasPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [isLoading, setIsLoading] = useState(true)
    const [aulas, setAulas] = useState<Aula[]>([])
    const [perfil, setPerfil] = useState<any>(null)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            setIsLoading(true)
            const [aulasRes, perfilRes] = await Promise.all([
                getAgendaAluno(),
                getPerfilAluno()
            ])
            setAulas(aulasRes.data as Aula[])
            setPerfil(perfilRes.data)
        } catch (error) {
            toast.error('Erro ao carregar aulas')
        } finally {
            setIsLoading(false)
        }
    }

    const hoje = new Date().getDay()

    // Organizar aulas por dia da semana
    const aulasPorDia = diasSemana.map((dia, index) => ({
        dia,
        index,
        aulas: aulas.filter(a => a.dia_semana === index)
    })).filter(d => d.aulas.length > 0)

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Carregando suas aulas...
                </p>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-5xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Minha Grade
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Minhas <span style={{ color: primaryColor }}>Aulas</span>
                    </h1>
                    <p className="text-muted-foreground font-bold text-sm">
                        {perfil?.turmas?.length || 0} turmas matriculadas
                    </p>
                </div>
                <Link href="/aluno">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                        Voltar ao Dashboard
                    </Button>
                </Link>
            </div>

            {/* Turmas Cards */}
            {perfil?.turmas && perfil.turmas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {perfil.turmas.map((turma: any) => (
                        <Card key={turma.id} className="bg-card border-border shadow-sm rounded-2xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black"
                                        style={{ backgroundColor: turma.cor || primaryColor }}
                                    >
                                        {turma.nome?.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black uppercase tracking-tight">{turma.nome}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {turma.nivel} {turma.professor && `• Prof. ${turma.professor}`}
                                        </p>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] font-black uppercase">
                                        Ativo
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Agenda Semanal */}
            <Card className="bg-card border-border shadow-sm rounded-[3rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-inner">
                            <Calendar className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                                Agenda Semanal
                            </CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest">
                                Seus horarios de aula
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {aulasPorDia.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                            <p className="text-muted-foreground font-bold">Nenhuma aula agendada</p>
                            <p className="text-sm text-muted-foreground mt-2">Entre em contato com a escola para verificar sua matricula.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {aulasPorDia.map(({ dia, index, aulas: aulasNoDia }) => (
                                <div key={index} className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className={`font-black uppercase tracking-tight ${index === hoje ? 'text-[var(--primary)]' : 'text-foreground'}`}>
                                            {dia}
                                        </h3>
                                        {index === hoje && (
                                            <Badge className="bg-emerald-500 text-white text-[8px] font-black uppercase border-none">
                                                Hoje
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {aulasNoDia.map((aula) => (
                                            <div
                                                key={aula.id}
                                                className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${
                                                    index === hoje
                                                        ? 'bg-[var(--primary)]/5 border-[var(--primary)]/20'
                                                        : 'bg-muted/20 border-border/50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div
                                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black shadow-lg"
                                                        style={{ backgroundColor: aula.turma?.cor_etiqueta || primaryColor }}
                                                    >
                                                        <Clock className="w-6 h-6" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="font-black text-lg uppercase tracking-tight">
                                                            {aula.turma?.nome}
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
                                                            {aula.turma?.perfis?.full_name && (
                                                                <span className="flex items-center gap-1 font-bold">
                                                                    <User className="w-4 h-4" />
                                                                    {aula.turma.perfis.full_name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
                                                    {aula.turma?.nivel}
                                                </Badge>
                                            </div>
                                        ))}
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
