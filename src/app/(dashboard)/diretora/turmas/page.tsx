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

const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

export default function TurmasPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#e11d48'

    const [turmas, setTurmas] = useState<Turma[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid')

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
        if (!agenda || agenda.length === 0) return 'Sem horarios'
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Gestao de Turmas
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                        Organize salas, horarios e ocupacao da {tenant?.nome}.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                        <Button
                            onClick={() => setViewMode('grid')}
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 rounded-lg transition-all ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
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
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                            }`}
                        >
                            <CalendarIcon className="w-4 h-4 mr-1.5" />
                            Calendario
                        </Button>
                    </div>
                    <Button
                        onClick={handleAddTurma}
                        className="h-10 px-5 rounded-xl font-semibold text-white shadow-lg shadow-pink-500/20"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Turma
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Total de Turmas
                            </p>
                            <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{turmas.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
                            <Layers className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Total de Alunos
                            </p>
                            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400 mt-1">
                                {turmas.reduce((acc, t) => acc + t.matriculas_turmas.filter(m => m.status === 'ativo').length, 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Ocupacao Media
                            </p>
                            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400 mt-1">
                                {turmas.length > 0
                                    ? Math.round(turmas.reduce((acc, t) => acc + calculateFillRate(t), 0) / turmas.length)
                                    : 0}%
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                </div>
            ) : error ? (
                <div className="p-12 text-center">
                    <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
                    <Button onClick={loadTurmas} variant="outline" className="border-neutral-300 dark:border-neutral-700">
                        Tentar Novamente
                    </Button>
                </div>
            ) : turmas.length === 0 ? (
                <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-12 text-center rounded-xl">
                    <Layers className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                    <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">Nenhuma turma cadastrada</p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Comece criando sua primeira turma</p>
                    <Button
                        onClick={handleAddTurma}
                        className="text-white"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeira Turma
                    </Button>
                </Card>
            ) : viewMode === 'calendar' ? (
                <TurmasCalendarView
                    turmas={turmas}
                    onTurmaClick={handleManageMatriculas}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {turmas.map((turma) => {
                        const fillRate = calculateFillRate(turma)
                        const numeroAlunos = getNumeroAlunos(turma)
                        const horarioDisplay = getHorarioDisplay(turma.agenda_aulas)
                        const isFull = fillRate >= 100

                        return (
                            <motion.div key={turma.id} whileHover={{ y: -2 }} className="h-full">
                                <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all h-full flex flex-col rounded-xl overflow-hidden">
                                    <CardHeader className="p-5 pb-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div
                                                className="p-2 rounded-lg border"
                                                style={{
                                                    backgroundColor: `${turma.cor_etiqueta}15`,
                                                    borderColor: `${turma.cor_etiqueta}30`
                                                }}
                                            >
                                                <Layers className="w-4 h-4" style={{ color: turma.cor_etiqueta }} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`text-xs px-2 py-0.5 rounded-full font-medium
                                                    ${isFull
                                                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                                                        : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                                    }`}>
                                                    {isFull ? 'Lotada' : 'Vagas'}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg
                                                            text-neutral-500 hover:text-neutral-700 dark:hover:text-white
                                                            hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48
                                                        bg-white dark:bg-neutral-900
                                                        border-neutral-200 dark:border-neutral-700
                                                        shadow-lg rounded-xl">
                                                        <DropdownMenuLabel className="text-neutral-500 dark:text-neutral-400 text-xs">
                                                            Acoes
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditTurma(turma)}
                                                            className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-lg"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Editar Turma
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageHorarios(turma)}
                                                            className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-lg"
                                                        >
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Gerenciar Horarios
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageMatriculas(turma)}
                                                            className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-lg"
                                                        >
                                                            <UserPlus className="w-4 h-4 mr-2" />
                                                            Gerenciar Alunos
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageRecursos(turma)}
                                                            className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-lg"
                                                        >
                                                            <Library className="w-4 h-4 mr-2" />
                                                            Biblioteca de Midia
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteTurma(turma)}
                                                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Deletar Turma
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <CardTitle className="text-base font-bold text-neutral-900 dark:text-white truncate">
                                            {turma.nome}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {turma.nivel}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Horario</span>
                                                <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 mt-1">
                                                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                                    {horarioDisplay}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Local</span>
                                                <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 mt-1">
                                                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                                    {turma.agenda_aulas[0]?.sala || 'Nao definido'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mt-auto pt-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-neutral-500 dark:text-neutral-400 font-medium">Ocupacao</span>
                                                <span className="font-bold text-neutral-900 dark:text-white">{numeroAlunos} Alunos</span>
                                            </div>
                                            <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${fillRate}%` }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: turma.cor_etiqueta }}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleManageMatriculas(turma)}
                                            className="w-full mt-2 h-9 rounded-xl
                                                border-neutral-300 dark:border-neutral-700
                                                text-neutral-700 dark:text-neutral-200
                                                hover:bg-neutral-100 dark:hover:bg-neutral-800
                                                font-medium text-sm"
                                        >
                                            Gerenciar <ChevronRight className="w-4 h-4 ml-1" />
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
