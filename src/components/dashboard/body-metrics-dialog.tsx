'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle, CheckCircle2, Ruler } from 'lucide-react'
import { updateBodyMetrics } from '@/app/actions/admin'

type BodyMetricsDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    studentId: string
    studentName: string
    currentMetrics?: {
        busto?: number
        cintura?: number
        quadril?: number
        altura?: number
        torso?: number
    }
    onSuccess: () => void
}

export function BodyMetricsDialog({
    open,
    onOpenChange,
    studentId,
    studentName,
    currentMetrics,
    onSuccess
}: BodyMetricsDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        busto: '',
        cintura: '',
        quadril: '',
        altura: '',
        torso: '',
    })

    useEffect(() => {
        if (currentMetrics && open) {
            setFormData({
                busto: currentMetrics.busto?.toString() || '',
                cintura: currentMetrics.cintura?.toString() || '',
                quadril: currentMetrics.quadril?.toString() || '',
                altura: currentMetrics.altura?.toString() || '',
                torso: currentMetrics.torso?.toString() || '',
            })
        } else if (open) {
            setFormData({
                busto: '',
                cintura: '',
                quadril: '',
                altura: '',
                torso: '',
            })
        }
        setError(null)
        setSuccess(false)
    }, [currentMetrics, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            await updateBodyMetrics({
                estudante_id: studentId,
                busto: formData.busto ? parseFloat(formData.busto) : undefined,
                cintura: formData.cintura ? parseFloat(formData.cintura) : undefined,
                quadril: formData.quadril ? parseFloat(formData.quadril) : undefined,
                altura: formData.altura ? parseFloat(formData.altura) : undefined,
                torso: formData.torso ? parseFloat(formData.torso) : undefined,
            })

            setSuccess(true)
            setTimeout(() => {
                onSuccess()
                onOpenChange(false)
            }, 1000)

        } catch (err) {
            console.error('Erro ao salvar métricas:', err)
            setError(err instanceof Error ? err.message : 'Erro ao salvar métricas')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        // Permitir apenas números e ponto decimal
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, [field]: value }))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Ruler className="w-5 h-5 text-pink-500" />
                        Métricas Corporais
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                        Atualizar medidas de <strong className="text-zinc-900 dark:text-white">{studentName}</strong> para ajuste de figurinos.
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
                                Métricas atualizadas com sucesso!
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="busto" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Busto (cm)
                            </Label>
                            <Input
                                id="busto"
                                type="text"
                                inputMode="decimal"
                                value={formData.busto}
                                onChange={(e) => handleChange('busto', e.target.value)}
                                placeholder="65.5"
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cintura" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Cintura (cm)
                            </Label>
                            <Input
                                id="cintura"
                                type="text"
                                inputMode="decimal"
                                value={formData.cintura}
                                onChange={(e) => handleChange('cintura', e.target.value)}
                                placeholder="58.0"
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quadril" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Quadril (cm)
                            </Label>
                            <Input
                                id="quadril"
                                type="text"
                                inputMode="decimal"
                                value={formData.quadril}
                                onChange={(e) => handleChange('quadril', e.target.value)}
                                placeholder="72.0"
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="altura" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Altura (cm)
                            </Label>
                            <Input
                                id="altura"
                                type="text"
                                inputMode="decimal"
                                value={formData.altura}
                                onChange={(e) => handleChange('altura', e.target.value)}
                                placeholder="150.0"
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="torso" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Torso (cm)
                            </Label>
                            <Input
                                id="torso"
                                type="text"
                                inputMode="decimal"
                                value={formData.torso}
                                onChange={(e) => handleChange('torso', e.target.value)}
                                placeholder="65.0"
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                disabled={isLoading || success}
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                            <strong>Dica:</strong> Estas medidas são importantes para escolher os figurinos adequados.
                            Atualize regularmente para manter o estoque alinhado.
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
                                'Salvar Métricas'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
