'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 2000)
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="flex justify-center mb-10">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <span className="text-3xl font-bold tracking-tighter text-white">Grand Salto<span className="text-pink-500">.IA</span></span>
                    </Link>
                </div>

                <Card className="bg-neutral-900/60 border-white/5 backdrop-blur-2xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-white">Bem-vinda de volta</CardTitle>
                        <CardDescription className="text-center text-neutral-400">
                            Gestão inteligente para sua escola de balé.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
                                    <Input
                                        placeholder="email@escola.com"
                                        type="email"
                                        className="h-11 pl-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus:border-pink-500/50 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
                                    <Input
                                        placeholder="Sua senha"
                                        type="password"
                                        className="h-11 pl-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus:border-pink-500/50 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Acessar Painel
                                        <ArrowRight className="ml-3 w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <div className="text-center text-xs text-neutral-500">
                            Esqueceu sua senha? <Link href="#" className="text-pink-500 hover:underline">Recuperar acesso</Link>
                        </div>

                        <div className="w-full h-px bg-white/5" />

                        <div className="w-full space-y-3">
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest text-center font-bold">Acesso Rápido (DEMO)</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/diretora" className="col-span-2">
                                    <Button variant="outline" className="w-full border-pink-500/20 hover:bg-pink-500/10 text-xs h-9">🛡️ Diretora (Espaço Revelle)</Button>
                                </Link>
                                <Link href="/professor">
                                    <Button variant="outline" className="w-full border-white/5 hover:bg-white/5 text-[10px] h-9">🩰 Professor</Button>
                                </Link>
                                <Link href="/aluno">
                                    <Button variant="outline" className="w-full border-white/5 hover:bg-white/5 text-[10px] h-9">👧 Aluna</Button>
                                </Link>
                                <Link href="/responsavel">
                                    <Button variant="outline" className="w-full border-white/5 hover:bg-white/5 text-[10px] h-9">👨‍👩‍👧 Pai/Responsável</Button>
                                </Link>
                                <Link href="/superadmin">
                                    <Button variant="outline" className="w-full border-white/5 hover:bg-white/5 text-[10px] h-9">⚙️ Super Admin</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5" />
                        <div className="text-center text-xs text-neutral-500">
                            Não é cliente Grand Salto? <Link href="/" className="text-white hover:underline">Assinar Agora</Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
