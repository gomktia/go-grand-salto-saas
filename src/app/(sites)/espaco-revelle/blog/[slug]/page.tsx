'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react'
import { getPostBlog } from '@/app/actions/blog'
import Image from 'next/image'
import Link from 'next/link'
import { useTenant } from '@/hooks/use-tenant'
import { useParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

export default function BlogPostPage() {
    const { slug } = useParams()
    const router = useRouter()
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [post, setPost] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPost() {
            try {
                const { data } = await getPostBlog(slug as string, true)
                setPost(data)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPost()
    }, [slug])

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white space-y-8">
                <h1 className="text-4xl font-black uppercase italic">Post não encontrado</h1>
                <Button onClick={() => router.back()} variant="outline" className="rounded-2xl border-white/10 text-[10px] font-black uppercase tracking-widest">
                    Voltar ao Blog
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-32">
            {/* Hero Header */}
            <article>
                <header className="relative pt-40 pb-24 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-rose-600/5 blur-[150px] rounded-full -translate-y-1/2" />
                    <div className="container mx-auto px-6 relative z-10">
                        <Button
                            onClick={() => router.back()}
                            variant="ghost"
                            className="text-zinc-500 hover:text-white font-black uppercase tracking-widest text-[10px] mb-12 h-10 px-0"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Blog
                        </Button>

                        <div className="max-w-4xl space-y-10">
                            <div className="flex flex-wrap items-center gap-6">
                                <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                                    {post.categoria || 'Artigo'}
                                </span>
                                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(post.data_publicacao)}
                                </div>
                                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" />
                                    {post.autor}
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] text-white">
                                {post.titulo}
                            </h1>

                            <p className="text-zinc-400 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl italic border-l-4 border-rose-600 pl-8">
                                {post.descricao_curta}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-6">
                    <div className="relative aspect-[21/9] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl mb-24">
                        <Image
                            src={post.imagem_capa || "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop"}
                            alt={post.titulo}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-20">
                            {/* Content */}
                            <div className="prose prose-invert prose-rose max-w-none prose-p:text-zinc-400 prose-p:text-xl prose-p:leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic prose-a:text-rose-500 hover:prose-a:text-rose-400">
                                <ReactMarkdown>{post.conteudo}</ReactMarkdown>
                            </div>

                            {/* Sidebar / Share */}
                            <aside className="lg:w-48 space-y-12">
                                <div className="space-y-6 sticky top-40">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Compartilhar</div>
                                    <div className="flex flex-col gap-4">
                                        {[
                                            { icon: Facebook, label: 'Facebook' },
                                            { icon: Twitter, label: 'Twitter' },
                                            { icon: MessageCircle, label: 'WhatsApp' },
                                            { icon: Share2, label: 'Copy Link' },
                                        ].map((item, i) => (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                className="w-full h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-rose-600 hover:border-rose-600 text-white font-black text-[9px] uppercase tracking-widest transition-all group"
                                            >
                                                <item.icon className="w-4 h-4 mr-3" />
                                                {item.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}
