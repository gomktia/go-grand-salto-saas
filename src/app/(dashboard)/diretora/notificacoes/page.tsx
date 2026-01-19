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
    Zap,
    Sparkles,
    Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTenant } from '@/hooks/use-tenant'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const templates = [
    { id: 1, title: 'Mensalidade Atrazada', channel: 'WhatsApp', text: 'Olá [Nome], notamos que sua mensalidade de [Mês] está em aberto. Podemos ajudar?' },
    { id: 2, title: 'Lembrete de Aula', channel: 'App', text: 'Boa tarde! Amanhã temos aula especial de [Turma] às [Hora]. Não falte!' },
    { id: 3, title: 'Aviso de Evento', channel: 'WhatsApp', text: 'Fotos do espetáculo liberadas! Acesse: [Link]' },
]

export default function NotificacoesPage() {
    const [isSending, setIsSending] = useState(false)
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#db2777'

    const simulateSend = () => {
        setIsSending(true)
        setTimeout(() => setIsSending(false), 2000)
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Central de Comunicação e Transmissão
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Mensagens & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Automações</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-10 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                        HISTÓRICO
                    </Button>
                    <Button
                        style={{ backgroundColor: primaryColor }}
                        className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none"
                    >
                        <Zap className="w-4 h-4 mr-1" />
                        NOVA AUTOMAÇÃO
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna de Envio */}
                <Card className="lg:col-span-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-4">Nova Transmissão</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Todas as Turmas', 'Para Inadimplentes', 'Diretoria'].map((cat) => (
                                    <Button key={cat} variant="outline" className="h-9 rounded-lg border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 px-4 gap-2 text-zinc-500 group">
                                        <Users className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-500" />
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Mensagem do Sistema</label>
                            <Textarea
                                placeholder="Olá! Gostaríamos de lembrar que..."
                                className="min-h-[160px] bg-zinc-50 dark:bg-black/40 border-none rounded-xl p-6 text-sm font-medium focus-visible:ring-1 focus-visible:ring-blue-500/50 resize-none shadow-inner"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <Button className="flex-1 h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-green-500/10 border-none">
                                <Send className="w-4 h-4" /> ENVIAR WHATSAPP
                            </Button>
                            <Button
                                onClick={simulateSend}
                                disabled={isSending}
                                className="flex-1 h-12 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase text-[10px] tracking-widest gap-2 transition-all hover:scale-[1.02] active:scale-95 border-none"
                            >
                                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Bell className="w-4 h-4" /> NOTIFICAR NO APP</>}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* AI Templates & Status Sidebar */}
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
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Sugestões IA</h3>
                            </div>
                            <div className="space-y-2">
                                {[
                                    'Cobrança Amigável',
                                    'Convite Matrícula',
                                    'Aviso de Feriado',
                                    'Parabéns Aluno'
                                ].map((t) => (
                                    <div key={t} className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-white">{t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Envios Recentes</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Aviso de Gala', time: 'Há 10 min', status: 'OK', color: 'bg-emerald-500' },
                                    { label: 'Boas-vindas', time: 'Há 2h', status: 'OK', color: 'bg-emerald-500' },
                                    { label: 'Boletim Mensal', time: 'Ontem', status: 'Falha', color: 'bg-red-500' },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-700 dark:text-zinc-300">{s.label}</p>
                                                <p className="text-[8px] text-zinc-400 font-medium uppercase tracking-widest">{s.time}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="h-5 text-[8px] font-black uppercase tracking-widest border-zinc-100 dark:border-zinc-800 px-2 text-zinc-400">{s.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
