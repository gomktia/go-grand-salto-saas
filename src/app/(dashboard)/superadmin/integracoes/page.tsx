'use client'

import React from 'react'
import {
    Zap,
    MessageSquare,
    CreditCard,
    Bot,
    Mail,
    Server,
    Database,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Key
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { toast } from 'sonner'

type Integration = {
    id: string
    name: string
    category: string
    status: 'connected' | 'disconnected' | 'error'
    icon: React.ElementType
    description: string
}

const INTEGRATIONS: Integration[] = [
    { id: 'asaas', name: 'Asaas', category: 'Pagamentos', status: 'connected', icon: CreditCard, description: 'Gateway de pagamentos para boletos e PIX automatizado.' },
    { id: 'stripe', name: 'Stripe', category: 'Pagamentos', status: 'disconnected', icon: CreditCard, description: 'Processamento de cartoes de credito internacional.' },
    { id: 'openai', name: 'OpenAI (GPT-4)', category: 'Inteligencia Artificial', status: 'connected', icon: Bot, description: 'Motor de IA para geracao de conteudo e chat.' },
    { id: 'whatsapp', name: 'Evolution API', category: 'Comunicacao', status: 'error', icon: MessageSquare, description: 'API de conexao nao-oficial para WhatsApp.' },
    { id: 'resend', name: 'Resend', category: 'Email', status: 'connected', icon: Mail, description: 'Servico de entrega de emails transacionais.' },
    { id: 'supabase', name: 'Supabase', category: 'Infraestrutura', status: 'connected', icon: Database, description: 'Banco de dados e autenticacao.' },
]

export default function SuperAdminIntegracoesPage() {

    const handleSave = () => {
        toast.success('Configuracoes de integracao salvas')
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
            case 'disconnected': return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20'
            case 'error': return 'text-red-500 bg-red-500/10 border-red-500/20'
            default: return 'text-neutral-500'
        }
    }

    return (
        <div className="p-4 lg:p-10 space-y-8 pb-24 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                        Integracoes
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm lg:text-lg mt-2">
                        Gerencie conexoes com servicos externos e APIs
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {INTEGRATIONS.map((integration) => (
                        <Card key={integration.id} className="bg-neutral-900 border-white/5 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all group">
                            <CardContent className="p-0">
                                <div className="p-6 flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                        <integration.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{integration.name}</h3>
                                            <Badge className={`${getStatusColor(integration.status)} border px-2 uppercase text-[9px] font-black tracking-widest`}>
                                                {integration.status}
                                            </Badge>
                                        </div>
                                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">{integration.description}</p>

                                        <div className="p-4 bg-black/20 rounded-xl space-y-4 border border-white/5">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 flex items-center gap-2">
                                                    <Key className="w-3 h-3" />
                                                    API Key / Token
                                                </Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="password"
                                                        value="sk_live_**********************"
                                                        readOnly
                                                        className="h-10 bg-black/40 border-white/5 text-neutral-300 font-mono text-xs rounded-lg flex-1"
                                                    />
                                                    <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest">
                                                        Editar
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-xs text-neutral-400 font-bold">Ativar Integracao Global</span>
                                                <Switch checked={integration.status === 'connected'} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="bg-violet-600/10 border-violet-500/20 rounded-3xl">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-violet-400 font-black uppercase tracking-tight text-lg">Webhooks Globais</CardTitle>
                            <CardDescription className="text-violet-300/60 uppercase text-[10px] font-bold tracking-widest">
                                Eventos do sistema para servicos externos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold tracking-widest text-violet-300">URL de Callback (Faturamento)</Label>
                                <Input
                                    value="https://api.grandsalto.ia/webhooks/asaas"
                                    readOnly
                                    className="bg-violet-900/20 border-violet-500/20 text-violet-200"
                                />
                            </div>
                            <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-xl">
                                Testar Webhook
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-white/5 rounded-3xl">
                        <CardHeader className="p-6">
                            <CardTitle className="text-white font-black uppercase tracking-tight text-lg">Documentacao</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-3">
                            <Button variant="outline" className="w-full justify-start h-12 border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white rounded-xl">
                                <ExternalLink className="w-4 h-4 mr-3" />
                                API Reference
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12 border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white rounded-xl">
                                <Bot className="w-4 h-4 mr-3" />
                                Configurar IA Agent
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
