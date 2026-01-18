'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Mail, Lock, ArrowRight, Loader2, Search, Building, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getTenantByHostname, TenantConfig } from '@/lib/tenant-resolver'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [tenant, setTenant] = useState<TenantConfig | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const searchParams = new URLSearchParams(window.location.search)
        const forcedHost = searchParams.get('host')
        const hostname = forcedHost || 'revelle.grandsalto.ia'

        const detectedTenant = getTenantByHostname(hostname)
        setTenant(detectedTenant)
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()

            // Autenticação real com Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                throw new Error(authError.message)
            }

            if (!authData.user) {
                throw new Error('Falha na autenticação')
            }

            // Buscar perfil e role do usuário
            const { data: perfil, error: perfilError } = await supabase
                .from('perfis')
                .select('role, escola_id, full_name')
                .eq('id', authData.user.id)
                .single()

            if (perfilError || !perfil) {
                throw new Error('Perfil não encontrado. Contate o administrador.')
            }

            // Redirecionar baseado no role real do banco
            const roleRoutes: Record<string, string> = {
                'diretora': '/diretora',
                'professor': '/professor',
                'estudante': '/aluno',
                'pai': '/responsavel',
                'super_admin': '/superadmin'
            }

            const redirectPath = roleRoutes[perfil.role] || '/diretora'
            router.push(redirectPath)
            router.refresh()

        } catch (err) {
            console.error('Erro no login:', err)
            setError(err instanceof Error ? err.message : 'Erro ao fazer login. Verifique suas credenciais.')
            setIsLoading(false)
        }
    }

    // Cores dinâmicas ou padrão do SaaS
    const primaryColor = tenant?.primaryColor || '#db2777' // Pink-600 default
    const schoolName = tenant?.nome || 'Grand Salto'

    if (!isMounted) return null

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Dinâmico */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] blur-[120px] rounded-full -z-10 transition-colors duration-1000"
                style={{ backgroundColor: `${primaryColor}15` }} />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] blur-[120px] rounded-full -z-10 transition-colors duration-1000"
                style={{ backgroundColor: tenant ? `${tenant.secondaryColor}10` : '#7c3aed10' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md relative"
            >
                {/* Logo da Escola ou do SaaS */}
                <div className="flex flex-col items-center justify-center mb-10 gap-3">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110"
                            style={{
                                background: `linear-gradient(135deg, ${primaryColor}, ${tenant?.secondaryColor || '#7c3aed'})`,
                                boxShadow: `0 10px 30px -10px ${primaryColor}60`
                            }}>
                            {tenant?.logo_url ? (
                                <span className="text-white font-black text-2xl">{tenant.nome.substring(0, 2).toUpperCase()}</span>
                            ) : (
                                <Sparkles className="text-white w-7 h-7" />
                            )}
                        </div>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase mt-2">
                            {tenant ? (
                                <span style={{ color: primaryColor }}>{tenant.nome}</span>
                            ) : (
                                <>Grand Salto<span className="text-pink-500">.IA</span></>
                            )}
                        </h1>
                        {!tenant && <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Plataforma de Gestão para Escolas de Dança</p>}
                    </div>
                </div>

                <Card className="bg-neutral-900/80 border-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
                    {/* Barra de Topo Colorida */}
                    <div className="h-1 w-full absolute top-0 left-0" style={{ background: `linear-gradient(90deg, ${primaryColor}, transparent)` }} />

                    <CardHeader className="space-y-2 pb-2">
                        <CardTitle className="text-xl font-bold text-center text-white">
                            {tenant ? 'Portal do Aluno & Equipe' : 'Acesse sua Conta'}
                        </CardTitle>
                        <CardDescription className="text-center text-neutral-400 text-xs">
                            {tenant ? `Bem-vindo ao ambiente digital oficial do ${tenant.nome}.` : 'Entre para gerenciar sua escola.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-red-300 leading-relaxed">{error}</p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                    <Input
                                        placeholder={tenant ? "Seu e-mail cadastrado" : "email@escola.com"}
                                        type="email"
                                        className="h-11 pl-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus:border-[var(--primary)]/50 rounded-xl transition-all"
                                        style={{ '--primary': primaryColor } as React.CSSProperties}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                                    <Input
                                        placeholder="Sua senha"
                                        type="password"
                                        className="h-11 pl-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 focus:border-[var(--primary)]/50 rounded-xl transition-all"
                                        style={{ '--primary': primaryColor } as React.CSSProperties}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    backgroundColor: primaryColor,
                                    boxShadow: `0 10px 25px -5px ${primaryColor}40`
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Entrar no Portal
                                        <ArrowRight className="ml-3 w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-6 pt-2">
                        <div className="text-center text-[10px] text-neutral-500 font-medium">
                            Problemas para entrar? <Link href="#" className="hover:underline" style={{ color: primaryColor }}>Recuperar acesso</Link>
                        </div>
                        <div className="text-center">
                            <Link href="/login?host=platform" className="text-[9px] text-neutral-600 uppercase tracking-widest hover:text-white transition-colors">
                                Login Administrativo (SaaS)
                            </Link>
                        </div>

                        {!tenant && (
                            <div className="w-full bg-white/5 rounded-xl p-4 border border-white/5">
                                <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center font-bold mb-3 flex items-center justify-center gap-2">
                                    <Search className="w-3 h-3" /> Encontre sua Escola
                                </p>
                                <Button variant="outline" className="w-full text-xs h-9 bg-transparent border-white/10 hover:bg-white/5 text-neutral-300">
                                    Buscar por nome ou cidade
                                </Button>
                            </div>
                        )}

                        <div className="w-full pt-4 border-t border-white/5">
                            <p className="text-[10px] text-neutral-600 text-center uppercase tracking-widest font-bold opacity-60">
                                Powered by <span className="text-neutral-400">Grand Salto</span>
                            </p>
                        </div>

                        {/* Atalhos de Demo (Apenas para visualização) */}
                        <div className="grid grid-cols-5 gap-1 opacity-20 hover:opacity-100 transition-opacity">
                            <Link href="/diretora"><div className="h-1 bg-pink-500 rounded-full" title="Diretora" /></Link>
                            <Link href="/professor"><div className="h-1 bg-violet-500 rounded-full" title="Professor" /></Link>
                            <Link href="/aluno"><div className="h-1 bg-emerald-500 rounded-full" title="Aluno" /></Link>
                            <Link href="/responsavel"><div className="h-1 bg-amber-500 rounded-full" title="Responsável" /></Link>
                            <Link href="/superadmin"><div className="h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" title="Super Admin" /></Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

