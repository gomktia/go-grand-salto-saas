'use client'

import React, { useState, useEffect } from 'react'
import {
    MessageSquare,
    Send,
    Bell,
    Clock,
    Users,
    Filter,
    Smartphone,
    Mail,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Settings,
    Zap,
    Sparkles,
    Loader2,
    Layers,
    DollarSign,
    ChevronDown,
    Check
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTenant } from '@/hooks/use-tenant'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    getDestinatariosNotificacao,
    enviarNotificacaoGrupo,
    getHistoricoNotificacoes
} from '@/app/actions/admin'
import { toast } from 'sonner'

type Turma = {
    id: string
    nome: string
    nivel: string
    cor: string
    totalAlunos: number
}

type HistoricoItem = {
    id: string
    titulo: string
    mensagem: string
    tipo: string
    created_at: string
    totalDestinatarios: number
    destinatarioNome: string
}

type GrupoDestinatario = 'todos' | 'turma' | 'inadimplentes'

export default function NotificacoesPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#db2777'

    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)

    // Form state
    const [message, setMessage] = useState('')
    const [title, setTitle] = useState('')
    const [tipo, setTipo] = useState<'geral' | 'financeiro' | 'evento'>('geral')
    const [grupo, setGrupo] = useState<GrupoDestinatario>('todos')
    const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null)

    // Data state
    const [turmas, setTurmas] = useState<Turma[]>([])
    const [totalResponsaveis, setTotalResponsaveis] = useState(0)
    const [totalInadimplentes, setTotalInadimplentes] = useState(0)
    const [historico, setHistorico] = useState<HistoricoItem[]>([])

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            setIsLoading(true)
            const [destRes, histRes] = await Promise.all([
                getDestinatariosNotificacao(),
                getHistoricoNotificacoes(10)
            ])

            setTurmas(destRes.data.turmas)
            setTotalResponsaveis(destRes.data.totalResponsaveis)
            setTotalInadimplentes(destRes.data.totalInadimplentes)
            setHistorico(histRes.data as HistoricoItem[])
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            toast.error('Erro ao carregar dados')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSend() {
        if (!message || !title) {
            toast.error('Titulo e mensagem sao obrigatorios')
            return
        }

        if (grupo === 'turma' && !turmaSelecionada) {
            toast.error('Selecione uma turma')
            return
        }

        setIsSending(true)
        try {
            const result = await enviarNotificacaoGrupo({
                titulo: title,
                mensagem: message,
                tipo,
                grupo,
                turma_id: turmaSelecionada?.id
            })

            toast.success(`Notificacao enviada para ${result.totalEnviados} destinatario(s)!`)
            setMessage('')
            setTitle('')
            setGrupo('todos')
            setTurmaSelecionada(null)
            loadData() // Refresh historico
        } catch (error) {
            toast.error('Erro ao enviar notificacao')
            console.error(error)
        } finally {
            setIsSending(false)
        }
    }

    const getGrupoLabel = () => {
        if (grupo === 'todos') return `Todos os Responsaveis (${totalResponsaveis})`
        if (grupo === 'inadimplentes') return `Inadimplentes (${totalInadimplentes})`
        if (grupo === 'turma' && turmaSelecionada) return `${turmaSelecionada.nome} (${turmaSelecionada.totalAlunos} alunos)`
        return 'Selecionar Destinatarios'
    }

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Agora'
        if (diffMins < 60) return `Ha ${diffMins} min`
        if (diffHours < 24) return `Ha ${diffHours}h`
        if (diffDays === 1) return 'Ontem'
        return `Ha ${diffDays} dias`
    }

    const getTipoBadgeClass = (tipo: string) => {
        switch (tipo) {
            case 'financeiro': return 'bg-amber-500/10 text-amber-500'
            case 'evento': return 'bg-violet-500/10 text-violet-500'
            default: return 'bg-blue-500/10 text-blue-500'
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Carregando Central de Comunicacao...
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Central de Comunicacao e Transmissao
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Mensagens & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Notificacoes</span>
                    </h1>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Responsaveis</p>
                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{totalResponsaveis}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/10">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </Card>
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Inadimplentes</p>
                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{totalInadimplentes}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/10">
                            <DollarSign className="w-5 h-5 text-amber-500" />
                        </div>
                    </div>
                </Card>
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Turmas</p>
                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{turmas.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-violet-500/10">
                            <Layers className="w-5 h-5 text-violet-500" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna de Envio */}
                <Card className="lg:col-span-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-4">Nova Transmissao</h3>

                            {/* Seletor de Destinatarios */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Destinatarios</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 justify-between rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 font-bold text-sm"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-zinc-400" />
                                                {getGrupoLabel()}
                                            </span>
                                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-80 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl p-2">
                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">
                                            Grupos
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => { setGrupo('todos'); setTurmaSelecionada(null) }}
                                            className="rounded-lg cursor-pointer flex items-center justify-between"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-blue-500" />
                                                Todos os Responsaveis
                                            </span>
                                            <span className="text-xs text-zinc-400">{totalResponsaveis}</span>
                                            {grupo === 'todos' && <Check className="w-4 h-4 text-emerald-500 ml-2" />}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => { setGrupo('inadimplentes'); setTurmaSelecionada(null) }}
                                            className="rounded-lg cursor-pointer flex items-center justify-between"
                                        >
                                            <span className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-amber-500" />
                                                Inadimplentes
                                            </span>
                                            <span className="text-xs text-zinc-400">{totalInadimplentes}</span>
                                            {grupo === 'inadimplentes' && <Check className="w-4 h-4 text-emerald-500 ml-2" />}
                                        </DropdownMenuItem>

                                        {turmas.length > 0 && (
                                            <>
                                                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-2" />
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">
                                                    Por Turma
                                                </DropdownMenuLabel>
                                                {turmas.map((turma) => (
                                                    <DropdownMenuItem
                                                        key={turma.id}
                                                        onClick={() => { setGrupo('turma'); setTurmaSelecionada(turma) }}
                                                        className="rounded-lg cursor-pointer flex items-center justify-between"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: turma.cor }}
                                                            />
                                                            {turma.nome}
                                                        </span>
                                                        <span className="text-xs text-zinc-400">{turma.totalAlunos} alunos</span>
                                                        {grupo === 'turma' && turmaSelecionada?.id === turma.id && (
                                                            <Check className="w-4 h-4 text-emerald-500 ml-2" />
                                                        )}
                                                    </DropdownMenuItem>
                                                ))}
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Tipo de Notificacao */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tipo</label>
                                <div className="flex gap-2">
                                    {[
                                        { value: 'geral', label: 'Geral', icon: Bell },
                                        { value: 'financeiro', label: 'Financeiro', icon: DollarSign },
                                        { value: 'evento', label: 'Evento', icon: Calendar },
                                    ].map((t) => (
                                        <Button
                                            key={t.value}
                                            variant={tipo === t.value ? 'default' : 'outline'}
                                            onClick={() => setTipo(t.value as any)}
                                            className={`flex-1 h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest ${tipo === t.value
                                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-none'
                                                    : 'border-zinc-200 dark:border-zinc-800'
                                                }`}
                                        >
                                            <t.icon className="w-3.5 h-3.5 mr-1.5" />
                                            {t.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Titulo do Aviso</label>
                            <Input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Ex: Aviso Importante"
                                className="bg-zinc-50 dark:bg-black/40 border-none rounded-xl p-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-blue-500/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Mensagem</label>
                            <Textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Ola! Gostariamos de informar que..."
                                className="min-h-[140px] bg-zinc-50 dark:bg-black/40 border-none rounded-xl p-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-blue-500/50 resize-none shadow-inner"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <Button
                                onClick={() => toast.info('Integracao com WhatsApp sera liberada na proxima atualizacao.')}
                                className="flex-1 h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-green-500/10 border-none"
                            >
                                <Send className="w-4 h-4" /> ENVIAR WHATSAPP
                            </Button>
                            <Button
                                onClick={handleSend}
                                disabled={isSending}
                                className="flex-1 h-12 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase text-[10px] tracking-widest gap-2 transition-all hover:scale-[1.02] active:scale-95 border-none"
                            >
                                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Bell className="w-4 h-4" /> NOTIFICAR NO APP</>}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Sidebar com Historico */}
                <div className="space-y-6">
                    <Card className="bg-zinc-950 text-white border-none rounded-xl p-5 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Sparkles size={100} className="text-blue-500" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Sugestoes Rapidas</h3>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { label: 'Cobranca Amigavel', tipo: 'financeiro', msg: 'Ola! Notamos que sua mensalidade esta em aberto. Podemos ajudar?' },
                                    { label: 'Lembrete de Aula', tipo: 'geral', msg: 'Lembrete: Amanha temos aula especial. Nao falte!' },
                                    { label: 'Aviso de Feriado', tipo: 'evento', msg: 'Informamos que nao havera aula no proximo feriado.' },
                                ].map((t) => (
                                    <div
                                        key={t.label}
                                        onClick={() => {
                                            setTitle(t.label)
                                            setMessage(t.msg)
                                            setTipo(t.tipo as any)
                                        }}
                                        className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group"
                                    >
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-white">{t.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Envios Recentes</h3>
                            {historico.length === 0 ? (
                                <div className="text-center py-6">
                                    <Bell className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
                                    <p className="text-xs text-zinc-400">Nenhuma notificacao enviada</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {historico.slice(0, 5).map((item) => (
                                        <div key={item.id} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-700 dark:text-zinc-300 truncate">
                                                        {item.titulo}
                                                    </p>
                                                    <p className="text-[8px] text-zinc-400 font-medium uppercase tracking-widest">
                                                        {formatTimeAgo(item.created_at)} • {item.totalDestinatarios > 1 ? `${item.totalDestinatarios} destinatarios` : item.destinatarioNome}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className={`${getTipoBadgeClass(item.tipo)} border-none text-[8px] font-black uppercase tracking-widest px-2 ml-2`}>
                                                {item.tipo}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
