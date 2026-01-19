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
    const primaryColor = tenant?.primaryColor || '#e11d48'

    return (
        <div className="space-y-8">
            {/* Header with Stats */}
            <AdminStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gestao de Figurinos */}
                <Card className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-neutral-900 dark:text-white">
                                    <Shirt className="w-5 h-5" style={{ color: primaryColor }} />
                                    Atelie de Figurinos
                                </CardTitle>
                                <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Monitoramento de Acervo e Medidas
                                </CardDescription>
                            </div>
                            <Link href="/diretora/estoque">
                                <Button variant="outline" className="h-9 px-4 rounded-lg
                                    border-neutral-300 dark:border-neutral-600
                                    text-neutral-700 dark:text-neutral-200
                                    hover:bg-neutral-100 dark:hover:bg-neutral-700
                                    font-medium text-sm">
                                    Inventario <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'Tutu Profissional Cisne Negro', stock: 12, status: 'Processando', last: 'Ha 2 horas' },
                                { name: 'Collant Floral Prime Baby I', stock: 45, status: 'Disponivel', last: 'Ha 1 dia' },
                            ].map((item, i) => (
                                <div key={i} className="p-5 rounded-xl
                                    bg-neutral-50 dark:bg-neutral-800/50
                                    border border-neutral-200 dark:border-neutral-700
                                    hover:border-pink-300 dark:hover:border-pink-500/30
                                    transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-1">
                                            <span className="font-semibold text-sm text-neutral-900 dark:text-white block">
                                                {item.name}
                                            </span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {item.last}
                                            </span>
                                        </div>
                                        <Badge className={`text-xs px-2.5 py-1 rounded-full font-medium
                                            ${item.status === 'Processando'
                                                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                                                : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                            }`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                {item.stock} unidades
                                            </span>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg
                                            text-neutral-500 dark:text-neutral-400
                                            hover:bg-neutral-200 dark:hover:bg-neutral-700
                                            group-hover:text-pink-500">
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* IA Content Hub */}
                <Card className="bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 shadow-xl rounded-2xl overflow-hidden relative flex flex-col">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="p-6 relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
                            <CardTitle className="text-lg font-bold text-white">AI Content Hub</CardTitle>
                        </div>
                        <CardDescription className="text-neutral-400 text-sm">
                            Automacao de Marketing Digital
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-5 relative z-10 flex-1 flex flex-col">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-5 space-y-4 flex-1 hover:bg-white/15 transition-all">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 text-xs font-medium">
                                    Novo Evento
                                </Badge>
                                <span className="text-xs text-neutral-400 font-medium">Recentemente</span>
                            </div>
                            <div className="space-y-3 text-center py-2">
                                <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-base">Espetaculo de Inverno</p>
                                    <p className="text-neutral-400 text-sm mt-1">42 novos registros</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" className="flex-1 h-9 rounded-lg bg-white/10 text-white font-medium text-sm border border-white/10 hover:bg-white/20">
                                    Revisar
                                </Button>
                                <Button variant="ghost" className="flex-1 h-9 rounded-lg bg-white/10 text-white font-medium text-sm border border-white/10 hover:bg-white/20">
                                    Editar
                                </Button>
                            </div>
                        </div>
                        <Link href="/diretora/galeria">
                            <Button className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: primaryColor }}>
                                <Zap className="w-5 h-5" />
                                Gerar Posts SEO
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
