'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Sparkles,
    CheckCircle2,
    Mail,
    ExternalLink,
    Copy,
    ArrowRight,
    PartyPopper,
    Clock,
    Shield
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

function SucessoContent() {
    const searchParams = useSearchParams()
    const escola = searchParams.get('escola') || 'sua-escola'
    const email = searchParams.get('email') || ''
    const [copied, setCopied] = useState(false)

    const urlEscola = `https://${escola}.grandsalto.ia`

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(urlEscola)
            setCopied(true)
            toast.success('URL copiada!')
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error('Erro ao copiar')
        }
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
                            <Sparkles className="text-black w-5 h-5" />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter">Grand Salto<span className="text-amber-400">.IA</span></span>
                    </Link>
                </div>
            </nav>

            <div className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <div className="mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <PartyPopper className="w-6 h-6 text-amber-400" />
                                    <span className="text-amber-400 font-bold">Parabéns!</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                    Sua escola foi criada!
                                </h1>
                                <p className="text-neutral-400 text-lg">
                                    Sua jornada com Grand Salto.IA começa agora.
                                </p>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="p-8 bg-neutral-900/50 border-white/5 mb-8">
                                <h3 className="font-bold text-lg mb-6">Próximos passos</h3>

                                <div className="space-y-6">
                                    {/* Email de confirmação */}
                                    <div className="flex items-start gap-4 text-left">
                                        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Confirme seu email</h4>
                                            <p className="text-neutral-400 text-sm mt-1">
                                                Enviamos um link de confirmação para <span className="text-white">{email}</span>.
                                                Verifique sua caixa de entrada e spam.
                                            </p>
                                        </div>
                                    </div>

                                    {/* URL da escola */}
                                    <div className="flex items-start gap-4 text-left">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <ExternalLink className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold">URL da sua escola</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex-1 bg-neutral-800 rounded-lg p-3 font-mono text-sm text-amber-400">
                                                    {urlEscola}
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={copyToClipboard}
                                                    className="border-neutral-700 hover:bg-neutral-800"
                                                >
                                                    <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`} />
                                                </Button>
                                            </div>
                                            <p className="text-neutral-500 text-xs mt-2">
                                                Compartilhe esta URL com alunos, pais e professores
                                            </p>
                                        </div>
                                    </div>

                                    {/* Trial */}
                                    <div className="flex items-start gap-4 text-left">
                                        <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-violet-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">7 dias grátis</h4>
                                            <p className="text-neutral-400 text-sm mt-1">
                                                Seu período de teste gratuito começou. Explore todas as funcionalidades
                                                sem compromisso. Você será avisado antes de qualquer cobrança.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href={`/login?redirect=${escola}`}>
                                    <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 h-14 text-lg">
                                        Acessar minha escola
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Info de segurança */}
                            <div className="mt-12 flex items-center justify-center gap-2 text-neutral-500 text-sm">
                                <Shield className="w-4 h-4" />
                                <span>Seus dados estão protegidos com criptografia de ponta a ponta</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default function CadastroSucessoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
            </div>
        }>
            <SucessoContent />
        </Suspense>
    )
}
