'use client'

import React, { useState, useEffect } from 'react'
import { getMinhasTurmas } from '@/app/actions/professor'
import { toast } from 'sonner'
import {
    Users,
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    Loader2,
    BookOpen,
    Star,
    GraduationCap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'

const diasSemana = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado']

export default function ProfessorTurmasPage() {
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
            const result = await getMinhasTurmas()
            setTurmas(result.data)
        } catch (error) {
            toast.error('Erro ao carregar turmas')
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
                        Gestao de Turmas
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Minhas <span style={{ color: primaryColor }}>Turmas</span>
                    </h1>
                    <p className="text-muted-foreground font-bold text-sm">
                        Voce possui <strong className="text-foreground">{turmas.length} turmas</strong> sob sua responsabilidade
                    </p>
                </div>
                <Link href="/professor">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                        Voltar ao Dashboard
                    </Button>
                </Link>
            </div>

            {/* Turmas Grid */}
            {turmas.length === 0 ? (
                <Card className="bg-card border-border rounded-[3rem] p-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Nenhuma turma encontrada</h3>
                    <p className="text-muted-foreground">Voce ainda nao possui turmas atribuidas.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {turmas.map((turma) => (
                        <Card key={turma.id} className="bg-card border-border shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-lg transition-all">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                                            style={{ backgroundColor: turma.cor_etiqueta || primaryColor }}
                                        >
                                            {turma.nome?.charAt(0) || 'T'}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tight group-hover:text-[var(--primary)] transition-colors">
                                                {turma.nome}
                                            </CardTitle>
                                            <CardDescription className="text-[10px] font-black uppercase tracking-widest">
                                                {turma.nivel || 'Nivel nao definido'}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] font-black uppercase">
                                        Ativa
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                {/* Alunos */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Alunos Matriculados</p>
                                        <p className="text-lg font-black">{turma.matriculas_turmas?.length || 0}</p>
                                    </div>
                                </div>

                                {/* Horarios */}
                                {turma.agenda_aulas && turma.agenda_aulas.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Horarios</p>
                                        <div className="space-y-2">
                                            {turma.agenda_aulas.slice(0, 2).map((aula: any) => (
                                                <div key={aula.id} className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-bold">{diasSemana[aula.dia_semana]}</span>
                                                    <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                                                    <span>{aula.hora_inicio?.slice(0, 5)} - {aula.hora_fim?.slice(0, 5)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Alunos Avatars */}
                                {turma.matriculas_turmas && turma.matriculas_turmas.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-3">
                                            {turma.matriculas_turmas.slice(0, 4).map((m: any, i: number) => (
                                                <Avatar key={m.id} className="h-10 w-10 border-2 border-background">
                                                    <AvatarImage src={m.estudantes?.perfis?.avatar_url} />
                                                    <AvatarFallback className="bg-muted font-bold text-xs" style={{ color: primaryColor }}>
                                                        {m.estudantes?.nome_responsavel?.charAt(0) || 'A'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                        {turma.matriculas_turmas.length > 4 && (
                                            <span className="text-[10px] font-black text-muted-foreground">
                                                +{turma.matriculas_turmas.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-border">
                                    <Link href="/professor" className="flex-1">
                                        <Button
                                            className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            Fazer Chamada
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-12 w-12 rounded-2xl"
                                        onClick={() => toast.info('Detalhes da turma em desenvolvimento')}
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
