'use client'

import React, { useState } from 'react'
import {
    MessageSquare,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle,
    Send,
    User,
    MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock Data
const TICKETS = [
    { id: '1', subject: 'Problemas com exportacao financeiro', user: 'Ana Paula', escola: 'Studio Danca Vida', status: 'open', priority: 'high', lastUpdate: '10 min', avatar: '' },
    { id: '2', subject: 'Duvida sobre cadastro de alunos', user: 'Carlos Silva', escola: 'Ballet Art', status: 'pending', priority: 'medium', lastUpdate: '2h', avatar: '' },
    { id: '3', subject: 'Integracao Asaas nao funciona', user: 'Mariana Lima', escola: 'Espaco Revelle', status: 'open', priority: 'critical', lastUpdate: '5 min', avatar: '' },
    { id: '4', subject: 'Sugestao de funcionalidade', user: 'Roberto Costa', escola: 'Danca & Movimento', status: 'closed', priority: 'low', lastUpdate: '1d', avatar: '' },
]

export default function SuperAdminSuportePage() {
    const [selectedTicket, setSelectedTicket] = useState<typeof TICKETS[0] | null>(TICKETS[0])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <Badge className="bg-blue-500/10 text-blue-500 border-none uppercase text-[9px] font-black tracking-widest">Aberto</Badge>
            case 'pending': return <Badge className="bg-amber-500/10 text-amber-500 border-none uppercase text-[9px] font-black tracking-widest">Pendente</Badge>
            case 'closed': return <Badge className="bg-emerald-500/10 text-emerald-500 border-none uppercase text-[9px] font-black tracking-widest">Resolvido</Badge>
            default: return null
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-500'
            case 'high': return 'text-orange-500'
            case 'medium': return 'text-amber-500'
            case 'low': return 'text-blue-500'
            default: return 'text-neutral-500'
        }
    }

    return (
        <div className="p-4 lg:p-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                        Central de Suporte
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">
                        Gerencie solicitacoes e chamados dos tenants
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-white/10 text-white hover:bg-white/5">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 h-full min-h-0 pb-16">
                {/* Lista de Chamados */}
                <Card className="col-span-12 lg:col-span-4 bg-neutral-900 border-white/5 rounded-3xl overflow-hidden flex flex-col h-full ring-1 ring-white/5">
                    <div className="p-4 border-b border-white/5 shrink-0 bg-white/[0.02]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <Input
                                placeholder="Buscar chamados..."
                                className="pl-10 bg-black/20 border-white/5 text-white rounded-xl h-10 placeholder:text-neutral-600"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-white/5">
                            {TICKETS.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-4 hover:bg-white/5 transition-all cursor-pointer group border-l-2 ${selectedTicket?.id === ticket.id ? 'bg-white/5 border-l-violet-500' : 'border-l-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-bold text-sm ${selectedTicket?.id === ticket.id ? 'text-white' : 'text-neutral-300'} group-hover:text-white line-clamp-1`}>
                                            {ticket.subject}
                                        </h3>
                                        <span className="text-[10px] text-neutral-500 whitespace-nowrap ml-2">{ticket.lastUpdate}</span>
                                    </div>
                                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-tight mb-2">
                                        {ticket.escola}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(ticket.status)}
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Area do Chat / Detalhes */}
                <Card className="col-span-12 lg:col-span-8 bg-neutral-900 border-white/5 rounded-3xl overflow-hidden flex flex-col h-full ring-1 ring-white/5">
                    {selectedTicket ? (
                        <>
                            {/* Header do Chat */}
                            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-10 h-10 border border-white/10">
                                        <AvatarFallback className="bg-violet-600 text-white font-bold">
                                            {selectedTicket.user.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-white font-bold text-lg leading-tight">{selectedTicket.subject}</h2>
                                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                                            <span className="font-bold text-white">{selectedTicket.user}</span>
                                            <span>de</span>
                                            <span className="font-bold text-violet-400">{selectedTicket.escola}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </Button>
                                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-9 text-[10px] font-black uppercase tracking-widest px-4">
                                        <CheckCircle2 className="w-3 h-3 mr-2" />
                                        Resolver
                                    </Button>
                                </div>
                            </div>

                            {/* Conteudo do Chat */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20">
                                {/* Mensagem do Cliente */}
                                <div className="flex gap-4">
                                    <Avatar className="w-8 h-8 border border-white/10 mt-1">
                                        <AvatarFallback className="bg-neutral-800 text-neutral-400 text-xs">ap</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 text-sm text-neutral-300 leading-relaxed border border-white/5">
                                            <p>Ola, estou tentando exportar o relatorio financeiro do mes passado mas esta dando erro 500 no console. Podem verificar?</p>
                                        </div>
                                        <span className="text-[10px] text-neutral-600 font-bold ml-1 mt-1 block">14:30</span>
                                    </div>
                                </div>

                                {/* Resposta do Suporte */}
                                <div className="flex gap-4 flex-row-reverse">
                                    <Avatar className="w-8 h-8 border border-white/10 mt-1">
                                        <AvatarFallback className="bg-violet-600 text-white text-xs">SA</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="bg-violet-600/10 rounded-2xl rounded-tr-none p-4 text-sm text-white leading-relaxed border border-violet-500/20 text-right">
                                            <p>Oi Ana! Claro, vamos verificar os logs aqui. Voce consegue me mandar um print do erro?</p>
                                        </div>
                                        <span className="text-[10px] text-neutral-600 font-bold mr-1 mt-1 block text-right">14:32</span>
                                    </div>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-white/5 bg-white/[0.02] shrink-0">
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Digite sua resposta..."
                                        className="h-12 bg-black/20 border-white/10 text-white rounded-xl flex-1"
                                    />
                                    <Button size="icon" className="h-12 w-12 bg-violet-600 hover:bg-violet-500 rounded-xl">
                                        <Send className="w-5 h-5 text-white" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-bold text-sm uppercase tracking-widest">Selecione um chamado</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
