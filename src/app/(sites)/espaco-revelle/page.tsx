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
    Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default function EspacoRevelleSite() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-red-500/30 overflow-x-hidden font-sans">
            {/* Header / Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <div className="flex flex-col -space-y-1">
                            <span className="text-xl font-bold tracking-tighter uppercase">Revelle</span>
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] whitespace-nowrap">Espaço Criativo da Arte</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
                        <a href="#home" className="hover:text-white transition-colors">Início</a>
                        <a href="#about" className="hover:text-white transition-colors">A Escola</a>
                        <a href="#modalidades" className="hover:text-white transition-colors">Aulas</a>
                        <a href="#horarios" className="hover:text-white transition-colors">Grade</a>
                        <a href="#reviews" className="hover:text-white transition-colors">Depoimentos</a>
                    </div>

                    <Button className="bg-red-600 hover:bg-red-500 text-white rounded-full px-6 text-sm font-bold">
                        Falar com Consultor
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative pt-40 pb-24 md:pt-48 md:pb-40 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/sites/espaco-revelle/hero.png"
                        alt="Bailarina Espaço Revelle"
                        fill
                        className="object-cover opacity-60 grayscale-[0.3]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/20 to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                            <Star className="w-3 h-3 fill-red-500" />
                            A melhor escola de dança de Santa Maria
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
                            Onde a sua <br />
                            <span className="text-red-600">Arte ganha vida.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-300 mb-12 max-w-xl leading-relaxed">
                            Uma escola acolhedora com profissionais dedicados, apaixonados por transformar vidas através da dança. Da técnica clássica ao movimento contemporâneo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/espaco-revelle/matricula">
                                <Button className="h-14 px-8 bg-red-600 hover:bg-red-500 rounded-full text-lg font-bold group w-full sm:w-auto">
                                    Quero Dançar
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <a href="#modalidades">
                                <Button variant="outline" className="h-14 px-8 border-white/20 hover:bg-white/5 rounded-full text-lg font-bold w-full sm:w-auto">
                                    Ver Modalidades
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Social Proof Stats */}
            <section className="py-12 bg-neutral-900/50 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-black text-red-600 mb-1">4.1</div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">No Google</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-white mb-1">10+</div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Modalidades</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-white mb-1">14+</div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Avaliações Reais</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-white mb-1">100%</div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Dedicados</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 bg-neutral-950 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-red-600/10 blur-[120px] rounded-full" />

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 group">
                                <Image
                                    src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop"
                                    alt="Ensaio de dança"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-neutral-950/20" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-red-600 rounded-3xl -z-10 hidden md:block" />
                        </div>

                        <div>
                            <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Nossa Essência</span>
                            <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight uppercase">Um espaço familiar <br />onde você pertence.</h2>
                            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                                No Espaço Revelle, acreditamos que a dança vai além do palco. É sobre disciplina, paixão e, acima de tudo, comunidade. Nossas crianças amam e os pais adotam como parte da família.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: <Heart className="text-red-500" />, title: "Ensino Acolhedor", desc: "Professores que inspiram e cuidam de cada passo." },
                                    { icon: <Music className="text-red-500" />, title: "Várias Modalidades", desc: "Do Ballet Clássico ao Jazz e Danças Urbanas." },
                                    { icon: <Users className="text-red-500" />, title: "Comunidade Viva", desc: "Eventos e apresentações que unem gerações." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-neutral-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modalidades Section */}
            <section id="modalidades" className="py-32 bg-neutral-900/30">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Encontre o seu ritmo</span>
                        <h2 className="text-5xl font-black tracking-tighter mb-8 uppercase">Nossas Aulas</h2>
                        <p className="text-neutral-400">Temos turmas para todas as idades e níveis técnicas, focadas no desenvolvimento integral do aluno.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Ballet Clássico", age: "A partir de 3 anos", img: "https://images.unsplash.com/photo-1547153760-18fc21fca24b?q=80&w=1974&auto=format&fit=crop" },
                            { title: "Jazz Dance", age: "Infantil e Adulto", img: "https://images.unsplash.com/photo-1508700915892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop" },
                            { title: "Baby Class", age: "Lúdico e Pedagógico", img: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2070&auto=format&fit=crop" }
                        ].map((aula, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="group cursor-pointer relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5"
                            >
                                <Image src={aula.img} alt={aula.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-2">{aula.age}</div>
                                    <h3 className="text-2xl font-bold uppercase mb-4">{aula.title}</h3>
                                    <Button size="sm" variant="outline" className="rounded-full border-white/20 hover:bg-white hover:text-black">
                                        Saber Mais
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grade de Horários */}
            <section id="horarios" className="py-32 bg-neutral-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Grade de Horários</span>
                        <h2 className="text-5xl font-black tracking-tighter uppercase">Nossas Turmas</h2>
                    </div>

                    <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-md">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Modalidade</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Dias</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Horário</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { class: 'Ballet Baby I', days: 'Seg/Qua', time: '14:00 - 15:00' },
                                    { class: 'Contemporary Jazz', days: 'Ter/Qui', time: '19:00 - 20:30' },
                                    { class: 'Hip Hop Kids', days: 'Sábado', time: '10:00 - 11:00' }
                                ].map((item, i) => (
                                    <tr key={i} className="hover:bg-red-600/5 transition-colors">
                                        <td className="p-6 font-bold">{item.class}</td>
                                        <td className="p-6 text-neutral-400 text-sm">{item.days}</td>
                                        <td className="p-6 text-red-500 font-mono text-sm font-bold">{item.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="py-32 bg-neutral-900/40">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16 gap-4">
                        <div className="max-w-xl">
                            <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Blog Revelle</span>
                            <h2 className="text-5xl font-black tracking-tighter uppercase">Dicas e <br />Notícias</h2>
                        </div>
                        <Button variant="ghost" className="text-red-500 hover:text-red-400 font-bold uppercase tracking-widest text-[10px]">
                            Ver tudo <ArrowRight className="ml-2 w-3 h-3" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Inscrições Abertas para o Espetáculo 2026",
                                date: "18 Jan 2026",
                                desc: "O momento mais aguardado do ano está chegando. Saiba como participar da audição.",
                                img: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop"
                            },
                            {
                                title: "Benefícios do Ballet para Crianças",
                                date: "15 Jan 2026",
                                desc: "Descubra como a dança ajuda no desenvolvimento motor e social dos pequenos.",
                                img: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=2070&auto=format&fit=crop"
                            }
                        ].map((post, i) => (
                            <Card key={i} className="bg-neutral-950 border-white/5 overflow-hidden group cursor-pointer hover:border-red-600/30 transition-all">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="aspect-square relative overflow-hidden">
                                        <Image src={post.img} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <CardContent className="p-8 flex flex-col justify-center">
                                        <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-4 font-mono">{post.date}</div>
                                        <h3 className="text-2xl font-bold uppercase mb-4 leading-tight">{post.title}</h3>
                                        <p className="text-neutral-500 text-sm mb-6 line-clamp-2">{post.desc}</p>
                                        <div className="flex items-center text-white font-bold text-[10px] uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                                            Ler Artigo <ArrowRight className="w-4 h-4 text-red-600" />
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="reviews" className="py-32 relative overflow-hidden">
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 blur-[150px] rounded-full" />

                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
                        <div className="max-w-xl">
                            <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Depoimentos</span>
                            <h2 className="text-5xl font-black tracking-tighter uppercase">O que diz o <br /><span className="text-red-600">nosso público.</span></h2>
                        </div>
                        <div className="flex gap-2">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="flex text-yellow-500 mb-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">4.1 (14) no Google</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Jessica Puchalski",
                                text: "Uma escola acolhedora com professores dedicados e apaixonados por dança. Incentivam os alunos a participarem e promovem grandes apresentações.",
                                role: "Local Guide"
                            },
                            {
                                name: "Emerson Eggers",
                                text: "Espaço familiar. Nossas crianças amam. E nós pais, adotamos para nossa família... Viva Família Revelle! 💕",
                                role: "Pai de Aluno"
                            },
                            {
                                name: "Antonella Santini",
                                text: "Sou aluna da Revelle, nem sei descrever o que sinto quando estou dançando. As profs estão de parabéns! 🩰",
                                role: "Aluna"
                            }
                        ].map((review, i) => (
                            <Card key={i} className="bg-white/[0.03] border-white/5 backdrop-blur-md p-8 hover:bg-white/[0.05] transition-all">
                                <CardContent className="p-0">
                                    <div className="flex text-red-500 mb-6 font-serif text-5xl">“</div>
                                    <p className="text-neutral-300 mb-8 italic leading-relaxed">
                                        {review.text}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center font-bold text-red-500">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{review.name}</div>
                                            <div className="text-[10px] text-neutral-500 uppercase tracking-widest">{review.role}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location & CTA */}
            <section className="py-32 bg-neutral-900/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-neutral-950 rounded-[40px] overflow-hidden border border-white/5">
                        <div className="p-12 md:p-20 flex flex-col justify-center">
                            <h2 className="text-5xl font-black tracking-tighter mb-8 uppercase">Venha nos <br />visitar.</h2>

                            <div className="space-y-8 mb-12">
                                <div className="flex items-start gap-4">
                                    <MapPin className="text-red-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold mb-1">Endereço</h4>
                                        <p className="text-neutral-400 text-sm">Av. Paulo Lauda, 225 - Tancredo Neves <br /> Santa Maria - RS, 97032-000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="text-red-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold mb-1">Telefone / WhatsApp</h4>
                                        <p className="text-neutral-400 text-sm">(55) 99650-4558</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="h-14 bg-red-600 hover:bg-red-500 text-lg font-bold rounded-full w-full sm:w-auto">
                                Ver no Google Maps
                            </Button>
                        </div>

                        <div className="relative min-h-[400px]">
                            {/* Static map placeholder or iframe */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.093433602521!2d-53.88219592445749!3d-29.71714217508933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9503add5e9cc2f67%3A0x60034bc98858e92d!2sAv.%20Paulo%20Lauda%2C%20225%20-%20Tancredo%20Neves%2C%20Santa%20Maria%20-%20RS%2C%2097032-000!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
                                className="absolute inset-0 w-full h-full border-0 grayscale opacity-40 hover:opacity-100 transition-opacity duration-700"
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-neutral-950 border-t border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <div className="flex flex-col -space-y-1 text-left">
                            <span className="text-lg font-bold tracking-tighter uppercase">Revelle</span>
                            <span className="text-[8px] text-red-500 font-bold uppercase tracking-[0.2em]">Espaço Criativo da Arte</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6 mb-12 text-neutral-500">
                        <a href="https://www.facebook.com/espacorevelle/" target="_blank" className="hover:text-red-500 transition-colors"><Facebook /></a>
                        <a href="https://www.instagram.com/espaco_revelle/" target="_blank" className="hover:text-red-500 transition-colors"><Instagram /></a>
                    </div>

                    <p className="text-neutral-600 text-[10px] uppercase tracking-widest">
                        © 2026 Espaço Revelle • Desenvolvido com tecnologia <span className="text-white font-bold">Grand Salto.IA</span>
                    </p>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/5555996504558"
                target="_blank"
                className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 z-[100] hover:scale-110 transition-transform"
            >
                <MessageCircle className="text-white w-8 h-8" />
            </a>
        </div>
    )
}
