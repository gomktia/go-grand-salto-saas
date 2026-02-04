'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Check,
    MessageCircle,
    ArrowRight,
    Music,
    Award,
    Users,
    Star,
    ChevronRight,
    MapPin,
    Phone,
    Instagram,
    Facebook,
    Play,
    Heart,
    Clock,
    Quote,
    Menu,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { BlogSection } from './blog-section'
import { CalendarSection } from './calendar-section'
import { VideosSection } from './videos-section'

export default function EspacoRevelleSite() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    // Prevent scroll when menu is open
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-[#800020]/30 overflow-x-hidden font-sans">
            {/* Header / Navbar */}
            <nav className="fixed top-0 w-full z-[100] border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-[#800020]/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Image src="/revelle-logo-icon.jpg" alt="Revelle Logo" width={32} height={32} className="object-cover" />
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
                        <Button className="bg-[#800020] hover:bg-[#600018] text-white rounded-xl px-4 sm:px-5 h-8 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#800020]/20 transition-all hover:scale-105 active:scale-95 border-none">
                            Matricule-se
                        </Button>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden w-8 h-8 text-zinc-900"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="fixed inset-0 z-[110] bg-white text-zinc-900 flex flex-col"
                        >
                            {/* Header inside Menu */}
                            <div className="container mx-auto px-6 h-16 flex items-center justify-between border-b border-zinc-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-[#800020]/30">
                                        <Image src="/revelle-logo-icon.jpg" alt="Revelle Logo" width={32} height={32} className="object-cover" />
                                    </div>
                                    <span className="text-lg font-black tracking-tighter uppercase leading-none italic">Revelle</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 text-zinc-900"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Menu Links */}
                            <div className="flex-1 flex flex-col justify-center items-center gap-8 p-6 bg-[radial-gradient(circle_at_top_right,rgba(128,0,32,0.05),transparent_40%)]">
                                {[
                                    { href: '#home', label: 'Início' },
                                    { href: '#about', label: 'A Escola' },
                                    { href: '#modalidades', label: 'Modalidades' },
                                    { href: '#horarios', label: 'Horários' },
                                    { href: '#reviews', label: 'Depoimentos' },
                                ].map((link, i) => (
                                    <motion.a
                                        key={link.href}
                                        href={link.href}
                                        className="text-3xl font-black uppercase italic tracking-tight hover:text-[#800020] transition-colors"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.1 }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-8 flex flex-col gap-4 w-full max-w-xs"
                                >
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full h-12 rounded-xl uppercase font-bold tracking-widest border-zinc-200">
                                            Área do Aluno
                                        </Button>
                                    </Link>
                                    <Link href="/espaco-revelle/matricula" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full h-12 bg-[#800020] hover:bg-[#600018] text-white rounded-xl uppercase font-black tracking-widest shadow-xl shadow-[#800020]/20">
                                            Quero me Matricular
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Footer inside Menu */}
                            <div className="p-6 text-center text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
                                Espaço Revelle © 2026
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section - Futuristic Animated Design */}
            <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background Image with Slow Zoom */}
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: 'easeOut' }}
                >
                    <Image
                        src="/ballet-dancer-illuminated-stockcake.webp"
                        alt="Ballet Elegante - Espaço Revelle"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                </motion.div>

                {/* Animated Floating Particles */}
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full"
                            style={{
                                left: `${15 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.6, 0.2],
                            }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.3,
                            }}
                        />
                    ))}
                </div>

                {/* Animated Glowing Orbs */}
                <motion.div
                    className="absolute top-20 left-1/4 w-64 h-64 bg-[#800020]/20 rounded-full blur-[100px] pointer-events-none"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute bottom-40 right-1/4 w-48 h-48 bg-[#800020]/10 rounded-full blur-[80px] pointer-events-none"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />

                {/* Animated Line Accent */}
                <motion.div
                    className="absolute left-0 top-1/2 w-32 h-[1px] bg-gradient-to-r from-[#800020] to-transparent"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                />

                <div className="container mx-auto px-6 relative z-10 pt-28 pb-20">
                    <div className="max-w-2xl">
                        {/* Location Badge - Animated */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-[9px] font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <MapPin className="w-3 h-3" />
                            </motion.div>
                            Santa Maria — RS
                        </motion.div>

                        {/* Main Title - Stagger Animation */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9] uppercase italic text-white">
                            <motion.span
                                className="block"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                Onde a
                            </motion.span>
                            <motion.span
                                className="block text-[#800020] relative"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                <motion.span
                                    className="relative z-10"
                                    animate={{
                                        textShadow: [
                                            '0 0 20px rgba(128,0,32,0.5)',
                                            '0 0 40px rgba(128,0,32,0.8)',
                                            '0 0 20px rgba(128,0,32,0.5)',
                                        ],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    Arte
                                </motion.span>
                            </motion.span>
                            <motion.span
                                className="block text-white/90"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                            >
                                Floresce.
                            </motion.span>
                        </h1>

                        {/* Animated Decorative Line */}
                        <motion.div
                            className="w-20 h-[2px] bg-gradient-to-r from-[#800020] via-[#800020] to-transparent mb-6"
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                        />

                        {/* Subtitle - Fade In */}
                        <motion.p
                            className="text-lg md:text-xl text-white/70 mb-8 max-w-xl leading-relaxed font-medium"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                        >
                            Transcenda o movimento. Descubra uma experiência educacional transformadora que une disciplina, técnica e alma.
                        </motion.p>

                        {/* CTA Buttons - Animated */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                        >
                            <Link href="/espaco-revelle/matricula">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="h-14 px-10 bg-[#800020] hover:bg-[#9a0028] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] group shadow-2xl shadow-[#800020]/40 transition-colors relative overflow-hidden">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 0.6 }}
                                        />
                                        <span className="relative z-10 flex items-center">
                                            Quero Iniciar
                                            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </motion.div>
                            </Link>
                            <a href="#modalidades">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="outline" className="h-14 px-10 border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all backdrop-blur-sm hover:border-white/40">
                                        Explorar Aulas
                                    </Button>
                                </motion.div>
                            </a>
                        </motion.div>

                        {/* Mini Stats - Stagger Animation */}
                        <motion.div
                            className="flex flex-wrap items-center gap-6 md:gap-8 text-white/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.3 }}
                        >
                            {[
                                { icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400" />, text: '4.9 Google' },
                                { icon: <Music className="w-4 h-4 text-white/50" />, text: '15+ Modalidades' },
                                { icon: <Heart className="w-4 h-4 text-white/50" />, text: '1000+ Alunos' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                                    >
                                        {stat.icon}
                                    </motion.div>
                                    <span className="text-xs font-bold tracking-wide">{stat.text}</span>
                                    {i < 2 && <div className="w-1 h-1 rounded-full bg-white/30 ml-4 hidden sm:block" />}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator - Animated */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    <motion.div
                        className="w-6 h-10 rounded-full border border-white/30 flex justify-center p-2"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            className="w-1 h-2 bg-white/60 rounded-full"
                            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* Premium Stats Section */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                            {[
                                { value: '4.9', label: 'Nota Google', sub: 'Avaliações reais' },
                                { value: '15+', label: 'Modalidades', sub: 'Para todas idades' },
                                { value: '1000+', label: 'Alunos', sub: 'Vidas transformadas' },
                                { value: '12', label: 'Anos', sub: 'De experiência' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className="text-center group"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <div className="text-4xl md:text-5xl lg:text-6xl font-black text-[#800020] tracking-tighter mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm md:text-base font-bold text-zinc-900 uppercase tracking-wide mb-1">
                                        {stat.label}
                                    </div>
                                    <div className="text-xs text-zinc-400 font-medium">
                                        {stat.sub}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Matrículas Abertas - CTA Section */}
            <section className="relative py-28 overflow-hidden">
                {/* Background Image with Slow Zoom */}
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1 }}
                    whileInView={{ scale: 1.1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 20, ease: 'linear' }}
                >
                    <Image
                        src="/elegant-ballet-performance-stockcake (1).webp"
                        alt="Bailarina no palco - Matrículas Abertas"
                        fill
                        className="object-cover object-center"
                    />
                </motion.div>

                {/* Dark Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/50 z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-[1]" />

                {/* Floating Particles */}
                <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/40 rounded-full"
                            style={{
                                left: `${10 + (i * 8)}%`,
                                top: `${20 + (i % 4) * 20}%`,
                            }}
                            animate={{
                                y: [0, -40, 0],
                                x: [0, i % 2 === 0 ? 20 : -20, 0],
                                opacity: [0.2, 0.6, 0.2],
                            }}
                            transition={{
                                duration: 4 + i * 0.3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>

                {/* Animated Glows */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#800020]/30 rounded-full blur-[180px] pointer-events-none z-[2]"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#800020]/20 rounded-full blur-[150px] pointer-events-none z-[2]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        {/* Badge - DESTAQUE MATRÍCULAS */}
                        <motion.div
                            className="relative inline-block mb-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, type: 'spring' }}
                        >
                            {/* Glow behind */}
                            <motion.div
                                className="absolute inset-0 bg-[#800020] rounded-2xl blur-xl -z-10"
                                animate={{
                                    opacity: [0.4, 0.8, 0.4],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />

                            {/* Main Badge */}
                            <motion.div
                                className="relative flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#800020] via-[#a00028] to-[#800020] text-white border border-white/20 shadow-2xl overflow-hidden"
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(128,0,32,0.5)',
                                        '0 0 40px rgba(128,0,32,0.8)',
                                        '0 0 20px rgba(128,0,32,0.5)',
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {/* Animated dot */}
                                <motion.div
                                    className="w-3 h-3 bg-white rounded-full"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [1, 0.5, 1]
                                    }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />

                                {/* Text */}
                                <span className="text-lg md:text-xl font-black uppercase tracking-wider relative z-10">
                                    Matrículas Abertas 2026
                                </span>

                                {/* Shimmer effect - contained */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Title with Stagger */}
                        <div className="mb-8">
                            <motion.h2
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic text-white"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                Do Baby ao
                            </motion.h2>
                            <motion.h2
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                <motion.span
                                    className="text-[#800020]"
                                    animate={{
                                        textShadow: [
                                            '0 0 20px rgba(128,0,32,0.3)',
                                            '0 0 60px rgba(128,0,32,0.6)',
                                            '0 0 20px rgba(128,0,32,0.3)',
                                        ],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    Adulto.
                                </motion.span>
                            </motion.h2>
                        </div>

                        {/* Animated Line Accent */}
                        <motion.div
                            className="w-24 h-1 bg-gradient-to-r from-[#800020] to-transparent mb-8"
                            initial={{ scaleX: 0, originX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />

                        {/* Aula Experimental - Redesigned */}
                        <motion.div
                            className="relative inline-block mb-10"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="relative px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-[#800020]/20 via-transparent to-[#800020]/20"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                />
                                <span className="relative z-10 text-white text-xl md:text-2xl font-bold tracking-wide">
                                    Aula Experimental <span className="text-[#800020] font-black">GRATUITA</span>
                                </span>
                            </div>
                        </motion.div>

                        {/* Turmas */}
                        <motion.div
                            className="mb-12"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <p className="text-white/50 text-xs uppercase tracking-[0.3em] font-bold mb-5">Nossas Modalidades</p>
                            <div className="flex flex-wrap gap-3">
                                {['Ballet', 'Jazz', 'K-Pop', 'Ritmos', 'Dança de Salão'].map((turma, i) => (
                                    <motion.div
                                        key={turma}
                                        className="group relative px-6 py-3 rounded-full bg-white/5 border border-white/20 text-white font-bold text-sm cursor-pointer overflow-hidden"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                                        whileHover={{ scale: 1.05, borderColor: 'rgba(128,0,32,1)' }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-[#800020]"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '0%' }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <span className="relative z-10">{turma}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            <Link href="/espaco-revelle/matricula">
                                <motion.div
                                    className="relative overflow-hidden rounded-2xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button className="h-16 px-12 bg-[#800020] hover:bg-[#9a0028] text-white rounded-2xl text-sm font-black uppercase tracking-[0.15em] group shadow-2xl shadow-[#800020]/50 transition-colors">
                                        <span className="flex items-center">
                                            Garantir Minha Vaga
                                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </span>
                                    </Button>
                                    {/* Shimmer contained */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                                    />
                                </motion.div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About Section - The Art of Belonging */}
            <section id="about" className="py-20 relative overflow-hidden bg-[#4a0012]">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-black/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1 flex justify-center">
                            <div className="w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white group shadow-2xl shadow-black/30 relative">
                                <Image
                                    src="/revelle-owner.jpg"
                                    alt="Diretora Espaço Revelle"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.1] group-hover:grayscale-0"
                                    style={{ objectPosition: 'center 85%' }}
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

            {/* Modalidades - Nossas Aulas */}
            <section id="modalidades" className="py-24 bg-white relative overflow-hidden">
                {/* Background subtle */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#800020]/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-16 space-y-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#800020] font-black uppercase tracking-[0.4em] text-[9px]">Nossas Modalidades</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900">
                            Escolha sua <span className="text-[#800020]">Arte</span>
                        </h2>
                        <p className="text-zinc-500 text-base font-medium max-w-2xl mx-auto">
                            Do clássico ao moderno, temos a modalidade perfeita para você. Aulas para todas as idades e níveis.
                        </p>
                    </motion.div>

                    {/* Grid de Modalidades */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            { title: "Ballet", sub: "Clássico & Elegante", age: "Baby ao Adulto", img: "/elegant-ballet-performance-stockcake.webp" },
                            { title: "Jazz", sub: "Energia & Expressão", age: "Infantil & Adulto", img: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=2069&auto=format&fit=crop" },
                            { title: "K-Pop", sub: "Cultura Coreana", age: "Infantil & Juvenil", img: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1974&auto=format&fit=crop" },
                            { title: "Ritmos", sub: "Diversão & Movimento", age: "Todas as Idades", img: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=2070&auto=format&fit=crop" },
                            { title: "Dança de Salão", sub: "Casais & Solo", age: "Adulto", img: "https://images.unsplash.com/photo-1545959570-a94084071b5d?q=80&w=1976&auto=format&fit=crop" },
                            { title: "Baby Class", sub: "Primeiros Passos", age: "3 a 6 anos", img: "/revelle-class-baby.jpg" }
                        ].map((aula, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group cursor-pointer relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl"
                            >
                                <Image
                                    src={aula.img}
                                    alt={aula.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute inset-0 bg-[#800020]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                    <div className="text-white/70 text-[9px] font-bold uppercase tracking-[0.3em] mb-2">{aula.sub}</div>
                                    <h3 className="text-2xl font-black uppercase italic mb-3 leading-none text-white group-hover:text-white transition-colors">{aula.title}</h3>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/20">
                                        <span className="text-[10px] font-bold uppercase text-white/60 tracking-wider">{aula.age}</span>
                                        <motion.div
                                            className="w-8 h-8 rounded-full bg-[#800020] flex items-center justify-center"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <ChevronRight className="w-4 h-4 text-white" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Link href="/espaco-revelle/matricula">
                            <Button className="h-14 px-10 bg-[#800020] hover:bg-[#9a0028] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] group shadow-xl shadow-[#800020]/20">
                                Agendar Aula Experimental
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
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

            {/* Premium Footer - Multi-Column Design */}
            <footer className="bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                {/* Main Footer Content */}
                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {/* Brand Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xl shadow-black/20">
                                    <Image src="/revelle-logo-icon.jpg" alt="Revelle Logo" width={48} height={48} className="object-cover" />
                                </div>
                                <div className="flex flex-col -space-y-0.5">
                                    <span className="text-2xl font-black tracking-tighter uppercase italic leading-none text-white">Revelle</span>
                                    <span className="text-[9px] text-white/50 font-black uppercase tracking-[0.3em]">Espaço Criativo</span>
                                </div>
                            </div>
                            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                                Transformando vidas através da dança há mais de uma década em Santa Maria.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://www.facebook.com/espacorevelle/" target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                    <Facebook size={18} />
                                </a>
                                <a href="https://www.instagram.com/espaco_revelle/" target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                    <Instagram size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Navigation Column */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Navegação</h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Início', href: '#home' },
                                    { label: 'A Escola', href: '#about' },
                                    { label: 'Grade de Horários', href: '#horarios' },
                                    { label: 'Depoimentos', href: '#reviews' },
                                    { label: 'Contato', href: '#contact' }
                                ].map((item, i) => (
                                    <li key={i}>
                                        <a href={item.href} className="text-white/50 hover:text-white text-sm font-medium transition-colors hover:translate-x-1 inline-block">
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Classes Column */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Modalidades</h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Ballet Clássico', href: '#modalidades' },
                                    { label: 'Jazz', href: '#modalidades' },
                                    { label: 'Contemporâneo', href: '#modalidades' },
                                    { label: 'Baby Class', href: '#modalidades' },
                                    { label: 'Hip Hop', href: '#modalidades' }
                                ].map((item, i) => (
                                    <li key={i}>
                                        <a href={item.href} className="text-white/50 hover:text-white text-sm font-medium transition-colors hover:translate-x-1 inline-block">
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Contato</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-[#800020] mt-0.5 shrink-0" />
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Av. Paulo Lauda, 225<br />
                                        Tancredo Neves<br />
                                        Santa Maria — RS
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-[#800020] shrink-0" />
                                    <a href="tel:+5555996504558" className="text-white/50 hover:text-white text-sm font-medium transition-colors">
                                        (55) 99650-4558
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5">
                    <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest">
                            © 2026 Espaço Revelle. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-white/30">Desenvolvido por</span>
                            <span className="text-[11px] font-black text-white/60 tracking-wider uppercase">Geison Höehr</span>
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
