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
                <Link href="/espaco-revelle" className="flex items-center gap-3 group border-none">
                    <ArrowLeft className="w-5 h-5 text-neutral-500 group-hover:text-rose-500 transition-colors" />
                    <span className="text-sm font-black uppercase tracking-widest">Site Revelle</span>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-12 space-y-4">
                        <Badge className="bg-rose-600 mb-4 uppercase text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full shadow-2xl shadow-rose-600/20">Galeria de Fotos</Badge>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white">
                            Álbuns <span className="text-rose-600">Disponíveis</span>
                        </h1>
                        <p className="text-zinc-500 text-lg font-medium max-w-2xl leading-relaxed">
                            Escolha um álbum para visualizar e adquirir fotos em alta resolução dos nossos eventos. Todo investimento é revertido para a produção dos espetáculos.
                        </p>
                    </div>

                    {albums.length === 0 ? (
                        <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-white/5">
                            <ImageIcon className="w-16 h-16 mx-auto mb-6 text-zinc-700" />
                            <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">Nenhum álbum disponível no momento</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {albums.map((album: any) => (
                                <Link key={album.id} href={`/espaco-revelle/galeria/${album.id}`} className="border-none">
                                    <Card className="bg-neutral-900 border-white/5 overflow-hidden group hover:border-rose-600/30 transition-all cursor-pointer rounded-[2rem] shadow-2xl">
                                        <div className="aspect-video relative overflow-hidden bg-neutral-800">
                                            <Image
                                                src={album.capa_url || 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop'}
                                                alt={album.titulo}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                            <div className="absolute bottom-6 right-6">
                                                {album.is_venda_ativa ? (
                                                    <Badge className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-2xl shadow-emerald-500/20">
                                                        Venda Ativa
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-zinc-600 text-zinc-400 text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full">
                                                        Venda Encerrada
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <CardContent className="p-8 space-y-6 bg-zinc-950/80 backdrop-blur-sm">
                                            <div>
                                                <h3 className="text-3xl font-black uppercase italic mb-2 group-hover:text-rose-500 transition-colors text-white tracking-tighter">
                                                    {album.titulo}
                                                </h3>
                                                {album.descricao && (
                                                    <p className="text-zinc-500 text-sm line-clamp-2 font-medium">
                                                        {album.descricao}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-rose-500" />
                                                    <span>{album.evento_data ? formatDate(album.evento_data) : 'Data não informada'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4 text-rose-500" />
                                                    <span>
                                                        {Array.isArray(album.fotos) && album.fotos.length > 0
                                                            ? album.fotos[0].count || album.fotos.length
                                                            : 0} fotos
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                className="w-full h-14 bg-rose-600 hover:bg-rose-500 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl shadow-rose-600/20 border-none transition-all hover:scale-[1.02]"
                                            >
                                                Explorar Álbum
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
