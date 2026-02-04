'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, User, Search, Filter, Sparkles } from 'lucide-react'
import { getPostsBlog } from '@/app/actions/blog'
import Image from 'next/image'
import Link from 'next/link'
import { useTenant } from '@/hooks/use-tenant'

export default function BlogListingPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [posts, setPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPosts() {
            try {
                const { data } = await getPostsBlog({ isPublic: true })
                setPosts(data)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [])

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-32">
            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-rose-600/10 blur-[120px] rounded-full -translate-y-1/2" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                            <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px]">Backstage Journal</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                            Diário da <br />
                            <span className="text-rose-600">Dança.</span>
                        </h1>
                        <p className="text-zinc-500 text-xl font-medium leading-relaxed max-w-xl">
                            Explore as novidades, dicas técnicas e os bastidores exclusivos do Espaço Revelle. Uma imersão no universo do ballet profissional.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-6">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[16/9] bg-white/5 rounded-[3rem] animate-pulse" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-white/5">
                        <Sparkles className="w-16 h-16 mx-auto text-zinc-800 mb-6" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Nenhum artigo publicado ainda</h3>
                        <p className="text-zinc-500 mt-2">Fique atento para as próximas novidades.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={`/espaco-revelle/blog/${post.slug}`}>
                                    <Card className="bg-[#0a0a0a] border-white/5 overflow-hidden group cursor-pointer hover:border-rose-600/30 transition-all rounded-[3rem] h-full flex flex-col shadow-2xl">
                                        <div className="aspect-[16/9] relative overflow-hidden">
                                            <Image
                                                src={post.imagem_capa || "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop"}
                                                alt={post.titulo}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            {post.is_destaque && (
                                                <div className="absolute top-6 right-6">
                                                    <div className="bg-rose-600 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                                        Destaque
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-10 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="text-[10px] text-rose-500 font-black uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(post.data_publicacao)}
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5" />
                                                    {post.autor}
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-black uppercase italic mb-6 leading-tight text-white group-hover:text-rose-500 transition-colors">
                                                {post.titulo}
                                            </h3>
                                            <p className="text-zinc-500 text-lg font-medium mb-10 line-clamp-3 leading-relaxed">
                                                {post.descricao_curta}
                                            </p>
                                            <div className="mt-auto flex items-center text-white font-black text-[10px] uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                                                Continuar Lendo <ArrowRight className="w-4 h-4 text-rose-600" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
