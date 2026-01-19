'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Plus,
    Search,
    Filter,
    QrCode,
    MoreVertical,
    AlertTriangle,
    ChevronDown,
    Ruler,
    Clock,
    Shirt
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTenant } from '@/hooks/use-tenant'

const costumeInventory = [
    {
        id: 1,
        name: 'Tutu Prato Cisne Negro',
        size: 'M',
        status: 'Limpo',
        renter: null,
        metrics: { busto: 72, cintura: 62, quadril: 80 }
    },
    {
        id: 2,
        name: 'Vestido Camponesa (Giselle)',
        size: 'P',
        status: 'Locado',
        renter: 'Valentina Rossi',
        metrics: { busto: 65, cintura: 58, quadril: 72 }
    },
    {
        id: 3,
        name: 'Figurino Fada Lilás',
        size: 'M',
        status: 'Lavanderia',
        renter: null,
        metrics: { busto: 74, cintura: 64, quadril: 82 }
    },
]

export default function FigurinosPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#db2777'

    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-neutral-900 dark:text-white flex items-center gap-3">
                        <Shirt className="w-8 h-8 text-pink-600" />
                        Acervo de Figurinos
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">Gestão inteligente de estoque com suporte a medidas para o <strong>{tenant?.nome}</strong>.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-neutral-200 dark:border-neutral-800 gap-2 font-bold uppercase text-[10px] tracking-widest glass">
                        <Ruler className="w-4 h-4" />
                        Tabela de Medidas
                    </Button>
                    <Button
                        style={{ backgroundColor: primaryColor }}
                        className="h-14 px-8 rounded-2xl text-white gap-2 font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-pink-500/20 hover:opacity-90 transition-all hover:scale-105"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Figurino
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {costumeInventory.map((item) => (
                    <Card key={item.id} className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-pink-500/30 transition-all group overflow-hidden rounded-[2.5rem] shadow-sm glass">
                        <div className="h-64 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 relative flex items-center justify-center pt-8">
                            <Shirt className="w-24 h-24 text-neutral-400 dark:text-neutral-700 group-hover:scale-110 group-hover:text-pink-500/50 transition-all duration-700" />
                            <Badge
                                className={`absolute top-6 right-6 px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-widest border-none
                                    ${item.status === 'Limpo' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                        item.status === 'Locado' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                            'bg-amber-500/10 text-amber-600'
                                    }`}
                            >
                                {item.status}
                            </Badge>
                        </div>
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start gap-4">
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white leading-tight">{item.name}</CardTitle>
                                <Badge variant="secondary" className="bg-neutral-100 dark:bg-white/5 text-[10px] font-black px-3 py-1 rounded-lg border-none">
                                    {item.size}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="space-y-8">
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Busto', value: item.metrics.busto },
                                        { label: 'Cintura', value: item.metrics.cintura },
                                        { label: 'Quadril', value: item.metrics.quadril },
                                    ].map((m) => (
                                        <div key={m.label} className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-100 dark:border-white/5 text-center">
                                            <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{m.label}</div>
                                            <div className="text-lg font-black font-mono tracking-tighter text-neutral-900 dark:text-white">{m.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {item.renter && (
                                    <div className="flex items-center justify-between p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-blue-500/70">Em posse de</div>
                                                <div className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-tight">{item.renter}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button variant="ghost" className="flex-1 text-[10px] font-black uppercase tracking-[0.2em] h-12 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all">
                                        Histórico
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-neutral-50 dark:bg-white/5 hover:bg-pink-500 hover:text-white transition-all transition-colors outline-none border-none">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
