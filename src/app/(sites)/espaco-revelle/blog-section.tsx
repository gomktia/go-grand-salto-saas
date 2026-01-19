import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPostsDestaque } from '@/app/actions/blog'

export async function BlogSection() {
    let posts = []
    let error = null

    try {
        const result = await getPostsDestaque(2)
        posts = result.data
    } catch (e: any) {
        error = e.message
        console.log('Blog posts not available yet, using fallback')
    }

    // Fallback posts if database not ready
    const fallbackPosts = [
        {
            titulo: "Inscrições Abertas para o Espetáculo 2026",
            data_publicacao: "2026-01-18T00:00:00",
            descricao_curta: "O momento mais aguardado do ano está chegando. Saiba como participar da audição.",
            imagem_capa: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop",
            slug: "inscricoes-espetaculo-2026"
        },
        {
            titulo: "Benefícios do Ballet para Crianças",
            data_publicacao: "2026-01-15T00:00:00",
            descricao_curta: "Descubra como a dança ajuda no desenvolvimento motor e social dos pequenos.",
            imagem_capa: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=2070&auto=format&fit=crop",
            slug: "beneficios-ballet-criancas"
        }
    ]

    const displayPosts = posts.length > 0 ? posts : fallbackPosts

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    return (
        <section id="blog" className="py-32 bg-neutral-900/40">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-16 gap-4">
                    <div className="max-w-xl">
                        <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Blog Revelle</span>
                        <h2 className="text-5xl font-black tracking-tighter uppercase">Dicas e <br />Notícias</h2>
                    </div>
                    <Link href="/espaco-revelle/blog">
                        <Button variant="ghost" className="text-red-500 hover:text-red-400 font-bold uppercase tracking-widest text-[10px]">
                            Ver tudo <ArrowRight className="ml-2 w-3 h-3" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayPosts.map((post: any, i: number) => (
                        <Link key={i} href={`/espaco-revelle/blog/${post.slug}`}>
                            <Card className="bg-neutral-950 border-white/5 overflow-hidden group cursor-pointer hover:border-red-600/30 transition-all">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="aspect-square relative overflow-hidden">
                                        <Image
                                            src={post.imagem_capa || fallbackPosts[0].imagem_capa}
                                            alt={post.titulo}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <CardContent className="p-8 flex flex-col justify-center">
                                        <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-4 font-mono">
                                            {formatDate(post.data_publicacao)}
                                        </div>
                                        <h3 className="text-2xl font-bold uppercase mb-4 leading-tight">
                                            {post.titulo}
                                        </h3>
                                        <p className="text-neutral-500 text-sm mb-6 line-clamp-2">
                                            {post.descricao_curta}
                                        </p>
                                        <div className="flex items-center text-white font-bold text-[10px] uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                                            Ler Artigo <ArrowRight className="w-4 h-4 text-red-600" />
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
