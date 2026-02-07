'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getMinhasTurmas, registrarFrequencia } from '@/app/actions/professor'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Calendar,
    Clock,
    CheckCircle2,
    TrendingUp,
    MessageSquare,
    Music4,
    Check,
    Camera,
    Sparkles,
    Trophy,
    ArrowUpRight,
    BarChart3,
    Send,
    Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTenant } from '@/hooks/use-tenant'

// ─── Editorial Ballet Images (curated, luxury aesthetic) ─────────────────────
const BALLET_IMAGES = {
    hero: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1200&q=85',
    studio: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=85',
    pointe: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&q=85',
    barre: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=85',
    performance: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=800&q=85',
}

// ─── Animation System (cubic-bezier matched to Linear/Stripe) ────────────────
const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.08
        }
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

export default function ProfessorDashboard() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#c72d1c'
    const [activeTab, setActiveTab] = useState('diario')
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
            const result = await getMinhasTurmas()
            setTurmas(result.data)
            if (result.data.length > 0) {
                selectTurma(result.data[0])
            }
        } catch {
            toast.error('Erro ao carregar turmas')
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

    const toggleAttendance = (estudanteId: string) => {
        setAttendance(prev => ({
            ...prev,
            [estudanteId]: !prev[estudanteId]
        }))
    }

    const toggleAll = () => {
        const allPresent = Object.values(attendance).every(Boolean)
        setAttendance(prev => {
            const updated: Record<string, boolean> = {}
            Object.keys(prev).forEach(id => { updated[id] = !allPresent })
            return updated
        })
    }

    const handleSaveAttendance = async () => {
        if (!selectedTurma || isSaving) return

        const presencas = Object.entries(attendance).map(([id, present]) => ({
            estudante_id: id,
            presente: present
        }))

        try {
            setIsSaving(true)
            await registrarFrequencia({
                turma_id: selectedTurma.id,
                presencas
            })
            toast.success('Chamada registrada com sucesso')
        } catch {
            toast.error('Erro ao registrar frequência')
        } finally {
            setIsSaving(false)
        }
    }

    const presentCount = Object.values(attendance).filter(Boolean).length
    const totalCount = Object.keys(attendance).length
    const attendancePercent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

    // ─── Loading State ───────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
                    <p className="text-[10px] font-light tracking-[0.4em] text-neutral-600 uppercase">
                        Preparando seu palco
                    </p>
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
            {/* ─── Ambient Background Glow ──────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute -top-40 right-0 w-[900px] h-[900px] rounded-full blur-[240px] opacity-[0.025]"
                    style={{ background: primaryColor }}
                />
                <div
                    className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.015]"
                    style={{ background: primaryColor }}
                />
            </div>

            <div className="relative max-w-[1400px] mx-auto px-6 py-8 lg:px-12 lg:py-12">
                {/* ─── Header ───────────────────────────────────────────── */}
                <motion.header variants={itemVariants} className="mb-12 space-y-8">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-light tracking-[0.4em] text-neutral-500 uppercase">
                                {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                            <p className="text-[10px] font-light tracking-[0.3em] text-neutral-600 uppercase">
                                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2, ease }}
                            className="flex items-center gap-4"
                        >
                            <div className="text-right">
                                <p className="text-[10px] font-light tracking-[0.2em] text-neutral-500 uppercase">Professora</p>
                                <p className="text-sm font-extralight tracking-wide">{tenant?.nome || 'Grand Salto'}</p>
                            </div>
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm ring-2 ring-neutral-800"
                                style={{ backgroundColor: primaryColor }}
                            >
                                P
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-5">
                        <motion.h1
                            variants={itemVariants}
                            className="text-[clamp(2.2rem,7vw,4.5rem)] font-black tracking-[-0.04em] leading-[0.9]"
                        >
                            <span className="text-neutral-500 font-extralight">Seu</span>{' '}
                            <span className="relative inline-block">
                                Palco
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.4, duration: 0.7, ease }}
                                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] origin-left"
                                    style={{ backgroundColor: primaryColor }}
                                />
                            </span>
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-neutral-500 font-extralight text-base max-w-lg tracking-wide leading-relaxed"
                        >
                            {turmas.length} {turmas.length === 1 ? 'turma ativa' : 'turmas ativas'} &middot; {totalCount} {totalCount === 1 ? 'bailarina aguarda' : 'bailarinas aguardam'} sua chamada.
                        </motion.p>
                    </div>

                    {/* ─── Stats Strip ──────────────────────────────────── */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-10 pt-6 border-t border-neutral-800/40"
                    >
                        {[
                            { label: 'Turmas', value: turmas.length.toString(), icon: Users },
                            { label: 'Aula Atual', value: selectedTurma?.nome || '—', icon: Music4 },
                            { label: 'Presença', value: `${presentCount}/${totalCount}`, icon: CheckCircle2 },
                            { label: 'Taxa', value: `${attendancePercent}%`, icon: TrendingUp },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800/60 flex items-center justify-center">
                                    <stat.icon className="w-3.5 h-3.5 text-neutral-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-medium tracking-[0.25em] text-neutral-600 uppercase">{stat.label}</p>
                                    <p className="text-base font-extralight text-white tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.header>

                {/* ─── Editorial Feature Cards ──────────────────────────── */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                img: BALLET_IMAGES.studio,
                                title: 'Ensaio Geral',
                                subtitle: 'Preparação para o recital de inverno',
                                tag: 'Esta semana'
                            },
                            {
                                img: BALLET_IMAGES.pointe,
                                title: 'Técnica Avançada',
                                subtitle: 'Avaliações individuais em andamento',
                                tag: 'Em progresso'
                            },
                            {
                                img: BALLET_IMAGES.performance,
                                title: 'Festival 2025',
                                subtitle: 'Repertório em definição pela direção',
                                tag: 'Atenção'
                            },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -4, transition: { duration: 0.3, ease } }}
                                className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${card.img}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute inset-0 mix-blend-color opacity-20" style={{ backgroundColor: primaryColor }} />
                                <div className="relative h-full flex flex-col justify-end p-6">
                                    <Badge className="w-fit mb-3 bg-white/10 backdrop-blur-md text-white/80 border-white/10 text-[8px] font-bold tracking-[0.15em] uppercase">
                                        {card.tag}
                                    </Badge>
                                    <h3 className="text-lg font-bold text-white tracking-tight leading-tight mb-1">
                                        {card.title}
                                    </h3>
                                    <p className="text-[11px] font-light text-white/60 tracking-wide">
                                        {card.subtitle}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* ─── Main Content Grid ────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                            <TabsList className="bg-transparent border-0 p-0 h-auto gap-1.5">
                                {[
                                    { value: 'diario', label: 'Chamada Digital', icon: CheckCircle2 },
                                    { value: 'turmas', label: 'Minhas Turmas', icon: Users },
                                    { value: 'evolucao', label: 'Evolução', icon: TrendingUp },
                                ].map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="data-[state=active]:bg-white data-[state=active]:text-black bg-neutral-900/80 text-neutral-400 border border-neutral-800/60 data-[state=active]:border-white rounded-full px-5 py-2.5 text-[10px] font-medium tracking-[0.12em] uppercase transition-all duration-300 hover:border-neutral-600"
                                    >
                                        <tab.icon className="w-3.5 h-3.5 mr-2" />
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* ─── Chamada Digital ──────────────────────── */}
                            <TabsContent value="diario" className="mt-0 space-y-6">
                                {/* Turma Selector */}
                                {turmas.length > 1 && (
                                    <motion.div variants={itemVariants} className="flex gap-2 flex-wrap">
                                        {turmas.map((turma) => (
                                            <motion.button
                                                key={turma.id}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => {
                                                    selectTurma(turma)
                                                }}
                                                className={`px-4 py-2 rounded-full text-[10px] font-medium tracking-[0.1em] uppercase transition-all duration-300 border ${
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

                                <Card className="bg-neutral-900/40 border-neutral-800/60 rounded-2xl overflow-hidden">
                                    <CardHeader className="px-8 pt-8 pb-6 border-b border-neutral-800/40">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                                                        style={{ backgroundColor: primaryColor }}
                                                    />
                                                    <CardDescription className="text-[9px] font-medium tracking-[0.3em] text-neutral-500 uppercase">
                                                        Aula em Andamento
                                                    </CardDescription>
                                                </div>
                                                <CardTitle className="text-2xl font-black tracking-tight text-white">
                                                    {selectedTurma?.nome || 'Selecione uma turma'}
                                                </CardTitle>
                                                <p className="text-neutral-500 font-extralight text-sm tracking-wide">
                                                    {selectedTurma?.horario || 'Horário não definido'} &middot; {selectedTurma?.nivel || 'Ballet'}
                                                </p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-3xl font-black tabular-nums" style={{ color: primaryColor }}>
                                                    {presentCount}
                                                </p>
                                                <p className="text-[9px] font-light tracking-[0.2em] text-neutral-500 uppercase">
                                                    de {totalCount}
                                                </p>
                                                {/* Progress bar */}
                                                <div className="w-20 h-1 rounded-full bg-neutral-800 mt-2 overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: primaryColor }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${attendancePercent}%` }}
                                                        transition={{ duration: 0.5, ease }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-8 space-y-3">
                                        {/* Select All */}
                                        {totalCount > 0 && (
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[10px] font-medium tracking-[0.15em] text-neutral-500 uppercase">
                                                    Lista de Chamada
                                                </p>
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
                                            {!selectedTurma || totalCount === 0 ? (
                                                <motion.div
                                                    key="empty"
                                                    initial={{ opacity: 0, scale: 0.96 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.96 }}
                                                    transition={{ duration: 0.4, ease }}
                                                    className="text-center py-16"
                                                >
                                                    <Users className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
                                                    <p className="text-neutral-600 font-extralight text-sm">Nenhuma aluna matriculada</p>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key={selectedTurma.id}
                                                    variants={containerVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    className="space-y-2"
                                                >
                                                    {selectedTurma.matriculas_turmas.map((m: any, index: number) => (
                                                        <motion.div
                                                            key={m.estudantes.id}
                                                            variants={itemVariants}
                                                            onClick={() => toggleAttendance(m.estudantes.id)}
                                                            whileHover={{ x: 2, transition: { duration: 0.15 } }}
                                                            whileTap={{ scale: 0.995 }}
                                                            className={`
                                                                flex items-center justify-between p-4 rounded-xl cursor-pointer
                                                                transition-all duration-300 group border
                                                                ${attendance[m.estudantes.id]
                                                                    ? 'bg-emerald-500/8 border-emerald-500/20'
                                                                    : 'bg-neutral-800/20 border-neutral-800/40 hover:border-neutral-700/60'
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative">
                                                                    <Avatar className="h-11 w-11 border border-neutral-700/50">
                                                                        <AvatarImage src={m.estudantes.perfis?.avatar_url} />
                                                                        <AvatarFallback className="bg-neutral-800 font-bold text-neutral-400 text-sm">
                                                                            {m.estudantes.nome_responsavel?.charAt(0)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <AnimatePresence>
                                                                        {attendance[m.estudantes.id] && (
                                                                            <motion.div
                                                                                initial={{ scale: 0, opacity: 0 }}
                                                                                animate={{ scale: 1, opacity: 1 }}
                                                                                exit={{ scale: 0, opacity: 0 }}
                                                                                transition={{ duration: 0.2, ease }}
                                                                                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-[#0A0A0A]"
                                                                            >
                                                                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-white tracking-tight">
                                                                        {m.estudantes.nome_responsavel}
                                                                    </p>
                                                                    <p className="text-[9px] font-light tracking-[0.2em] text-neutral-500 uppercase">
                                                                        #{String(index + 1).padStart(2, '0')} &middot; {selectedTurma.nivel || 'Ballet'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className={`
                                                                    px-5 py-2 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase
                                                                    transition-all duration-300
                                                                    ${attendance[m.estudantes.id]
                                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                                        : 'bg-neutral-800/60 text-neutral-400 hover:bg-neutral-700/60'
                                                                    }
                                                                `}
                                                            >
                                                                {attendance[m.estudantes.id] ? 'Presente' : 'Marcar'}
                                                            </motion.div>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {selectedTurma && totalCount > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2, duration: 0.4, ease }}
                                                className="pt-6"
                                            >
                                                <Button
                                                    onClick={handleSaveAttendance}
                                                    disabled={isSaving || presentCount === 0}
                                                    className="w-full h-14 rounded-xl text-white font-bold tracking-[0.1em] uppercase text-[11px] transition-all duration-300 hover:brightness-110 active:scale-[0.98] border-0 disabled:opacity-40 disabled:cursor-not-allowed"
                                                    style={{ backgroundColor: primaryColor }}
                                                >
                                                    {isSaving ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4 mr-2" />
                                                    )}
                                                    {isSaving ? 'Registrando...' : `Consolidar Chamada (${presentCount})`}
                                                </Button>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ─── Minhas Turmas ───────────────────────── */}
                            <TabsContent value="turmas" className="mt-0">
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {turmas.map((turma, index) => (
                                        <motion.div
                                            key={turma.id}
                                            variants={itemVariants}
                                            whileHover={{ y: -3, transition: { duration: 0.25, ease } }}
                                            onClick={() => {
                                                selectTurma(turma)
                                                setActiveTab('diario')
                                            }}
                                            className="group cursor-pointer"
                                        >
                                            <Card className="bg-neutral-900/40 border-neutral-800/60 rounded-2xl overflow-hidden hover:border-neutral-700/60 transition-all duration-300">
                                                {/* Card image header */}
                                                <div className="relative h-28 overflow-hidden">
                                                    <div
                                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                        style={{
                                                            backgroundImage: `url('${Object.values(BALLET_IMAGES)[index % 5]}')`,
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
                                                    <div className="absolute inset-0 mix-blend-color opacity-15" style={{ backgroundColor: primaryColor }} />
                                                    <div className="absolute top-4 right-4">
                                                        <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors duration-300" />
                                                    </div>
                                                </div>
                                                <CardContent className="p-6 space-y-4">
                                                    <div>
                                                        <p className="text-[9px] font-light tracking-[0.3em] text-neutral-500 uppercase mb-1.5">
                                                            Turma #{String(index + 1).padStart(2, '0')}
                                                        </p>
                                                        <h3 className="text-lg font-bold text-white tracking-tight">
                                                            {turma.nome}
                                                        </h3>
                                                        {turma.horario && (
                                                            <p className="text-[11px] font-light text-neutral-500 mt-1 tracking-wide">
                                                                <Clock className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                                                                {turma.horario}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800/40">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-3.5 h-3.5 text-neutral-500" />
                                                            <span className="text-[11px] font-light text-neutral-400 tracking-wide">
                                                                {turma.matriculas_turmas?.length || 0} alunas
                                                            </span>
                                                        </div>
                                                        <Badge className="bg-neutral-800/60 text-neutral-400 border-0 text-[8px] font-medium tracking-[0.1em]">
                                                            {turma.nivel || 'Iniciante'}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </TabsContent>

                            {/* ─── Evolução ────────────────────────────── */}
                            <TabsContent value="evolucao" className="mt-0">
                                <Card className="bg-neutral-900/40 border-neutral-800/60 rounded-2xl">
                                    <CardContent className="p-12 text-center">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5, ease }}
                                        >
                                            <div
                                                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                                                style={{ backgroundColor: `${primaryColor}10` }}
                                            >
                                                <BarChart3 className="w-7 h-7" style={{ color: primaryColor }} />
                                            </div>
                                            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Evolução Técnica</h3>
                                            <p className="text-neutral-500 font-extralight text-sm max-w-sm mx-auto leading-relaxed">
                                                Acompanhe o progresso individual de cada bailarina com avaliações detalhadas.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="mt-8 rounded-full px-8 border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-[10px] font-medium tracking-[0.1em] uppercase"
                                                onClick={() => toast.info('Disponível na próxima atualização')}
                                            >
                                                Em breve
                                            </Button>
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>

                    {/* ─── Right Column - Sidebar ──────────────────────── */}
                    <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                        {/* Communicações */}
                        <Card className="bg-neutral-900/40 border-neutral-800/60 rounded-2xl overflow-hidden">
                            <CardHeader className="px-6 pt-6 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <MessageSquare className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                    <CardTitle className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
                                        Comunicações
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-0 space-y-3">
                                <motion.div
                                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                                    className="p-5 rounded-xl border cursor-pointer transition-all"
                                    style={{
                                        backgroundColor: `${primaryColor}06`,
                                        borderColor: `${primaryColor}15`
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge
                                            className="text-[7px] font-black tracking-[0.15em] border-0 px-2.5 py-0.5"
                                            style={{ backgroundColor: primaryColor, color: 'white' }}
                                        >
                                            URGENTE
                                        </Badge>
                                        <span className="text-[9px] font-light text-neutral-600">Direção</span>
                                    </div>
                                    <p className="text-[13px] font-medium text-white leading-relaxed">
                                        &quot;O repertório do festival de inverno precisa ser definido até sexta.&quot;
                                    </p>
                                    <Button
                                        variant="ghost"
                                        className="w-full mt-4 h-9 rounded-lg bg-white/5 text-white text-[9px] font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-all"
                                        onClick={() => toast.info('Central de mensagens em breve')}
                                    >
                                        Responder
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                                    className="p-5 rounded-xl bg-neutral-800/20 border border-neutral-800/40 cursor-pointer hover:border-neutral-700/50 transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-[9px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                                            Novidade
                                        </span>
                                    </div>
                                    <p className="text-[13px] font-light text-neutral-300 leading-relaxed">
                                        Nova avaliação técnica disponível para suas turmas.
                                    </p>
                                </motion.div>
                            </CardContent>
                        </Card>

                        {/* Photo Capture Card */}
                        <motion.div
                            whileHover={{ y: -3, transition: { duration: 0.25, ease } }}
                        >
                            <Card className="bg-neutral-900 border-neutral-800/60 rounded-2xl overflow-hidden relative h-72">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                                    style={{
                                        backgroundImage: `url('${BALLET_IMAGES.barre}')`,
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
                                <div className="absolute inset-0 mix-blend-color opacity-10" style={{ backgroundColor: primaryColor }} />
                                <CardContent className="relative z-10 p-7 h-full flex flex-col justify-end">
                                    <motion.div
                                        whileHover={{ rotate: 4, transition: { duration: 0.2 } }}
                                        className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center mb-5"
                                    >
                                        <Camera className="w-5 h-5 text-white" />
                                    </motion.div>
                                    <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight">
                                        Momento <span style={{ color: primaryColor }}>Mágico</span>
                                    </h3>
                                    <p className="text-[11px] font-extralight text-white/50 mb-5 leading-relaxed">
                                        Capture fotos profissionais para o portal dos pais.
                                    </p>
                                    <Button
                                        className="w-full h-10 rounded-lg bg-white text-black font-bold text-[9px] tracking-[0.15em] uppercase hover:bg-neutral-100 transition-all"
                                        onClick={() => toast.info('Funcionalidade em breve')}
                                    >
                                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                                        Ativar Câmera
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Daily Schedule */}
                        <Card className="bg-neutral-900/40 border-neutral-800/60 rounded-2xl">
                            <CardHeader className="px-6 pt-6 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <Calendar className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                                    <CardTitle className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
                                        Agenda de Hoje
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-0 space-y-1.5">
                                {turmas.length > 0 ? (
                                    turmas.map((turma, i) => {
                                        const isFirst = i === 0
                                        return (
                                            <motion.div
                                                key={turma.id}
                                                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                                                onClick={() => {
                                                    selectTurma(turma)
                                                    setActiveTab('diario')
                                                }}
                                                className={`flex items-center gap-3.5 p-3.5 rounded-lg cursor-pointer transition-all duration-200 ${
                                                    isFirst
                                                        ? 'bg-neutral-800/40 border border-neutral-700/40'
                                                        : 'hover:bg-neutral-800/20'
                                                }`}
                                            >
                                                <div
                                                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isFirst ? 'animate-pulse' : ''}`}
                                                    style={{
                                                        backgroundColor: isFirst ? primaryColor : '#333'
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <span className={`text-[12px] block truncate ${
                                                        isFirst ? 'font-medium text-white' : 'font-light text-neutral-400'
                                                    }`}>
                                                        {turma.nome}
                                                    </span>
                                                </div>
                                                <span className={`text-[11px] flex-shrink-0 ${
                                                    isFirst ? 'font-medium text-white' : 'font-light text-neutral-500'
                                                }`}>
                                                    {turma.horario || `${14 + i}:00`}
                                                </span>
                                            </motion.div>
                                        )
                                    })
                                ) : (
                                    // Fallback schedule
                                    [
                                        { time: '14:00', name: 'Baby Ballet II', active: true },
                                        { time: '15:30', name: 'Ballet Juvenil', active: false },
                                        { time: '17:00', name: 'Avançado A', active: false },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-3.5 p-3.5 rounded-lg transition-all ${
                                                item.active
                                                    ? 'bg-neutral-800/40 border border-neutral-700/40'
                                                    : 'hover:bg-neutral-800/20'
                                            }`}
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full ${item.active ? 'animate-pulse' : ''}`}
                                                style={{
                                                    backgroundColor: item.active ? primaryColor : '#333'
                                                }}
                                            />
                                            <span className={`text-[12px] flex-1 ${
                                                item.active ? 'font-medium text-white' : 'font-light text-neutral-400'
                                            }`}>
                                                {item.name}
                                            </span>
                                            <span className={`text-[11px] ${
                                                item.active ? 'font-medium text-white' : 'font-light text-neutral-500'
                                            }`}>
                                                {item.time}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
