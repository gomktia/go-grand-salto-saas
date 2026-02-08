'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'

type Turma = {
    id: string
    nome: string
    nivel: string
    vagas_max: number
    cor_etiqueta: string
    professor_id?: string
    created_at: string
    professor?: {
        id: string
        full_name: string
    }
    matriculas: Array<{
        id: string
        status: string
        estudante?: {
            id: string
            nome_responsavel: string
            data_nascimento: string
            status_matricula: string
        }
    }>
    agenda_aulas: Array<{
        id: string
        dia_semana: number
        hora_inicio: string
        hora_fim: string
        sala?: string
    }>
}

type TurmasCalendarViewProps = {
    turmas: Turma[]
    onTurmaClick: (turma: Turma) => void
}

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const HORAS = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']

export function TurmasCalendarView({ turmas, onTurmaClick }: TurmasCalendarViewProps) {
    // Criar mapa de aulas por dia e horário
    const getClassesForSlot = (diaSemana: number, horaInicio: string) => {
        const classes: Array<{ turma: Turma; agenda: Turma['agenda_aulas'][0] }> = []

        turmas.forEach(turma => {
            turma.agenda_aulas.forEach(agenda => {
                if (agenda.dia_semana === diaSemana && agenda.hora_inicio === horaInicio) {
                    classes.push({ turma, agenda })
                }
            })
        })

        return classes
    }

    const calculateDuration = (horaInicio: string, horaFim: string) => {
        const [inicioHora, inicioMin] = horaInicio.split(':').map(Number)
        const [fimHora, fimMin] = horaFim.split(':').map(Number)

        const inicioMinutos = inicioHora * 60 + inicioMin
        const fimMinutos = fimHora * 60 + fimMin

        return (fimMinutos - inicioMinutos) / 60 // Retorna em horas
    }

    const getNumeroAlunos = (turma: Turma) => {
        return (turma.matriculas || []).filter(m => m.status === 'ativo').length
    }

    return (
        <div className="relative overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-px bg-border/30 border border-border rounded-2xl overflow-hidden">
                    {/* Header - Horário */}
                    <div className="bg-card p-3 flex items-center justify-center sticky left-0 z-20 border-b border-border">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Header - Dias da semana */}
                    {DIAS_SEMANA.map((dia, index) => (
                        <div
                            key={dia}
                            className="bg-card p-3 text-center sticky top-0 z-10 border-b border-border"
                        >
                            <div className="text-xs font-bold text-foreground">{dia}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                                {index === 0 ? 'Dom' : index === 6 ? 'Sáb' : ''}
                            </div>
                        </div>
                    ))}

                    {/* Grid - Horários e Aulas */}
                    {HORAS.map((hora) => (
                        <React.Fragment key={hora}>
                            {/* Coluna de horário */}
                            <div className="bg-card/50 p-2 flex items-start justify-center sticky left-0 z-10 border-t border-border">
                                <span className="text-xs font-mono text-muted-foreground">{hora}</span>
                            </div>

                            {/* Colunas dos dias */}
                            {DIAS_SEMANA.map((_, diaSemana) => {
                                const classes = getClassesForSlot(diaSemana, hora)

                                return (
                                    <div
                                        key={`${hora}-${diaSemana}`}
                                        className="bg-background p-1 min-h-[60px] border-t border-border relative hover:bg-muted/20 transition-colors"
                                    >
                                        {classes.length > 0 ? (
                                            <div className="space-y-1">
                                                {classes.map(({ turma, agenda }) => {
                                                    const duration = calculateDuration(agenda.hora_inicio, agenda.hora_fim)
                                                    const numeroAlunos = getNumeroAlunos(turma)
                                                    const fillRate = turma.vagas_max > 0
                                                        ? Math.round((numeroAlunos / turma.vagas_max) * 100)
                                                        : 0

                                                    return (
                                                        <motion.div
                                                            key={agenda.id}
                                                            whileHover={{ scale: 1.02, zIndex: 50 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => onTurmaClick(turma)}
                                                            className="cursor-pointer rounded-lg p-2 border shadow-sm transition-all"
                                                            style={{
                                                                backgroundColor: `${turma.cor_etiqueta}15`,
                                                                borderColor: `${turma.cor_etiqueta}60`,
                                                                minHeight: `${duration * 60}px`
                                                            }}
                                                        >
                                                            <div className="flex flex-col gap-1">
                                                                <div
                                                                    className="text-xs font-bold truncate"
                                                                    style={{ color: turma.cor_etiqueta }}
                                                                >
                                                                    {turma.nome}
                                                                </div>
                                                                <div className="text-[10px] text-muted-foreground truncate">
                                                                    {turma.nivel}
                                                                </div>
                                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>{agenda.hora_inicio} - {agenda.hora_fim}</span>
                                                                </div>
                                                                {agenda.sala && (
                                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                                        <MapPin className="w-3 h-3" />
                                                                        <span className="truncate">{agenda.sala}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1 text-[10px] font-semibold mt-1">
                                                                    <Users className="w-3 h-3" style={{ color: turma.cor_etiqueta }} />
                                                                    <span style={{ color: turma.cor_etiqueta }}>
                                                                        {numeroAlunos}/{turma.vagas_max} ({fillRate}%)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] text-muted-foreground">-</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Legenda */}
            <Card className="mt-6 p-4 bg-card border-border">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-primary/20 border border-primary/60"></div>
                        <span className="text-xs text-muted-foreground">Clique em uma aula para gerenciar</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Ocupação de alunos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Duração da aula</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
