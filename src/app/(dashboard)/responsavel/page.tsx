'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Heart, CreditCard, Bell, Calendar, Clock, MapPin, Star, Sparkles, ChevronRight, Camera, Download, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ResponsavelDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    return (
        <div className="p-4 lg:p-10 space-y-10 pb-24 max-w-7xl mx-auto">
            {/* Header com Contexto Familiar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2.5rem] bg-card border-2 border-border flex items-center justify-center shadow-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent" style={{ '--primary': primaryColor } as React.CSSProperties} />
                        <Heart className="w-10 h-10 transition-transform group-hover:scale-110" style={{ color: primaryColor }} fill={primaryColor} />
                    </div>
                    <div className="space-y-1">
                        <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                            Experiência da Família
                        </Badge>
                        <h1 className="text-3xl lg:text-6xl font-black text-foreground tracking-tighter uppercase leading-none">
                            Área dos <span style={{ color: primaryColor }}>Responsáveis</span>
                        </h1>
                        <p className="text-muted-foreground font-black uppercase text-xs tracking-widest flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Bem-vindo ao <strong className="text-foreground">{tenant?.nome}</strong>
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 border-border font-black uppercase tracking-widest text-[10px] bg-card hover:bg-muted transition-all">
                        <Bell className="w-5 h-5 mr-3" style={{ color: primaryColor }} />
                        Notificações
                    </Button>
                    <Button className="h-16 px-10 rounded-2xl font-black uppercase tracking-tighter text-lg shadow-2xl shadow-[var(--primary)]/30 border-none transition-all hover:scale-105 active:scale-95 text-white" style={{ backgroundColor: primaryColor }}>
                        <Camera className="w-6 h-6 mr-2" />
                        Galeria do Recital
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Coluna Principal: Alunos Vinculados e Agenda */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Aluno em Destaque */}
                    <Card className="bg-card border-border overflow-hidden rounded-[3rem] shadow-sm relative group border-2 border-transparent hover:border-border transition-all">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            <Sparkles size={240} />
                        </div>
                        <CardHeader className="p-12 pb-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-background shadow-xl ring-4 ring-[var(--primary)]/10" style={{ '--primary': primaryColor } as React.CSSProperties}>
                                        <AvatarFallback className="bg-muted font-black text-xl" style={{ color: primaryColor }}>V</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">Valentina Silva</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nível Baby II • Turma B</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20 uppercase text-[10px] font-black tracking-widest px-6 py-2 rounded-full shadow-sm">Ativa no Portal</Badge>
                            </div>
                            <CardTitle className="text-4xl font-black uppercase tracking-tighter">Próxima Aula</CardTitle>
                        </CardHeader>
                        <CardContent className="px-12 pb-12">
                            <div className="flex flex-col md:flex-row items-stretch gap-6">
                                <div className="flex-1 flex items-center gap-8 p-10 bg-muted/20 rounded-[2.5rem] border-2 border-border/50 group/item hover:border-[var(--primary)]/20 transition-all">
                                    <div className="p-8 rounded-[2rem] text-white shadow-2xl transition-all group-hover/item:scale-110 flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor, boxShadow: `0 25px 30px -10px ${primaryColor}60` }}>
                                        <Clock size={42} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-3xl font-black uppercase tracking-tighter">14:00</div>
                                        <div className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] flex flex-wrap gap-4">
                                            <span className="flex items-center gap-2"><Calendar size={14} className="text-foreground/40" /> Hoje</span>
                                            <span className="flex items-center gap-2"><MapPin size={14} className="text-foreground/40" /> Sala Principal</span>
                                        </div>
                                    </div>
                                </div>
                                <Button className="h-auto md:w-48 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] border-2 border-border bg-card text-foreground hover:bg-muted transition-all flex flex-col items-center justify-center gap-3 p-8 group/btn">
                                    <Calendar className="w-8 h-8 opacity-40 group-hover/btn:text-[var(--primary)] group-hover/btn:opacity-100 transition-all" />
                                    Ver Agenda
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-sm rounded-[3rem] overflow-hidden group">
                        <CardHeader className="p-10 border-b border-border/50 bg-muted/10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-4 font-black text-2xl uppercase tracking-tighter">
                                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-inner">
                                        <Heart className="w-6 h-6 fill-current" style={{ color: primaryColor }} />
                                    </div>
                                    Favoritos do Palco
                                </CardTitle>
                                <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest group-hover:text-[var(--primary)] transition-all">Ver Galeria Completa <ChevronRight className="w-4 h-4 ml-2" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                                        className="aspect-[4/5] bg-muted/50 rounded-[2.5rem] border-2 border-border overflow-hidden relative group/photo cursor-pointer"
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover/photo:opacity-100 transition-all flex flex-col justify-end p-8 gap-4">
                                            <p className="text-white font-black text-[10px] uppercase tracking-widest">Ensaio de Primavera</p>
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="ghost" className="text-white hover:bg-[var(--primary)] h-12 w-12 p-0 bg-white/10 backdrop-blur-md rounded-2xl transition-all border border-white/10">
                                                    <Download size={20} />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-white hover:bg-pink-500 h-12 w-12 p-0 bg-white/10 backdrop-blur-md rounded-2xl transition-all border border-white/10">
                                                    <Heart size={20} className="fill-current" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Sidebar Financeira */}
                <div className="space-y-10">
                    <Card className="bg-card border-border shadow-2xl rounded-[3rem] overflow-hidden relative group">
                        <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: primaryColor }} />
                        <CardHeader className="p-10">
                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-muted-foreground">
                                <Wallet className="w-5 h-5" style={{ color: primaryColor }} />
                                Financeiro & Mensalidade
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-10">
                            <div className="p-10 bg-muted/20 rounded-[2.5rem] border-2 border-border relative overflow-hidden">
                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status Atual</span>
                                        <Badge className="bg-emerald-500 text-white border-none py-2 px-6 font-black uppercase text-[10px] tracking-widest rounded-full shadow-lg shadow-emerald-500/20">Pago</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Mensalidade Jan/24</span>
                                        <div className="text-5xl font-black tracking-tighter leading-none">R$ 280<span className="text-xl opacity-30">,00</span></div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />
                            </div>
                            <Button className="w-full h-20 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl transition-all hover:scale-[1.02] border-none text-white focus:outline-none" style={{ backgroundColor: primaryColor }}>
                                Gerar Carnê Integrado
                            </Button>
                            <p className="text-[10px] text-center font-black uppercase tracking-widest text-muted-foreground opacity-40">Próximo vencimento em 10 de Fevereiro</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/10 border-border rounded-[3rem] p-12 border-dashed border-2 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shadow-sm ring-1 ring-violet-500/20">
                                <Bell size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-lg uppercase tracking-tighter leading-none">Mural de Avisos</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Sempre atualizado</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="p-8 bg-card border-2 border-border rounded-[2rem] relative overflow-hidden group/notice hover:border-violet-500/30 transition-all cursor-pointer">
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-violet-500/10 text-violet-600 font-black text-[8px] px-3 uppercase border-none">Evento</Badge>
                                    <span className="text-[9px] font-black text-muted-foreground opacity-40 uppercase">Secretaria</span>
                                </div>
                                <p className="font-black uppercase tracking-tight text-sm mb-2 group-hover/notice:text-violet-500 transition-colors">Recital de Páscoa: Aula Aberta</p>
                                <p className="text-muted-foreground font-bold text-[11px] leading-relaxed italic opacity-80">"Preparem as sapatilhas rosas, teremos uma aula especial inesquecível!"</p>
                                <ChevronRight className="w-4 h-4 ml-auto mt-4 opacity-20 group-hover/notice:translate-x-1 group-hover/notice:opacity-100 transition-all text-violet-500" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}


