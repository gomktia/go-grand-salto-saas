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
        <div className="space-y-8 p-1">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 italic mb-2">Comunicação Unificada</h2>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-neutral-900 dark:text-white flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-pink-600" />
                        Centro de Mensagens
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">Automatize o contato com seus <strong>Alunos</strong> de forma inteligente no <strong>{tenant?.nome}</strong>.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-neutral-200 dark:border-neutral-800 gap-2 font-bold uppercase text-[10px] tracking-widest glass">
                        Relatórios
                    </Button>
                    <Button
                        style={{ backgroundColor: primaryColor }}
                        className="h-14 px-8 rounded-2xl text-white gap-2 font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-pink-500/20 hover:opacity-90 transition-all hover:scale-105"
                    >
                        <Zap className="w-4 h-4" />
                        Nova Automação
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna de Envio */}
                <Card className="lg:col-span-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-10 rounded-[2.5rem] shadow-sm glass">
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-tight">Redigir Transmissão</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['Todas as Turmas', 'Somente inadimplentes', 'Diretoria'].map((cat) => (
                                    <Button key={cat} variant="outline" className="h-14 rounded-2xl border-neutral-100 dark:border-white/5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-white/5 justify-start px-6 gap-3 group">
                                        <Users className="w-4 h-4 text-neutral-400 group-hover:text-pink-500" />
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Mensagem do Sistema</label>
                            <Textarea
                                placeholder="Olá! Gostaríamos de lembrar que..."
                                className="min-h-[200px] bg-neutral-50 dark:bg-black/40 border-none rounded-[2rem] p-8 text-lg font-medium focus-visible:ring-2 focus-visible:ring-pink-500/50 resize-none shadow-inner"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-neutral-100 dark:border-white/5">
                            <Button className="flex-1 h-16 rounded-2xl bg-[#25D366] hover:bg-[#20bd5c] text-white font-black uppercase text-[10px] tracking-widest gap-3 shadow-xl shadow-green-500/20">
                                <Send className="w-5 h-5" /> Enviar via WhatsApp
                            </Button>
                            <Button
                                onClick={simulateSend}
                                disabled={isSending}
                                className="flex-1 h-16 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest gap-3 transition-all hover:scale-105 active:scale-95"
                            >
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Bell className="w-5 h-5" /> Notificar no App</>}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* AI Templates & Status */}
                <div className="space-y-8">
                    <Card className="bg-gradient-to-br from-neutral-900 to-black border-none rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Sparkles size={120} className="text-pink-500" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-pink-500/10 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white">Templates IA</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    'Cobrança Amigável',
                                    'Convite para Matrícula',
                                    'Aviso de Feriado',
                                    'Parabéns Aniversário'
                                ].map((t) => (
                                    <div key={t} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer group">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white">{t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-8 rounded-[2.5rem] shadow-sm glass">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest">Status Recente</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Aviso de Gala', time: 'Há 10 min', status: 'Entregue', color: 'bg-emerald-500' },
                                    { label: 'Mensagem de Boas-vindas', time: 'Há 2h', status: 'Entregue', color: 'bg-emerald-500' },
                                    { label: 'Boletim Mensal', time: 'Ontem', status: 'Falha', color: 'bg-red-500' },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${s.color} group-hover:animate-ping`} />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-tight">{s.label}</p>
                                                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{s.time}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="h-6 text-[8px] font-black uppercase tracking-widest border-neutral-100 dark:border-white/5 px-3">{s.status}</Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-pink-500 transition-colors">Ver Histórico Completo</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
