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
import { toast } from 'sonner'

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
        <div className="space-y-6 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Gestão de Acervo e Medidas Artísticas
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Ateliê de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Figurinos</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => toast.info('A tabela de medidas será liberada na próxima atualização.')}
                        variant="outline"
                        className="h-10 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-bold"
                    >
                        <Ruler className="w-3.5 h-3.5 mr-2" />
                        TABELA MEDIDAS
                    </Button>
                    <Button
                        onClick={() => toast.info('O cadastro de novos figurinos será liberado na próxima atualização.')}
                        style={{ backgroundColor: primaryColor }}
                        className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        NOVO FIGURINO
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {costumeInventory.map((item) => (
                    <Card key={item.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-pink-500/30 transition-all group overflow-hidden rounded-xl shadow-sm">
                        <div className="h-48 bg-zinc-50 dark:bg-zinc-800/50 relative flex items-center justify-center">
                            <Shirt className="w-16 h-16 text-zinc-300 dark:text-zinc-700 group-hover:scale-110 group-hover:text-pink-500/30 transition-all duration-500" />
                            <Badge
                                className={`absolute top-4 right-4 px-3 py-1 rounded-full font-black uppercase text-[8px] tracking-widest border-none
                                    ${item.status === 'Limpo' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                        item.status === 'Locado' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                            'bg-amber-500/10 text-amber-600'
                                    }`}
                            >
                                {item.status}
                            </Badge>
                        </div>
                        <CardHeader className="p-5 pb-2">
                            <div className="flex justify-between items-start gap-4">
                                <CardTitle className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-tight">{item.name}</CardTitle>
                                <Badge variant="secondary" className="bg-zinc-50 dark:bg-white/5 text-[9px] font-black px-2 py-0.5 rounded-lg border-none text-zinc-500">
                                    {item.size}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <div className="space-y-5">
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: 'Busto', value: item.metrics.busto },
                                        { label: 'Cintura', value: item.metrics.cintura },
                                        { label: 'Quadril', value: item.metrics.quadril },
                                    ].map((m) => (
                                        <div key={m.label} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-white/5 text-center">
                                            <div className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{m.label}</div>
                                            <div className="text-sm font-black text-zinc-900 dark:text-white">{m.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {item.renter && (
                                    <div className="flex items-center justify-between p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="text-[8px] font-black uppercase tracking-widest text-blue-500/70">Locado para</div>
                                                <div className="text-[10px] font-black text-zinc-900 dark:text-white uppercase truncate max-w-[120px]">{item.renter}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button variant="ghost" className="flex-1 text-[9px] font-black uppercase tracking-[0.2em] h-10 rounded-xl bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all text-zinc-500">
                                        HISTÓRICO
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-white/5 hover:bg-pink-500 hover:text-white transition-all">
                                        <MoreVertical className="w-4 h-4" />
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
