'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { getVideosSite } from '@/app/actions/fotos-venda'

export function VideosSection() {
    const [videos, setVideos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchVideos() {
            try {
                const { data } = await getVideosSite()
                if (data.length > 0) {
                    setVideos(data.slice(0, 3))
                }
            } catch (e) {
                console.error('Erro ao buscar vídeos:', e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVideos()
    }, [])

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return match && match[2].length === 11 ? match[2] : null
    }

    const getThumbnail = (video: any) => {
        if (video.thumbnail_url) return video.thumbnail_url

        const youtubeId = getYouTubeId(video.url_video)
        if (youtubeId) {
            return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        }

        return 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2070&auto=format&fit=crop'
    }

    if (!isLoading && videos.length === 0) return null

    return (
        <section id="videos" className="py-20 bg-[#4a0012] relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-black/20 blur-[150px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12 space-y-3">
                    <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[9px]">Backstage</span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white">Momentos <span className="text-white/50">Especiais</span></h2>
                    <p className="text-zinc-300 mt-4 max-w-xl mx-auto font-medium text-sm">
                        Assista aos nossos melhores momentos, apresentações e conheça mais sobre o Espaço Revelle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="aspect-video bg-white/5 rounded-[2rem] animate-pulse" />
                        ))
                    ) : (
                        videos.map((video: any, i: number) => (
                            <a
                                key={i}
                                href={video.url_video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <Card className="bg-black/20 border-white/10 overflow-hidden hover:border-[#800020]/50 transition-all rounded-[2rem] shadow-2xl">
                                    <div className="aspect-video relative overflow-hidden bg-black/40">
                                        <Image
                                            src={getThumbnail(video)}
                                            alt={video.titulo}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-[#800020] flex items-center justify-center shadow-lg shadow-[#800020]/30 group-hover:scale-110 transition-transform">
                                                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                                            </div>
                                        </div>
                                        {video.is_destaque && (
                                            <div className="absolute top-3 left-3 bg-[#800020] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-2xl shadow-[#800020]/20">
                                                Destaque
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 bg-black/40 backdrop-blur-sm">
                                        <h3 className="font-black text-xs mb-1.5 line-clamp-1 group-hover:text-[#800020] transition-colors uppercase italic text-white tracking-tight">
                                            {video.titulo}
                                        </h3>
                                        {video.descricao && (
                                            <p className="text-zinc-400 text-[10px] line-clamp-2 font-medium">
                                                {video.descricao}
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            </a>
                        ))
                    )}
                </div>

                {!isLoading && videos.length === 0 && (
                    <div className="text-center py-16 bg-white/5 rounded-[2.5rem] border border-white/5 max-w-md mx-auto">
                        <Play className="w-12 h-12 mx-auto mb-4 text-white/20" />
                        <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Nenhum vídeo disponível no momento</p>
                    </div>
                )}
            </div>
        </section>
    )
}
