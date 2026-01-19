import { getAlbunsVenda } from '@/app/actions/fotos-venda'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function AlbunsPage() {
    let albums = []

    try {
        const result = await getAlbunsVenda(true) // isPublic = true
        albums = result.data
    } catch (e) {
        console.log('Albums not available yet')
        // Fallback albums
        albums = [
            {
                id: 'demo-1',
                titulo: 'Quebra Nozes 2025',
                descricao: 'Espetáculo de fim de ano - momentos inesquecíveis',
                evento_data: '2025-12-20',
                capa_url: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop',
                is_venda_ativa: true,
                fotos: [{ count: 48 }]
            },
            {
                id: 'demo-2',
                titulo: 'Aula Experimental - Janeiro 2026',
                descricao: 'Primeiras aulas do ano com novos alunos',
                evento_data: '2026-01-15',
                capa_url: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=2070&auto=format&fit=crop',
                is_venda_ativa: true,
                fotos: [{ count: 24 }]
            }
        ]
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00')
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-2xl px-6 h-20 flex items-center">
                <Link href="/espaco-revelle" className="flex items-center gap-3 group">
                    <ArrowLeft className="w-5 h-5 text-neutral-500 group-hover:text-red-500 transition-colors" />
                    <span className="text-sm font-bold uppercase tracking-widest">Voltar ao Site</span>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-12">
                        <Badge className="bg-red-600 mb-4 uppercase text-[10px]">Galeria de Fotos</Badge>
                        <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
                            Álbuns <span className="text-red-600">Disponíveis</span>
                        </h1>
                        <p className="text-neutral-500 text-lg">
                            Escolha um álbum para visualizar e adquirir fotos em alta resolução dos nossos eventos.
                        </p>
                    </div>

                    {albums.length === 0 ? (
                        <div className="text-center py-20">
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-neutral-700" />
                            <p className="text-neutral-500">Nenhum álbum disponível no momento</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {albums.map((album: any) => (
                                <Link key={album.id} href={`/espaco-revelle/galeria/${album.id}`}>
                                    <Card className="bg-neutral-900 border-white/5 overflow-hidden group hover:border-red-600/30 transition-all cursor-pointer">
                                        <div className="aspect-video relative overflow-hidden">
                                            <Image
                                                src={album.capa_url || 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop'}
                                                alt={album.titulo}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                            <div className="absolute bottom-4 right-4">
                                                {album.is_venda_ativa ? (
                                                    <Badge className="bg-emerald-600 text-white text-[10px]">
                                                        Venda Ativa
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-neutral-600 text-neutral-400 text-[10px]">
                                                        Venda Encerrada
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <CardContent className="p-6 space-y-4">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase mb-2 group-hover:text-red-500 transition-colors">
                                                    {album.titulo}
                                                </h3>
                                                {album.descricao && (
                                                    <p className="text-neutral-500 text-sm line-clamp-2">
                                                        {album.descricao}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-neutral-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{album.evento_data ? formatDate(album.evento_data) : 'Data não informada'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4" />
                                                    <span>
                                                        {Array.isArray(album.fotos) && album.fotos.length > 0
                                                            ? album.fotos[0].count || album.fotos.length
                                                            : 0} fotos
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                className="w-full h-12 bg-red-600 hover:bg-red-500 font-bold uppercase tracking-wide text-xs rounded-xl"
                                            >
                                                Ver Álbum
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
