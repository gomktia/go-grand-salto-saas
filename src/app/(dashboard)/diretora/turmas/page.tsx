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
    Bell,
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
import { NotificacaoTurmaDialog } from '@/components/dashboard/notificacao-turma-dialog'
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
    const [notificacaoDialogOpen, setNotificacaoDialogOpen] = useState(false)
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

    const handleNotifyTurma = (turma: Turma) => {
        setSelectedTurma(turma)
        setNotificacaoDialogOpen(true)
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
        const matriculados = turma.matriculas.filter(m => m.status === 'ativo').length
        return turma.vagas_max > 0 ? Math.round((matriculados / turma.vagas_max) * 100) : 0
    }

    const getNumeroAlunos = (turma: Turma) => {
        const matriculados = turma.matriculas.filter(m => m.status === 'ativo').length
        return `${matriculados}/${turma.vagas_max}`
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Gestão de Classes e Cronogramas
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Organização de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Turmas</span>
                    </h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                        <Button
                            onClick={() => setViewMode('grid')}
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest ${viewMode === 'grid'
                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
                            Grade
                        </Button>
                        <Button
                            onClick={() => setViewMode('calendar')}
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-3 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest ${viewMode === 'calendar'
                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                        >
                            <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                            Calendário
                        </Button>
                    </div>
                    <Button
                        onClick={handleAddTurma}
                        className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        NOVA TURMA
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total de Turmas', value: turmas.length, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Total de Alunos', value: turmas.reduce((acc, t) => acc + (t.matriculas?.filter(m => m.status === 'ativo').length || 0), 0), icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Ocupação Média', value: `${turmas.length > 0 ? Math.round(turmas.reduce((acc, t) => acc + calculateFillRate(t), 0) / turmas.length) : 0}%`, icon: CalendarIcon, color: 'text-amber-500', bg: 'bg-amber-500/10' }
                ].map((stat, i) => (
                    <Card key={i} className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 p-4 rounded-xl shadow-sm overflow-hidden relative group">
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-24 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sincronizando Grade Horária...</p>
                </div>
            ) : error ? (
                <div className="p-24 text-center">
                    <p className="text-red-600 dark:text-red-400 font-bold mb-4">{error}</p>
                    <Button onClick={loadTurmas} variant="outline" className="h-10 px-8 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold uppercase text-[10px] tracking-widest">
                        Tentar Novamente
                    </Button>
                </div>
            ) : turmas.length === 0 ? (
                <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 p-24 text-center rounded-xl">
                    <Layers className="w-12 h-12 mx-auto text-zinc-200 dark:text-zinc-800 mb-4" />
                    <p className="text-zinc-900 dark:text-white font-black uppercase text-lg tracking-tighter mb-1">Nenhuma turma cadastrada</p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-8 uppercase tracking-widest">Comece criando sua primeira turma estratégica</p>
                    <Button
                        onClick={handleAddTurma}
                        className="h-10 px-8 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-emerald-500/20 border-none"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        CRIAR PRIMEIRA TURMA
                    </Button>
                </Card>
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
                                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all h-full flex flex-col rounded-xl overflow-hidden group">
                                    <div className="p-5 pb-4 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-800/20">
                                        <div className="flex items-start justify-between gap-3 mb-4">
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
                                                <Badge className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border-none
                                                    ${isFull
                                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                    {isFull ? 'LOTADA' : 'VAGAS'}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-1">
                                                        <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-400 px-3 py-2">Comandos</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                                                        <DropdownMenuItem onClick={() => handleEditTurma(turma)} className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 cursor-pointer rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 !outline-none">
                                                            <Edit className="w-3.5 h-3.5 mr-2" /> Editar Turma
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleManageHorarios(turma)} className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 cursor-pointer rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 !outline-none">
                                                            <Clock className="w-3.5 h-3.5 mr-2" /> Gerenciar Horários
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleManageMatriculas(turma)} className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 cursor-pointer rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 !outline-none">
                                                            <UserPlus className="w-3.5 h-3.5 mr-2" /> Gerenciar Alunos
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleManageRecursos(turma)} className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 cursor-pointer rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 !outline-none">
                                                            <Library className="w-3.5 h-3.5 mr-2" /> Biblioteca de Mídia
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleNotifyTurma(turma)} className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 cursor-pointer rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 !outline-none">
                                                            <Bell className="w-3.5 h-3.5 mr-2" /> Enviar Aviso
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                                                        <DropdownMenuItem onClick={() => handleDeleteTurma(turma)} className="text-[10px] font-bold uppercase tracking-widest px-3 py-2 cursor-pointer rounded-lg text-red-500 hover:bg-red-500/10 !outline-none">
                                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Deletar Turma
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <CardTitle className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight truncate">
                                            {turma.nome}
                                        </CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mt-1">
                                            {turma.nivel}
                                        </CardDescription>
                                    </div>
                                    <CardContent className="p-5 space-y-5 flex-1 flex flex-col">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Horário</span>
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mt-1">
                                                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                                    {horarioDisplay}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Local</span>
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mt-1 uppercase truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                                    {turma.agenda_aulas[0]?.sala || 'NÃO DEFINIDO'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mt-auto">
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                                                <span className="text-zinc-400">Ocupação</span>
                                                <span className="text-zinc-900 dark:text-white">{numeroAlunos} ALUNOS</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
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
                                            className="w-full h-10 rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold text-[10px] uppercase tracking-widest transition-all"
                                        >
                                            GERENCIAR <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
                        matriculas={selectedTurma.matriculas}
                        onSuccess={handleSuccess}
                    />

                    <RecursosTurmaDialog
                        open={recursosDialogOpen}
                        onOpenChange={setRecursosDialogOpen}
                        turmaId={selectedTurma.id}
                        turmaNome={selectedTurma.nome}
                        canEdit={true}
                    />

                    <NotificacaoTurmaDialog
                        open={notificacaoDialogOpen}
                        onOpenChange={setNotificacaoDialogOpen}
                        turmaId={selectedTurma.id}
                        turmaNome={selectedTurma.nome}
                    />
                </>
            )}
        </div>
    )
}
