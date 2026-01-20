import { Suspense } from 'react'
import { getFotosDownload, verificarDownloadPermitido } from '@/app/actions/download-fotos'
import DownloadClient from './download-client'

interface PageProps {
    params: Promise<{ pedidoId: string }>
    searchParams: Promise<{ token?: string }>
}

export default async function DownloadPage({ params, searchParams }: PageProps) {
    const { pedidoId } = await params
    const { token } = await searchParams

    // Verificar permissão no servidor
    const { permitido, motivo, pedido } = await verificarDownloadPermitido(pedidoId, token)

    if (!permitido || !pedido) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-white mb-2">Acesso Negado</h1>
                    <p className="text-zinc-400 mb-6">{motivo}</p>
                    <a
                        href="/espaco-revelle"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all"
                    >
                        Voltar ao Site
                    </a>
                </div>
            </div>
        )
    }

    // Buscar fotos do pedido
    const { data, error } = await getFotosDownload(pedidoId, token)

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-white mb-2">Erro</h1>
                    <p className="text-zinc-400">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full" />
            </div>
        }>
            <DownloadClient
                pedido={data.pedido}
                fotos={data.fotos}
                token={token}
            />
        </Suspense>
    )
}
