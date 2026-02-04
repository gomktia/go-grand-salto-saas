'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { deleteStudent } from '@/app/actions/admin'

type DeleteStudentDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId: string
    studentName: string
    onSuccess: () => void
}

export function DeleteStudentDialog({
    open,
    onOpenChange,
    studentId,
    studentName,
    onSuccess
}: DeleteStudentDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        setIsLoading(true)
        setError(null)

        try {
            await deleteStudent(studentId)
            onSuccess()
            onOpenChange(false)
        } catch (err) {
            console.error('Erro ao deletar estudante:', err)
            setError(err instanceof Error ? err.message : 'Erro ao deletar estudante')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        Confirmar Exclusão
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                        Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
                        </div>
                    )}

                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            Você está prestes a remover o aluno <strong className="text-zinc-900 dark:text-white">{studentName}</strong>
                            {' '}do sistema.
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                            Todos os dados relacionados, incluindo métricas corporais e matrículas, serão permanentemente deletados.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-500 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deletando...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Sim, Deletar Aluno
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
