'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Sparkles,
    Users,
    Calendar,
    Image as ImageIcon,
    ShoppingBag,
    ChevronRight,
    Star,
    Zap,
    Camera,
    Heart
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-pink-500/30 font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter">Grand Salto<span className="text-pink-500">.IA</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-neutral-400">
                        <a href="#features" className="hover:text-white transition-colors">Plataforma</a>
                        <a href="#solutions" className="hover:text-white transition-colors">Soluções</a>
                        <a href="#premium" className="hover:text-white transition-colors text-pink-500">Premium</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-neutral-400 hover:text-white">Entrar</Button>
                        </Link>
                        <Button className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 border-none px-6 rounded-full shadow-lg shadow-pink-500/20 font-bold">
                            Experimentar Grátis
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-pink-500/10 blur-[130px] rounded-full -z-10" />

                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-pink-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <Star className="w-3 h-3 fill-pink-400" />
                            SaaS LÍDER PARA ESCOLAS DE DANÇA
                        </div>
                        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter mb-10 leading-[0.9] bg-gradient-to-b from-white via-white to-neutral-600 bg-clip-text text-transparent">
                            Onde a Arte <br />encontra a IA.
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 mb-14 leading-relaxed max-w-3xl mx-auto font-light">
                            Do estoque de figurinos ao portal de progresso dos pais. <br className="hidden md:block" />
                            Uma plataforma inteligente desenhada para elevar cada movimento.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Button size="lg" className="h-16 px-10 text-lg bg-white text-black hover:bg-neutral-200 transition-all rounded-full font-bold group">
                                Começar agora
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-white/10 hover:bg-white/5 rounded-full font-medium">
                                Agendar Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-20 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-6">
                    <p className="text-center text-neutral-500 text-sm font-bold uppercase tracking-widest mb-10">Confiado por escolas de elite</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-white">ER</div>
                            <span className="text-xl font-bold tracking-tighter">Espaço Revelle</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature High Retention Grid */}
            <section id="features" className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Camera className="w-6 h-6 text-pink-500" />}
                            title="Momento do Palco"
                            description="Galerias inteligentes que os pais amam. Sistema de favoritos e compartilhamento seguro que aumenta o engajamento em 300%."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-violet-500" />}
                            title="IA Content Assistant"
                            description="Transforme fotos de ensaios em posts de blog otimizados para SEO em segundos. Sua escola sempre no topo das buscas."
                        />
                        <FeatureCard
                            icon={<Heart className="w-6 h-6 text-blue-500" />}
                            title="Métricas do Corpo"
                            description="Gestão de medidas (busto, cintura, quadril) integrada ao estoque de figurinos. Nunca mais erre no tamanho do Tutu."
                        />
                    </div>
                </div>
            </section>

            {/* Client Showcase */}
            <section id="solutions" className="py-32 bg-neutral-900/20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Sites que encantam.</h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">Sua escola merece uma presença digital tão elegante quanto suas coreografias. Criamos sites personalizados integrados ao seu sistema.</p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="relative group rounded-3xl overflow-hidden border border-white/5 bg-neutral-900 shadow-2xl">
                            <div className="aspect-video relative">
                                <Image
                                    src="/sites/espaco-revelle/hero.png"
                                    alt="Preview Espaço Revelle"
                                    fill
                                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                                    <Link href="/espaco-revelle">
                                        <Button className="bg-white text-black hover:bg-neutral-200 font-bold rounded-full px-8 h-14">
                                            Ver Site ao Vivo
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="p-8 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold">Espaço Revelle</h3>
                                        <p className="text-neutral-500 text-sm">Escola de Dança em Santa Maria - RS</p>
                                    </div>
                                    <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/20 border-red-500/20">Site Premium</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-20 border-t border-white/5 text-center">
                <div className="container mx-auto px-6">
                    <p className="text-neutral-500 text-sm">&copy; 2026 Grand Salto • Crafted for the world's best dance schools.</p>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="p-10 bg-neutral-900/40 border-white/5 hover:border-pink-500/40 transition-all group cursor-default backdrop-blur-md">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner shadow-white/5">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
            <p className="text-neutral-400 leading-relaxed font-light">
                {description}
            </p>
        </Card>
    )
}
