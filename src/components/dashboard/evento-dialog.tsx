'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle, CheckCircle2, Calendar, MapPin, Globe, Lock } from 'lucide-react'
import { createEventoCalendario, updateEventoCalendario } from '@/app/actions/fotos-venda'

type Evento = {
    id: string
    titulo: string
    descricao?: string
    data_inicio: string
    data_fim?: string
    local?: string
    tipo: 'evento' | 'aula_aberta' | 'recital' | 'feriado'
    cor: string
    is_publico: boolean
}

type EventoDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    evento?: Evento | null
    onSuccess: () => void
}

const TIPOS_EVENTO = [
    { value: 'evento', label: 'Evento', description: 'Evento genérico' },
    { value: 'aula_aberta', label: 'Aula Aberta', description: 'Aula demonstrativa para visitantes' },
    { value: 'recital', label: 'Recital', description: 'Apresentação de dança' },
    { value: 'feriado', label: 'Feriado', description: 'Dia sem aulas' },
]

const CORES_EVENTO = [
    { nome: 'Rosa', hex: '#ec4899' },
    { nome: 'Roxo', hex: '#8b5cf6' },
    { nome: 'Azul', hex: '#3b82f6' },
    { nome: 'Ciano', hex: '#06b6d4' },
    { nome: 'Verde', hex: '#10b981' },
    { nome: 'Amarelo', hex: '#f59e0b' },
    { nome: 'Laranja', hex: '#f97316' },
    { nome: 'Vermelho', hex: '#ef4444' },
]

export function EventoDialog({ open, onOpenChange, evento, onSuccess }: EventoDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        data_inicio: '',
        hora_inicio: '',
        data_fim: '',
        hora_fim: '',
        local: '',
        tipo: 'evento' as 'evento' | 'aula_aberta' | 'recital' | 'feriado',
        cor: '#ec4899',
        is_publico: true,
    })

    useEffect(() => {
        if (evento) {
            const dataInicio = new Date(evento.data_inicio)
            const dataFim = evento.data_fim ? new Date(evento.data_fim) : null

            setFormData({
                titulo: evento.titulo || '',
                descricao: evento.descricao || '',
                data_inicio: dataInicio.toISOString().split('T')[0],
                hora_inicio: dataInicio.toTimeString().slice(0, 5),
                data_fim: dataFim ? dataFim.toISOString().split('T')[0] : '',
                hora_fim: dataFim ? dataFim.toTimeString().slice(0, 5) : '',
                local: evento.local || '',
                tipo: evento.tipo || 'evento',
                cor: evento.cor || '#ec4899',
                is_publico: evento.is_publico ?? true,
            })
        } else {
            const hoje = new Date()
            setFormData({
                titulo: '',
                descricao: '',
                data_inicio: hoje.toISOString().split('T')[0],
                hora_inicio: '19:00',
                data_fim: '',
                hora_fim: '',
                local: '',
                tipo: 'evento',
                cor: '#ec4899',
                is_publico: true,
            })
        }
        setError(null)
        setSuccess(false)
    }, [evento, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // Combine date and time
            const dataInicioISO = `${formData.data_inicio}T${formData.hora_inicio || '00:00'}:00`
            let dataFimISO: string | undefined

            if (formData.data_fim) {
                dataFimISO = `${formData.data_fim}T${formData.hora_fim || '23:59'}:00`
            }

            const payload = {
                titulo: formData.titulo,
                descricao: formData.descricao || undefined,
                data_inicio: dataInicioISO,
                data_fim: dataFimISO,
                local: formData.local || undefined,
                tipo: formData.tipo,
                cor: formData.cor,
                is_publico: formData.is_publico,
            }

            if (evento) {
                await updateEventoCalendario(evento.id, payload)
            } else {
                await createEventoCalendario(payload)
            }

            setSuccess(true)
            setTimeout(() => {
                onSuccess()
                onOpenChange(false)
            }, 1000)

        } catch (err) {
            console.error('Erro ao salvar evento:', err)
            setError(err instanceof Error ? err.message : 'Erro ao salvar evento')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-pink-500" />
                        {evento ? 'Editar Evento' : 'Novo Evento'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                        {evento
                            ? 'Atualize as informações do evento abaixo.'
                            : 'Adicione um novo evento ao calendário.'}
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
                                {evento ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!'}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="titulo" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Título *
                        </Label>
                        <Input
                            id="titulo"
                            value={formData.titulo}
                            onChange={(e) => handleChange('titulo', e.target.value)}
                            placeholder="Ex: Recital de Fim de Ano"
                            className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            required
                            disabled={isLoading || success}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tipo" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Tipo de Evento *
                            </Label>
                            <select
                                id="tipo"
                                value={formData.tipo}
                                onChange={(e) => handleChange('tipo', e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                required
                                disabled={isLoading || success}
                            >
                                {TIPOS_EVENTO.map(tipo => (
                                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="local" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Local
                            </Label>
                            <div className="relative">
                                <Input
                                    id="local"
                                    value={formData.local}
                                    onChange={(e) => handleChange('local', e.target.value)}
                                    placeholder="Ex: Teatro Municipal"
                                    className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 pl-10"
                                    disabled={isLoading || success}
                                />
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="data_inicio" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Data Início *
                            </Label>
                            <Input
                                id="data_inicio"
                                type="date"
                                value={formData.data_inicio}
                                onChange={(e) => handleChange('data_inicio', e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hora_inicio" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Hora Início
                            </Label>
                            <Input
                                id="hora_inicio"
                                type="time"
                                value={formData.hora_inicio}
                                onChange={(e) => handleChange('hora_inicio', e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="data_fim" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Data Fim
                            </Label>
                            <Input
                                id="data_fim"
                                type="date"
                                value={formData.data_fim}
                                onChange={(e) => handleChange('data_fim', e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hora_fim" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Hora Fim
                            </Label>
                            <Input
                                id="hora_fim"
                                type="time"
                                value={formData.hora_fim}
                                onChange={(e) => handleChange('hora_fim', e.target.value)}
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                                disabled={isLoading || success}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descricao" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Descrição
                        </Label>
                        <textarea
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => handleChange('descricao', e.target.value)}
                            placeholder="Detalhes sobre o evento..."
                            rows={3}
                            className="flex w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-y"
                            disabled={isLoading || success}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Cor do Evento
                        </Label>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                            {CORES_EVENTO.map(cor => (
                                <button
                                    key={cor.hex}
                                    type="button"
                                    onClick={() => handleChange('cor', cor.hex)}
                                    disabled={isLoading || success}
                                    className={`
                                        h-10 rounded-xl border-2 transition-all
                                        ${formData.cor === cor.hex
                                            ? 'border-zinc-900 dark:border-white scale-110 shadow-lg'
                                            : 'border-transparent hover:scale-105'
                                        }
                                    `}
                                    style={{ backgroundColor: cor.hex }}
                                    title={cor.nome}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="button"
                            onClick={() => handleChange('is_publico', !formData.is_publico)}
                            disabled={isLoading || success}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${formData.is_publico
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                                }`}
                        >
                            {formData.is_publico ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            <span className="text-sm font-medium">
                                {formData.is_publico ? 'Visível no Site' : 'Apenas Interno'}
                            </span>
                        </button>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                            <strong>Dica:</strong> Eventos marcados como &quot;Visível no Site&quot; aparecem no calendário público.
                            Eventos internos são visíveis apenas no painel administrativo.
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
                                evento ? 'Atualizar Evento' : 'Criar Evento'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
