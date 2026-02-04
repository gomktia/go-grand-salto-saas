'use client'

import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, QrCode, User, ScanLine, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckInSmart() {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle')
    const [lastCheckIn, setLastCheckIn] = useState<string | null>(null)

    const simulateCheckIn = () => {
        setStatus('scanning')
        setTimeout(() => {
            setStatus('success')
            setLastCheckIn('Valentina Rossi')
            setTimeout(() => setStatus('idle'), 3000)
        }, 1500)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Totem de Check-in */}
                <Card className="bg-neutral-900/60 border-white/5 backdrop-blur-xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ScanLine className="text-pink-500 w-5 h-5" />
                            Portal de Entrada
                        </CardTitle>
                        <CardDescription>Aproxime o QR Code do aluno para realizar o check-in</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-10 relative">
                        <AnimatePresence mode="wait">
                            {status === 'idle' && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl shadow-pink-500/10">
                                        <QRCodeSVG value="Grand Salto-IA-TOTEM-01" size={160} />
                                    </div>
                                    <Button
                                        onClick={simulateCheckIn}
                                        className="bg-white text-black hover:bg-neutral-200 rounded-full px-8 font-bold"
                                    >
                                        Ativar Scanner (Simulação)
                                    </Button>
                                </motion.div>
                            )}

                            {status === 'scanning' && (
                                <motion.div
                                    key="scanning"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="w-48 h-48 border-2 border-pink-500 rounded-3xl flex items-center justify-center overflow-hidden relative">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/20 to-transparent h-1/2 w-full"
                                            animate={{ top: ['-50%', '100%'] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        />
                                        <QrCode className="w-16 h-16 text-pink-500 animate-pulse" />
                                    </div>
                                    <p className="text-pink-500 font-bold animate-pulse text-sm">Escaneando...</p>
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center gap-4 text-center"
                                >
                                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{lastCheckIn}</h3>
                                        <p className="text-neutral-400 text-sm">Entrada registrada com sucesso!</p>
                                    </div>
                                    <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                                        <div className="p-2 bg-pink-500 rounded-md">
                                            <ArrowRight className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-xs text-neutral-300">Notificação enviada no WhatsApp dos pais</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Fila de Espera / Cadastro Rápido */}
                <Card className="bg-neutral-900/60 border-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-sm">Recentes Hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: 'Maria Alice', time: '14:20', class: 'Baby I' },
                                { name: 'Helena Souza', time: '14:15', class: 'Jazz Juvenil' },
                                { name: 'Giovanna Lima', time: '14:05', class: 'Ballet II' },
                            ].map((student, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                                            <User className="w-4 h-4 text-neutral-500" />
                                        </div>
                                        <div className="text-xs">
                                            <div className="font-bold">{student.name}</div>
                                            <div className="text-neutral-500">{student.class}</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-pink-500 font-mono font-bold">
                                        {student.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
