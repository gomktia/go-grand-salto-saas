'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Check, Loader2, Image as ImageIcon, Clock, AlertCircle, CheckCircle2, Package } from 'lucide-react'
import { gerarSignedUrlDownload, gerarTodasSignedUrls } from '@/app/actions/download-fotos'
import { toast } from 'sonner'

interface Foto {
    id: string
    titulo?: string
    preco: number
    preview?: string
    storage_path?: string
}

interface Pedido {
    id: string
    nome_comprador: string
    email_comprador: string
    valor_total: number
    quantidade_fotos: number
    download_expira_em: string | null
    download_token: string
}

interface DownloadClientProps {
    pedido: Pedido
    fotos: Foto[]
    token?: string
}

export default function DownloadClient({ pedido, fotos, token }: DownloadClientProps) {
    const [downloadingId, setDownloadingId] = useState<string | null>(null)
    const [downloadedIds, setDownloadedIds] = useState<string[]>([])
    const [downloadingAll, setDownloadingAll] = useState(false)

    const expirationDate = pedido.download_expira_em ? new Date(pedido.download_expira_em) : null
    const daysRemaining = expirationDate
        ? Math.max(0, Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null

    const handleDownloadSingle = async (fotoId: string) => {
        setDownloadingId(fotoId)

        try {
            const { url, filename, error } = await gerarSignedUrlDownload(pedido.id, fotoId, token)

            if (error || !url) {
                toast.error(error || 'Erro ao gerar link de download')
                return
            }

            // Criar link temporário e fazer download
            const link = document.createElement('a')
            link.href = url
            link.download = filename || `foto_${fotoId}.jpg`
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setDownloadedIds(prev => [...prev, fotoId])
            toast.success('Download iniciado!')

        } catch (err) {
            console.error('Erro no download:', err)
            toast.error('Erro ao fazer download')
        } finally {
            setDownloadingId(null)
        }
    }

    const handleDownloadAll = async () => {
        setDownloadingAll(true)

        try {
            const { urls, error } = await gerarTodasSignedUrls(pedido.id, token)

            if (error || urls.length === 0) {
                toast.error(error || 'Erro ao gerar links de download')
                return
            }

            // Download sequencial com intervalo
            for (let i = 0; i < urls.length; i++) {
                const { url, filename, fotoId } = urls[i]

                const link = document.createElement('a')
                link.href = url
                link.download = filename
                link.target = '_blank'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                setDownloadedIds(prev => [...prev, fotoId])

                // Aguardar um pouco entre downloads para não sobrecarregar
                if (i < urls.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500))
                }
            }

            toast.success(`${urls.length} fotos baixadas com sucesso!`)

        } catch (err) {
            console.error('Erro no download em lote:', err)
            toast.error('Erro ao fazer download das fotos')
        } finally {
            setDownloadingAll(false)
        }
    }

    const allDownloaded = fotos.every(f => downloadedIds.includes(f.id))

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            {/* Header */}
            <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-1">
                                SUAS FOTOS ESTAO PRONTAS
                            </p>
                            <h1 className="text-2xl font-black text-white">
                                Download de Fotos
                            </h1>
                        </div>

                        {daysRemaining !== null && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                                daysRemaining <= 2
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-bold">
                                    {daysRemaining === 0
                                        ? 'Expira hoje!'
                                        : daysRemaining === 1
                                            ? 'Expira amanhã'
                                            : `${daysRemaining} dias restantes`
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                                <Package className="w-7 h-7 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm">Pedido para</p>
                                <p className="text-white font-bold text-lg">{pedido.nome_comprador}</p>
                                <p className="text-zinc-500 text-sm">{pedido.email_comprador}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-3xl font-black text-white">{fotos.length}</p>
                                <p className="text-zinc-500 text-xs uppercase tracking-wider">Fotos</p>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <p className="text-3xl font-black text-emerald-400">
                                    R$ {Number(pedido.valor_total).toFixed(2)}
                                </p>
                                <p className="text-zinc-500 text-xs uppercase tracking-wider">Total Pago</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Download All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <button
                        onClick={handleDownloadAll}
                        disabled={downloadingAll || allDownloaded}
                        className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-lg uppercase tracking-wider transition-all ${
                            allDownloaded
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                                : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-500 hover:to-pink-500 shadow-2xl shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                    >
                        {downloadingAll ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Baixando todas as fotos...
                            </>
                        ) : allDownloaded ? (
                            <>
                                <CheckCircle2 className="w-6 h-6" />
                                Todas as fotos baixadas
                            </>
                        ) : (
                            <>
                                <Download className="w-6 h-6" />
                                Baixar todas as {fotos.length} fotos
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Fotos Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-rose-500" />
                        Suas Fotos ({fotos.length})
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {fotos.map((foto, index) => {
                                const isDownloading = downloadingId === foto.id
                                const isDownloaded = downloadedIds.includes(foto.id)

                                return (
                                    <motion.div
                                        key={foto.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10"
                                    >
                                        {/* Preview Image */}
                                        {foto.preview ? (
                                            <img
                                                src={foto.preview}
                                                alt={foto.titulo || 'Foto'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-zinc-600" />
                                            </div>
                                        )}

                                        {/* Overlay */}
                                        <div className={`absolute inset-0 transition-all ${
                                            isDownloaded
                                                ? 'bg-emerald-500/20'
                                                : 'bg-black/40 group-hover:bg-black/60'
                                        }`} />

                                        {/* Status Badge */}
                                        {isDownloaded && (
                                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                        )}

                                        {/* Download Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => handleDownloadSingle(foto.id)}
                                                disabled={isDownloading || downloadingAll}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                                                    isDownloaded
                                                        ? 'bg-white/10 text-white/60'
                                                        : 'bg-white text-zinc-900 hover:bg-rose-500 hover:text-white'
                                                }`}
                                            >
                                                {isDownloading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : isDownloaded ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Baixado
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="w-4 h-4" />
                                                        Baixar
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Foto Title */}
                                        {foto.titulo && (
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                <p className="text-white text-sm font-medium truncate">
                                                    {foto.titulo}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20"
                >
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-white font-bold mb-2">Informacoes Importantes</h3>
                            <ul className="text-blue-300 text-sm space-y-1">
                                <li>As fotos baixadas sao em alta resolucao, sem marca dagua.</li>
                                <li>O link de download expira em {daysRemaining} dias.</li>
                                <li>Guarde suas fotos em local seguro apos o download.</li>
                                <li>Em caso de problemas, entre em contato com o estudio.</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 mt-12 py-6">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-zinc-500 text-sm">
                        Espaco Revelle - Todas as fotos sao protegidas por direitos autorais.
                    </p>
                </div>
            </footer>
        </div>
    )
}
