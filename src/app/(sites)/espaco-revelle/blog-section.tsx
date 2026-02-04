'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPostsDestaque } from '@/app/actions/blog'

export function BlogSection() {
    const [posts, setPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPosts() {
            try {
                const { data } = await getPostsDestaque(2)
                setPosts(data)
            } catch (e) {
                console.error('Erro ao buscar posts:', e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [])

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    if (!isLoading && posts.length === 0) return null

    return (
        <section id="blog" className="py-24 bg-zinc-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#800020]/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-xl">
                        <span className="text-[#800020] font-black uppercase tracking-[0.3em] text-[9px] mb-4 block">Blog Revelle</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white">
                            Dicas e <br />
                            <span className="text-white/50">Notícias</span>
                        </h2>
                    </div>
                    <Link href="/espaco-revelle/blog">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" className="text-[#800020] hover:text-[#800020] hover:bg-[#800020]/10 font-black uppercase tracking-widest text-[10px] rounded-full px-6">
                                Ver tudo <ArrowRight className="ml-2 w-3 h-3" />
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {isLoading ? (
                        [1, 2].map((i) => (
                            <div key={i} className="aspect-[2/1] bg-white/5 rounded-[2rem] animate-pulse" />
                        ))
                    ) : (
                        posts.map((post: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                            >
                                <Link href={`/espaco-revelle/blog/${post.slug}`}>
                                    <Card className="bg-zinc-950 border-white/5 overflow-hidden group cursor-pointer hover:border-[#800020]/30 transition-all rounded-[2rem] hover:-translate-y-2 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2">
                                            <div className="aspect-square relative overflow-hidden">
                                                <Image
                                                    src={post.imagem_capa || "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop"}
                                                    alt={post.titulo}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <CardContent className="p-8 flex flex-col justify-center">
                                                <div className="text-[10px] text-[#800020] font-black uppercase tracking-widest mb-4">
                                                    {formatDate(post.data_publicacao)}
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black uppercase italic mb-4 leading-tight text-white group-hover:text-[#800020] transition-colors">
                                                    {post.titulo}
                                                </h3>
                                                <p className="text-zinc-500 text-sm mb-6 line-clamp-2">
                                                    {post.descricao_curta}
                                                </p>
                                                <div className="flex items-center text-white font-black text-[10px] uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                                                    Ler Artigo <ArrowRight className="w-4 h-4 text-[#800020]" />
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
