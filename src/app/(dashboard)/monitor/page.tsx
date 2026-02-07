'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getMinhasTurmasMonitor, registrarFrequenciaMonitor } from '@/app/actions/monitor'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    CheckCircle2,
    Check,
    Send,
    Loader2,
    Clock,
    Music4,
    ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTenant } from '@/hooks/use-tenant'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.08 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease }
    }
}

// Imagem editorial: estúdio de ballet, movimento, luz suave
const MONITOR_HERO = 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=85'

export default function MonitorDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#c72d1c'
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [turmas, setTurmas] = useState<any[]>([])
    const [selectedTurma, setSelectedTurma] = useState<any>(null)
    const [attendance, setAttendance] = useState<Record<string, boolean>>({})
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        loadData()
        const timer = setInterval(() => setCurrentTime(new Date()), 30000)
        return () => clearInterval(timer)
    }, [])

    async function loadData() {
        try {
            setIsLoading(true)
            const result = await getMinhasTurmasMonitor()
            setTurmas(result.data)
            if (result.data.length > 0) {
                selectTurma(result.data[0])
            }
        } catch {
            toast.error('Erro ao carregar suas turmas')
        } finally {
            setIsLoading(false)
        }
    }

    const selectTurma = useCallback((turma: any) => {
        setSelectedTurma(turma)
        const initial: Record<string, boolean> = {}
        turma.matriculas_turmas?.forEach((m: any) => {
            initial[m.estudantes.id] = false
        })
        setAttendance(initial)
    }, [])

    const toggleAttendance = (id: string) => {
        setAttendance(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const toggleAll = () => {
        const allPresent = Object.values(attendance).every(Boolean)
        setAttendance(prev => {
            const updated: Record<string, boolean> = {}
            Object.keys(prev).forEach(id => { updated[id] = !allPresent })
            return updated
        })
    }

    const handleSave = async () => {
        if (!selectedTurma || isSaving) return
        const presencas = Object.entries(attendance).map(([id, presente]) => ({
            estudante_id: id, presente
        }))
        try {
            setIsSaving(true)
            await registrarFrequenciaMonitor({ turma_id: selectedTurma.id, presencas })
            toast.success('Chamada registrada com sucesso')
        } catch {
            toast.error('Erro ao registrar frequência')
        } finally {
            setIsSaving(false)
        }
    }

    const presentCount = Object.values(attendance).filter(Boolean).length
    const totalCount = Object.keys(attendance).length
    const pct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                    <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
                    <p className="text-[10px] font-light tracking-[0.4em] text-neutral-600 uppercase">Carregando turmas</p>
                </motion.div>
            </div>
        )
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-[#0A0A0A] text-white"
        >
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full blur-[200px] opacity-[0.02]"
                    style={{ background: primaryColor }} />
            </div>

            <div className="relative max-w-3xl mx-auto px-6 py-8 lg:py-12">
                {/* Header */}
                <motion.header variants={itemVariants} className="mb-10 space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-light tracking-[0.4em] text-neutral-500 uppercase">
                                {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                            <p className="text-[10px] font-light tracking-[0.3em] text-neutral-600 uppercase">
                                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[10px] font-light tracking-[0.2em] text-neutral-500 uppercase">Monitor(a)</p>
                                <p className="text-sm font-extralight">{tenant?.nome || 'Grand Salto'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-neutral-800 bg-neutral-700">
                                M
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <motion.h1 variants={itemVariants} className="text-3xl font-black tracking-tight">
                            <span className="text-neutral-500 font-extralight">Chamada</span>{' '}
                            <span style={{ color: primaryColor }}>Digital</span>
                        </motion.h1>
                        <p className="text-neutral-500 font-extralight text-sm">
                            {turmas.length} {turmas.length === 1 ? 'turma atribuída' : 'turmas atribuídas'} &middot; {totalCount} alunas
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 pt-4 border-t border-neutral-800/40">
                        {[
                            { label: 'Presentes', value: `${presentCount}/${totalCount}`, icon: CheckCircle2 },
                            { label: 'Turma', value: selectedTurma?.nome || '—', icon: Music4 },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800/60 flex items-center justify-center">
                                    <s.icon className="w-3.5 h-3.5 text-neutral-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-medium tracking-[0.2em] text-neutral-600 uppercase">{s.label}</p>
                                    <p className="text-sm font-extralight text-white">{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.header>

                {/* Turma selector */}
                {turmas.length > 1 && (
                    <motion.div variants={itemVariants} className="flex gap-2 flex-wrap mb-6">
                        {turmas.map((turma) => (
                            <motion.button
                                key={turma.id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => selectTurma(turma)}
                                className={`px-4 py-2 rounded-full text-[10px] font-medium tracking-[0.1em] uppercase border transition-all duration-300 ${
                                    selectedTurma?.id === turma.id
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-600'
                                }`}
                            >
                                {turma.nome}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* Attendance Card */}
                <motion.div variants={itemVariants}>
                    <Card className="bg-neutral-900/40 border-neutral-800/60 rounded-2xl overflow-hidden">
                        <CardHeader className="px-6 pt-6 pb-4 border-b border-neutral-800/40">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                                        <CardDescription className="text-[9px] font-medium tracking-[0.3em] text-neutral-500 uppercase">
                                            Chamada em Andamento
                                        </CardDescription>
                                    </div>
                                    <CardTitle className="text-xl font-bold tracking-tight text-white">
                                        {selectedTurma?.nome || 'Nenhuma turma'}
                                    </CardTitle>
                                    {selectedTurma?.perfis?.full_name && (
                                        <p className="text-[11px] font-light text-neutral-500">
                                            Prof. {selectedTurma.perfis.full_name}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black tabular-nums" style={{ color: primaryColor }}>{presentCount}</p>
                                    <p className="text-[9px] font-light tracking-[0.2em] text-neutral-500 uppercase">de {totalCount}</p>
                                    <div className="w-16 h-1 rounded-full bg-neutral-800 mt-1.5 overflow-hidden">
                                        <motion.div className="h-full rounded-full" style={{ backgroundColor: primaryColor }}
                                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.5, ease }} />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-2">
                            {totalCount > 0 && (
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-medium tracking-[0.15em] text-neutral-500 uppercase">Alunas</p>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={toggleAll}
                                        className="text-[10px] font-medium tracking-[0.1em] text-neutral-400 uppercase hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-800/50"
                                    >
                                        {Object.values(attendance).every(Boolean) ? 'Desmarcar Todas' : 'Marcar Todas'}
                                    </motion.button>
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {totalCount === 0 ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-12"
                                    >
                                        <Users className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
                                        <p className="text-neutral-600 font-extralight text-sm">Nenhuma aluna nesta turma</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={selectedTurma?.id}
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-1.5"
                                    >
                                        {selectedTurma?.matriculas_turmas?.map((m: any, index: number) => (
                                            <motion.div
                                                key={m.estudantes.id}
                                                variants={itemVariants}
                                                onClick={() => toggleAttendance(m.estudantes.id)}
                                                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                                                whileTap={{ scale: 0.995 }}
                                                className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${
                                                    attendance[m.estudantes.id]
                                                        ? 'bg-emerald-500/8 border-emerald-500/20'
                                                        : 'bg-neutral-800/20 border-neutral-800/40 hover:border-neutral-700/60'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div className="relative">
                                                        <Avatar className="h-10 w-10 border border-neutral-700/50">
                                                            <AvatarImage src={m.estudantes.perfis?.avatar_url} />
                                                            <AvatarFallback className="bg-neutral-800 font-bold text-neutral-400 text-sm">
                                                                {m.estudantes.nome_responsavel?.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <AnimatePresence>
                                                            {attendance[m.estudantes.id] && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    exit={{ scale: 0 }}
                                                                    transition={{ duration: 0.2, ease }}
                                                                    className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-[#0A0A0A]"
                                                                >
                                                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white tracking-tight">{m.estudantes.nome_responsavel}</p>
                                                        <p className="text-[9px] font-light tracking-[0.2em] text-neutral-500 uppercase">
                                                            #{String(index + 1).padStart(2, '0')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
                                                        attendance[m.estudantes.id]
                                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                            : 'bg-neutral-800/60 text-neutral-400 hover:bg-neutral-700/60'
                                                    }`}
                                                >
                                                    {attendance[m.estudantes.id] ? 'Presente' : 'Marcar'}
                                                </motion.div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {totalCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, ease }}
                                    className="pt-4"
                                >
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving || presentCount === 0}
                                        className="w-full h-12 rounded-xl text-white font-bold tracking-[0.1em] uppercase text-[11px] transition-all hover:brightness-110 active:scale-[0.98] border-0 disabled:opacity-40"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                        {isSaving ? 'Registrando...' : `Enviar Chamada (${presentCount})`}
                                    </Button>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Info footer */}
                <motion.div variants={itemVariants} className="mt-6 text-center">
                    <p className="text-[10px] font-light tracking-[0.2em] text-neutral-600 uppercase">
                        Acesso restrito &middot; Apenas turmas atribuídas
                    </p>
                </motion.div>
            </div>
        </motion.div>
    )
}
