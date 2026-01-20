'use client'

import { useEffect, useState } from 'react'
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
        <section id="blog" className="py-32 bg-neutral-900/40">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-16 gap-4">
                    <div className="max-w-xl">
                        <span className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Blog Revelle</span>
                        <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white">Dicas e <br />Notícias</h2>
                    </div>
                    <Link href="/espaco-revelle/blog">
                        <Button variant="ghost" className="text-rose-500 hover:text-rose-400 font-black uppercase tracking-widest text-[10px]">
                            Ver tudo <ArrowRight className="ml-2 w-3 h-3" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {isLoading ? (
                        [1, 2].map((i) => (
                            <div key={i} className="aspect-[2/1] bg-white/5 rounded-[2rem] animate-pulse" />
                        ))
                    ) : (
                        posts.map((post: any, i: number) => (
                            <Link key={i} href={`/espaco-revelle/blog/${post.slug}`}>
                                <Card className="bg-neutral-950 border-white/5 overflow-hidden group cursor-pointer hover:border-rose-600/30 transition-all rounded-[2rem]">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="aspect-square relative overflow-hidden">
                                            <Image
                                                src={post.imagem_capa || "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop"}
                                                alt={post.titulo}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <CardContent className="p-8 flex flex-col justify-center">
                                            <div className="text-[10px] text-rose-500 font-black uppercase tracking-widest mb-4">
                                                {formatDate(post.data_publicacao)}
                                            </div>
                                            <h3 className="text-2xl font-black uppercase italic mb-4 leading-tight text-white group-hover:text-rose-500 transition-colors">
                                                {post.titulo}
                                            </h3>
                                            <p className="text-zinc-500 text-sm mb-6 line-clamp-2">
                                                {post.descricao_curta}
                                            </p>
                                            <div className="flex items-center text-white font-black text-[10px] uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                                                Ler Artigo <ArrowRight className="w-4 h-4 text-rose-600" />
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
