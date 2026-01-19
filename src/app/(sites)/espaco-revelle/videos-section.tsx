import { Card } from '@/components/ui/card'
import { Play } from 'lucide-react'
import { getVideosSite } from '@/app/actions/fotos-venda'
import Image from 'next/image'

export async function VideosSection() {
    let videos = []

    try {
        const result = await getVideosSite()
        videos = result.data.slice(0, 3) // Show latest 3 videos
    } catch (e: any) {
        console.log('Videos not available yet, using fallback')
        // Fallback videos
        videos = [
            {
                titulo: "Espetáculo 2025 - Destaques",
                descricao: "Os melhores momentos da nossa apresentação de fim de ano",
                url_video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnail_url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2070&auto=format&fit=crop",
                is_destaque: true
            },
            {
                titulo: "Aula de Ballet Baby",
                descricao: "Veja como funciona uma aula para os pequenos",
                url_video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnail_url: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=2070&auto=format&fit=crop",
                is_destaque: false
            },
            {
                titulo: "Tour pelo Espaço Revelle",
                descricao: "Conheça nossa estrutura completa",
                url_video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                thumbnail_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop",
                is_destaque: false
            }
        ]
    }

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

    return (
        <section id="videos" className="py-32 bg-neutral-900/40 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 blur-[150px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Nossa História</span>
                    <h2 className="text-5xl font-black tracking-tighter uppercase">Momentos <span className="text-red-600">Especiais</span></h2>
                    <p className="text-neutral-500 mt-4 max-w-2xl mx-auto">
                        Assista aos nossos melhores momentos, apresentações e conheça mais sobre o Espaço Revelle
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {videos.map((video: any, i: number) => (
                        <a
                            key={i}
                            href={video.url_video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <Card className="bg-neutral-950 border-white/5 overflow-hidden hover:border-red-600/30 transition-all">
                                <div className="aspect-video relative overflow-hidden bg-neutral-900">
                                    <Image
                                        src={getThumbnail(video)}
                                        alt={video.titulo}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                                            <Play className="w-7 h-7 text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                    {video.is_destaque && (
                                        <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                            Destaque
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 bg-neutral-950/80 backdrop-blur-sm">
                                    <h3 className="font-bold text-sm mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">
                                        {video.titulo}
                                    </h3>
                                    {video.descricao && (
                                        <p className="text-neutral-500 text-xs line-clamp-2">
                                            {video.descricao}
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </a>
                    ))}
                </div>

                {videos.length === 0 && (
                    <div className="text-center py-12">
                        <Play className="w-16 h-16 mx-auto mb-4 text-neutral-700" />
                        <p className="text-neutral-500 text-sm">Nenhum vídeo disponível no momento</p>
                    </div>
                )}
            </div>
        </section>
    )
}
