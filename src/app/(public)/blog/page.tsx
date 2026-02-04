'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calendar, Sparkles, User, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const blogPosts = [
    {
        title: '5 Benefícios do Balé na Primeira Infância',
        description: 'Como a dança ajuda no desenvolvimento cognitivo e motor em crianças de 3 a 5 anos.',
        date: '15 Jan, 2026',
        category: 'Educação',
        author: 'Clara Mendes',
        image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1000'
    },
    {
        title: 'Preparação para o Grande Espetáculo',
        description: 'Um olhar exclusivo nos bastidores da montagem do Quebra Nozes no teatro municipal.',
        date: '10 Jan, 2026',
        category: 'Bastidores',
        author: 'Direção Grand Salto',
        image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=1000'
    }
]

export default function BlogPublico() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <Badge className="bg-pink-600/20 text-pink-500 border-none px-4 py-1">BLOG DA ESCOLA</Badge>
                    <h1 className="text-5xl font-extrabold tracking-tighter">Diário da Dança</h1>
                    <p className="text-neutral-500 max-w-xl mx-auto">Novidades, dicas de performance e os melhores momentos da nossa escola.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {blogPosts.map((post, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="bg-neutral-900/60 border-white/5 overflow-hidden group hover:border-pink-500/30 transition-all cursor-pointer">
                                <div className="relative h-64 overflow-hidden">
                                    <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={post.title} />
                                    <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border-none">{post.category}</Badge>
                                </div>
                                <CardHeader>
                                    <div className="flex items-center gap-4 text-xs text-neutral-500 mb-2">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                                        <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                                    </div>
                                    <CardTitle className="text-2xl group-hover:text-pink-500 transition-colors">{post.title}</CardTitle>
                                    <CardDescription className="text-neutral-400 mt-2 line-clamp-2">
                                        {post.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="ghost" className="p-0 text-white font-bold gap-2 group/btn">
                                        Ler artigo completo
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA para Matrícula (Otimização SEO/Lead) */}
                <section className="bg-gradient-to-br from-pink-600/20 to-violet-600/20 rounded-3xl p-12 border border-white/5 text-center relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold">Faça parte da nossa história</h2>
                        <p className="text-neutral-300 max-w-lg mx-auto leading-relaxed">
                            Agende uma aula experimental agora e descubra como o balé pode transformar a vida do seu filho(a).
                        </p>
                        <Button className="bg-white text-black hover:bg-neutral-200 px-10 h-12 rounded-full font-bold shadow-xl shadow-white/5">
                            Agendar Aula Experimental
                        </Button>
                    </div>
                    <Sparkles className="absolute top-10 right-10 text-pink-500/20 w-24 h-24" />
                    <Zap className="absolute bottom-10 left-10 text-violet-500/20 w-32 h-32" />
                </section>
            </div>
        </div>
    )
}
