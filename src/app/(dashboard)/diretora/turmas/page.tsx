'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    Clock,
    MapPin,
    Plus,
    Calendar,
    Layers,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'

const classes = [
    {
        id: 1,
        name: 'Baby Ballet II',
        teacher: 'Prof. Marina',
        schedule: 'Seg/Qua 14:00',
        students: '12/15',
        status: 'Full',
        room: 'Sala 01',
        fillRate: 80
    },
    {
        id: 2,
        name: 'Jazz Juvenil A',
        teacher: 'Prof. Ricardo',
        schedule: 'Ter/Qui 16:30',
        students: '8/12',
        status: 'Available',
        room: 'Sala Principal',
        fillRate: 66
    },
    {
        id: 3,
        name: 'Contemporâneo Adulto',
        teacher: 'Prof. Cláudia',
        schedule: 'Sex 19:00',
        students: '6/10',
        status: 'Available',
        room: 'Sala 02',
        fillRate: 60
    },
]

export default function TurmasPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Engenharia Acadêmica
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Gestão de <span style={{ color: primaryColor }}>Turmas</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm lg:text-lg">Organize salas, horários e ocupação da <strong className="text-foreground">{tenant?.nome}</strong>.</p>
                </div>
                <Button className="h-16 px-10 rounded-2xl font-black uppercase tracking-tighter text-lg shadow-2xl shadow-[var(--primary)]/30 border-none transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: primaryColor }}>
                    <Plus className="w-5 h-5 mr-1" />
                    Nova Turma
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {classes.map((cls) => (
                    <motion.div key={cls.id} whileHover={{ y: -8 }} className="h-full">
                        <Card className="bg-card border-border shadow-sm overflow-hidden group hover:border-[var(--primary)]/30 transition-all h-full flex flex-col rounded-[2.5rem] relative">
                            <CardHeader className="p-8 pb-4 border-b border-border/50 bg-muted/20">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="p-4 rounded-2xl bg-card border border-border shadow-sm group-hover:rotate-6 transition-transform">
                                        <Layers className="w-6 h-6" style={{ color: primaryColor }} />
                                    </div>
                                    <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-full ${cls.status === 'Full' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                                        }`}>
                                        {cls.status === 'Full' ? 'Limite Atingido' : 'Vagas Abertas'}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-black uppercase tracking-tight truncate mb-1">{cls.name}</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: primaryColor }}>{cls.teacher}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-6 space-y-6 flex-1 flex flex-col">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Horário</span>
                                        <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
                                            <Clock className="w-4 h-4 opacity-50" /> {cls.schedule}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Local</span>
                                        <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
                                            <MapPin className="w-4 h-4 opacity-50" /> {cls.room}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 mt-auto">
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-muted-foreground font-black uppercase tracking-widest">Ocupação da Sala</span>
                                        <span className="font-black text-foreground">{cls.students} Alunas</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cls.fillRate}%` }}
                                            className="h-full rounded-full transition-all shadow-lg"
                                            style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}40` }}
                                        />
                                    </div>
                                </div>
                                <Button className="w-full mt-4 h-14 rounded-2xl border-2 border-border bg-card text-foreground group-hover:bg-muted group-hover:border-[var(--primary)]/30 font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
                                    Configurações da Turma <ChevronRight className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

