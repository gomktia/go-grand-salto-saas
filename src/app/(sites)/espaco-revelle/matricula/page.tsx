'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    Calendar,
    User,
    Phone,
    Mail,
    ArrowRight,
    Sparkles,
    CreditCard,
    ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function EnrollmentPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const nextStep = () => {
        setLoading(true)
        setTimeout(() => {
            setStep(s => s + 1)
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-red-500/30 font-sans overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/espaco-revelle" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tighter uppercase">Voltar ao Site</span>
                    </Link>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">Matrícula Online v1.0</div>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center">
                {/* Progress Bar */}
                <div className="w-full max-w-md mb-12 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-red-600 transition-all duration-500 -translate-y-1/2 z-0"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${step >= i ? 'bg-red-600 text-white shadow-lg shadow-red-600/40' : 'bg-neutral-900 text-neutral-500 border border-white/5'
                                }`}
                        >
                            {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-xl text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Para quem é a aula?</h1>
                            <p className="text-neutral-400 mb-10">Vamos começar personalizando sua experiência no Espaço Revelle.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                <Card
                                    className="bg-white/5 border-white/10 hover:border-red-600/50 hover:bg-white/[0.08] transition-all cursor-pointer p-8 text-left group"
                                    onClick={nextStep}
                                >
                                    <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Heart className="text-red-500 w-6 h-6" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-1">Para meu filho(a)</h3>
                                    <p className="text-neutral-500 text-sm italic">Baby Class, Ballet Infantil ou Jazz Kids.</p>
                                </Card>
                                <Card
                                    className="bg-white/5 border-white/10 hover:border-red-600/50 hover:bg-white/[0.08] transition-all cursor-pointer p-8 text-left group"
                                    onClick={nextStep}
                                >
                                    <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <User className="text-red-500 w-6 h-6" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-1">Para mim</h3>
                                    <p className="text-neutral-500 text-sm italic">Jazz Adulto, Contemporâneo ou Pilates.</p>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-md"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-black tracking-tighter mb-4 uppercase">Dados do Aluno</h1>
                                <p className="text-neutral-400">Só precisamos de algumas informações básicas.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Nome Completo</label>
                                    <Input placeholder="Seu nome ou do seu filho" className="h-14 bg-white/5 border-white/10 focus:ring-red-600" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">WhatsApp</label>
                                    <Input placeholder="(55) 0 0000-0000" className="h-14 bg-white/5 border-white/10" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">E-mail</label>
                                    <Input placeholder="seu@email.com" className="h-14 bg-white/5 border-white/10" />
                                </div>

                                <Button
                                    className="w-full h-16 bg-red-600 hover:bg-red-500 text-lg font-bold rounded-2xl mt-8 shadow-xl shadow-red-600/20"
                                    onClick={nextStep}
                                    disabled={loading}
                                >
                                    {loading ? "Processando..." : "Continuar para Pagamento"}
                                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-2xl"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase">Finalizar Matrícula</h1>
                                <p className="text-neutral-400 text-lg">Seja bem-vindo(a) à Família Revelle!</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="bg-white/5 border-white/10 p-8 h-fit">
                                    <h3 className="font-bold text-neutral-400 uppercase text-xs tracking-widest mb-6">Resumo</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-400">Taxa de Matrícula</span>
                                            <span className="font-bold">R$ 50,00</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-400">Mensalidade (Jan)</span>
                                            <span className="font-bold">R$ 150,00</span>
                                        </div>
                                        <div className="h-px bg-white/5 my-4" />
                                        <div className="flex justify-between items-center text-xl font-black">
                                            <span className="text-red-500 italic">Total</span>
                                            <span>R$ 200,00</span>
                                        </div>
                                    </div>
                                </Card>

                                <div className="space-y-4">
                                    <Button className="w-full h-16 bg-green-600 hover:bg-green-500 text-lg font-bold rounded-2xl flex items-center justify-center gap-3">
                                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-green-600 font-extrabold text-[10px]">pix</div>
                                        Pagar com PIX
                                    </Button>
                                    <Button variant="outline" className="w-full h-16 border-white/10 bg-white/5 hover:bg-white/10 text-lg font-bold rounded-2xl flex items-center justify-center gap-3">
                                        <CreditCard className="w-6 h-6 text-red-500" />
                                        Cartão de Crédito
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 text-neutral-600 text-[10px] font-bold uppercase tracking-widest mt-4">
                                        <ShieldCheck className="w-3 h-3" />
                                        Ambiente Seguro & Criptografado
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer / Contact */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-center opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                    Problemas com a matrícula? <span className="text-red-500 cursor-pointer">Fale conosco pelo WhatsApp</span>
                </p>
            </div>
        </div>
    )
}

function Heart(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}
