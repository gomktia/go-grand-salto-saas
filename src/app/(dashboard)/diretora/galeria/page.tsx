import React from 'react'
import { getAlbunsVenda } from '@/app/actions/fotos-venda'
import { ClientGalleryContent } from './client-content'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function GaleriaPage() {
    try {
        const { data: albums } = await getAlbunsVenda(false)

        return <ClientGalleryContent albums={albums} />
    } catch (error: any) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border-2 border-dashed border-red-500/30">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Erro de Acesso</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-md font-medium">
                        {error.message || 'Não foi possível carregar os álbuns da galeria.'}
                    </p>
                </div>
                <Link href="/diretora/financeiro">
                    <Button className="bg-red-600 hover:bg-red-500 h-14 px-10 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-500/20 transition-all hover:scale-105 border-none">
                        Verificar Financeiro
                    </Button>
                </Link>
            </div>
        )
    }
}
