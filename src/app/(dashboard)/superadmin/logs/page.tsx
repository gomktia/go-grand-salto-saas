'use client'

import React, { useState } from 'react'
import {
    Search,
    Filter,
    AlertCircle,
    CheckCircle2,
    Info,
    Download,
    RefreshCw,
    Terminal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type LogEntry = {
    id: string
    timestamp: string
    level: 'info' | 'warning' | 'error' | 'success'
    source: string
    message: string
    tenant?: string
}

const MOCK_LOGS: LogEntry[] = [
    { id: '1', timestamp: '2024-01-20 14:30:22', level: 'info', source: 'Auth', message: 'User login attempt', tenant: 'Espaco Revelle' },
    { id: '2', timestamp: '2024-01-20 14:28:15', level: 'success', source: 'Payment', message: 'Mensalidade processada com sucesso', tenant: 'Studio Danca' },
    { id: '3', timestamp: '2024-01-20 14:25:00', level: 'warning', source: 'System', message: 'High memory usage detected on worker-01', tenant: 'System' },
    { id: '4', timestamp: '2024-01-20 14:22:11', level: 'error', source: 'Database', message: 'Connection timeout - retrying', tenant: 'Ballet Art' },
    { id: '5', timestamp: '2024-01-20 14:20:05', level: 'info', source: 'Escola', message: 'Nova turma criada: Ballet Infantil', tenant: 'Espaco Revelle' },
    { id: '6', timestamp: '2024-01-20 14:15:33', level: 'success', source: 'Backup', message: 'Backup diario concluido', tenant: 'System' },
    { id: '7', timestamp: '2024-01-20 14:10:12', level: 'info', source: 'Auth', message: 'User logout', tenant: 'Studio Danca' },
    { id: '8', timestamp: '2024-01-20 14:05:45', level: 'info', source: 'API', message: 'Webhook received from Hotmart', tenant: 'System' },
]

export default function SystemLogsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [levelFilter, setLevelFilter] = useState('all')

    const filteredLogs = MOCK_LOGS.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.tenant?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLevel = levelFilter === 'all' ? true : log.level === levelFilter
        return matchesSearch && matchesLevel
    })

    const getLevelBadge = (level: string) => {
        switch (level) {
            case 'info': return <Badge className="bg-blue-500/10 text-blue-400 border-none uppercase text-[10px] font-black tracking-widest">Info</Badge>
            case 'success': return <Badge className="bg-emerald-500/10 text-emerald-400 border-none uppercase text-[10px] font-black tracking-widest">Success</Badge>
            case 'warning': return <Badge className="bg-amber-500/10 text-amber-400 border-none uppercase text-[10px] font-black tracking-widest">Warning</Badge>
            case 'error': return <Badge className="bg-red-500/10 text-red-400 border-none uppercase text-[10px] font-black tracking-widest">Error</Badge>
            default: return <Badge className="bg-neutral-500/10 text-neutral-400">Unknown</Badge>
        }
    }

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'info': return <Info className="w-4 h-4 text-blue-400" />
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            case 'warning': return <AlertCircle className="w-4 h-4 text-amber-400" />
            case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />
            default: return <Info className="w-4 h-4 text-neutral-400" />
        }
    }

    return (
        <div className="p-4 lg:p-10 space-y-8 pb-24 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                        Logs do Sistema
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm lg:text-lg mt-2">
                        Monitoramento de eventos e auditoria
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 border-white/10 text-white hover:bg-white/5 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar
                    </Button>
                    <Button className="h-12 bg-white text-black hover:bg-neutral-200 rounded-xl font-black uppercase text-[10px] tracking-widest">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar CSV
                    </Button>
                </div>
            </div>

            <Card className="bg-neutral-900 border-white/5 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-violet-500" />
                            <CardTitle className="text-white font-black uppercase tracking-tight">Console de Eventos</CardTitle>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <Input
                                    placeholder="Buscar logs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-10 pl-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-neutral-500"
                                />
                            </div>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-full md:w-40 h-10 bg-white/5 border-white/10 text-white rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-3 h-3 text-neutral-400" />
                                        <SelectValue placeholder="Nivel" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-white/10">
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">Origem</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">Tenant</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">Mensagem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors font-mono text-sm">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getLevelIcon(log.level)}
                                                {getLevelBadge(log.level)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400 text-xs">
                                            {log.timestamp}
                                        </td>
                                        <td className="px-6 py-4 text-white font-bold">
                                            {log.source}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-300">
                                            {log.tenant || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-300">
                                            {log.message}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredLogs.length === 0 && (
                        <div className="p-12 text-center text-neutral-500 font-bold uppercase text-xs tracking-widest">
                            Nenhum log encontrado para os filtros selecionados
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
