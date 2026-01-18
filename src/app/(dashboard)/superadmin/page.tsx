'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Globe,
    Shield,
    Activity,
    Database,
    Server,
    Zap,
    TrendingUp,
    Users,
    ChevronRight,
    Search
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function SuperAdminDashboard() {
    return (
        <div className="p-4 lg:p-10 space-y-10 pb-24 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-neutral-900 p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Zap size={140} />
                </div>
                <div className="relative z-10 space-y-3">
                    <Badge className="bg-violet-600 text-white border-none px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px] rounded-full">
                        MODO ROOT: SISTEMA GLOBAL
                    </Badge>
                    <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        Painel <span className="text-violet-500">Grand Salto</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm lg:text-lg">Monitoramento de infraestrutura e performance de todos os tenants.</p>
                </div>
                <div className="flex gap-3 relative z-10">
                    <Button variant="outline" className="h-14 border-white/10 bg-white/5 text-white hover:bg-white/10 px-8 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                        Logs do Sistema
                    </Button>
                    <Button className="h-14 bg-violet-600 hover:bg-violet-500 text-white px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-violet-600/20">
                        Configurações Globais
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Escolas Ativas', value: '42', icon: Globe, color: 'text-blue-500', trend: '+3 este mês' },
                    { label: 'MRR Global', value: 'R$ 12.800', icon: TrendingUp, color: 'text-emerald-500', trend: '+12% Crescimento' },
                    { label: 'Status DB', value: '100% Online', icon: Database, color: 'text-violet-500', trend: 'Latência: 24ms' },
                    { label: 'Cloud Storage', value: '4GB / 100GB', icon: Server, color: 'text-orange-500', trend: 'Uso: 4.2%' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-neutral-900 border-white/5 shadow-xl rounded-[2rem] hover:border-white/10 transition-all group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center justify-between">
                                {stat.label}
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                            <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{stat.trend}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-neutral-900 border-white/5 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">Últimas Escolas Onboarded</CardTitle>
                            <CardDescription className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-1">Gerenciamento de Instâncias</CardDescription>
                        </div>
                        <Button variant="ghost" className="text-neutral-400 hover:text-white uppercase font-black text-[10px] tracking-widest">
                            Ver Todas <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {[
                            { name: 'Espaço Revelle', slug: 'espaco-revelle', status: 'Ativo', plan: 'Premium' },
                            { name: 'Studio Dance Art', slug: 'studio-dance', status: 'Ativo', plan: 'Enterprise' },
                            { name: 'Ballet Municipal', slug: 'ballet-mun', status: 'Setup', plan: 'Basic' },
                        ].map((tenant, i) => (
                            <div key={i} className="p-8 flex items-center justify-between hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white uppercase text-xs">
                                        {tenant.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="font-black text-white uppercase tracking-tight">{tenant.name}</div>
                                        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{tenant.slug}.grandsalto.ia</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <Badge className="bg-neutral-800 text-neutral-300 border-none uppercase text-[9px] font-black tracking-widest px-3 py-1">{tenant.plan}</Badge>
                                    <Badge className={tenant.status === 'Ativo' ? "bg-emerald-500/10 text-emerald-500 border-none uppercase text-[9px] font-black tracking-widest px-3 py-1" : "bg-orange-500/10 text-orange-500 border-none uppercase text-[9px] font-black tracking-widest px-3 py-1"}>
                                        {tenant.status}
                                    </Badge>
                                    <Button size="icon" variant="ghost" className="text-neutral-600 hover:text-white">
                                        <ChevronRight className="w-5 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

