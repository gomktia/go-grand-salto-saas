import { getAlbumVenda, getFotosVenda } from '@/app/actions/fotos-venda'
import { GalleryClient } from './gallery-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AlbumGalleryPage({ params }: { params: { id: string } }) {
    let album = null
    let fotos = []
    let error = null

    try {
        const [albumResult, fotosResult] = await Promise.all([
            getAlbumVenda(params.id),
            getFotosVenda(params.id)
        ])

        album = albumResult.data
        fotos = fotosResult.data
    } catch (e: any) {
        error = e.message
        console.error('Erro ao carregar álbum:', e)
    }

    // If error (schema not executed yet), show placeholder
    if (error || !album) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
                <Card className="bg-amber-50 border-amber-200 rounded-3xl max-w-2xl">
                    <CardHeader className="p-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            <CardTitle className="text-amber-900">Álbum não encontrado</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                        <p className="text-sm text-amber-800">
                            {error ? 'O sistema de galeria ainda não está configurado.' : 'Este álbum não existe ou não está público.'}
                        </p>
                        <div className="bg-white rounded-xl p-4 border border-amber-200 space-y-2">
                            <p className="font-bold text-xs text-amber-900">Para ativar as galerias de fotos:</p>
                            <ol className="text-xs text-amber-800 space-y-1 list-decimal list-inside">
                                <li>Execute o arquivo <code className="bg-amber-100 px-2 py-0.5 rounded">schema-financeiro-e-fotos-FIXED.sql</code> no Supabase</li>
                                <li>Crie o bucket <code className="bg-amber-100 px-2 py-0.5 rounded">fotos-venda</code> no Storage</li>
                                <li>Crie álbuns no dashboard da diretora</li>
                            </ol>
                        </div>
                        <Link href="/espaco-revelle">
                            <Button className="w-full">Voltar ao Site</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <GalleryClient album={album} fotos={fotos} />
}
