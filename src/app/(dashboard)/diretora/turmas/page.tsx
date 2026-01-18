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
    return (
        <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto pb-24 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            Engenharia Acadêmica
                        </Badge>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Gestão de <span style={{ color: primaryColor }}>Turmas</span>
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl">
                        Organize salas, horários e ocupação da <strong className="font-semibold text-neutral-900 dark:text-white">{tenant?.nome}</strong>.
                    </p>
                </div>
                <Button className="h-10 px-6 rounded-xl font-bold text-xs shadow-lg shadow-black/5 border-none transition-all hover:translate-y-px active:translate-y-0.5 text-white" style={{ backgroundColor: primaryColor }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Turma
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <motion.div key={cls.id} whileHover={{ y: -2 }} className="h-full">
                        <Card className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all h-full flex flex-col rounded-3xl overflow-hidden group">
                            <CardHeader className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-white/5">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 shadow-sm group-hover:rotate-3 transition-transform">
                                        <Layers className="w-4 h-4" style={{ color: primaryColor }} />
                                    </div>
                                    <Badge variant="outline" className={`text-[9px] font-semibold uppercase tracking-wide h-6 px-2.5 rounded-full border ${cls.status === 'Full' ? 'border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800/30' : 'border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800/30'
                                        }`}>
                                        {cls.status === 'Full' ? 'Limite Atingido' : 'Vagas Abertas'}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold leading-tight truncate mb-1 text-neutral-900 dark:text-white">{cls.name}</CardTitle>
                                <CardDescription className="text-xs font-medium text-neutral-500 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                    {cls.teacher}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-5 space-y-6 flex-1 flex flex-col">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-medium uppercase text-neutral-400 tracking-wider">Horário</span>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                            <Clock className="w-3.5 h-3.5 text-neutral-400" /> {cls.schedule}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-medium uppercase text-neutral-400 tracking-wider">Local</span>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                            <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {cls.room}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 mt-auto pt-2">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-neutral-500 font-medium">Ocupação da Sala</span>
                                        <span className="font-bold text-neutral-900 dark:text-white">{cls.students} Alunas</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cls.fillRate}%` }}
                                            className="h-full rounded-full transition-all"
                                            style={{ backgroundColor: primaryColor }}
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-2 h-9 rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2">
                                    Gerenciar <ChevronRight className="w-3 h-3" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

