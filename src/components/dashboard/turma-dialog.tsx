'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle, CheckCircle2, Users } from 'lucide-react'
import { createTurma, updateTurma } from '@/app/actions/admin'

type Turma = {
    id: string
    nome: string
    nivel: string
    vagas_max: number
    cor_etiqueta?: string
    professor_id?: string
}

type TurmaDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    turma?: Turma | null
    onSuccess: () => void
}

const CORES_PREDEFINIDAS = [
    { nome: 'Rosa', hex: '#ec4899' },
    { nome: 'Roxo', hex: '#8b5cf6' },
    { nome: 'Azul', hex: '#06b6d4' },
    { nome: 'Verde', hex: '#10b981' },
    { nome: 'Amarelo', hex: '#f59e0b' },
    { nome: 'Laranja', hex: '#f97316' },
    { nome: 'Vermelho', hex: '#ef4444' },
    { nome: 'Pink', hex: '#db2777' },
]

const NIVEIS = [
    'Baby Class',
    'Iniciante',
    'Intermediário',
    'Avançado',
    'Profissional',
    'Jazz',
    'Ballet Clássico',
    'Contemporâneo',
    'Hip Hop',
]

export function TurmaDialog({ open, onOpenChange, turma, onSuccess }: TurmaDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        nome: '',
        nivel: '',
        vagas_max: 15,
        cor_etiqueta: '#ec4899',
    })

    useEffect(() => {
        if (turma) {
            setFormData({
                nome: turma.nome,
                nivel: turma.nivel,
                vagas_max: turma.vagas_max,
                cor_etiqueta: turma.cor_etiqueta || '#ec4899',
            })
        } else {
            setFormData({
                nome: '',
                nivel: '',
                vagas_max: 15,
                cor_etiqueta: '#ec4899',
            })
        }
        setError(null)
        setSuccess(false)
    }, [turma, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            if (turma) {
                await updateTurma({
                    id: turma.id,
                    ...formData,
                })
            } else {
                await createTurma(formData)
            }

            setSuccess(true)
            setTimeout(() => {
                onSuccess()
                onOpenChange(false)
            }, 1000)

        } catch (err) {
            console.error('Erro ao salvar turma:', err)
            setError(err instanceof Error ? err.message : 'Erro ao salvar turma')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-pink-500" />
                        {turma ? 'Editar Turma' : 'Adicionar Nova Turma'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                        {turma
                            ? 'Atualize as informações da turma abaixo.'
                            : 'Crie uma nova turma para organizar seus alunos.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-emerald-600 dark:text-emerald-300 leading-relaxed">
                                {turma ? 'Turma atualizada com sucesso!' : 'Turma criada com sucesso!'}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="nome" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Nome da Turma *
                        </Label>
                        <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => handleChange('nome', e.target.value)}
                            placeholder="Ex: Iniciante A - Terça e Quinta"
                            className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            required
                            disabled={isLoading || success}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nivel" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Nível *
                            </Label>
                            <select
                                id="nivel"
                                value={formData.nivel}
                                onChange={(e) => handleChange('nivel', e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                required
                                disabled={isLoading || success}
                            >
                                <option value="">Selecione...</option>
                                {NIVEIS.map(nivel => (
                                    <option key={nivel} value={nivel}>{nivel}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vagas_max" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Vagas Máximas *
                            </Label>
                            <Input
                                id="vagas_max"
                                type="number"
                                min="1"
                                max="50"
                                value={formData.vagas_max}
                                onChange={(e) => handleChange('vagas_max', parseInt(e.target.value))}
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                                required
                                disabled={isLoading || success}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Cor de Identificação
                        </Label>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                            {CORES_PREDEFINIDAS.map(cor => (
                                <button
                                    key={cor.hex}
                                    type="button"
                                    onClick={() => handleChange('cor_etiqueta', cor.hex)}
                                    disabled={isLoading || success}
                                    className={`
                                        h-12 rounded-xl border-2 transition-all
                                        ${formData.cor_etiqueta === cor.hex
                                            ? 'border-zinc-900 dark:border-white scale-110 shadow-lg'
                                            : 'border-transparent hover:scale-105'
                                        }
                                    `}
                                    style={{ backgroundColor: cor.hex }}
                                    title={cor.nome}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div
                                className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700"
                                style={{ backgroundColor: formData.cor_etiqueta }}
                            />
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">Cor selecionada: {formData.cor_etiqueta}</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                            <strong>Dica:</strong> As turmas são organizadas por nível e horário. Você poderá adicionar
                            horários específicos após criar a turma.
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading || success}
                            className="border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                                turma ? 'Atualizar Turma' : 'Criar Turma'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
