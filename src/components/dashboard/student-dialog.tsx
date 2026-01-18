'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createStudent, updateStudent } from '@/app/actions/admin'

type Student = {
    id: string
    data_nascimento: string
    nome_responsavel: string
    contato_responsavel: string
    status_matricula: string
    observacoes_medicas?: string
}

type StudentDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    student?: Student | null
    onSuccess: () => void
}

export function StudentDialog({ open, onOpenChange, student, onSuccess }: StudentDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        data_nascimento: '',
        nome_responsavel: '',
        contato_responsavel: '',
        status_matricula: 'ativo',
        observacoes_medicas: '',
    })

    // Preencher formulário ao editar
    useEffect(() => {
        if (student) {
            setFormData({
                data_nascimento: student.data_nascimento,
                nome_responsavel: student.nome_responsavel,
                contato_responsavel: student.contato_responsavel,
                status_matricula: student.status_matricula,
                observacoes_medicas: student.observacoes_medicas || '',
            })
        } else {
            // Reset ao criar novo
            setFormData({
                data_nascimento: '',
                nome_responsavel: '',
                contato_responsavel: '',
                status_matricula: 'ativo',
                observacoes_medicas: '',
            })
        }
        setError(null)
        setSuccess(false)
    }, [student, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            if (student) {
                // Atualizar
                await updateStudent({
                    id: student.id,
                    ...formData,
                })
            } else {
                // Criar
                await createStudent(formData)
            }

            setSuccess(true)
            setTimeout(() => {
                onSuccess()
                onOpenChange(false)
            }, 1000)

        } catch (err) {
            console.error('Erro ao salvar estudante:', err)
            setError(err instanceof Error ? err.message : 'Erro ao salvar estudante')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-neutral-900 border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {student ? 'Editar Aluno' : 'Adicionar Novo Aluno'}
                    </DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        {student
                            ? 'Atualize as informações do aluno abaixo.'
                            : 'Preencha os dados do novo aluno.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-300 leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-emerald-300 leading-relaxed">
                                {student ? 'Aluno atualizado com sucesso!' : 'Aluno criado com sucesso!'}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome_responsavel" className="text-sm font-medium text-neutral-300">
                                Nome do Responsável *
                            </Label>
                            <Input
                                id="nome_responsavel"
                                value={formData.nome_responsavel}
                                onChange={(e) => handleChange('nome_responsavel', e.target.value)}
                                placeholder="Ex: Maria Silva"
                                className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600"
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contato_responsavel" className="text-sm font-medium text-neutral-300">
                                Contato (WhatsApp) *
                            </Label>
                            <Input
                                id="contato_responsavel"
                                value={formData.contato_responsavel}
                                onChange={(e) => handleChange('contato_responsavel', e.target.value)}
                                placeholder="(55) 99999-9999"
                                className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600"
                                required
                                disabled={isLoading || success}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="data_nascimento" className="text-sm font-medium text-neutral-300">
                                Data de Nascimento *
                            </Label>
                            <Input
                                id="data_nascimento"
                                type="date"
                                value={formData.data_nascimento}
                                onChange={(e) => handleChange('data_nascimento', e.target.value)}
                                className="bg-black/40 border-white/10 text-white"
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status_matricula" className="text-sm font-medium text-neutral-300">
                                Status *
                            </Label>
                            <select
                                id="status_matricula"
                                value={formData.status_matricula}
                                onChange={(e) => handleChange('status_matricula', e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                required
                                disabled={isLoading || success}
                            >
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                                <option value="pendente">Pendente</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observacoes_medicas" className="text-sm font-medium text-neutral-300">
                            Observações Médicas
                        </Label>
                        <Textarea
                            id="observacoes_medicas"
                            value={formData.observacoes_medicas}
                            onChange={(e) => handleChange('observacoes_medicas', e.target.value)}
                            placeholder="Alergias, restrições médicas, etc."
                            rows={3}
                            className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 resize-none"
                            disabled={isLoading || success}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading || success}
                            className="border-white/10 hover:bg-white/5"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || success}
                            className="bg-pink-600 hover:bg-pink-500 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Salvo!
                                </>
                            ) : (
                                student ? 'Atualizar Aluno' : 'Adicionar Aluno'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
