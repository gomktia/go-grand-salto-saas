'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react'
import { createAgendaAula, deleteAgendaAula } from '@/app/actions/admin'

type Horario = {
    id: string
    dia_semana: number
    hora_inicio: string
    hora_fim: string
    sala?: string
}

type HorariosTurmaDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    turmaId: string
    turmaNome: string
    horarios: Horario[]
    onSuccess: () => void
}

const DIAS_SEMANA = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
]

export function HorariosTurmaDialog({
    open,
    onOpenChange,
    turmaId,
    turmaNome,
    horarios,
    onSuccess
}: HorariosTurmaDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)

    const [newHorario, setNewHorario] = useState({
        dia_semana: 1,
        hora_inicio: '',
        hora_fim: '',
        sala: '',
    })

    useEffect(() => {
        if (!open) {
            setIsAdding(false)
            setError(null)
            setSuccess(null)
            setNewHorario({
                dia_semana: 1,
                hora_inicio: '',
                hora_fim: '',
                sala: '',
            })
        }
    }, [open])

    const handleAddHorario = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        try {
            await createAgendaAula({
                turma_id: turmaId,
                ...newHorario,
            })

            setSuccess('Horário adicionado com sucesso!')
            setIsAdding(false)
            setNewHorario({
                dia_semana: 1,
                hora_inicio: '',
                hora_fim: '',
                sala: '',
            })

            setTimeout(() => {
                setSuccess(null)
                onSuccess()
            }, 1500)

        } catch (err) {
            console.error('Erro ao adicionar horário:', err)
            setError(err instanceof Error ? err.message : 'Erro ao adicionar horário')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteHorario = async (horarioId: string) => {
        if (!confirm('Tem certeza que deseja remover este horário?')) return

        setIsLoading(true)
        setError(null)
        setSuccess(null)

        try {
            await deleteAgendaAula(horarioId)
            setSuccess('Horário removido com sucesso!')

            setTimeout(() => {
                setSuccess(null)
                onSuccess()
            }, 1500)

        } catch (err) {
            console.error('Erro ao deletar horário:', err)
            setError(err instanceof Error ? err.message : 'Erro ao deletar horário')
        } finally {
            setIsLoading(false)
        }
    }

    const sortedHorarios = [...horarios].sort((a, b) => {
        if (a.dia_semana !== b.dia_semana) return a.dia_semana - b.dia_semana
        return a.hora_inicio.localeCompare(b.hora_inicio)
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-pink-500" />
                        Horários - {turmaNome}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                        Gerencie os dias e horários das aulas desta turma.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-emerald-600 dark:text-emerald-300 leading-relaxed">{success}</p>
                        </div>
                    )}

                    {/* Lista de Horários Existentes */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Horários Cadastrados</Label>
                        {sortedHorarios.length === 0 ? (
                            <div className="p-6 text-center rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                                <Clock className="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600 mb-2" />
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Nenhum horário cadastrado</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {sortedHorarios.map((horario) => (
                                    <div
                                        key={horario.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-pink-500/30 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-zinc-900 dark:text-white">
                                                    {DIAS_SEMANA[horario.dia_semana]}
                                                </span>
                                                <span className="text-zinc-400">•</span>
                                                <span className="font-mono text-sm text-zinc-600 dark:text-zinc-300">
                                                    {horario.hora_inicio} - {horario.hora_fim}
                                                </span>
                                                {horario.sala && (
                                                    <>
                                                        <span className="text-zinc-400">•</span>
                                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">{horario.sala}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteHorario(horario.id)}
                                            disabled={isLoading}
                                            className="hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Formulário para Adicionar Novo Horário */}
                    {!isAdding ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAdding(true)}
                            className="w-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Novo Horário
                        </Button>
                    ) : (
                        <form onSubmit={handleAddHorario} className="space-y-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Novo Horário</Label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dia_semana" className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Dia da Semana *
                                    </Label>
                                    <select
                                        id="dia_semana"
                                        value={newHorario.dia_semana}
                                        onChange={(e) => setNewHorario(prev => ({ ...prev, dia_semana: parseInt(e.target.value) }))}
                                        className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                        required
                                        disabled={isLoading}
                                    >
                                        {DIAS_SEMANA.map((dia, index) => (
                                            <option key={index} value={index}>{dia}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sala" className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Sala (opcional)
                                    </Label>
                                    <Input
                                        id="sala"
                                        value={newHorario.sala}
                                        onChange={(e) => setNewHorario(prev => ({ ...prev, sala: e.target.value }))}
                                        placeholder="Ex: Sala Principal"
                                        className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hora_inicio" className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Início *
                                    </Label>
                                    <Input
                                        id="hora_inicio"
                                        type="time"
                                        value={newHorario.hora_inicio}
                                        onChange={(e) => setNewHorario(prev => ({ ...prev, hora_inicio: e.target.value }))}
                                        className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hora_fim" className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Fim *
                                    </Label>
                                    <Input
                                        id="hora_fim"
                                        type="time"
                                        value={newHorario.hora_fim}
                                        onChange={(e) => setNewHorario(prev => ({ ...prev, hora_fim: e.target.value }))}
                                        className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAdding(false)}
                                    disabled={isLoading}
                                    className="flex-1 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-pink-600 hover:bg-pink-500 text-white"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Adicionar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
