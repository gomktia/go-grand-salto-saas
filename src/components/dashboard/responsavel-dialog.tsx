'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Loader2,
    AlertCircle,
    CheckCircle2,
    Plus,
    Trash2,
    User,
    Mail,
    Phone,
    Users,
    Crown,
    Key,
    Shield
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    getResponsaveisByEstudante,
    criarResponsavelComVinculo,
    desvincularResponsavel,
    atualizarVinculo
} from '@/app/actions/responsaveis'
import { useTenant } from '@/hooks/use-tenant'

type Responsavel = {
    id: string
    nome_completo: string
    email: string
    telefone?: string
    parentesco: string
    portal_habilitado: boolean
    ativo: boolean
}

type VinculoResponsavel = {
    id: string
    estudante_id: string
    responsavel_id: string
    is_principal: boolean
    pode_buscar: boolean
    recebe_notificacoes: boolean
    responsavel: Responsavel
}

type ResponsavelDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    estudanteId: string
    estudanteNome: string
    onSuccess?: () => void
}

const parentescoOptions = [
    { value: 'pai', label: 'Pai' },
    { value: 'mae', label: 'Mãe' },
    { value: 'avo', label: 'Avô/Avó' },
    { value: 'tio', label: 'Tio/Tia' },
    { value: 'responsavel', label: 'Responsável Legal' },
]

