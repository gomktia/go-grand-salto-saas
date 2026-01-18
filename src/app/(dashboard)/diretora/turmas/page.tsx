'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    Clock,
    MapPin,
    Plus,
    Layers,
    ChevronRight,
    Loader2,
    Edit,
    Trash2,
    MoreHorizontal,
    Calendar as CalendarIcon,
    UserPlus,
    LayoutGrid,
    Library,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
import { getTurmas } from '@/app/actions/admin'
import { TurmaDialog } from '@/components/dashboard/turma-dialog'
import { DeleteTurmaDialog } from '@/components/dashboard/delete-turma-dialog'
import { HorariosTurmaDialog } from '@/components/dashboard/horarios-turma-dialog'
import { MatriculasTurmaDialog } from '@/components/dashboard/matriculas-turma-dialog'
import { RecursosTurmaDialog } from '@/components/dashboard/recursos-turma-dialog'
import { TurmasCalendarView } from '@/components/dashboard/turmas-calendar-view'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Turma = {
    id: string
    nome: string
    nivel: string
    vagas_max: number
    cor_etiqueta: string
    professor_id?: string
    created_at: string
    perfis?: {
        id: string
        full_name: string
    }
    matriculas_turmas: Array<{
        id: string
        status: string
        estudantes?: {
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

const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function TurmasPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    const [turmas, setTurmas] = useState<Turma[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid')

    // Dialogs state
    const [turmaDialogOpen, setTurmaDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [horariosDialogOpen, setHorariosDialogOpen] = useState(false)
    const [matriculasDialogOpen, setMatriculasDialogOpen] = useState(false)
    const [recursosDialogOpen, setRecursosDialogOpen] = useState(false)

    const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null)

    useEffect(() => {
        loadTurmas()
    }, [])

    async function loadTurmas() {
        try {
            setIsLoading(true)
            const result = await getTurmas()
            setTurmas(result.data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar turmas')
            console.error('Erro ao carregar turmas:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddTurma = () => {
        setSelectedTurma(null)
        setTurmaDialogOpen(true)
    }

    const handleEditTurma = (turma: Turma) => {
        setSelectedTurma(turma)
        setTurmaDialogOpen(true)
    }

    const handleDeleteTurma = (turma: Turma) => {
        setSelectedTurma(turma)
        setDeleteDialogOpen(true)
    }

    const handleManageHorarios = (turma: Turma) => {
        setSelectedTurma(turma)
        setHorariosDialogOpen(true)
    }

    const handleManageMatriculas = (turma: Turma) => {
        setSelectedTurma(turma)
        setMatriculasDialogOpen(true)
    }

    const handleManageRecursos = (turma: Turma) => {
        setSelectedTurma(turma)
        setRecursosDialogOpen(true)
    }

    const handleSuccess = () => {
        loadTurmas()
        setSelectedTurma(null)
    }

    const getHorarioDisplay = (agenda: Turma['agenda_aulas']) => {
        if (!agenda || agenda.length === 0) return 'Sem horários'

        const sorted = [...agenda].sort((a, b) => a.dia_semana - b.dia_semana)
        const dias = sorted.map(h => DIAS_SEMANA_ABREV[h.dia_semana]).join('/')
        const horario = sorted[0] ? sorted[0].hora_inicio : ''

        return `${dias} ${horario}`
    }

    const calculateFillRate = (turma: Turma) => {
        const matriculados = turma.matriculas_turmas.filter(m => m.status === 'ativo').length
        return turma.vagas_max > 0 ? Math.round((matriculados / turma.vagas_max) * 100) : 0
    }

    const getNumeroAlunos = (turma: Turma) => {
        const matriculados = turma.matriculas_turmas.filter(m => m.status === 'ativo').length
        return `${matriculados}/${turma.vagas_max}`
    }

    return (
        <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            Engenharia Acadêmica
                        </Badge>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Gestão de <span style={{ color: primaryColor }}>Turmas</span>
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl">
                        Organize salas, horários e ocupação da <strong className="font-semibold text-neutral-900 dark:text-white">{tenant?.nome}</strong>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900/50 border border-white/5">
                        <Button
                            onClick={() => setViewMode('grid')}
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 rounded-lg transition-all ${
                                viewMode === 'grid'
                                    ? 'bg-white/10 text-white'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <LayoutGrid className="w-4 h-4 mr-1.5" />
                            Grade
                        </Button>
                        <Button
                            onClick={() => setViewMode('calendar')}
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 rounded-lg transition-all ${
                                viewMode === 'calendar'
                                    ? 'bg-white/10 text-white'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <CalendarIcon className="w-4 h-4 mr-1.5" />
                            Calendário
                        </Button>
                    </div>
                    <Button
                        onClick={handleAddTurma}
                        className="h-10 px-6 rounded-xl font-bold text-xs shadow-lg shadow-black/5 border-none transition-all hover:translate-y-px active:translate-y-0.5 text-white"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Turma
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-card border-border p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total de Turmas</p>
                            <p className="text-3xl font-bold text-foreground mt-2">{turmas.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                            <Layers className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                    </div>
                </Card>

                <Card className="bg-card border-border p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total de Alunos</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: primaryColor }}>
                                {turmas.reduce((acc, t) => acc + t.matriculas_turmas.filter(m => m.status === 'ativo').length, 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                            <Users className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                    </div>
                </Card>

                <Card className="bg-card border-border p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ocupação Média</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: primaryColor }}>
                                {turmas.length > 0
                                    ? Math.round(turmas.reduce((acc, t) => acc + calculateFillRate(t), 0) / turmas.length)
                                    : 0}%
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                            <CalendarIcon className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Turmas Content */}
            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
                </div>
            ) : error ? (
                <div className="p-12 text-center">
                    <p className="text-destructive text-sm mb-4">{error}</p>
                    <Button onClick={loadTurmas} variant="outline" className="border-border">
                        Tentar Novamente
                    </Button>
                </div>
            ) : turmas.length === 0 ? (
                <div className="p-12 text-center">
                    <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-foreground font-medium mb-2">Nenhuma turma cadastrada</p>
                    <p className="text-muted-foreground text-sm mb-6">Comece criando sua primeira turma</p>
                    <Button
                        onClick={handleAddTurma}
                        className="text-white shadow-lg"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeira Turma
                    </Button>
                </div>
            ) : viewMode === 'calendar' ? (
                <TurmasCalendarView
                    turmas={turmas}
                    onTurmaClick={handleManageMatriculas}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {turmas.map((turma) => {
                        const fillRate = calculateFillRate(turma)
                        const numeroAlunos = getNumeroAlunos(turma)
                        const horarioDisplay = getHorarioDisplay(turma.agenda_aulas)
                        const isFull = fillRate >= 100

                        return (
                            <motion.div key={turma.id} whileHover={{ y: -2 }} className="h-full">
                                <Card className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all h-full flex flex-col rounded-3xl overflow-hidden group">
                                    <CardHeader className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-white/5">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div
                                                className="p-2.5 rounded-xl border shadow-sm group-hover:rotate-3 transition-transform"
                                                style={{
                                                    backgroundColor: `${turma.cor_etiqueta}20`,
                                                    borderColor: `${turma.cor_etiqueta}40`
                                                }}
                                            >
                                                <Layers className="w-4 h-4" style={{ color: turma.cor_etiqueta }} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[9px] font-semibold uppercase tracking-wide h-6 px-2.5 rounded-full border ${
                                                        isFull
                                                            ? 'border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800/30'
                                                            : 'border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800/30'
                                                    }`}
                                                >
                                                    {isFull ? 'Lotada' : 'Vagas'}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 rounded-lg">
                                                            <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-neutral-900 border-white/10 w-48">
                                                        <DropdownMenuLabel className="text-neutral-400 text-xs">Ações</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditTurma(turma)}
                                                            className="text-white hover:bg-white/5 cursor-pointer"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Editar Turma
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageHorarios(turma)}
                                                            className="text-white hover:bg-white/5 cursor-pointer"
                                                        >
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Gerenciar Horários
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageMatriculas(turma)}
                                                            className="text-white hover:bg-white/5 cursor-pointer"
                                                        >
                                                            <UserPlus className="w-4 h-4 mr-2" />
                                                            Gerenciar Alunos
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageRecursos(turma)}
                                                            className="text-white hover:bg-white/5 cursor-pointer"
                                                        >
                                                            <Library className="w-4 h-4 mr-2" />
                                                            Biblioteca de Mídia
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteTurma(turma)}
                                                            className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Deletar Turma
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg font-bold leading-tight truncate mb-1 text-neutral-900 dark:text-white">
                                            {turma.nome}
                                        </CardTitle>
                                        <CardDescription className="text-xs font-medium text-neutral-500">
                                            {turma.nivel}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-5 space-y-6 flex-1 flex flex-col">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] font-medium uppercase text-neutral-400 tracking-wider">Horário</span>
                                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                                    <Clock className="w-3.5 h-3.5 text-neutral-400" /> {horarioDisplay}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] font-medium uppercase text-neutral-400 tracking-wider">Local</span>
                                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                                    {turma.agenda_aulas[0]?.sala || 'Não definido'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 mt-auto pt-2">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-neutral-500 font-medium">Ocupação</span>
                                                <span className="font-bold text-neutral-900 dark:text-white">{numeroAlunos} Alunos</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${fillRate}%` }}
                                                    className="h-full rounded-full transition-all"
                                                    style={{ backgroundColor: turma.cor_etiqueta }}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleManageMatriculas(turma)}
                                            className="w-full mt-2 h-9 rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                                        >
                                            Gerenciar <ChevronRight className="w-3 h-3" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {/* Dialogs */}
            <TurmaDialog
                open={turmaDialogOpen}
                onOpenChange={setTurmaDialogOpen}
                turma={selectedTurma}
                onSuccess={handleSuccess}
            />

            {selectedTurma && (
                <>
                    <DeleteTurmaDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        turmaId={selectedTurma.id}
                        turmaNome={selectedTurma.nome}
                        onSuccess={handleSuccess}
                    />

                    <HorariosTurmaDialog
                        open={horariosDialogOpen}
                        onOpenChange={setHorariosDialogOpen}
                        turmaId={selectedTurma.id}
                        turmaNome={selectedTurma.nome}
                        horarios={selectedTurma.agenda_aulas}
                        onSuccess={handleSuccess}
                    />

                    <MatriculasTurmaDialog
                        open={matriculasDialogOpen}
                        onOpenChange={setMatriculasDialogOpen}
                        turmaId={selectedTurma.id}
                        turmaNome={selectedTurma.nome}
                        matriculas={selectedTurma.matriculas_turmas}
                        onSuccess={handleSuccess}
                    />

                    <RecursosTurmaDialog
                        open={recursosDialogOpen}
                        onOpenChange={setRecursosDialogOpen}
                        turmaId={selectedTurma.id}
                        turmaNome={selectedTurma.nome}
                        canEdit={true}
                    />
                </>
            )}
        </div>
    )
}
