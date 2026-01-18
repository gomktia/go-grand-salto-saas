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

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Acervo de Figurinos</h1>
                    <p className="text-neutral-500">Gestão inteligente de estoque com suporte a medidas customizadas para o <strong>{tenant?.nome}</strong>.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-white/10 gap-2">
                        <Ruler className="w-4 h-4" />
                        Tabela de Medidas
                    </Button>
                    <Button className="bg-pink-600 hover:bg-pink-500 gap-2">
                        <Plus className="w-4 h-4" />
                        Novo Figurino
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {costumeInventory.map((item) => (
                    <Card key={item.id} className="bg-neutral-900/60 border-white/5 hover:border-pink-500/20 transition-all group overflow-hidden">
                        <div className="h-48 bg-gradient-to-br from-neutral-800 to-neutral-900 relative flex items-center justify-center">
                            <Shirt className="w-16 h-16 text-neutral-700 group-hover:scale-110 group-hover:text-pink-500/50 transition-all" />
                            <Badge
                                className={`absolute top-4 right-4 ${item.status === 'Limpo' ? 'bg-emerald-500/20 text-emerald-500' :
                                    item.status === 'Locado' ? 'bg-blue-500/20 text-blue-500' :
                                        'bg-yellow-500/20 text-yellow-500'
                                    } border-none`}
                            >
                                {item.status}
                            </Badge>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                Tamanho <Badge variant="secondary" className="bg-white/5">{item.size}</Badge>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                                        <div className="text-[10px] text-neutral-500 uppercase">Busto</div>
                                        <div className="text-sm font-bold">{item.metrics.busto}</div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                                        <div className="text-[10px] text-neutral-500 uppercase">Cintura</div>
                                        <div className="text-sm font-bold">{item.metrics.cintura}</div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                                        <div className="text-[10px] text-neutral-500 uppercase">Quadril</div>
                                        <div className="text-sm font-bold">{item.metrics.quadril}</div>
                                    </div>
                                </div>

                                {item.renter && (
                                    <div className="flex items-center justify-between p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-blue-500" />
                                            <span className="text-xs text-blue-200">Em posse de:</span>
                                        </div>
                                        <span className="text-xs font-bold text-white">{item.renter}</span>
                                    </div>
                                )}

                                <Button variant="ghost" className="w-full text-xs hover:bg-white/5 text-neutral-400">
                                    Ver histórico de locação
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
