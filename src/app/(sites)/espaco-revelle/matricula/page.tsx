'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    User,
    Phone,
    Mail,
    ArrowRight,
    ArrowLeft,
    MessageCircle,
    Calendar,
    Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import Image from 'next/image'
import { solicitarAulaExperimental } from '@/app/actions/crm'

export default function AulaExperimentalPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [tipoAluno, setTipoAluno] = useState<'crianca' | 'adulto' | null>(null)
    const [formData, setFormData] = useState({
        nome_aluno: '',
        idade_aluno: '',
        nome_responsavel: '',
        whatsapp: '',
        email: '',
        modalidade: '',
        observacoes: ''
    })

    const modalidades = [
        'Ballet',
        'Jazz',
        'K-Pop',
        'Ritmos',
        'Dança de Salão',
        'Baby Class'
    ]

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleTipoAluno = (tipo: 'crianca' | 'adulto') => {
        setTipoAluno(tipo)
        setStep(2)
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await solicitarAulaExperimental(formData)
            setStep(3)
        } catch (error) {
            console.error('Erro ao enviar:', error)
            alert('Erro ao enviar solicitação. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const isFormValid = () => {
        const baseValid = formData.nome_aluno && formData.whatsapp && formData.modalidade && formData.idade_aluno
        if (tipoAluno === 'crianca') {
            return baseValid && formData.nome_responsavel
        }
        return baseValid
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-[#800020]/30 font-sans overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#800020]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#800020]/5 blur-[120px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/espaco-revelle" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl overflow-hidden group-hover:scale-110 transition-transform">
                            <Image
                                src="/revelle-logo-icon.jpg"
                                alt="Revelle Logo"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <span className="text-lg font-bold tracking-tighter uppercase">Voltar ao Site</span>
                    </Link>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">Aula Experimental</div>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center">
                {/* Progress Bar */}
                {step < 3 && (
                    <div className="w-full max-w-md mb-12 flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-[#800020] transition-all duration-500 -translate-y-1/2 z-0"
                            style={{ width: `${((step - 1) / 1) * 100}%` }}
                        />
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${step >= i ? 'bg-[#800020] text-white shadow-lg shadow-[#800020]/40' : 'bg-zinc-900 text-neutral-500 border border-white/5'
                                    }`}
                            >
                                {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                            </div>
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* Step 1 - Tipo de Aluno */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-xl text-center"
                        >
                            <div className="mb-8">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 shadow-2xl shadow-[#800020]/30">
                                    <Image
                                        src="/revelle-logo-icon.jpg"
                                        alt="Revelle Logo"
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                    />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">
                                    Aula Experimental <span className="text-[#800020]">Gratuita</span>
                                </h1>
                                <p className="text-neutral-400">Para quem é a aula?</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                <Card
                                    className="bg-white/5 border-white/10 hover:border-[#800020]/50 hover:bg-white/[0.08] transition-all cursor-pointer p-8 text-left group"
                                    onClick={() => handleTipoAluno('crianca')}
                                >
                                    <div className="w-12 h-12 bg-[#800020]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Heart className="text-[#800020] w-6 h-6" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-1">Para meu filho(a)</h3>
                                    <p className="text-neutral-500 text-sm">Baby Class, Ballet Infantil, K-Pop Kids</p>
                                </Card>
                                <Card
                                    className="bg-white/5 border-white/10 hover:border-[#800020]/50 hover:bg-white/[0.08] transition-all cursor-pointer p-8 text-left group"
                                    onClick={() => handleTipoAluno('adulto')}
                                >
                                    <div className="w-12 h-12 bg-[#800020]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <User className="text-[#800020] w-6 h-6" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-1">Para mim</h3>
                                    <p className="text-neutral-500 text-sm">Jazz, Ritmos, Dança de Salão</p>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2 - Formulário */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-md"
                        >
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-6 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" /> Voltar
                            </button>

                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-black tracking-tighter mb-4 uppercase italic">
                                    {tipoAluno === 'crianca' ? 'Dados do Aluno' : 'Seus Dados'}
                                </h1>
                                <p className="text-neutral-400">Preencha para agendar sua aula experimental gratuita</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">
                                        Nome {tipoAluno === 'crianca' ? 'do Aluno(a)' : 'Completo'} *
                                    </label>
                                    <Input
                                        placeholder={tipoAluno === 'crianca' ? 'Nome da criança' : 'Seu nome completo'}
                                        className="h-14 bg-white/5 border-white/10 focus:border-[#800020] rounded-xl"
                                        value={formData.nome_aluno}
                                        onChange={(e) => handleInputChange('nome_aluno', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Idade *</label>
                                    <Input
                                        placeholder="Ex: 8 anos"
                                        className="h-14 bg-white/5 border-white/10 focus:border-[#800020] rounded-xl"
                                        value={formData.idade_aluno}
                                        onChange={(e) => handleInputChange('idade_aluno', e.target.value)}
                                    />
                                </div>

                                {tipoAluno === 'crianca' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Nome do Responsável *</label>
                                        <Input
                                            placeholder="Nome do pai, mãe ou responsável"
                                            className="h-14 bg-white/5 border-white/10 focus:border-[#800020] rounded-xl"
                                            value={formData.nome_responsavel}
                                            onChange={(e) => handleInputChange('nome_responsavel', e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">WhatsApp *</label>
                                    <Input
                                        placeholder="(55) 99999-9999"
                                        className="h-14 bg-white/5 border-white/10 focus:border-[#800020] rounded-xl"
                                        value={formData.whatsapp}
                                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">E-mail</label>
                                    <Input
                                        placeholder="seu@email.com"
                                        type="email"
                                        className="h-14 bg-white/5 border-white/10 focus:border-[#800020] rounded-xl"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Modalidade Desejada *</label>
                                    <Select onValueChange={(value) => handleInputChange('modalidade', value)}>
                                        <SelectTrigger className="h-14 bg-white/5 border-white/10 focus:border-[#800020] rounded-xl">
                                            <SelectValue placeholder="Selecione a modalidade" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10">
                                            {modalidades.map((mod) => (
                                                <SelectItem key={mod} value={mod} className="hover:bg-white/10">
                                                    {mod}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Observações (opcional)</label>
                                    <Textarea
                                        placeholder="Alguma informação adicional? Horário preferido?"
                                        className="bg-white/5 border-white/10 focus:border-[#800020] rounded-xl min-h-[100px]"
                                        value={formData.observacoes}
                                        onChange={(e) => handleInputChange('observacoes', e.target.value)}
                                    />
                                </div>

                                <Button
                                    className="w-full h-16 bg-[#800020] hover:bg-[#9a0028] text-lg font-bold rounded-2xl mt-8 shadow-xl shadow-[#800020]/20 disabled:opacity-50"
                                    onClick={handleSubmit}
                                    disabled={loading || !isFormValid()}
                                >
                                    {loading ? "Enviando..." : "Solicitar Aula Experimental"}
                                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>

                                <p className="text-center text-neutral-500 text-xs mt-4">
                                    Ao enviar, nossa equipe entrará em contato pelo WhatsApp para agendar sua aula.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3 - Confirmação */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-lg text-center"
                        >
                            {/* Success Animation */}
                            <motion.div
                                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.6 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </motion.div>
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">
                                Solicitação <span className="text-green-500">Enviada!</span>
                            </h1>

                            <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
                                Recebemos sua solicitação de aula experimental. Nossa equipe entrará em contato pelo WhatsApp em breve para agendar o melhor horário.
                            </p>

                            <Card className="bg-white/5 border-white/10 p-6 mb-8 text-left">
                                <h3 className="font-bold text-neutral-400 uppercase text-xs tracking-widest mb-4">Resumo</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Aluno</span>
                                        <span className="font-bold">{formData.nome_aluno}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Modalidade</span>
                                        <span className="font-bold text-[#800020]">{formData.modalidade}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">WhatsApp</span>
                                        <span className="font-bold">{formData.whatsapp}</span>
                                    </div>
                                </div>
                            </Card>

                            <div className="space-y-4">
                                <a
                                    href="https://wa.me/5555996504558?text=Olá! Acabei de solicitar uma aula experimental pelo site."
                                    target="_blank"
                                    className="block"
                                >
                                    <Button className="w-full h-14 bg-green-600 hover:bg-green-500 text-base font-bold rounded-2xl">
                                        <MessageCircle className="mr-2 w-5 h-5" />
                                        Falar pelo WhatsApp
                                    </Button>
                                </a>

                                <Link href="/espaco-revelle">
                                    <Button variant="outline" className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 text-base font-bold rounded-2xl">
                                        Voltar ao Site
                                    </Button>
                                </Link>
                            </div>

                            <p className="text-neutral-600 text-xs mt-8">
                                Aguarde nosso contato em até 24 horas úteis.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer / Contact */}
            {step < 3 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-center opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
                    <a
                        href="https://wa.me/5555996504558"
                        target="_blank"
                        className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest hover:text-[#800020] transition-colors"
                    >
                        Dúvidas? <span className="text-[#800020]">Fale conosco pelo WhatsApp</span>
                    </a>
                </div>
            )}
        </div>
    )
}