export function ResponsavelDialog({
    open,
    onOpenChange,
    estudanteId,
    estudanteNome,
    onSuccess
}: ResponsavelDialogProps) {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#db2777'

    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [vinculos, setVinculos] = useState<VinculoResponsavel[]>([])
    const [showAddForm, setShowAddForm] = useState(false)

    const [newResponsavel, setNewResponsavel] = useState({
        nome_completo: '',
        email: '',
        telefone: '',
        cpf: '',
        parentesco: 'responsavel' as const,
        is_principal: false,
        criar_acesso_portal: false,
    })

    // Carregar responsáveis do estudante
    useEffect(() => {
        if (open && estudanteId) {
            loadResponsaveis()
        }
    }, [open, estudanteId])

    const loadResponsaveis = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await getResponsaveisByEstudante(estudanteId)
            setVinculos(result.data as VinculoResponsavel[])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar responsáveis')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddResponsavel = async () => {
        if (!newResponsavel.nome_completo || !newResponsavel.email) {
            setError('Nome e email são obrigatórios')
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            await criarResponsavelComVinculo({
                estudante_id: estudanteId,
                ...newResponsavel,
            })

            setSuccess(true)
            setShowAddForm(false)
            setNewResponsavel({
                nome_completo: '',
                email: '',
                telefone: '',
                cpf: '',
                parentesco: 'responsavel',
                is_principal: false,
                criar_acesso_portal: false,
            })

            await loadResponsaveis()

            setTimeout(() => setSuccess(false), 2000)
            onSuccess?.()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao adicionar responsável')
        } finally {
            setIsSaving(false)
        }
    }

    const handleRemoveVinculo = async (vinculoId: string) => {
        if (!confirm('Tem certeza que deseja remover este responsável do aluno?')) return

        setIsSaving(true)
        setError(null)

        try {
            await desvincularResponsavel(vinculoId)
            await loadResponsaveis()
            onSuccess?.()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao remover responsável')
        } finally {
            setIsSaving(false)
        }
    }

    const handleTogglePrincipal = async (vinculoId: string, isPrincipal: boolean) => {
        setIsSaving(true)
        try {
            await atualizarVinculo(vinculoId, { is_principal: !isPrincipal })
            await loadResponsaveis()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar')
        } finally {
            setIsSaving(false)
        }
    }

    const getParentescoLabel = (value: string) => {
        return parentescoOptions.find(p => p.value === value)?.label || value
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] bg-white dark:bg-neutral-900 border-zinc-200 dark:border-white/10 max-h-[90vh] overflow-y-auto rounded-[2rem]">
                <DialogHeader className="p-2">
                    <DialogTitle className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                        <Users className="w-6 h-6" style={{ color: primaryColor }} />
                        Gestão de Responsáveis
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-neutral-400 font-medium">
                        Vincule os responsáveis que terão acesso ao portal de <span className="text-zinc-900 dark:text-white font-bold">{estudanteNome}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-300 leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-emerald-300 leading-relaxed">Responsável adicionado com sucesso!</p>
                        </div>
                    )}

                    {/* Lista de responsáveis vinculados */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-zinc-400 dark:text-neutral-300 uppercase tracking-[0.2em] ml-1">
                                Responsáveis Vinculados
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="h-9 px-4 rounded-xl border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
                                style={{ color: showAddForm ? '#71717a' : primaryColor }}
                            >
                                {showAddForm ? 'FECHAR' : 'NOVO VÍNCULO'}
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                            </div>
                        ) : vinculos.length === 0 ? (
                            <div className="text-center py-8 bg-neutral-800/50 rounded-xl border border-white/5">
                                <Users className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                                <p className="text-neutral-400 text-sm">Nenhum responsável cadastrado</p>
                                <p className="text-neutral-500 text-xs mt-1">Clique em &quot;Adicionar&quot; para vincular um responsável</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {vinculos.map((vinculo) => (
                                    <div
                                        key={vinculo.id}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50 dark:bg-neutral-800/50 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                                                <User className="w-5 h-5 text-pink-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-sm text-zinc-900 dark:text-white uppercase tracking-tight">
                                                        {vinculo.responsavel.nome_completo}
                                                    </span>
                                                    {vinculo.is_principal && (
                                                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none text-[9px] font-black uppercase tracking-widest px-2 shadow-none">
                                                            <Crown className="w-3 h-3 mr-1" />
                                                            Principal
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] text-zinc-500 dark:text-neutral-400 mt-1.5 font-bold uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5">
                                                        <Mail className="w-3 h-3 opacity-40" />
                                                        {vinculo.responsavel.email}
                                                    </span>
                                                    {vinculo.responsavel.telefone && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Phone className="w-3 h-3 opacity-40" />
                                                            {vinculo.responsavel.telefone}
                                                        </span>
                                                    )}
                                                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[8px]">
                                                        {getParentescoLabel(vinculo.responsavel.parentesco)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleTogglePrincipal(vinculo.id, vinculo.is_principal)}
                                                disabled={isSaving}
                                                className={`text-xs ${vinculo.is_principal ? 'text-amber-400' : 'text-neutral-400 hover:text-amber-400'}`}
                                            >
                                                <Crown className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveVinculo(vinculo.id)}
                                                disabled={isSaving}
                                                className="text-neutral-400 hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Formulário para adicionar novo responsável */}
                    {showAddForm && (
                        <div className="mt-6 p-6 rounded-[2rem] bg-zinc-50 dark:bg-neutral-800/80 border border-zinc-200 dark:border-white/10 space-y-5 shadow-inner">
                            <h4 className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                <Plus className="w-4 h-4" style={{ color: primaryColor }} />
                                Adicionar Novo Responsável
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nome_completo" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                        Nome Completo *
                                    </Label>
                                    <Input
                                        id="nome_completo"
                                        value={newResponsavel.nome_completo}
                                        onChange={(e) => setNewResponsavel({ ...newResponsavel, nome_completo: e.target.value })}
                                        placeholder="Ex: Maria Silva Santos"
                                        className="h-11 bg-white dark:bg-black/40 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl font-bold"
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                        Email *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newResponsavel.email}
                                        onChange={(e) => setNewResponsavel({ ...newResponsavel, email: e.target.value })}
                                        placeholder="email@exemplo.com"
                                        className="h-11 bg-white dark:bg-black/40 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl font-bold"
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefone" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                        Telefone (WhatsApp)
                                    </Label>
                                    <Input
                                        id="telefone"
                                        value={newResponsavel.telefone}
                                        onChange={(e) => setNewResponsavel({ ...newResponsavel, telefone: e.target.value })}
                                        placeholder="(55) 99999-9999"
                                        className="h-11 bg-white dark:bg-black/40 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl font-bold"
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cpf" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                        CPF
                                    </Label>
                                    <Input
                                        id="cpf"
                                        value={newResponsavel.cpf}
                                        onChange={(e) => setNewResponsavel({ ...newResponsavel, cpf: e.target.value })}
                                        placeholder="000.000.000-00"
                                        className="h-11 bg-white dark:bg-black/40 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl font-bold"
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="parentesco" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                        Parentesco
                                    </Label>
                                    <select
                                        id="parentesco"
                                        value={newResponsavel.parentesco}
                                        onChange={(e) => setNewResponsavel({ ...newResponsavel, parentesco: e.target.value as typeof newResponsavel.parentesco })}
                                        className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black/40 px-3 py-2 text-sm text-zinc-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                        disabled={isSaving}
                                    >
                                        {parentescoOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-neutral-300">Opções</Label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newResponsavel.is_principal}
                                                onChange={(e) => setNewResponsavel({ ...newResponsavel, is_principal: e.target.checked })}
                                                className="w-4 h-4 rounded border-white/10 bg-black/40 text-pink-500 focus:ring-pink-500/50"
                                                disabled={isSaving}
                                            />
                                            <span className="text-sm text-neutral-300">Responsável Principal</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newResponsavel.criar_acesso_portal}
                                                onChange={(e) => setNewResponsavel({ ...newResponsavel, criar_acesso_portal: e.target.checked })}
                                                className="w-4 h-4 rounded border-white/10 bg-black/40 text-pink-500 focus:ring-pink-500/50"
                                                disabled={isSaving}
                                            />
                                            <span className="text-sm text-neutral-300 flex items-center gap-1">
                                                <Shield className="w-3 h-3" />
                                                Habilitar acesso ao Portal
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddForm(false)}
                                    disabled={isSaving}
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleAddResponsavel}
                                    disabled={isSaving || !newResponsavel.nome_completo || !newResponsavel.email}
                                    className="h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest text-white shadow-lg active:scale-95 transition-all border-none"
                                    style={{ backgroundColor: primaryColor, boxShadow: `0 10px 20px -5px ${primaryColor}40` }}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            SALVAR VÍNCULO
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-white/10 hover:bg-white/5"
                    >
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
