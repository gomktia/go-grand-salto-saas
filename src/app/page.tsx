'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Sparkles,
    ChevronRight,
    Star,
    Zap,
    Camera,
    Heart,
    Check,
    Crown,
    Rocket,
    Users,
    Calendar,
    BarChart3,
    Headphones,
    Shield,
    ArrowRight,
    Menu,
    X
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

// Definição dos planos
const planos = [
    {
        id: 'starter',
        nome: 'Starter',
        preco: 97,
        precoAnual: 970,
        descricao: 'Para escolas iniciando sua jornada digital',
        icon: Zap,
        cor: 'neutral',
        popular: false,
        recursos: [
            'Até 50 alunos',
            'Até 3 turmas',
            '1 usuário administrador',
            'Site institucional básico',
            'Galeria de fotos (até 500 fotos)',
            'Agenda de aulas',
            'Suporte por email',
        ]
    },
    {
        id: 'professional',
        nome: 'Professional',
        preco: 197,
        precoAnual: 1970,
        descricao: 'Para escolas em crescimento',
        icon: Crown,
        cor: 'amber',
        popular: true,
        recursos: [
            'Até 200 alunos',
            'Até 15 turmas',
            '5 usuários administradores',
            'Site premium personalizado',
            'Galeria ilimitada de fotos',
            'Venda de fotos integrada',
            'Blog com IA para SEO',
            'Gestão financeira completa',
            'Estoque de figurinos',
            'Métricas corporais dos alunos',
            'Notificações WhatsApp',
            'Suporte prioritário',
        ]
    },
    {
        id: 'enterprise',
        nome: 'Enterprise',
        preco: 397,
        precoAnual: 3970,
        descricao: 'Para redes de escolas e grandes operações',
        icon: Rocket,
        cor: 'violet',
        popular: false,
        recursos: [
            'Alunos ilimitados',
            'Turmas ilimitadas',
            'Usuários ilimitados',
            'Múltiplas unidades/filiais',
            'Domínio personalizado',
            'API de integração',
            'Relatórios avançados',
            'Reconhecimento facial (check-in)',
            'App mobile white-label',
            'Gerente de conta dedicado',
            'Suporte 24/7',
            'Treinamento personalizado',
        ]
    }
]

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [periodoCobranca, setPeriodoCobranca] = useState<'mensal' | 'anual'>('mensal')

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-500/30 font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
                            <Sparkles className="text-black w-5 h-5" />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter">Grand Salto<span className="text-amber-400">.IA</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-neutral-400">
                        <a href="#features" className="hover:text-white transition-colors">Plataforma</a>
                        <a href="#solutions" className="hover:text-white transition-colors">Soluções</a>
                        <a href="#planos" className="hover:text-amber-400 transition-colors text-amber-500">Planos</a>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-neutral-400 hover:text-white">Entrar</Button>
                        </Link>
                        <Link href="/cadastro">
                            <Button className="bg-amber-500 hover:bg-amber-400 text-black border-none px-6 rounded-full shadow-lg shadow-amber-500/20 font-bold transition-all">
                                Começar Grátis
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden bg-black/95 border-t border-white/5 py-6 px-6"
                    >
                        <div className="flex flex-col gap-4">
                            <a href="#features" className="text-neutral-400 hover:text-white transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Plataforma</a>
                            <a href="#solutions" className="text-neutral-400 hover:text-white transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Soluções</a>
                            <a href="#planos" className="text-amber-500 hover:text-amber-400 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Planos</a>
                            <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
                                <Link href="/login">
                                    <Button variant="outline" className="w-full border-white/10">Entrar</Button>
                                </Link>
                                <Link href="/cadastro">
                                    <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold">
                                        Começar Grátis
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-amber-500/5 blur-[130px] rounded-full -z-10" />

                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <Star className="w-3 h-3 fill-amber-400" />
                            SaaS LÍDER PARA ESCOLAS DE DANÇA
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter mb-10 leading-[0.9] text-white">
                            Onde a Arte <br />encontra a IA.
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-neutral-400 mb-14 leading-relaxed max-w-3xl mx-auto font-light">
                            Do estoque de figurinos ao portal de progresso dos pais. <br className="hidden md:block" />
                            Uma plataforma inteligente desenhada para elevar cada movimento.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/cadastro">
                                <Button size="lg" className="h-14 md:h-16 px-8 md:px-10 text-base md:text-lg bg-white text-black hover:bg-neutral-200 transition-all rounded-full font-bold group">
                                    Testar 7 dias grátis
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="#planos">
                                <Button size="lg" variant="outline" className="h-14 md:h-16 px-8 md:px-10 text-base md:text-lg border-white/10 hover:bg-white/5 rounded-full font-medium">
                                    Ver Planos
                                </Button>
                            </Link>
                        </div>

                        <p className="mt-6 text-sm text-neutral-500 flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" />
                            Sem compromisso. Cancele quando quiser.
                        </p>
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
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Tudo que sua escola precisa</h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">Uma plataforma completa para gestão de escolas de dança, com ferramentas inteligentes que automatizam o dia a dia.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        <FeatureCard
                            icon={<Camera className="w-6 h-6 text-amber-400" />}
                            title="Momento do Palco"
                            description="Galerias inteligentes que os pais amam. Sistema de favoritos e compartilhamento seguro que aumenta o engajamento em 300%."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-white" />}
                            title="IA Content Assistant"
                            description="Transforme fotos de ensaios em posts de blog otimizados para SEO em segundos. Sua escola sempre no topo das buscas."
                        />
                        <FeatureCard
                            icon={<Heart className="w-6 h-6 text-rose-400" />}
                            title="Métricas do Corpo"
                            description="Gestão de medidas (busto, cintura, quadril) integrada ao estoque de figurinos. Nunca mais erre no tamanho do Tutu."
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-blue-400" />}
                            title="Gestão de Alunos"
                            description="Cadastro completo, histórico de matrículas, turmas e evolução. Portal para pais acompanharem tudo."
                        />
                        <FeatureCard
                            icon={<Calendar className="w-6 h-6 text-green-400" />}
                            title="Agenda Inteligente"
                            description="Calendário de aulas, eventos e apresentações. Sistema de check-in com reconhecimento facial opcional."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-6 h-6 text-violet-400" />}
                            title="Financeiro Completo"
                            description="Mensalidades, cobranças automatizadas via PIX, relatórios e controle de inadimplência."
                        />
                    </div>
                </div>
            </section>

            {/* Client Showcase */}
            <section id="solutions" className="py-32 bg-neutral-900/20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">Sites que encantam.</h2>
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
                                    <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Site Premium</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="planos" className="py-32 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full -z-10" />

                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-6">Planos e Preços</Badge>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
                            Escolha o plano ideal para sua escola
                        </h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto mb-10">
                            Comece com 7 dias grátis. Sem compromisso. Cancele quando quiser.
                        </p>

                        {/* Toggle Mensal/Anual */}
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => setPeriodoCobranca('mensal')}
                                className={`px-6 py-2 rounded-full transition-all ${
                                    periodoCobranca === 'mensal'
                                        ? 'bg-white text-black font-bold'
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                Mensal
                            </button>
                            <button
                                onClick={() => setPeriodoCobranca('anual')}
                                className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                                    periodoCobranca === 'anual'
                                        ? 'bg-white text-black font-bold'
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                Anual
                                <Badge className="bg-green-500/20 text-green-400 text-xs">-17%</Badge>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {planos.map((plano) => {
                            const Icon = plano.icon
                            const preco = periodoCobranca === 'anual'
                                ? Math.round(plano.precoAnual / 12)
                                : plano.preco

                            return (
                                <Card
                                    key={plano.id}
                                    className={`relative p-8 transition-all hover:scale-105 ${
                                        plano.popular
                                            ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/10'
                                            : 'bg-neutral-900/50 border-white/5 hover:border-white/20'
                                    }`}
                                >
                                    {plano.popular && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold">
                                            Mais Popular
                                        </Badge>
                                    )}

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            plano.cor === 'amber' ? 'bg-amber-500/20 text-amber-500' :
                                            plano.cor === 'violet' ? 'bg-violet-500/20 text-violet-500' :
                                            'bg-neutral-800 text-neutral-400'
                                        }`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl">{plano.nome}</h3>
                                        </div>
                                    </div>

                                    <p className="text-neutral-400 text-sm mb-6">{plano.descricao}</p>

                                    <div className="mb-8">
                                        <span className="text-5xl font-bold">R$ {preco}</span>
                                        <span className="text-neutral-400">/mês</span>
                                        {periodoCobranca === 'anual' && (
                                            <p className="text-sm text-green-400 mt-2">
                                                Cobrado R$ {plano.precoAnual}/ano
                                            </p>
                                        )}
                                    </div>

                                    <Link href={`/cadastro?plano=${plano.id}`}>
                                        <Button className={`w-full h-12 font-bold mb-8 ${
                                            plano.popular
                                                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                                                : 'bg-white/10 hover:bg-white/20 text-white'
                                        }`}>
                                            Começar Grátis
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>

                                    <ul className="space-y-3">
                                        {plano.recursos.map((recurso, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm">
                                                <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                                    plano.cor === 'amber' ? 'text-amber-500' :
                                                    plano.cor === 'violet' ? 'text-violet-500' :
                                                    'text-neutral-500'
                                                }`} />
                                                <span className="text-neutral-300">{recurso}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Trust badges */}
                    <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-neutral-500 text-sm">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            <span>Dados protegidos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Headphones className="w-5 h-5" />
                            <span>Suporte humanizado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            <span>7 dias grátis</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-32 bg-gradient-to-b from-transparent to-amber-500/5">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
                        Pronto para transformar sua escola?
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto mb-10">
                        Junte-se às melhores escolas de dança do Brasil. Comece seu teste grátis de 7 dias agora.
                    </p>
                    <Link href="/cadastro">
                        <Button size="lg" className="h-16 px-10 text-lg bg-amber-500 hover:bg-amber-400 text-black rounded-full font-bold">
                            Criar minha conta grátis
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            <footer className="py-20 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <Sparkles className="text-black w-4 h-4" />
                            </div>
                            <span className="text-lg font-bold tracking-tighter">Grand Salto<span className="text-amber-400">.IA</span></span>
                        </div>
                        <div className="flex gap-8 text-sm text-neutral-500">
                            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                            <a href="#" className="hover:text-white transition-colors">Contato</a>
                        </div>
                        <p className="text-neutral-500 text-sm">&copy; 2026 Grand Salto • Crafted for the world&apos;s best dance schools.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="p-8 md:p-10 bg-neutral-900/40 border-white/5 hover:border-amber-500/40 transition-all group cursor-default backdrop-blur-md">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner shadow-white/5">
                {icon}
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">{title}</h3>
            <p className="text-neutral-400 leading-relaxed font-light">
                {description}
            </p>
        </Card>
    )
}
