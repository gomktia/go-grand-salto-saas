'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle, Plus, Trash2, Users, CheckCircle2 } from 'lucide-react'
import { createMatricula, deleteMatricula, getStudents } from '@/app/actions/admin'

type Aluno = {
    id: string
    nome_responsavel: string
    data_nascimento: string
    status_matricula: string
}

type Matricula = {
    id: string
    status: string
    estudantes?: Aluno
}

type MatriculasTurmaDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    turmaId: string
    turmaNome: string
    matriculas: Matricula[]
    onSuccess: () => void
}

export function MatriculasTurmaDialog({
    open,
    onOpenChange,
    turmaId,
    turmaNome,
    matriculas,
    onSuccess
}: MatriculasTurmaDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)

    const [todosAlunos, setTodosAlunos] = useState<Aluno[]>([])
    const [selectedAlunoId, setSelectedAlunoId] = useState('')

    useEffect(() => {
        if (open) {
            loadAlunos()
        } else {
            setIsAdding(false)
            setError(null)
            setSuccess(null)
            setSelectedAlunoId('')
        }
    }, [open])

    const loadAlunos = async () => {
        try {
            const result = await getStudents()
            setTodosAlunos(result.data || [])
        } catch (err) {
            console.error('Erro ao carregar alunos:', err)
        }
    }

    // Filtrar alunos que ainda não estão matriculados
    const alunosDisponiveis = todosAlunos.filter(aluno =>
        !matriculas.some(m => m.estudantes?.id === aluno.id) &&
        aluno.status_matricula === 'ativo'
    )

    const handleAddMatricula = async () => {
        if (!selectedAlunoId) {
            setError('Selecione um aluno')
            return
        }

        setIsLoading(true)
        setError(null)
        setSuccess(null)

        try {
            await createMatricula({
                estudante_id: selectedAlunoId,
                turma_id: turmaId,
                status: 'ativo',
            })

            setSuccess('Aluno matriculado com sucesso!')
            setIsAdding(false)
            setSelectedAlunoId('')

            setTimeout(() => {
                setSuccess(null)
                onSuccess()
                loadAlunos()
            }, 1500)

        } catch (err) {
            console.error('Erro ao matricular aluno:', err)
            setError(err instanceof Error ? err.message : 'Erro ao matricular aluno')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteMatricula = async (matriculaId: string, alunoNome: string) => {
        if (!confirm(`Tem certeza que deseja remover ${alunoNome} desta turma?`)) return

        setIsLoading(true)
        setError(null)
        setSuccess(null)

        try {
            await deleteMatricula(matriculaId)
            setSuccess(`${alunoNome} removido da turma com sucesso!`)

            setTimeout(() => {
                setSuccess(null)
                onSuccess()
                loadAlunos()
            }, 1500)

        } catch (err) {
            console.error('Erro ao remover matrícula:', err)
            setError(err instanceof Error ? err.message : 'Erro ao remover matrícula')
        } finally {
            setIsLoading(false)
        }
    }

    const calculateAge = (birthDate: string) => {
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }
        return age
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-pink-500" />
                        Alunos Matriculados - {turmaNome}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                        Gerencie os alunos matriculados nesta turma.
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

                    {/* Lista de Alunos Matriculados */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Alunos Matriculados ({matriculas.length})
                        </Label>
                        {matriculas.length === 0 ? (
                            <div className="p-6 text-center rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                                <Users className="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600 mb-2" />
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Nenhum aluno matriculado</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {matriculas.filter(m => m.estudantes).map((matricula) => {
                                    const aluno = matricula.estudantes!
                                    const idade = calculateAge(aluno.data_nascimento)

                                    return (
                                        <div
                                            key={matricula.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-pink-500/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                    {aluno.nome_responsavel.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-zinc-900 dark:text-white">{aluno.nome_responsavel}</p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{idade} anos</p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteMatricula(matricula.id, aluno.nome_responsavel)}
                                                disabled={isLoading}
                                                className="hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Formulário para Adicionar Aluno */}
                    {!isAdding ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAdding(true)}
                            disabled={alunosDisponiveis.length === 0}
                            className="w-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {alunosDisponiveis.length === 0
                                ? 'Não há alunos disponíveis'
                                : 'Matricular Novo Aluno'
                            }
                        </Button>
                    ) : (
                        <div className="space-y-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Selecionar Aluno</Label>

                            <div className="space-y-2">
                                <select
                                    value={selectedAlunoId}
                                    onChange={(e) => setSelectedAlunoId(e.target.value)}
                                    className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Selecione um aluno...</option>
                                    {alunosDisponiveis.map((aluno) => (
                                        <option key={aluno.id} value={aluno.id}>
                                            {aluno.nome_responsavel} ({calculateAge(aluno.data_nascimento)} anos)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsAdding(false)
                                        setSelectedAlunoId('')
                                    }}
                                    disabled={isLoading}
                                    className="flex-1 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleAddMatricula}
                                    disabled={isLoading || !selectedAlunoId}
                                    className="flex-1 bg-pink-600 hover:bg-pink-500 text-white"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Matriculando...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Matricular
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
