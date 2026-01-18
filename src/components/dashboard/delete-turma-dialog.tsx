'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { deleteTurma } from '@/app/actions/admin'

type DeleteTurmaDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    turmaId: string
    turmaNome: string
    onSuccess: () => void
}

export function DeleteTurmaDialog({
    open,
    onOpenChange,
    turmaId,
    turmaNome,
    onSuccess
}: DeleteTurmaDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        setIsLoading(true)
        setError(null)

        try {
            await deleteTurma(turmaId)
            onSuccess()
            onOpenChange(false)
        } catch (err) {
            console.error('Erro ao deletar turma:', err)
            setError(err instanceof Error ? err.message : 'Erro ao deletar turma')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-destructive" />
                        Confirmar Exclusão
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-300 leading-relaxed">{error}</p>
                        </div>
                    )}

                    <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                        <p className="text-sm text-foreground leading-relaxed">
                            Você está prestes a remover a turma <strong className="font-bold">{turmaNome}</strong>
                            {' '}do sistema.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Todos os dados relacionados serão permanentemente deletados:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                            <li>Horários e agenda de aulas</li>
                            <li>Matrículas de alunos</li>
                            <li>Check-ins registrados</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="border-white/10 hover:bg-white/5"
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
                                Sim, Deletar Turma
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
