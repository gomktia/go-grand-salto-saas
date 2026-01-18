'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    Calendar,
    Clock,
    CheckCircle2,
    Star,
    FileText,
    TrendingUp,
    MessageSquare,
    AlertTriangle,
    Music4,
    Zap,
    Plus,
    Check,
    Camera,
    Sparkles,
    ChevronRight,
    Trophy
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTenant } from '@/hooks/use-tenant'

const studentsInClass = [
    { id: 1, name: 'Valentina Silva', age: '6 anos', progress: 85, attendance: '100%', status: 'Presente' },
    { id: 2, name: 'Heloísa Oliveira', age: '5 anos', progress: 72, attendance: '92%', status: 'Pendente' },
    { id: 3, name: 'Alice Santos', age: '6 anos', progress: 91, attendance: '100%', status: 'Presente' },
    { id: 4, name: 'Julia Costa', age: '5 anos', progress: 65, attendance: '85%', status: 'Ausente' },
]

export default function ProfessorDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [activeTab, setActiveTab] = useState('diario')

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-24">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div
                        className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2.5rem] flex items-center justify-center font-black text-4xl text-white shadow-2xl transition-transform hover:rotate-6 border-4 border-white/20"
                        style={{ backgroundColor: primaryColor }}
                    >
                        M
                    </div>
                    <div className="space-y-1">
                        <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                            Excelência Docente
                        </Badge>
                        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">Olá, <span style={{ color: primaryColor }}>Prof. Marina!</span></h1>
                        <p className="text-muted-foreground font-bold text-sm lg:text-lg">Você possui <strong className="text-foreground">2 aulas</strong> magnéticas hoje no <strong className="text-foreground">{tenant?.nome}</strong>.</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 border-border font-black uppercase tracking-widest text-[10px] bg-card hover:bg-muted transition-all">
                        <Calendar className="w-5 h-5 mr-3" style={{ color: primaryColor }} />
                        Minha Agenda
                    </Button>
                    <Button className="h-16 px-12 rounded-2xl font-black uppercase tracking-tighter text-lg shadow-2xl shadow-[var(--primary)]/30 border-none transition-all hover:scale-105 active:scale-95 text-white" style={{ backgroundColor: primaryColor }}>
                        <Zap className="w-6 h-6 mr-2" />
                        Chamada Digital
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Progress and Class Management */}
                <div className="lg:col-span-2 space-y-10">
                    <Tabs defaultValue="diario" className="w-full space-y-10" onValueChange={setActiveTab}>
                        <TabsList className="bg-card border-2 border-border p-2 rounded-[2rem] h-20 w-full justify-start gap-2 shadow-sm">
                            {[
                                { value: 'diario', label: 'Diário de Classe', icon: CheckCircle2 },
                                { value: 'alunos', label: 'Evolução Técnica', icon: TrendingUp },
                                { value: 'pedagogico', label: 'Planos de Aula', icon: FileText },
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="flex-1 lg:flex-none rounded-2xl px-10 h-full data-[state=active]:bg-foreground data-[state=active]:text-background font-black uppercase text-[10px] tracking-widest transition-all gap-3"
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="diario" className="mt-0 focus-visible:outline-none">
                            <Card className="bg-card border-border shadow-sm rounded-[3rem] overflow-hidden">
                                <CardHeader className="p-12 border-b border-border/50 bg-muted/20">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-1">
                                            <CardTitle className="text-3xl font-black uppercase tracking-tighter">Chamada: Baby Ballet II</CardTitle>
                                            <CardDescription className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Sala Principal • Início: 14:00 • Nível Iniciante</CardDescription>
                                        </div>
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20 px-6 py-2.5 font-black text-[10px] uppercase tracking-widest rounded-full animate-pulse shadow-sm">
                                            Aula em Andamento
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-12 space-y-6">
                                    <div className="space-y-4">
                                        {studentsInClass.map((student) => (
                                            <div key={student.id} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-muted/20 border-2 border-transparent hover:border-[var(--primary)]/20 transition-all group cursor-pointer">
                                                <div className="flex items-center gap-6">
                                                    <Avatar className="h-16 w-16 border-2 border-border shadow-inner">
                                                        <AvatarFallback className="bg-card font-black text-lg uppercase" style={{ color: primaryColor }}>{student.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <div className="font-black text-lg uppercase tracking-tight">{student.name}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black flex items-center gap-3">
                                                            <span>{student.age}</span>
                                                            <span className="w-1 h-1 rounded-full bg-border" />
                                                            <span className="text-[var(--primary)]">{student.attendance} Frequência</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Button variant="outline" className={`h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${student.status === 'Presente' ? 'bg-emerald-500 text-white border-none shadow-xl shadow-emerald-500/30' : 'hover:border-[var(--primary)] hover:bg-[var(--primary)]/5'}`}>
                                                        {student.status === 'Presente' ? 'Confirmado' : 'Marcar Presença'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button className="w-full mt-12 h-20 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl transition-all hover:scale-[1.02] border-none" style={{ backgroundColor: primaryColor }}>
                                        Consolidar Diário e Notificar Pais
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Communications and Insights */}
                <div className="space-y-10">
                    <Card className="bg-card border-border shadow-sm rounded-[3rem] overflow-hidden group">
                        <CardHeader className="p-10 pb-6">
                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-muted-foreground">
                                <MessageSquare className="w-5 h-5" style={{ color: primaryColor }} />
                                Central de Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-6">
                            <div className="p-8 rounded-[2.5rem] bg-[var(--primary)]/5 border-2 border-[var(--primary)]/10 space-y-4 hover:bg-[var(--primary)]/10 transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <Badge className="bg-[var(--primary)] text-white font-black text-[8px] px-3">URGENTE</Badge>
                                    <span className="text-[10px] font-black text-muted-foreground opacity-40">DIREÇÃO</span>
                                </div>
                                <p className="text-[13px] leading-relaxed font-black uppercase tracking-tight text-foreground">
                                    "Marina, o repertório do festival de inverno precisa ser fechado até sexta."
                                </p>
                                <Button variant="ghost" className="w-full h-11 rounded-2xl bg-foreground text-background font-black uppercase text-[10px] tracking-widest hover:bg-neutral-800">Responder Digitalmente</Button>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-muted/30 border-2 border-border space-y-2 group/msg hover:border-[var(--primary)]/30 transition-all cursor-pointer">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Novidade</span>
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-tight">Nova avaliação técnica liberada para a turma Baby II.</p>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-20 group-hover/msg:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-none shadow-2xl rounded-[3rem] overflow-hidden group relative min-h-[400px] flex items-center">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                        <CardContent className="p-12 text-center relative z-10 w-full">
                            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:rotate-12 transition-all border border-white/20 shadow-2xl">
                                <Camera className="text-white w-10 h-10" />
                            </div>
                            <h3 className="text-white font-black text-3xl mb-4 tracking-tighter uppercase leading-none">Momento <span style={{ color: primaryColor }}>Mágico</span></h3>
                            <p className="text-xs text-neutral-400 font-black uppercase tracking-widest mb-10 leading-relaxed max-w-[200px] mx-auto opacity-70">Capture e envie fotos profissionais direto para o portal dos pais.</p>
                            <Button className="w-full bg-white text-black hover:bg-neutral-100 font-black h-16 rounded-[1.5rem] tracking-widest uppercase text-xs shadow-2xl hover:scale-105 transition-all outline-none border-none">Ativar Lente de Captura</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
