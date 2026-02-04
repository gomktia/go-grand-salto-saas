'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Search,
    Filter,
    Plus,
    Mail,
    Phone,
    MessageSquare,
    TrendingUp,
    UserPlus,
    CheckCircle2,
    Clock,
    Target,
    Loader2,
    MoreHorizontal,
    Edit2,
    Trash2,
    ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useTenant } from '@/hooks/use-tenant'
import { getLeads, createLead, updateLeadStatus } from '@/app/actions/crm'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const STATUS_CONFIG: Record<string, { color: string; bgColor: string; icon: any }> = {
    'Novo': { color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500/10', icon: UserPlus },
    'Aula Experimental': { color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-500/10', icon: Target },
    'Aguardando Resposta': { color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-500/10', icon: Clock },
    'Matriculado': { color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-500/10', icon: CheckCircle2 },
}

const PRIORIDADE_CONFIG: Record<string, string> = {
    'Alta': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    'Média': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'Baixa': 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
}

export default function CRMLeadsPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [showNewLeadModal, setShowNewLeadModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newLead, setNewLead] = useState({
        nome: '',
        interesse: '',
        contato: '',
        prioridade: 'Média'
    })

    useEffect(() => {
        loadLeads()
    }, [])

    async function loadLeads() {
        try {
            setLoading(true)
            const result = await getLeads()
            setLeads(result.data || [])
        } catch (error) {
            toast.error('Erro ao carregar leads')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateLead = async () => {
        if (!newLead.nome || !newLead.interesse) {
            toast.error('Preencha nome e interesse')
            return
        }

        setIsSubmitting(true)
        try {
            await createLead(newLead)
            toast.success('Lead criado com sucesso!')
            setShowNewLeadModal(false)
            setNewLead({ nome: '', interesse: '', contato: '', prioridade: 'Média' })
            loadLeads()
        } catch (error) {
            toast.error('Erro ao criar lead')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAdvanceStatus = async (leadId: string, currentStatus: string) => {
        const statusMap: Record<string, string> = {
            'Novo': 'Aula Experimental',
            'Aula Experimental': 'Aguardando Resposta',
            'Aguardando Resposta': 'Matriculado'
        }
        const nextStatus = statusMap[currentStatus]
        if (!nextStatus) {
            toast.info('Lead já está no status final')
            return
        }

        try {
            await updateLeadStatus(leadId, nextStatus)
            toast.success(`Lead avançado para: ${nextStatus}`)
            loadLeads()
        } catch (error) {
            toast.error('Erro ao atualizar lead')
        }
    }

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.contato?.includes(searchTerm)
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const stats = {
        total: leads.length,
        novos: leads.filter(l => l.status === 'Novo').length,
        experimental: leads.filter(l => l.status === 'Aula Experimental').length,
        matriculados: leads.filter(l => l.status === 'Matriculado').length,
        conversao: leads.length > 0 ? ((leads.filter(l => l.status === 'Matriculado').length / leads.length) * 100).toFixed(1) : '0',
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Nucleo de Expansao e Matriculas
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        CRM de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Prospeccao</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setShowNewLeadModal(true)}
                        className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        NOVO LEAD
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-xl bg-blue-500/10">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white">{stats.total}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Total de Leads</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-xl bg-rose-500/10">
                                <Target className="w-5 h-5 text-rose-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white">{stats.experimental}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Aula Experimental</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-xl bg-emerald-500/10">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white">{stats.matriculados}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Matriculados</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 rounded-xl bg-violet-500/10">
                                <TrendingUp className="w-5 h-5 text-violet-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white">{stats.conversao}%</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Taxa Conversao</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <Input
                        placeholder="Buscar por nome ou contato..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 pl-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'Novo', 'Aula Experimental', 'Aguardando Resposta', 'Matriculado'].map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'outline'}
                            onClick={() => setStatusFilter(status)}
                            className={`h-10 px-4 rounded-xl uppercase text-[9px] font-bold tracking-wider ${statusFilter === status
                                    ? 'bg-rose-600 text-white border-rose-600'
                                    : 'border-zinc-200 dark:border-zinc-800'
                                }`}
                        >
                            {status === 'all' ? 'Todos' : status}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Leads Table */}
            <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 overflow-hidden rounded-[2rem] shadow-xl">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Nenhum lead encontrado</h3>
                        <p className="text-zinc-500 mb-4">Comece adicionando seu primeiro lead.</p>
                        <Button onClick={() => setShowNewLeadModal(true)} style={{ backgroundColor: primaryColor }} className="text-white border-none">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Novo Lead
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-white/[0.02]">
                                    <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Lead</th>
                                    <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Interesse</th>
                                    <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Prioridade</th>
                                    <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Contato</th>
                                    <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Acoes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                <AnimatePresence>
                                    {filteredLeads.map((lead, index) => {
                                        const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG['Novo']
                                        const StatusIcon = statusConfig.icon

                                        return (
                                            <motion.tr
                                                key={lead.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group"
                                            >
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-11 w-11 border-2 border-zinc-100 dark:border-zinc-800">
                                                            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold">
                                                                {lead.nome?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-black text-sm text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors">
                                                                {lead.nome}
                                                            </p>
                                                            <p className="text-[10px] text-zinc-500 mt-0.5">
                                                                {lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                                        {lead.interesse || '-'}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full`}>
                                                        <StatusIcon className="w-3 h-3 mr-1.5" />
                                                        {lead.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-6">
                                                    <Badge className={`${PRIORIDADE_CONFIG[lead.prioridade] || PRIORIDADE_CONFIG['Média']} border font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full`}>
                                                        {lead.prioridade || 'Média'}
                                                    </Badge>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2">
                                                        {lead.contato && (
                                                            <>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => window.open(`https://wa.me/55${lead.contato.replace(/\D/g, '')}`, '_blank')}
                                                                    className="h-9 w-9 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500"
                                                                >
                                                                    <MessageSquare className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => window.open(`tel:${lead.contato}`, '_blank')}
                                                                    className="h-9 w-9 rounded-xl hover:bg-blue-500/10 hover:text-blue-500"
                                                                >
                                                                    <Phone className="w-4 h-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {lead.status !== 'Matriculado' && (
                                                            <Button
                                                                onClick={() => handleAdvanceStatus(lead.id, lead.status)}
                                                                className="h-9 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-bold uppercase text-[9px] tracking-widest rounded-xl transition-all border-none"
                                                            >
                                                                <ArrowRight className="w-3.5 h-3.5 mr-1" />
                                                                Avancar
                                                            </Button>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Acoes</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="rounded-lg cursor-pointer">
                                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                                    Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-lg cursor-pointer text-red-500 focus:text-red-500">
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Excluir
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* New Lead Modal */}
            <Dialog open={showNewLeadModal} onOpenChange={setShowNewLeadModal}>
                <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-rose-500" />
                            Novo Lead
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Cadastre um novo contato interessado em suas aulas.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nome Completo *</Label>
                            <Input
                                value={newLead.nome}
                                onChange={e => setNewLead({ ...newLead, nome: e.target.value })}
                                placeholder="Ex: Maria Silva (Mae da Julia)"
                                className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Interesse *</Label>
                            <Input
                                value={newLead.interesse}
                                onChange={e => setNewLead({ ...newLead, interesse: e.target.value })}
                                placeholder="Ex: Ballet Baby, Jazz Juvenil"
                                className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">WhatsApp/Telefone</Label>
                            <Input
                                value={newLead.contato}
                                onChange={e => setNewLead({ ...newLead, contato: e.target.value })}
                                placeholder="(00) 00000-0000"
                                className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Prioridade</Label>
                            <Select value={newLead.prioridade} onValueChange={v => setNewLead({ ...newLead, prioridade: v })}>
                                <SelectTrigger className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Baixa">Baixa</SelectItem>
                                    <SelectItem value="Média">Media</SelectItem>
                                    <SelectItem value="Alta">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowNewLeadModal(false)}
                            disabled={isSubmitting}
                            className="border-zinc-200 dark:border-zinc-700"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateLead}
                            disabled={isSubmitting}
                            className="text-white border-none"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                'Criar Lead'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
