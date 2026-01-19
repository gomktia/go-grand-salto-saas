'use client'

import React from 'react'
import AdminStats from '@/components/dashboard/admin-stats'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Sparkles, ChevronRight, Zap, Shirt, Camera, FileText, Globe, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'

export default function DiretoraDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#f43f5e'

    return (
        <div className="space-y-6 lg:space-y-8 max-w-[1600px] mx-auto pb-12">
            {/* Header with Stats */}
            <AdminStats />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Gestao de Figurinos */}
                <Card className="xl:col-span-2 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden flex flex-col">
                    <CardHeader className="p-6 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-800/20 shrink-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-white uppercase tracking-tight">
                                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                        <Shirt className="w-5 h-5 text-rose-500" />
                                    </div>
                                    Ateliê de Figurinos
                                </CardTitle>
                                <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                    Monitoramento estratégico de acervo e medidas artísticas.
                                </CardDescription>
                            </div>
                            <Link href="/diretora/estoque">
                                <Button variant="outline" className="h-11 px-6 rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 font-bold text-xs uppercase tracking-widest transition-all">
                                    Ver Inventário <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'Tutu Profissional Cisne Negro', stock: 12, status: 'Processando', last: 'Há 2 horas', type: 'Premium' },
                                { name: 'Collant Floral Prime Baby I', stock: 45, status: 'Disponível', last: 'Há 1 dia', type: 'Estoque' },
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-[2rem] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 hover:border-rose-500/30 transition-all cursor-pointer group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="space-y-1">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.2em] border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 mb-2">
                                                {item.type}
                                            </Badge>
                                            <span className="font-black text-base text-zinc-900 dark:text-zinc-100 block group-hover:text-rose-500 transition-colors">
                                                {item.name}
                                            </span>
                                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" /> Atualizado {item.last}
                                            </span>
                                        </div>
                                        <Badge className={`text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-widest border
                                            ${item.status === 'Processando'
                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between pt-5 border-t border-zinc-200/50 dark:border-zinc-700/50 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.4)]" style={{ backgroundColor: primaryColor }} />
                                            <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                                                {item.stock} <span className="text-zinc-400 dark:text-zinc-600 font-medium lowercase">unidades</span>
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all shadow-sm">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-3xl rounded-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* IA Content Hub */}
                <Card className="bg-zinc-950 text-white border-none shadow-2xl rounded-2xl overflow-hidden relative flex flex-col group transition-all">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <CardHeader className="p-10 relative z-10 shrink-0">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
                                <Sparkles className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black tracking-tight uppercase leading-none">Content Hub</CardTitle>
                                <CardDescription className="text-rose-400/80 text-xs font-black uppercase tracking-[0.2em] mt-1">
                                    Inteligência Criativa
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-10 pt-0 space-y-6 relative z-10 flex-1 flex flex-col">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 space-y-6 flex-1 flex flex-col justify-center hover:bg-white/10 transition-all group/inner border-dashed">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-rose-500 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20">
                                    LIVE EVENT
                                </Badge>
                                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic animate-pulse">Detecting content...</span>
                            </div>

                            <div className="space-y-4 text-center py-4">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-violet-600 p-0.5 mx-auto group-hover/inner:scale-110 transition-transform">
                                    <div className="w-full h-full bg-zinc-900 rounded-[1.4rem] flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white font-black text-lg tracking-tight uppercase">Espetáculo de Inverno</p>
                                    <p className="text-rose-400/80 text-[10px] font-black uppercase tracking-[0.2em]">42 novos registros detectados</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="ghost" className="h-11 rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                                    Revisar
                                </Button>
                                <Button variant="ghost" className="h-11 rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                                    Aprovar
                                </Button>
                            </div>
                        </div>

                        <Link href="/diretora/galeria" className="shrink-0">
                            <Button className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-rose-500/20 border-none group/btn"
                                style={{ backgroundColor: primaryColor }}>
                                <Zap className="w-5 h-5 fill-current group-hover:animate-pulse" />
                                Gerar Posts SEO
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
