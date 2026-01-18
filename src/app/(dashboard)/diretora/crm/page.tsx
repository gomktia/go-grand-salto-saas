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
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Gestão de Conversão
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        CRM de <span style={{ color: primaryColor }}>Matrículas</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm lg:text-lg">Gerencie o crescimento da <strong className="text-foreground">{tenant?.nome || 'sua escola'}</strong> com precisão.</p>
                </div>
                <Button className="h-16 px-10 rounded-2xl font-black uppercase tracking-tighter text-lg shadow-2xl shadow-[var(--primary)]/30 border-none transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: primaryColor }}>
                    <UserPlus className="w-5 h-5 mr-1" />
                    Novo Lead
                </Button>
            </div>

            {/* CRM Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
                {[
                    { label: 'Leads do Mês', value: '24', detail: '+15% vs. Dez', color: 'text-emerald-500' },
                    { label: 'Taxa de Conversão', value: '18.5%', detail: 'Meta: 25%', color: 'text-violet-500' },
                    { label: 'Ações Urgentes', value: '8', detail: 'Hoje', color: 'text-[var(--primary)]' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-card border-border/50 shadow-sm rounded-[2rem] hover:border-[var(--primary)]/20 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                            <TrendingUp size={80} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
                            <div className={`text-[10px] ${stat.color} mt-2 flex items-center gap-1 font-black uppercase tracking-widest`}>
                                <ArrowUpRight className="w-3 h-3" /> {stat.detail}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Leads List */}
            <Card className="bg-card border-border overflow-hidden rounded-[2.5rem] shadow-sm">
                <CardHeader className="p-10 border-b border-border/50 bg-muted/20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter">Leads em Prospecção</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Acompanhamento estratégico em tempo real</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Filtro de busca..." className="pl-12 h-14 bg-muted border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[var(--primary)]/20" />
                            </div>
                            <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-border bg-muted/50 hover:bg-muted transition-all">
                                <Filter className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        {leads.map((lead) => (
                            <div
                                key={lead.id}
                                className="flex flex-col lg:flex-row lg:items-center justify-between p-8 hover:bg-muted/30 transition-all gap-6 group relative"
                            >
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-16 w-16 border-2 border-border p-0.5 group-hover:rotate-3 transition-transform">
                                        <AvatarFallback className="bg-muted font-black text-lg uppercase" style={{ color: primaryColor }}>{lead.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-black text-lg uppercase tracking-tight group-hover:text-[var(--primary)] transition-colors">{lead.name}</div>
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest h-7 px-4 rounded-full ${lead.status === 'Novo' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' :
                                                lead.status === 'Aula Experimental' ? 'border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5' :
                                                    'border-amber-500/30 text-amber-600 bg-amber-500/5'
                                                }`}>
                                                {lead.status}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">• {lead.interest}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col lg:items-end gap-4">
                                    <div className="text-[10px] text-muted-foreground bg-muted/50 px-4 py-2 rounded-full w-fit font-black uppercase tracking-tighter">
                                        <span className="opacity-50 mr-2">Último Contato:</span> {lead.lastContact}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl border-border hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all">
                                            <MessageSquare className="w-5 h-5" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl border-border hover:text-blue-500 hover:border-blue-500 transition-all">
                                            <Phone className="w-5 h-5" />
                                        </Button>
                                        <Button className="h-12 px-8 bg-foreground text-background hover:bg-neutral-800 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all">
                                            Avançar no Funil
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

