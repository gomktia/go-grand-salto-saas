'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Calendar,
    Star,
    MessageSquare,
    ChevronRight,
    PlayCircle,
    User,
    Trophy,
    Music,
    Camera,
    Award,
    Zap,
    Sparkles,
    Heart,
    Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/hooks/use-tenant'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AlunoDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-24">
            {/* Boas-vindas Branded */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-amber-500 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" style={{ '--primary': primaryColor } as React.CSSProperties} />
                        <Avatar className="h-20 w-20 lg:h-24 lg:w-24 border-4 border-background relative">
                            <AvatarFallback className="bg-muted font-black text-2xl uppercase" style={{ color: primaryColor }}>V</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-card border-2 border-border rounded-xl flex items-center justify-center shadow-lg">
                            <Star className="w-5 h-5" style={{ color: primaryColor }} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-black rounded-full">
                            Minha Evolução
                        </Badge>
                        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                            Olá, <span style={{ color: primaryColor }}>Valentina!</span>
                        </h1>
                        <p className="text-muted-foreground font-black uppercase text-xs tracking-widest flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> {tenant?.nome} • <span className="text-foreground/60">Baby II</span>
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-card border border-border shadow-sm">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: primaryColor + '10' }}>
                            <Trophy className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Status</p>
                            <p className="text-lg font-black tracking-tighter uppercase">Estagiária</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-card border border-border shadow-sm">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10 shadow-sm">
                            <Flame className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Streak</p>
                            <p className="text-lg font-black tracking-tighter uppercase">5 Dias</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Agenda e Próximas Aulas */}
                <Card className="lg:col-span-2 bg-card border-border shadow-sm rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-border/50 bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-inner">
                                        <Calendar className="w-6 h-6" style={{ color: primaryColor }} />
                                    </div>
                                    Minha Agenda de Aulas
                                </CardTitle>
                                <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2 ml-16">Organização e Disciplina para o Palco</CardDescription>
                            </div>
                            <Button variant="outline" className="h-10 px-6 rounded-xl border-border font-black text-[10px] uppercase tracking-widest hover:bg-muted transition-all">Ver Mês Todo</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-4">
                        {[
                            { time: '14:00', class: 'Plié Baby II', teacher: 'Prof. Marina', status: 'Hoje', difficulty: 'Médio', bg: 'bg-emerald-500/5', color: 'text-emerald-500' },
                            { time: '15:30', class: 'Expressão Corporal', teacher: 'Prof. Carlos', status: 'Quarta-feira', difficulty: 'Fácil', bg: 'bg-violet-500/5', color: 'text-violet-500' },
                        ].map((aula, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2.5rem] bg-muted/20 border-2 border-transparent hover:border-[var(--primary)]/20 transition-all group cursor-pointer relative overflow-hidden">
                                <div className="flex items-center gap-8">
                                    <div className="text-center min-w-[70px] space-y-1">
                                        <p className="text-xl font-black tracking-tighter" style={{ color: primaryColor }}>{aula.time}</p>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{aula.status}</p>
                                    </div>
                                    <div className="h-12 w-px bg-border hidden md:block" />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-lg uppercase tracking-tight">{aula.class}</p>
                                            <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest border-none ${aula.bg} ${aula.color}`}>{aula.difficulty}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold italic">
                                            <Avatar className="w-5 h-5 border border-border">
                                                <AvatarFallback className="text-[8px]">{aula.teacher.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {aula.teacher}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 md:mt-0 flex items-center gap-4">
                                    <Button className="h-12 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all bg-foreground text-background hover:scale-105 active:scale-95 shadow-xl">Confirmar Vaga</Button>
                                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-muted group-hover:translate-x-1 transition-all">
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Estratégia e Status */}
                <div className="space-y-10">
                    <Card className="bg-card border-border shadow-sm rounded-[3rem] overflow-hidden group">
                        <CardHeader className="p-10 pb-6">
                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-muted-foreground">
                                <Award className="w-5 h-5" style={{ color: primaryColor }} />
                                Roadmap de Aperfeiçoamento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-8">
                            {[
                                { label: 'Técnica e Precisão', val: 60, icon: Sparkles, color: primaryColor },
                                { label: 'Musicalidade', val: 85, icon: Music, color: '#f59e0b' },
                                { label: 'Presença de Palco', val: 40, icon: Zap, color: '#8b5cf6' },
                            ].map((skill, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex items-center gap-2">
                                            <skill.icon className="w-3.5 h-3.5" style={{ color: skill.color }} />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{skill.label}</span>
                                        </div>
                                        <span className="text-sm font-black tracking-tighter">{skill.val}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/50">
                                        <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)]" style={{ width: `${skill.val}%`, backgroundColor: skill.color }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-none shadow-2xl rounded-[3rem] overflow-hidden group relative min-h-[350px] flex items-center">
                        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--primary)]" style={{ backgroundColor: primaryColor }} />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30" />
                        <CardContent className="p-10 text-center relative z-10 w-full">
                            <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:rotate-12 transition-all">
                                <Camera className="text-white w-8 h-8" />
                            </div>
                            <h3 className="text-white font-black text-2xl mb-3 tracking-tighter uppercase leading-none">Momento <span style={{ color: primaryColor }}>Estrela</span></h3>
                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-8 leading-relaxed max-w-[180px] mx-auto opacity-70">2 novos registros profissionais no seu feed!</p>
                            <Button className="w-full bg-white text-black hover:bg-neutral-100 font-black h-16 rounded-[1.5rem] tracking-widest uppercase text-xs shadow-2xl hover:scale-105 transition-all outline-none border-none">Visualizar Galeria</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

