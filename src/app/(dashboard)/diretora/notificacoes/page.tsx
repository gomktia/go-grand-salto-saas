'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
    Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const templates = [
    { id: 1, title: 'Mensalidade Atrazada', channel: 'WhatsApp', text: 'Olá [Nome], notamos que sua mensalidade de [Mês] está em aberto. Podemos ajudar?' },
    { id: 2, title: 'Lembrete de Aula', channel: 'App', text: 'Boa tarde! Amanhã temos aula especial de [Turma] às [Hora]. Não falte!' },
    { id: 3, title: 'Aviso de Evento', channel: 'WhatsApp', text: 'Fotos do espetáculo liberadas! Acesse: [Link]' },
]

export default function NotificationsPage() {
    const [isSending, setIsSending] = useState(false)
    const [activeTab, setActiveTab] = useState('templates')

    const simulateSend = () => {
        setIsSending(true)
        setTimeout(() => setIsSending(false), 2000)
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
                        <MessageSquare className="text-pink-600" />
                        Comunicação Inteligente
                    </h1>
                    <p className="text-neutral-500">Automação de mensagens via WhatsApp e App para pais e alunos.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">API WhatsApp Online</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lado Esquerdo: Nova Mensagem */}
                <Card className="lg:col-span-2 bg-neutral-900 border-white/5 overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.01]">
                        <CardTitle className="flex items-center gap-2">
                            <Send className="w-5 h-5 text-pink-500" />
                            Enviar Nova Notificação
                        </CardTitle>
                        <CardDescription>Envie avisos rápidos ou cobranças automatizadas.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Para quem?</label>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1 border-white/10 gap-2 h-12 text-xs uppercase font-bold">
                                        <Users className="w-4 h-4" />
                                        Toda a Escola
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-white/10 gap-2 h-12 text-xs uppercase font-bold">
                                        <Filter className="w-4 h-4" />
                                        Filtrar
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Canal</label>
                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2 h-12 text-xs uppercase font-bold">
                                        <Smartphone className="w-4 h-4" />
                                        WhatsApp
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-white/10 gap-2 h-12 text-xs uppercase font-bold">
                                        <Bell className="w-4 h-4" />
                                        Push App
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Mensagem</label>
                            <Textarea
                                placeholder="Digite sua mensagem aqui..."
                                className="min-h-[150px] bg-neutral-950/50 border-white/5 rounded-2xl p-4 focus:ring-pink-500/50"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <AlertCircle className="w-4 h-4" />
                                Estimativa: 145 destinatários
                            </div>
                            <Button
                                onClick={simulateSend}
                                className="bg-pink-600 hover:bg-pink-500 px-12 h-14 rounded-2xl font-bold text-lg uppercase tracking-tighter shadow-xl shadow-pink-600/20"
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Disparando...
                                    </div>
                                ) : (
                                    <>
                                        Disparar Agora
                                        <Zap className="ml-2 w-5 h-5 fill-white" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Lado Direito: Templates e Logs */}
                <div className="space-y-6">
                    <Card className="bg-neutral-900 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-neutral-400">Templates IA</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {templates.map(tmp => (
                                <div key={tmp.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm font-bold">{tmp.title}</span>
                                        <Badge variant="outline" className="text-[8px] uppercase">{tmp.channel}</Badge>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed italic">"{tmp.text}"</p>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-[10px] uppercase font-bold tracking-widest text-neutral-500 hover:text-white">
                                + Novo Template
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-neutral-400">Status Recente</CardTitle>
                            <Clock className="w-4 h-4 text-neutral-500" />
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {[
                                { status: 'success', time: '10m atrás', count: 45 },
                                { status: 'error', time: '1h atrás', count: 1 },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        {log.status === 'success' ? <CheckCircle2 className="text-emerald-500 w-4 h-4" /> : <AlertCircle className="text-red-500 w-4 h-4" />}
                                        <span className="text-neutral-400">{log.count} mensagens enviadas</span>
                                    </div>
                                    <span className="text-[10px] text-neutral-600">{log.time}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
