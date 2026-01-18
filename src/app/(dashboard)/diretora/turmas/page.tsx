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
        <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full mb-2">
                        Engenharia Acadêmica
                    </Badge>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Gestão de <span style={{ color: primaryColor }}>Turmas</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">Organize salas, horários e ocupação da <strong className="text-foreground">{tenant?.nome}</strong>.</p>
                </div>
                <Button className="h-10 px-6 rounded-xl font-bold text-xs shadow-lg shadow-[var(--primary)]/20 border-none transition-all hover:scale-105 active:scale-95 text-white" style={{ backgroundColor: primaryColor }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Turma
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <motion.div key={cls.id} whileHover={{ y: -4 }} className="h-full">
                        <Card className="bg-card border-border shadow-sm overflow-hidden group hover:border-[var(--primary)]/30 transition-all h-full flex flex-col rounded-3xl relative">
                            <CardHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="p-3 rounded-xl bg-card border border-border shadow-sm group-hover:rotate-6 transition-transform">
                                        <Layers className="w-5 h-5" style={{ color: primaryColor }} />
                                    </div>
                                    <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-wider h-6 px-2.5 rounded-full ${cls.status === 'Full' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                                        }`}>
                                        {cls.status === 'Full' ? 'Limite Atingido' : 'Vagas Abertas'}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold leading-tight truncate mb-1">{cls.name}</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-wider opacity-80" style={{ color: primaryColor }}>{cls.teacher}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-5 space-y-5 flex-1 flex flex-col">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Horário</span>
                                        <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                                            <Clock className="w-3.5 h-3.5 opacity-50" /> {cls.schedule}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Local</span>
                                        <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                                            <MapPin className="w-3.5 h-3.5 opacity-50" /> {cls.room}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-auto">
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-muted-foreground font-bold uppercase tracking-wider">Ocupação da Sala</span>
                                        <span className="font-bold text-foreground">{cls.students} Alunas</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cls.fillRate}%` }}
                                            className="h-full rounded-full transition-all shadow-sm"
                                            style={{ backgroundColor: primaryColor }}
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-4 h-10 rounded-xl border border-border bg-card text-foreground hover:bg-muted hover:text-foreground font-bold uppercase tracking-wide text-[10px] transition-all flex items-center justify-center gap-2">
                                    Configurações <ChevronRight className="w-3.5 h-3.5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

