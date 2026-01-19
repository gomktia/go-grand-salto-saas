'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Check,
    MessageCircle,
    ArrowRight,
    Music,
    Award,
    Users,
    Sparkles,
    Star,
    ChevronRight,
    MapPin,
    Phone,
    Instagram,
    Facebook,
    Play,
    Heart,
    Clock,
    Quote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { BlogSection } from './blog-section'
import { CalendarSection } from './calendar-section'
import { VideosSection } from './videos-section'

export default function EspacoRevelleSite() {
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-rose-500/30 overflow-x-hidden font-sans">
            {/* Header / Navbar */}
            <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-rose-600/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Sparkles className="text-white w-7 h-7" />
                        </div>
                        <div className="flex flex-col -space-y-1">
                            <span className="text-2xl font-black tracking-tighter uppercase leading-none italic">Revelle</span>
                            <span className="text-[10px] text-rose-500 font-black uppercase tracking-[0.3em] whitespace-nowrap">Creative Art Space</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        <a href="#home" className="hover:text-white transition-colors">Início</a>
                        <a href="#about" className="hover:text-white transition-colors">A Escola</a>
                        <a href="#modalidades" className="hover:text-white transition-colors">Aulas</a>
                        <a href="#horarios" className="hover:text-white transition-colors">Grade</a>
                        <a href="#reviews" className="hover:text-white transition-colors">Depoimentos</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="hidden sm:flex text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl px-5 text-xs font-black uppercase tracking-widest transition-all">
                                Login
                            </Button>
                        </Link>
                        <Button className="bg-rose-600 hover:bg-rose-500 text-white rounded-2xl px-8 h-12 text-xs font-black uppercase tracking-widest shadow-2xl shadow-rose-600/20 transition-all hover:scale-105 active:scale-95 border-none">
                            Matricule-se
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/sites/espaco-revelle/hero.png"
                        alt="Bailarina Espaço Revelle"
                        fill
                        className="object-cover scale-110 animate-slow-zoom"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-60" />
                </div>

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-rose-600/10 border border-rose-600/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-2xl shadow-rose-600/10 backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Elite Dance Academy • Santa Maria
                        </div>
                        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-10 leading-[0.8] uppercase italic">
                            Onde a <br />
                            <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">Arte</span> <br />
                            <span className="text-rose-600">Floresce.</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-zinc-400 mb-16 max-w-2xl leading-relaxed font-medium">
                            Transcenda o movimento. Descubra uma experiência educacional transformadora que une disciplina, técnica e alma.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/espaco-revelle/matricula">
                                <Button className="h-16 px-12 bg-rose-600 hover:bg-rose-500 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] group shadow-2xl shadow-rose-600/30">
                                    Quero Iniciar
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <a href="#modalidades">
                                <Button variant="outline" className="h-16 px-12 border-white/10 bg-white/5 hover:bg-white/10 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] transition-all backdrop-blur-xl">
                                    Explorar Aulas
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center p-1.5 backdrop-blur-sm">
                        <div className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" />
                    </div>
                </div>
            </section>

            {/* Premium Stats Section */}
            <section className="py-24 bg-zinc-900/20 backdrop-blur-3xl border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
                        {[
                            { value: '4.9', label: 'Google Rating', sub: 'Satisfação plena' },
                            { value: '15+', label: 'Disciplinas', sub: 'Técnicas globais' },
                            { value: '1k+', label: 'Vidas', sub: 'Transformadas' },
                            { value: '100%', label: 'Paixão', sub: 'Em cada passo' }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2 group">
                                <div className="text-5xl md:text-6xl font-black text-white group-hover:text-rose-500 transition-colors tracking-tighter italic">
                                    {stat.value}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black">{stat.label}</div>
                                    <div className="text-[9px] text-rose-500/60 uppercase tracking-widest font-bold italic">{stat.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section - The Art of Belonging */}
            <section id="about" className="py-40 relative overflow-hidden bg-[#050505]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl shadow-rose-900/10">
                                <Image
                                    src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2070&auto=format&fit=crop"
                                    alt="Premiere Dance Studio"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-rose-600/10 blur-[100px] -z-10" />

                            {/* Floating Card */}
                            <div className="absolute bottom-10 -right-10 p-8 rounded-[2rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl hidden md:block max-w-[240px]">
                                <Quote className="w-8 h-8 text-rose-500 mb-4" />
                                <p className="text-sm font-medium italic text-zinc-300">&quot;Aqui não ensinamos apenas passos, moldamos o caráter através da sensibilidade artística.&quot;</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-6">
                                <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 inline-block">Nossa Essência</span>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic text-white">
                                    O Legado da <br />
                                    <span className="text-rose-600">Expressão.</span>
                                </h2>
                                <p className="text-zinc-400 text-xl leading-relaxed font-medium">
                                    No Revelle, cada aluno é único. Oferecemos um ambiente de elite onde a técnica rigorosa encontra o calor de uma família dedicada à arte.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                {[
                                    { icon: <Music className="w-6 h-6" />, title: "Curadoria Artística", desc: "Metodologias exclusivas que aceleram o aprendizado técnico e emocional." },
                                    { icon: <Award className="w-6 h-6" />, title: "Palco & Holofotes", desc: "Oportunidades anuais em grandes teatros para vivenciar a magia da performance." },
                                    { icon: <Users className="w-6 h-6" />, title: "Comunidade Seleta", desc: "Networking e conexões que transcendem as paredes do estúdio." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-rose-600 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-rose-600/30 group-hover:-rotate-6">
                                            <div className="text-rose-500 group-hover:text-white transition-colors uppercase">
                                                {item.icon}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-black text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors uppercase">{item.title}</h4>
                                            <p className="text-sm text-zinc-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modalidades - The Collection */}
            <section id="modalidades" className="py-40 bg-[#0a0a0a] relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24">
                        <div className="max-w-2xl space-y-6">
                            <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px]">The Collection</span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white">Nossas Disciplinas</h2>
                            <p className="text-zinc-500 text-xl font-medium">Escolha o seu caminho na arte. Do clássico absoluto ao contemporâneo visceral.</p>
                        </div>
                        <Button variant="ghost" className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:bg-white/5 h-14 px-8 rounded-full border border-white/5">
                            Ver Todas as Turmas <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Ballet Clássico", sub: "Foundation of Grace", age: "3 a 80 anos", img: "https://images.unsplash.com/photo-1547153760-18fc21fca24b?q=80&w=1974&auto=format&fit=crop" },
                            { title: "Jazz Premium", sub: "Dynamic Energy", age: "Infantil & Adulto", img: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?q=80&w=2070&auto=format&fit=crop" },
                            { title: "Neo Urban", sub: "Street Culture", age: "Exploração Criativa", img: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2070&auto=format&fit=crop" }
                        ].map((aula, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -20 }}
                                className="group cursor-pointer relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl"
                            >
                                <Image src={aula.img} alt={aula.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-120 grayscale-[0.2] group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                                <div className="absolute inset-0 bg-rose-900/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute bottom-10 left-10 right-10 z-10">
                                    <div className="text-rose-500 text-[9px] font-black uppercase tracking-[0.4em] mb-3">{aula.sub}</div>
                                    <h3 className="text-3xl font-black uppercase italic mb-6 leading-none text-white">{aula.title}</h3>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{aula.age}</span>
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                            <ChevronRight className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Time Schedule - Visual Elite */}
            <section id="horarios" className="py-40 bg-[#050505] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.03)_0%,transparent_70%)]" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-24 space-y-4">
                        <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px]">Schedule</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white">Planeje seus Passos</h2>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="p-1 rounded-[4rem] bg-gradient-to-br from-white/10 via-transparent to-white/5 shadow-2xl">
                            <div className="bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[3.8rem] overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Aula & Nível</th>
                                            <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Cronograma</th>
                                            <th className="p-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Investimento</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {[
                                            { class: 'Ballet Royal Junior', days: 'TER & QUI', time: '14:30 — 16:00', status: 'Inscrições Abertas' },
                                            { class: 'Contemporary Master', days: 'SEG & QUA', time: '19:00 — 21:00', status: 'Últimas Vagas' },
                                            { class: 'Jazz Funk Fusion', days: 'SEXTA-FEIRA', time: '18:00 — 19:30', status: 'Novidade' }
                                        ].map((item, i) => (
                                            <tr key={i} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                                <td className="p-10">
                                                    <div className="font-black text-xl italic text-white group-hover:text-rose-500 transition-colors uppercase tracking-tight">{item.class}</div>
                                                    <div className="text-[9px] text-zinc-500 font-black mt-2 uppercase tracking-widest">{item.status}</div>
                                                </td>
                                                <td className="p-10">
                                                    <div className="text-zinc-300 font-bold text-sm tracking-widest">{item.days}</div>
                                                    <div className="text-rose-500 font-black text-sm mt-1">{item.time}</div>
                                                </td>
                                                <td className="p-10">
                                                    <Button variant="ghost" className="h-10 px-6 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest bg-white/5 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-all">
                                                        Reservar Vaga
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BlogSection />
            <VideosSection />
            <CalendarSection />

            {/* Testimonials - The Voices of Revelle */}
            <section id="reviews" className="py-40 relative bg-[#0a0a0a] overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/[0.02] blur-[150px] rounded-full" />
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-32 gap-10">
                        <div className="max-w-xl space-y-6 text-left">
                            <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px]">Testimonials</span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">Vozes que <br /><span className="text-rose-600">Inspiram.</span></h2>
                        </div>
                        <div className="p-10 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-rose-500/20 transition-all text-left">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600/5 blur-3xl" />
                            <div className="flex text-rose-500 mb-2 gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />)}
                            </div>
                            <div className="text-3xl font-black text-white italic tracking-tighter uppercase">4.9 Stars</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-2">Certified Google Reviews</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                name: "Jessica Puchalski",
                                text: "Uma experiência imersiva na dança. O cuidado com a técnica e a paixão das professoras criam um ambiente incomparável para o desenvolvimento artístico.",
                                role: "Elite Academy Member"
                            },
                            {
                                name: "Emerson Eggers",
                                text: "O Espaço Revelle tornou-se nossa segunda casa. Ver o crescimento e a felicidade das nossas crianças é um presente diário. Vida longa à Família Revelle! 💕",
                                role: "Revelle Family"
                            },
                            {
                                name: "Antonella Santini",
                                text: "Não há palavras para descrever a liberdade que sinto neste palco. Aprender com mestres que realmente amam a dança faz toda a diferença.",
                                role: "Featured Artist"
                            }
                        ].map((review, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl -z-10" />
                                <Card className="bg-white/[0.04] border-white/5 backdrop-blur-3xl p-10 rounded-[3rem] h-full hover:-translate-y-4 transition-all duration-500 flex flex-col justify-between shadow-2xl">
                                    <div className="space-y-10">
                                        <div className="text-rose-600/30 text-8xl font-serif leading-none h-10 select-none">“</div>
                                        <p className="text-zinc-300 text-lg italic leading-relaxed font-medium">
                                            {review.text}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6 pt-10 mt-10 border-t border-white/5">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-900 p-0.5 shadow-xl rotate-3">
                                            <div className="w-full h-full bg-[#0a0a0a] rounded-[0.9rem] flex items-center justify-center font-black text-white uppercase italic">
                                                {review.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-black text-white uppercase italic tracking-tighter text-lg">{review.name}</div>
                                            <div className="text-[10px] text-rose-500/80 font-black uppercase tracking-[0.3em] mt-0.5">{review.role}</div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visit Us - The Experience */}
            <section className="py-40 bg-[#050505] relative px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[5rem] overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(225,29,72,0.1)] bg-[#0a0a0a]">
                        <div className="p-16 md:p-32 flex flex-col justify-center space-y-16 text-left">
                            <div className="space-y-6">
                                <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px]">Concierge</span>
                                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] text-white">Visit The <br /><span className="text-rose-600">Studio.</span></h2>
                            </div>

                            <div className="space-y-12">
                                <div className="flex items-start gap-8 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-rose-500 border border-white/10 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xl">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-black text-white uppercase tracking-widest text-xs italic">Location</h4>
                                        <p className="text-zinc-500 text-lg font-medium leading-relaxed uppercase tracking-tighter">Av. Paulo Lauda, 225 — Tancredo Neves <br /> Santa Maria — RS, 97032-000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-8 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-rose-500 border border-white/10 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xl">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-black text-white uppercase tracking-widest text-xs italic">Direct Line</h4>
                                        <p className="text-rose-500 text-2xl font-black tracking-tighter">+55 (55) 99650-4558</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="h-16 px-12 bg-white text-black hover:bg-zinc-200 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all w-fit">
                                Abrir GPS Navigation
                            </Button>
                        </div>

                        <div className="relative min-h-[600px] overflow-hidden grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.093433602521!2d-53.88219592445749!3d-29.71714217508933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9503add5e9cc2f67%3A0x60034bc98858e92d!2sAv.%20Paulo%20Lauda%2C%20225%20-%20Tancredo%20Neves%2C%20Santa%20Maria%20-%20RS%2C%2097032-000!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
                                className="absolute inset-0 w-full h-full border-0"
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="py-32 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent opacity-20" />
                <div className="container mx-auto px-6 text-center space-y-20">
                    <div className="flex flex-col items-center gap-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-rose-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-rose-600/30">
                                <Sparkles className="text-white w-9 h-9" />
                            </div>
                            <div className="flex flex-col -space-y-2 text-left">
                                <span className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Revelle</span>
                                <span className="text-xs text-rose-500 font-black uppercase tracking-[0.4em] italic">Art Space</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-12 text-zinc-600">
                            <a href="https://www.facebook.com/espacorevelle/" target="_blank" className="hover:text-rose-500 hover:scale-125 transition-all"><Facebook size={24} /></a>
                            <a href="https://www.instagram.com/espaco_revelle/" target="_blank" className="hover:text-rose-500 hover:scale-125 transition-all"><Instagram size={24} /></a>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
                            © 2026 Espaço Revelle • Private Dance Collection
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700">Powered by</span>
                            <span className="text-xs font-black text-white tracking-widest uppercase italic">Grand Salto.IA</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Floating Button - Premium Treatment */}
            <a
                href="https://wa.me/5555996504558"
                target="_blank"
                className="fixed bottom-12 right-12 w-20 h-20 bg-[#25D366] rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(37,211,102,0.4)] z-[200] hover:scale-110 active:scale-90 transition-all duration-500 group overflow-hidden"
            >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                <MessageCircle className="text-white w-10 h-10 group-hover:rotate-12 transition-transform" />
            </a>
        </div>
    )
}
