'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    MessageSquare,
    TrendingUp,
    UserPlus,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTenant } from '@/hooks/use-tenant'

const leads = [
    {
        id: 1,
        name: 'Carolina Mendes (Mãe da Alice)',
        status: 'Novo',
        interest: 'Ballet Baby',
        date: '2 horas atrás',
        lastContact: '-',
        priority: 'Alta'
    },
    {
        id: 2,
        name: 'Pedro Rocha (Pai da Sofia)',
        status: 'Aula Experimental',
        interest: 'Jazz Juvenil',
        date: 'Ontem',
        lastContact: 'Agendado para 20/01',
        priority: 'Média'
    },
    {
        id: 3,
        name: 'Mariana Silva',
        status: 'Aguardando Resposta',
        interest: 'Contemporary Dance',
        date: '3 dias atrás',
        lastContact: 'Enviado proposta via WhatsApp',
        priority: 'Baixa'
    },
]

export default function CRMLeadsPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    return (
        <div className="space-y-6 p-4 lg:p-8 max-w-[1600px] mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Núcleo de Expansão e Matrículas
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        CRM de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Prospecção</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="h-10 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        <Filter className="w-3.5 h-3.5 mr-2" />
                        FILTROS
                    </Button>
                    <Button
                        onClick={() => { }}
                        className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        NOVO LEAD
                    </Button>
                </div>
            </div>

            {/* CRM Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Leads do Mês', value: '24', detail: '+15%', color: 'text-emerald-500' },
                    { label: 'Taxa de Conversão', value: '18.5%', detail: 'Meta: 25%', color: 'text-violet-500' },
                    { label: 'Ações Urgentes', value: '8', detail: 'Hoje', color: 'text-rose-500' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden relative group hover:border-rose-500/30 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-1 p-4">
                            <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{stat.label}</CardTitle>
                            <TrendingUp className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{stat.value}</div>
                            <div className={`text-[9px] ${stat.color} mt-1 flex items-center gap-1 font-bold uppercase tracking-widest`}>
                                {stat.detail}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Leads List */}
            <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 overflow-hidden rounded-2xl shadow-sm">
                <CardHeader className="p-5 border-b border-zinc-50 dark:border-zinc-800">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold uppercase tracking-tight text-zinc-900 dark:text-white">Leads em Prospecção</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                <Input placeholder="Nome ou contato..." className="pl-9 h-9 w-64 bg-zinc-100 dark:bg-black/40 border-none rounded-xl text-[10px] focus-visible:ring-1 focus-visible:ring-rose-500/50" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                        {leads.map((lead) => (
                            <div
                                key={lead.id}
                                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 px-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-all gap-4 group relative"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border border-zinc-100 dark:border-zinc-800">
                                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 font-bold text-sm uppercase text-zinc-600 dark:text-zinc-400">{lead.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-xs uppercase tracking-tight text-zinc-900 dark:text-white group-hover:text-rose-600 transition-colors">{lead.name}</div>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <Badge variant="outline" className={`text-[8px] font-bold uppercase tracking-widest h-5 px-2 rounded-full ${lead.status === 'Novo' ? 'border-blue-500/30 text-blue-600 bg-blue-500/5' :
                                                lead.status === 'Aula Experimental' ? 'border-rose-500/30 text-rose-600 bg-rose-500/5' :
                                                    'border-amber-500/30 text-amber-600 bg-amber-500/5'
                                                }`}>
                                                {lead.status}
                                            </Badge>
                                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">• {lead.interest}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row lg:items-center gap-4 ml-14 lg:ml-0">
                                    <div className="text-[9px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full font-bold uppercase tracking-widest h-fit">
                                        <span className="opacity-50">Contato:</span> {lead.lastContact}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg border-zinc-200 dark:border-zinc-800 hover:text-rose-600 hover:border-rose-500 transition-all">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg border-zinc-200 dark:border-zinc-800 hover:text-blue-500 hover:border-blue-500 transition-all">
                                            <Phone className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button className="h-8 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 font-bold uppercase text-[9px] tracking-widest rounded-lg transition-all border-none">
                                            AVANÇAR
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

