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
    Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function FaceCheckinPage() {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
    const [scanProgress, setScanProgress] = useState(0)
    const [detectedStudent, setDetectedStudent] = useState<any>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

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
                lastCheckin: 'Ontem, 16:00'
            })
        }, 500)
    }

    const reset = () => {
        setStatus('idle')
        setScanProgress(0)
        setDetectedStudent(null)
    }

    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        Reconhecimento Facial
                        <Badge className="bg-pink-500/10 text-pink-500 border-pink-500/20 uppercase text-[10px] tracking-widest">Tecnologia IA</Badge>
                    </h1>
                    <p className="text-neutral-500 mt-1">Controle de acesso inteligente e sem contato.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Sistema Operacional</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Camera Viewport */}
                <Card className="lg:col-span-2 bg-neutral-950 border-white/5 overflow-hidden relative group">
                    <div className="aspect-video bg-neutral-900 flex items-center justify-center relative">
                        {/* Simulated Camera Overlay */}
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            {/* Scanning Corners */}
                            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-pink-500 rounded-tl-2xl opacity-50" />
                            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-pink-500 rounded-tr-2xl opacity-50" />
                            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-pink-500 rounded-bl-2xl opacity-50" />
                            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-pink-500 rounded-br-2xl opacity-50" />

                            {/* Scanning Line */}
                            {status === 'scanning' && (
                                <motion.div
                                    initial={{ top: '10%' }}
                                    animate={{ top: '90%' }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                                />
                            )}
                        </div>

                        {status === 'idle' && (
                            <div className="text-center space-y-6 z-20">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 group-hover:scale-110 transition-transform">
                                    <Camera className="w-8 h-8 text-neutral-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold">Câmera em espera</h3>
                                    <p className="text-sm text-neutral-500 max-w-xs mx-auto">Posicione o aluno em frente à câmera para iniciar a validação automática.</p>
                                </div>
                                <Button
                                    onClick={startScan}
                                    className="bg-pink-600 hover:bg-pink-500 px-8 rounded-full font-bold h-12"
                                >
                                    Iniciar Escaneamento
                                </Button>
                            </div>
                        )}

                        {status === 'scanning' && (
                            <div className="text-center z-20 bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                                <RefreshCcw className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Processando Biometria...</h3>
                                <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                                    <motion.div
                                        className="h-full bg-pink-500"
                                        style={{ width: `${scanProgress}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-neutral-500 mt-4 uppercase tracking-[0.2em]">Neural Engine v4.2</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-20 bg-emerald-500/90 text-white p-10 rounded-full aspect-square flex flex-col items-center justify-center"
                            >
                                <CheckCircle2 className="w-16 h-16 mb-2" />
                                <div className="font-black text-2xl uppercase tracking-tighter">Confirmado</div>
                            </motion.div>
                        )}
                    </div>
                </Card>

                {/* Info Panel */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <Card className="bg-emerald-500/10 border-emerald-500/20 p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl font-black">
                                            {detectedStudent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{detectedStudent.name}</h3>
                                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/5">
                                                {detectedStudent.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm py-2 border-b border-white/5">
                                            <span className="text-neutral-500">Turma</span>
                                            <span className="font-bold">{detectedStudent.class}</span>
                                        </div>
                                        <div className="flex justify-between text-sm py-2 border-b border-white/5">
                                            <span className="text-neutral-500">Último Acesso</span>
                                            <span className="font-bold">{detectedStudent.lastCheckin}</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={reset}
                                        className="w-full mt-8 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold"
                                    >
                                        Próximo Aluno
                                    </Button>
                                </Card>

                                <Card className="bg-neutral-900 border-white/5 p-6">
                                    <div className="flex items-center gap-3 text-pink-500 mb-4">
                                        <Zap className="w-5 h-5 fill-pink-500" />
                                        <span className="font-bold uppercase text-xs tracking-widest">Ações Rápidas</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="text-[10px] h-12 uppercase font-bold border-white/5">Ver Ficha</Button>
                                        <Button variant="outline" className="text-[10px] h-12 uppercase font-bold border-white/5">Finanç.</Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="tips"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <Card className="bg-neutral-900/40 border-white/5 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <ShieldCheck className="text-pink-500 w-5 h-5" />
                                        <h4 className="font-bold">Dicas de Acesso</h4>
                                    </div>
                                    <ul className="text-sm text-neutral-500 space-y-3 leading-relaxed">
                                        <li className="flex gap-2">
                                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 shrink-0" />
                                            Certifique-se que a iluminação está frontal.
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 shrink-0" />
                                            Remova óculos escuros ou chapéus volumosos.
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 shrink-0" />
                                            Mantenha-se a pelo menos 1 metro da câmera.
                                        </li>
                                    </ul>
                                </Card>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Lock className="w-4 h-4 text-neutral-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Privacidade</span>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 leading-relaxed">
                                        Seus dados biométricos são criptografados de ponta a ponta e processados localmente. Atendendo à LGPD.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
