'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Camera,
    ShieldCheck,
    UserCheck,
    AlertCircle,
    RefreshCcw,
    Zap,
    CheckCircle2,
    Lock,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'

export default function CheckinFacialPage() {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
    const [scanProgress, setScanProgress] = useState(0)
    const [detectedStudent, setDetectedStudent] = useState<{
        name: string;
        class: string;
        status: string;
        lastCheckin: string;
        photo: string;
    } | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#db2777'

    const startScan = () => {
        setStatus('scanning')
        setScanProgress(0)

        // Simulação de processamento de IA
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    finalizeScan()
                    return 100
                }
                return prev + 2
            })
        }, 50)
    }

    const finalizeScan = () => {
        // Simulação de acerto de 98% de confiança
        setTimeout(() => {
            setStatus('success')
            setDetectedStudent({
                name: 'Valentina Rossi',
                class: 'Ballet Infantil - Nível II',
                status: 'Matrícula Ativa',
                lastCheckin: 'Ontem, 16:00',
                photo: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2000'
            })
        }, 500)
    }

    const reset = () => {
        setStatus('idle')
        setScanProgress(0)
        setDetectedStudent(null)
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Segurança & Reconhecimento Biométrico
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Check-in <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Facial</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-10 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                        CONFIGURAR CÂMERA
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Viewport da Câmera */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl border-4 border-white dark:border-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

                    {/* Placeholder Camera Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-20 h-20 text-neutral-800 animate-pulse" />
                    </div>

                    {status === 'scanning' && (
                        <motion.div
                            initial={{ top: '0%' }}
                            animate={{ top: '100%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent z-20 shadow-[0_0_20px_rgba(236,72,153,0.8)]"
                        />
                    )}

                    <div className="absolute top-10 left-10 z-30">
                        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Feed: Camera 01</span>
                        </div>
                    </div>

                    <div className="absolute inset-0 z-10 flex items-center justify-center p-20 pointer-events-none opacity-20">
                        <div className="w-full h-full border-[1px] border-white/40 rounded-[2rem] border-dashed" />
                    </div>
                </div>

                {/* Painel de Resultados */}
                <div className="space-y-8 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {status === 'idle' ? (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-10 rounded-[2.5rem] bg-neutral-50 dark:bg-white/5 border border-dashed border-neutral-200 dark:border-white/10 flex flex-col items-center text-center gap-8"
                            >
                                <div className="w-24 h-24 rounded-full bg-pink-500/10 flex items-center justify-center border-2 border-dashed border-pink-500/20">
                                    <Camera className="w-10 h-10 text-pink-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Câmera em Espera</h3>
                                    <p className="text-neutral-500 font-medium">Aguardando aluno para validação biométrica.</p>
                                </div>
                                <Button
                                    style={{ backgroundColor: primaryColor }}
                                    onClick={startScan}
                                    className="h-16 px-10 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-pink-500/20 transition-all hover:scale-105"
                                >
                                    Iniciar Escaneamento
                                </Button>
                            </motion.div>
                        ) : status === 'scanning' ? (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="p-10 rounded-[2.5rem] bg-neutral-50 dark:bg-white/5 border border-dashed border-neutral-200 dark:border-white/10 flex flex-col items-center text-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center">
                                        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">Processando... {scanProgress}%</h3>
                                        <div className="w-64 h-2 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden mx-auto">
                                            <div className="h-full bg-pink-500 transition-all" style={{ width: `${scanProgress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : status === 'success' && detectedStudent && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                <div className="p-10 rounded-[3rem] bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                                            <img src={detectedStudent.photo} className="w-full h-full object-cover" alt="Student" />
                                        </div>
                                        <div className="space-y-2">
                                            <Badge className="bg-emerald-500 text-white border-none px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest mb-2">Acesso Liberado</Badge>
                                            <h3 className="text-4xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white leading-tight">{detectedStudent.name}</h3>
                                            <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-xs tracking-widest">{detectedStudent.class}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-10">
                                        <div className="p-6 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/20">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">Último Acesso</p>
                                            <p className="text-sm font-black text-neutral-900 dark:text-white">{detectedStudent.lastCheckin}</p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/20">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">Status Financeiro</p>
                                            <p className="text-sm font-black text-emerald-600">Adimplente</p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={reset}
                                    className="w-full h-20 rounded-[2rem] bg-neutral-900 dark:bg-white text-white dark:text-black font-black uppercase text-sm tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl"
                                >
                                    Próximo Check-in
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
