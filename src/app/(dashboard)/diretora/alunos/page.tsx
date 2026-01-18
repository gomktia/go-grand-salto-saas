'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    Search,
    Plus,
    Ruler,
    MoreHorizontal,
    ArrowUpDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const students = [
    {
        id: 1,
        name: 'Valentina Rossi',
        status: 'Ativo',
        metrics: { busto: 65, cintura: 58, quadril: 72 },
        lastUpdate: '15/01/2026'
    },
    {
        id: 2,
        name: 'Isadora Lima',
        status: 'Ativo',
        metrics: { busto: 70, cintura: 62, quadril: 78 },
        lastUpdate: '10/01/2026'
    },
    {
        id: 3,
        name: 'Beatriz Costa',
        status: 'Inativo',
        metrics: { busto: 68, cintura: 60, quadril: 75 },
        lastUpdate: '02/12/2025'
    },
]

export default function AlunosPage() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestão de Alunos</h1>
                    <p className="text-neutral-500">Acompanhe matrículas e métricas corporais para figurinos.</p>
                </div>
                <Button className="bg-pink-600 hover:bg-pink-500 gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Aluno
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                    <Input
                        placeholder="Buscar por nome ou responsável..."
                        className="pl-10 bg-neutral-900/50 border-white/5"
                    />
                </div>
                <Button variant="outline" className="border-white/5 gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    Filtros
                </Button>
            </div>

            <Card className="bg-neutral-900/50 border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="p-4 text-sm font-medium text-neutral-400">Aluno</th>
                            <th className="p-4 text-sm font-medium text-neutral-400">Status</th>
                            <th className="p-4 text-sm font-medium text-neutral-400">Métricas (B/C/Q)</th>
                            <th className="p-4 text-sm font-medium text-neutral-400">Última Medição</th>
                            <th className="p-4 text-sm font-medium text-neutral-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 font-medium">{student.name}</td>
                                <td className="p-4">
                                    <Badge variant="outline" className={student.status === 'Ativo' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-neutral-500 border-white/10'}>
                                        {student.status}
                                    </Badge>
                                </td>
                                <td className="p-4 text-sm font-mono text-neutral-300">
                                    <div className="flex items-center gap-2">
                                        <Ruler className="w-3 h-3 text-pink-500" />
                                        {student.metrics.busto}/{student.metrics.cintura}/{student.metrics.quadril}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-neutral-500">{student.lastUpdate}</td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="icon" className="hover:bg-white/5">
                                        <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
