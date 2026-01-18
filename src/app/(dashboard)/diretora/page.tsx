'use client'

import React from 'react'
import AdminStats from '@/components/dashboard/admin-stats'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Sparkles, ChevronRight, Zap, Shirt, Camera, FileText, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'

export default function DiretoraDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    return (
        <div className="space-y-12 pb-24">
            {/* Header with Stats (White Label friendly) */}
            <AdminStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-4 lg:px-8 max-w-[1600px] mx-auto">
                {/* Gestão de Figurinos & Operações */}
                <Card className="lg:col-span-2 bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden group">
                    <CardHeader className="p-8 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-white/5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-3 text-neutral-900 dark:text-white">
                                    <Shirt className="w-5 h-5" style={{ color: primaryColor }} />
                                    Ateliê de Figurinos
                                </CardTitle>
                                <CardDescription className="text-xs font-medium text-neutral-500">Monitoramento de Acervo e Medidas</CardDescription>
                            </div>
                            <Link href="/diretora/estoque">
                                <Button variant="outline" className="h-9 px-4 rounded-lg border-neutral-200 dark:border-neutral-700 font-semibold text-xs hover:bg-white dark:hover:bg-neutral-800 transition-all">
                                    Inventário <ChevronRight className="ml-2 w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'Tutu Profissional Cisne Negro', stock: 12, status: 'Processando', priority: 'High', last: 'Há 2 horas' },
                                { name: 'Collant Floral Prime Baby I', stock: 45, status: 'Disponível', priority: 'Normal', last: 'Há 1 dia' },
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 hover:border-[var(--primary)]/20 transition-all group/item cursor-pointer relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <span className="font-semibold text-sm block leading-tight text-neutral-900 dark:text-white">{item.name}</span>
                                            <span className="text-[10px] font-medium text-neutral-500">{item.last}</span>
                                        </div>
                                        <Badge variant="outline" className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${item.status === 'Processando' ? 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' : 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'}`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-200 dark:border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                                            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">{item.stock} unidades</span>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg group-hover/item:bg-[var(--primary)] group-hover/item:text-white transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* IA Content & Marketing Hub */}
                <Card className="bg-neutral-900 border border-neutral-800 shadow-2xl rounded-3xl overflow-hidden group relative flex flex-col">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary)]/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" style={{ '--primary': primaryColor } as React.CSSProperties} />
                    <CardHeader className="p-8 relative z-10">
                        <div className="flex items-center gap-3 mb-1">
                            <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                            <CardTitle className="text-lg font-bold text-white tracking-tight">AI Content Hub</CardTitle>
                        </div>
                        <CardDescription className="text-neutral-400 font-medium text-xs">Automação de Marketing Digital</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6 relative z-10 flex-1 flex flex-col">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4 flex-1 hover:bg-white/10 transition-all group/box">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-violet-500/10 text-violet-300 border-none px-2 py-0.5 text-[10px] font-semibold">Novo Evento</Badge>
                                <span className="text-[10px] text-neutral-500 font-medium uppercase">Recentemente</span>
                            </div>
                            <div className="space-y-3 text-center">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-xl group-hover/box:rotate-6 transition-transform">
                                    <Camera className="w-5 h-5 text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold tracking-tight text-base leading-tight">Espetáculo de Inverno</p>
                                    <p className="text-neutral-500 font-medium text-xs mt-1">"42 novos registros"</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" className="flex-1 h-8 rounded-lg bg-white/5 text-white font-semibold text-[10px] border border-white/5 hover:bg-white/10">Revisar</Button>
                                <Button variant="ghost" className="flex-1 h-8 rounded-lg bg-white/5 text-white font-semibold text-[10px] border border-white/5 hover:bg-white/10">Editar</Button>
                            </div>
                        </div>
                        <Link href="/diretora/galeria">
                            <Button className="w-full h-14 rounded-xl font-bold tracking-wide text-sm shadow-xl transition-all hover:scale-[1.02] border-none text-white flex items-center justify-center gap-2 shadow-[var(--primary)]/20 group/btn" style={{ backgroundColor: primaryColor }}>
                                <Zap className="w-5 h-5 fill-current group-hover/btn:scale-110 transition-transform" />
                                Gerar Posts SEO
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


