'use client'

import React, { useState } from 'react'
import {
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Calendar,
    Download,
    FileText,
    Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SuperAdminFinanceiroPage() {
    return (
        <div className="p-4 lg:p-10 space-y-8 pb-24 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                        Financeiro Global
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm lg:text-lg mt-2">
                        Gestao de receita, faturas e repasses
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select defaultValue="mes_atual">
                        <SelectTrigger className="w-40 h-12 bg-white/5 border-white/10 text-white rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-white/10">
                            <SelectItem value="mes_atual">Este Mes</SelectItem>
                            <SelectItem value="ultimo_mes">Ultimo Mes</SelectItem>
                            <SelectItem value="ultimo_trimestre">Ultimo Trimestre</SelectItem>
                            <SelectItem value="ano_atual">Este Ano</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="h-12 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-violet-600/20">
                        <Download className="w-4 h-4 mr-2" />
                        Relatorio
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-neutral-900 border-white/5 rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center justify-between">
                            MRR Global
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="text-3xl font-black text-white tracking-tighter">R$ 45.280</div>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-1.5 py-0.5 text-[10px] font-bold">
                                +12%
                            </Badge>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">vs mes anterior</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900 border-white/5 rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center justify-between">
                            Faturamento Total
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="text-3xl font-black text-white tracking-tighter">R$ 52.140</div>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-1.5 py-0.5 text-[10px] font-bold">
                                +8%
                            </Badge>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">vs mes anterior</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900 border-white/5 rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center justify-between">
                            Inadimplencia
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="text-3xl font-black text-white tracking-tighter">2.4%</div>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-1.5 py-0.5 text-[10px] font-bold">
                                -0.5%
                            </Badge>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">vs mes anterior</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900 border-white/5 rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center justify-between">
                            Ticket Medio
                            <CreditCard className="w-4 h-4 text-violet-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="text-3xl font-black text-white tracking-tighter">R$ 389</div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Estavel</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="transacoes" className="space-y-6">
                <TabsList className="bg-neutral-900 border border-white/5 p-1.5 rounded-2xl h-14 w-full md:w-auto overflow-x-auto">
                    <TabsTrigger value="transacoes" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest min-w-[120px]">
                        Transacoes
                    </TabsTrigger>
                    <TabsTrigger value="faturas" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest min-w-[120px]">
                        Faturas SaaS
                    </TabsTrigger>
                    <TabsTrigger value="repasses" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest min-w-[120px]">
                        Repasses (Split)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="transacoes">
                    <Card className="bg-neutral-900 border-white/5 rounded-3xl overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/5">
                            <CardTitle className="text-white font-black uppercase tracking-tight">Ultimas Transacoes Globais</CardTitle>
                            <CardDescription className="text-neutral-500 uppercase text-[10px] font-bold tracking-widest">
                                Historico de pagamentos processados em todos os tenants
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">Mensalidade #8392</div>
                                                <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Studio Danca Vida • Ha 2 min</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-white text-sm">R$ 250,00</div>
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none uppercase text-[8px] font-black tracking-widest px-2">
                                                Aprovado
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
