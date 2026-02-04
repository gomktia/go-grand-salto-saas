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
        <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-[#800020]/30 overflow-x-hidden font-sans">
            {/* Header / Navbar */}
            <nav className="fixed top-0 w-full z-[100] border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#800020] rounded-lg flex items-center justify-center shadow-lg shadow-[#800020]/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Sparkles className="text-white w-4 h-4" />
                        </div>
                        <div className="flex flex-col -space-y-0.5">
                            <span className="text-lg font-black tracking-tighter uppercase leading-none italic text-zinc-900">Revelle</span>
                            <span className="text-[8px] text-[#800020] font-black uppercase tracking-[0.3em] whitespace-nowrap">Espaço Criativo</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        <a href="#home" className="hover:text-[#800020] transition-colors">Início</a>
                        <a href="#about" className="hover:text-[#800020] transition-colors">A Escola</a>
                        <a href="#modalidades" className="hover:text-[#800020] transition-colors">Aulas</a>
                        <a href="#horarios" className="hover:text-[#800020] transition-colors">Grade</a>
                        <a href="#reviews" className="hover:text-[#800020] transition-colors">Depoimentos</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" className="hidden sm:flex text-zinc-600 hover:text-[#800020] hover:bg-[#800020]/5 rounded-xl px-3 text-[9px] font-black uppercase tracking-widest transition-all h-8">
                                Login
                            </Button>
                        </Link>
                        <Button className="bg-[#800020] hover:bg-[#600018] text-white rounded-xl px-5 h-8 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#800020]/20 transition-all hover:scale-105 active:scale-95 border-none">
                            Matricule-se
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/revelle-hero-ballerina.png"
                        alt="Ballet Elegante - Espaço Revelle"
                        fill
                        className="object-cover object-top scale-105 animate-slow-zoom"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                </div>

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#800020]/10 border border-[#800020]/20 text-[#800020] text-[9px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl shadow-[#800020]/10 backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#800020] animate-pulse" />
                            Escola de Dança de Elite • Santa Maria
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] uppercase italic text-zinc-900">
                            Onde a <br />
                            <span className="text-[#800020]">Arte</span> <br />
                            Floresce.
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-700 mb-12 max-w-xl leading-relaxed font-medium">
                            Transcenda o movimento. Descubra uma experiência educacional transformadora que une disciplina, técnica e alma.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link href="/espaco-revelle/matricula">
                                <Button className="h-14 px-10 bg-[#800020] hover:bg-[#600018] rounded-2xl text-xs font-black uppercase tracking-[0.2em] group shadow-xl shadow-[#800020]/30 text-white">
                                    Quero Iniciar
                                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <a href="#modalidades">
                                <Button variant="outline" className="h-14 px-10 border-[#800020]/20 bg-white/50 hover:bg-white/80 text-[#800020] rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all backdrop-blur-xl">
                                    Explorar Aulas
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-5 h-9 rounded-full border border-zinc-400 flex justify-center p-1.5 backdrop-blur-sm">
                        <div className="w-1 h-2 bg-[#800020] rounded-full animate-bounce" />
                    </div>
                </div>
            </section>

            {/* Premium Stats Section */}
            <section className="py-16 bg-white border-y border-zinc-100 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#800020]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: '4.9', label: 'Nota Google', sub: 'Satisfação plena' },
                            { value: '15+', label: 'Disciplinas', sub: 'Técnicas globais' },
                            { value: '1k+', label: 'Vidas', sub: 'Transformadas' },
                            { value: '100%', label: 'Paixão', sub: 'Em cada passo' }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1 group text-center md:text-left">
                                <div className="text-3xl md:text-4xl font-black text-zinc-900 group-hover:text-[#800020] transition-colors tracking-tighter italic">
                                    {stat.value}
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[8px] text-zinc-400 uppercase tracking-[0.3em] font-black">{stat.label}</div>
                                    <div className="text-[7px] text-[#800020]/60 uppercase tracking-widest font-bold italic">{stat.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section - The Art of Belonging */}
            <section id="about" className="py-20 relative overflow-hidden bg-[#4a0012]">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-black/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="aspect-square rounded-full overflow-hidden border border-white/10 group shadow-2xl shadow-black/30 bg-white max-w-sm mx-auto lg:max-w-none">
                                <Image
                                    src="/revelle-owner.jpg"
                                    alt="Diretora Espaço Revelle"
                                    fill
                                    className="object-cover object-top group-hover:scale-110 transition-transform duration-1000 grayscale-[0.1] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Floating Card */}
                            <div className="absolute bottom-6 -right-4 lg:-right-8 p-5 rounded-2xl bg-white/95 backdrop-blur-3xl border border-white/20 shadow-2xl hidden md:block max-w-[200px]">
                                <Quote className="w-5 h-5 text-[#800020] mb-2" />
                                <p className="text-[10px] font-medium italic text-zinc-700 leading-tight">&quot;Aqui não ensinamos apenas passos, moldamos o caráter através da sensibilidade artística.&quot;</p>
                                <p className="text-[9px] font-black text-[#800020] mt-2 uppercase tracking-widest text-right">— A Diretora</p>
                            </div>
                        </div>

                        <div className="space-y-8 order-1 lg:order-2">
                            <div className="space-y-4">
                                <span className="text-white font-black uppercase tracking-[0.4em] text-[9px] px-3 py-1 rounded-full bg-white/10 border border-white/20 inline-block">Nossa Liderança</span>
                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.9] uppercase italic text-white">
                                    O Legado da <br />
                                    <span className="text-white/50">Expressão.</span>
                                </h2>
                                <p className="text-zinc-200 text-base leading-relaxed font-medium">
                                    No Revelle, cada aluno é único. Oferecemos um ambiente de elite onde a técnica rigorosa encontra o calor de uma família dedicada à arte.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { icon: <Music className="w-4 h-4" />, title: "Curadoria Artística", desc: "Metodologias exclusivas que aceleram o aprendizado." },
                                    { icon: <Award className="w-4 h-4" />, title: "Palco & Holofotes", desc: "Oportunidades anuais em grandes teatros." },
                                    { icon: <Users className="w-4 h-4" />, title: "Comunidade Seleta", desc: "Networking e conexões que transcendem o estúdio." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group rounded-xl p-3 hover:bg-white/5 transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                            <div className="text-[#800020] uppercase">
                                                {item.icon}
                                            </div>
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="font-black text-white uppercase tracking-tight group-hover:text-zinc-200 transition-colors text-xs">{item.title}</h4>
                                            <p className="text-[10px] text-zinc-300 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modalidades - The Collection (Keep White) */}
            <section id="modalidades" className="py-20 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="max-w-xl space-y-4">
                            <span className="text-[#800020] font-black uppercase tracking-[0.4em] text-[9px]">A Coleção</span>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900">Nossas Disciplinas</h2>
                            <p className="text-zinc-500 text-base font-medium">Escolha o seu caminho na arte. Do clássico absoluto ao contemporâneo visceral.</p>
                        </div>
                        <Button variant="ghost" className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-[#800020] hover:bg-[#800020]/5 h-10 px-5 rounded-full border border-zinc-200">
                            Ver Todas as Turmas <ArrowRight className="ml-2 w-3 h-3" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Baby Class", sub: "Primeiros Passos", age: "3 a 6 anos", img: "/revelle-class-baby.jpg" },
                            { title: "Jazz Premium", sub: "Energia Dinâmica", age: "Infantil & Adulto", img: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?q=80&w=2070&auto=format&fit=crop" },
                            { title: "Neo Urban", sub: "Cultura Urbana", age: "Exploração Criativa", img: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2070&auto=format&fit=crop" }
                        ].map((aula, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="group cursor-pointer relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-zinc-200 shadow-lg"
                            >
                                <Image src={aula.img} alt={aula.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute inset-0 bg-[#800020]/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute bottom-6 left-6 right-6 z-10">
                                    <div className="text-white/90 text-[7px] font-black uppercase tracking-[0.4em] mb-1.5">{aula.sub}</div>
                                    <h3 className="text-xl font-black uppercase italic mb-3 leading-none text-white">{aula.title}</h3>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <span className="text-[8px] font-black uppercase text-white/80 tracking-widest">{aula.age}</span>
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                            <ChevronRight className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Time Schedule - Visual Elite */}
            <section id="horarios" className="py-20 bg-[#4a0012] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-12 space-y-3">
                        <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[9px]">Cronograma</span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white">Planeje seus Passos</h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 via-transparent to-white/5 shadow-2xl">
                            <div className="bg-white rounded-[2.4rem] overflow-hidden shadow-2xl">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-zinc-100">
                                            <th className="p-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Aula & Nível</th>
                                            <th className="p-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Horário</th>
                                            <th className="p-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 italic w-32">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {[
                                            { class: 'Ballet Royal Junior', days: 'TER & QUI', time: '14:30 — 16:00', status: 'Inscrições Abertas' },
                                            { class: 'Contemporary Master', days: 'SEG & QUA', time: '19:00 — 21:00', status: 'Últimas Vagas' },
                                            { class: 'Jazz Funk Fusion', days: 'SEXTA-FEIRA', time: '18:00 — 19:30', status: 'Novidade' }
                                        ].map((item, i) => (
                                            <tr key={i} className="group hover:bg-zinc-50 transition-colors cursor-pointer">
                                                <td className="p-6">
                                                    <div className="font-black text-base italic text-zinc-900 group-hover:text-[#800020] transition-colors uppercase tracking-tight">{item.class}</div>
                                                    <div className="text-[8px] text-zinc-400 font-black mt-1 uppercase tracking-widest">{item.status}</div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="text-zinc-500 font-bold text-[10px] tracking-widest">{item.days}</div>
                                                    <div className="text-[#800020] font-black text-xs mt-1">{item.time}</div>
                                                </td>
                                                <td className="p-6">
                                                    <Button variant="ghost" className="h-8 px-4 rounded-full border border-zinc-200 text-[8px] font-black uppercase tracking-widest text-zinc-600 hover:bg-[#800020] hover:text-white hover:border-[#800020] transition-all">
                                                        Reservar
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

            {/* Testimonials - The Voices of Revelle (Keep White) */}
            <section id="reviews" className="py-20 relative bg-white overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#800020]/[0.03] blur-[150px] rounded-full" />
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
                        <div className="max-w-xl space-y-4 text-left">
                            <span className="text-[#800020] font-black uppercase tracking-[0.4em] text-[9px]">Depoimentos</span>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-900 leading-none">Vozes que <br /><span className="text-[#800020]">Inspiram.</span></h2>
                        </div>
                        <div className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 backdrop-blur-3xl shadow-lg relative overflow-hidden group hover:border-[#800020]/20 transition-all text-left">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[#800020]/5 blur-3xl" />
                            <div className="flex items-center mb-2 gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="relative w-3.5 h-3.5 group-hover:scale-110 transition-transform">
                                        <Image
                                            src="/revelle-logo.jpg"
                                            alt="Star"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-xl font-black text-zinc-900 italic tracking-tighter uppercase">4.9 Estrelas</div>
                            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-1">Avaliações Verificadas</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Jessica Puchalski",
                                text: "Uma experiência imersiva na dança. O cuidado com a técnica e a paixão das professoras criam um ambiente incomparável para o desenvolvimento artístico.",
                                role: "Aluna da Academia"
                            },
                            {
                                name: "Emerson Eggers",
                                text: "O Espaço Revelle tornou-se nossa segunda casa. Ver o crescimento e a felicidade das nossas crianças é um presente diário. Vida longa à Família Revelle! 💕",
                                role: "Família Revelle"
                            },
                            {
                                name: "Antonella Santini",
                                text: "Não há palavras para descrever a liberdade que sinto neste palco. Aprender com mestres que realmente amam a dança faz toda a diferença.",
                                role: "Artista Destaque"
                            }
                        ].map((review, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl -z-10" />
                                <Card className="bg-white border-zinc-100 backdrop-blur-3xl p-6 rounded-[2rem] h-full hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between shadow-lg">
                                    <div className="space-y-6">
                                        <div className="text-[#800020]/20 text-6xl font-serif leading-none h-6 select-none">“</div>
                                        <p className="text-zinc-600 text-sm italic leading-relaxed font-medium">
                                            {review.text}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-6 mt-6 border-t border-zinc-100">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#800020] to-[#4a0012] p-0.5 shadow-lg rotate-3">
                                            <div className="w-full h-full bg-white rounded-[0.4rem] flex items-center justify-center font-black text-[#800020] uppercase italic">
                                                {review.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-black text-zinc-900 uppercase italic tracking-tighter text-sm">{review.name}</div>
                                            <div className="text-[8px] text-[#800020]/80 font-black uppercase tracking-[0.3em] mt-0.5">{review.role}</div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visit Us - The Experience */}
            <section className="py-20 bg-[#4a0012] relative px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-white">
                        <div className="p-10 md:p-16 flex flex-col justify-center space-y-10 text-left bg-white relative z-10">
                            <div className="space-y-3">
                                <span className="text-[#800020] font-black uppercase tracking-[0.4em] text-[9px]">Atendimento</span>
                                <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900">Visite o <br /><span className="text-[#800020]">Estúdio.</span></h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-5 group">
                                    <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center text-[#800020] border border-zinc-200 group-hover:bg-[#800020] group-hover:text-white transition-all shadow-lg">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-zinc-900 uppercase tracking-widest text-[9px] italic">Localização</h4>
                                        <p className="text-zinc-500 text-sm font-medium leading-relaxed uppercase tracking-tighter">Av. Paulo Lauda, 225 — Tancredo Neves <br /> Santa Maria — RS, 97032-000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 group">
                                    <div className="w-9 h-9 rounded-lg bg-zinc-50 flex items-center justify-center text-[#800020] border border-zinc-200 group-hover:bg-[#800020] group-hover:text-white transition-all shadow-lg">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-zinc-900 uppercase tracking-widest text-[9px] italic">Linha Direta</h4>
                                        <p className="text-[#800020] text-lg font-black tracking-tighter">+55 (55) 99650-4558</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="h-12 px-8 bg-zinc-900 text-white hover:bg-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all w-fit">
                                Abrir no GPS
                            </Button>
                        </div>

                        <div className="relative min-h-[400px] overflow-hidden grayscale opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
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
            <footer className="py-20 bg-black border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-10" />
                <div className="container mx-auto px-6 text-center space-y-12">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-2xl shadow-black/20">
                                <Sparkles className="text-white w-6 h-6" />
                            </div>
                            <div className="flex flex-col -space-y-0.5 text-left">
                                <span className="text-2xl font-black tracking-tighter uppercase italic leading-none text-white">Revelle</span>
                                <span className="text-[9px] text-white/60 font-black uppercase tracking-[0.4em] italic">Espaço de Arte</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-8 text-white/50">
                            <a href="https://www.facebook.com/espacorevelle/" target="_blank" className="hover:text-white hover:scale-125 transition-all"><Facebook size={18} /></a>
                            <a href="https://www.instagram.com/espaco_revelle/" target="_blank" className="hover:text-white hover:scale-125 transition-all"><Instagram size={18} /></a>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.4em]">
                            © 2026 Espaço Revelle • Coleção de Dança Privada
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/40">Desenvolvido por</span>
                            <span className="text-[9px] font-black text-white tracking-widest uppercase italic">Grand Salto.IA</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Floating Button - Premium Treatment */}
            <a
                href="https://wa.me/5555996504558"
                target="_blank"
                className="fixed bottom-10 right-10 w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(37,211,102,0.4)] z-[200] hover:scale-110 active:scale-90 transition-all duration-500 group overflow-hidden"
            >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                <MessageCircle className="text-white w-7 h-7 group-hover:rotate-12 transition-transform" />
            </a>
        </div>
    )
}
