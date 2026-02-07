'use client'

import React, { useState, useEffect } from 'react'
import { getMinhasTurmasMonitora } from '@/app/actions/monitora'
import { toast } from 'sonner'
import {
    Users,
    Calendar,
    Clock,
    Loader2,
    ChevronRight,
    GraduationCap,
    CheckCircle2,
    XCircle,
    Shield
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

export default function MonitoraTurmasPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [isLoading, setIsLoading] = useState(true)
    const [turmas, setTurmas] = useState<any[]>([])

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            setIsLoading(true)
            const result = await getMinhasTurmasMonitora()
            setTurmas(result.data)
        } catch (error: any) {
            toast.error(error.message || 'Erro ao carregar turmas')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Carregando suas turmas...
                </p>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Area da Monitora
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Minhas <span style={{ color: primaryColor }}>Turmas</span>
                    </h1>
                    <p className="text-muted-foreground font-bold text-sm">
                        {turmas.length} turmas sob sua monitoria
                    </p>
                </div>
                <Link href="/monitor">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                        Voltar ao Dashboard
                    </Button>
                </Link>
            </div>

            {/* Turmas Grid */}
            {turmas.length === 0 ? (
                <Card className="bg-card border-border rounded-[3rem] p-12 text-center">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Nenhuma turma vinculada</h3>
                    <p className="text-muted-foreground">Fale com a diretora para ser vinculada a uma turma.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {turmas.map((vinculo) => (
                        <Card key={vinculo.id} className="bg-card border-border shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-lg transition-all">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg"
                                            style={{ backgroundColor: (Array.isArray(vinculo.turma) ? vinculo.turma[0]?.cor_etiqueta : vinculo.turma?.cor_etiqueta) || primaryColor }}
                                        >
                                            {(Array.isArray(vinculo.turma) ? vinculo.turma[0]?.nome : vinculo.turma?.nome)?.charAt(0)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-[var(--primary)] transition-colors">
                                                {Array.isArray(vinculo.turma) ? vinculo.turma[0]?.nome : vinculo.turma?.nome}
                                            </CardTitle>
                                            <CardDescription className="text-[10px] font-black uppercase tracking-widest">
                                                {Array.isArray(vinculo.turma) ? vinculo.turma[0]?.nivel : vinculo.turma?.nivel} • Professor(a): {(Array.isArray(vinculo.turma) ? vinculo.turma[0]?.professor?.full_name : vinculo.turma?.professor?.full_name) || 'N/A'}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                {/* Alunos */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Alunos na Turma</p>
                                        <p className="text-2xl font-black">{(Array.isArray(vinculo.turma) ? vinculo.turma[0]?.matriculas_turmas : vinculo.turma?.matriculas_turmas)?.length || 0}</p>
                                    </div>
                                    {/* Avatar Stack */}
                                    <div className="flex -space-x-2 ml-auto">
                                        {(Array.isArray(vinculo.turma) ? vinculo.turma[0]?.matriculas_turmas : vinculo.turma?.matriculas_turmas)?.slice(0, 5).map((m: any) => (
                                            <Avatar key={m.id} className="h-8 w-8 border-2 border-background">
                                                <AvatarImage src={m.estudante?.perfis?.avatar_url} />
                                                <AvatarFallback className="bg-muted font-bold text-[10px]" style={{ color: primaryColor }}>
                                                    {m.estudante?.nome_responsavel?.charAt(0) || 'A'}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {((Array.isArray(vinculo.turma) ? vinculo.turma[0]?.matriculas_turmas : vinculo.turma?.matriculas_turmas)?.length || 0) > 5 && (
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-background">
                                                +{(Array.isArray(vinculo.turma) ? vinculo.turma[0].matriculas_turmas : vinculo.turma.matriculas_turmas).length - 5}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Horários */}
                                {vinculo.turma?.agenda_aulas && vinculo.turma.agenda_aulas.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Horarios</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(vinculo.turma) ? vinculo.turma[0]?.agenda_aulas : vinculo.turma?.agenda_aulas)?.slice(0, 3).map((aula: any) => (
                                                <Badge key={aula.id} variant="outline" className="text-[10px] font-bold">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {diasSemana[aula.dia_semana]} {aula.hora_inicio?.slice(0, 5)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Permissões */}
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        Suas Permissoes
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className={vinculo.pode_chamada ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}>
                                            {vinculo.pode_chamada ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                            Chamada
                                        </Badge>
                                        <Badge className={vinculo.pode_avaliar ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-muted text-muted-foreground'}>
                                            {vinculo.pode_avaliar ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                            Avaliar
                                        </Badge>
                                        <Badge className={vinculo.pode_ver_observacoes ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-muted text-muted-foreground'}>
                                            {vinculo.pode_ver_observacoes ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                            Observacoes
                                        </Badge>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-border">
                                    {vinculo.pode_chamada && (
                                        <Link href="/monitor/chamada" className="flex-1">
                                            <Button
                                                className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                Fazer Chamada
                                            </Button>
                                        </Link>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="h-12 px-4 rounded-2xl"
                                        onClick={() => toast.info('Lista de alunos em desenvolvimento')}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
