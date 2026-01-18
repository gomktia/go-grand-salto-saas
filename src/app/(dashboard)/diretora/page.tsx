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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 lg:px-10 max-w-[1600px] mx-auto">
                {/* Gestão de Figurinos & Operações */}
                <Card className="lg:col-span-2 bg-card border-border shadow-sm rounded-[3rem] overflow-hidden group">
                    <CardHeader className="p-10 border-b border-border/50 bg-muted/20">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    <Shirt className="w-8 h-8" style={{ color: primaryColor }} />
                                    Ateliê de Figurinos
                                </CardTitle>
                                <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground">Monitoramento de Acervo e Medidas</CardDescription>
                            </div>
                            <Link href="/diretora/estoque">
                                <Button variant="outline" className="h-10 px-6 rounded-xl border-border font-black text-[10px] uppercase tracking-widest hover:bg-muted transition-all">
                                    Inventário <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: 'Tutu Profissional Cisne Negro', stock: 12, status: 'Processando', priority: 'High', last: 'Há 2 horas' },
                                { name: 'Collant Floral Prime Baby I', stock: 45, status: 'Disponível', priority: 'Normal', last: 'Há 1 dia' },
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-[2.5rem] bg-muted/20 border-2 border-transparent hover:border-[var(--primary)]/20 transition-all group/item cursor-pointer relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                            <span className="font-black text-lg uppercase tracking-tight block leading-tight">{item.name}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.last}</span>
                                        </div>
                                        <Badge variant="outline" className={`text-[9px] px-4 py-1.5 rounded-full uppercase font-black tracking-widest border-2 ${item.status === 'Processando' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'}`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                                            <span className="text-xs font-black uppercase tracking-widest">{item.stock} no estoque</span>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl group-hover/item:bg-[var(--primary)] group-hover/item:text-white transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* IA Content & Marketing Hub */}
                <Card className="bg-neutral-900 border-none shadow-2xl rounded-[3rem] overflow-hidden group relative flex flex-col">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary)]/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" style={{ '--primary': primaryColor } as React.CSSProperties} />
                    <CardHeader className="p-10 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-5 h-5" style={{ color: primaryColor }} />
                            <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">AI Content Hub</CardTitle>
                        </div>
                        <CardDescription className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Automação de Marketing Digital</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 pt-0 space-y-8 relative z-10 flex-1 flex flex-col">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 space-y-6 flex-1 hover:bg-white/10 transition-all group/box">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-violet-500/10 text-violet-400 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest">Novo Evento Detectado</Badge>
                                <span className="text-[10px] text-neutral-600 font-black uppercase">Recentemente</span>
                            </div>
                            <div className="space-y-3 text-center">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-2xl group-hover/box:rotate-12 transition-transform">
                                    <Camera className="w-8 h-8 text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-white font-black uppercase tracking-tight text-lg leading-tight">Espetáculo de Inverno 2025</p>
                                    <p className="text-neutral-400 font-medium text-xs mt-2 italic">"42 novos registros capturados"</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" className="flex-1 h-10 rounded-xl bg-white/5 text-white font-black text-[9px] uppercase tracking-widest border border-white/5 hover:bg-white/10">Revisar</Button>
                                <Button variant="ghost" className="flex-1 h-10 rounded-xl bg-white/5 text-white font-black text-[9px] uppercase tracking-widest border border-white/5 hover:bg-white/10">Editar</Button>
                            </div>
                        </div>
                        <Link href="/diretora/galeria">
                            <Button className="w-full h-20 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl transition-all hover:scale-[1.02] border-none text-white flex items-center justify-center gap-3 shadow-[var(--primary)]/30 group/btn" style={{ backgroundColor: primaryColor }}>
                                <Zap className="w-6 h-6 fill-current group-hover/btn:scale-125 transition-transform" />
                                Gerar Posts SEO
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


