'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle2, Loader2, AlertCircle, ImageIcon, Sliders, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/utils/supabase/client'
import { createFotoVenda } from '@/app/actions/fotos-venda'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UploadFotosVendaProps {
    albumId: string
    defaultPrice?: number
    onComplete?: () => void
}

interface UploadFile {
    file: File
    id: string
    progress: number
    status: 'pending' | 'processing' | 'uploading' | 'completed' | 'error'
    error?: string
    watermarkUrl?: string
    originalPath?: string
    watermarkPath?: string
    price: number
}

export function UploadFotosVenda({ albumId, defaultPrice = 15, onComplete }: UploadFotosVendaProps) {
    const [files, setFiles] = useState<UploadFile[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const newFiles = Array.from(e.target.files).map(file => ({
            file,
            id: Math.random().toString(36).substring(7),
            progress: 0,
            status: 'pending' as const,
            price: defaultPrice
        }))
        setFiles(prev => [...prev, ...newFiles])
    }

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id))
    }

    const generateWatermark = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                if (!ctx) return reject('No context')

                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0)

                // Estilo da Marca d'Água
                const fontSize = Math.max(24, Math.floor(canvas.width / 15))
                ctx.font = `black ${fontSize}px Inter, system-ui, sans-serif`
                ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'

                // Padrão de repetição
                const text = "REVELLE  REVELLE  REVELLE"
                ctx.save()
                ctx.translate(canvas.width / 2, canvas.height / 2)
                ctx.rotate(-45 * Math.PI / 180)

                // Desenhar várias linhas
                for (let i = -3; i <= 3; i++) {
                    ctx.fillText(text, 0, i * fontSize * 3)
                }
                ctx.restore()

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob)
                    else reject('Canvas conversion failed')
                }, 'image/webp', 0.8)
            }
            img.onerror = () => reject('Image load failed')
            img.src = URL.createObjectURL(file)
        })
    }

    const startUpload = async () => {
        if (files.length === 0) return
        setIsUploading(true)

        for (let i = 0; i < files.length; i++) {
            const uploadFile = files[i]
            if (uploadFile.status === 'completed') continue

            try {
                // 1. Marcar como processando (gerando watermark)
                setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'processing' } : f))
                const watermarkBlob = await generateWatermark(uploadFile.file)

                // 2. Upload Original (Privado)
                const originalPath = `original/${albumId}/${uploadFile.id}_${uploadFile.file.name}`
                setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 10 } : f))

                const { error: errorOrig } = await supabase.storage
                    .from('fotos-venda')
                    .upload(originalPath, uploadFile.file)
                if (errorOrig) throw errorOrig

                // 3. Upload Watermark (Público)
                const watermarkPath = `watermark/${albumId}/${uploadFile.id}_wm.webp`
                const { error: errorWM } = await supabase.storage
                    .from('fotos-venda')
                    .upload(watermarkPath, watermarkBlob)
                if (errorWM) throw errorWM

                // 4. Obter URL pública
                const { data: { publicUrl } } = supabase.storage
                    .from('fotos-venda')
                    .getPublicUrl(watermarkPath)

                // 5. Salvar no Banco
                await createFotoVenda({
                    album_id: albumId,
                    storage_path_original: originalPath,
                    storage_path_watermark: watermarkPath,
                    url_watermark: publicUrl,
                    preco: uploadFile.price,
                })

                setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'completed', progress: 100 } : f))
            } catch (error: any) {
                console.error(error)
                setFiles(prev => prev.map(f => f.id === uploadFile.id ? { ...f, status: 'error', error: error.message } : f))
            }
        }

        setIsUploading(false)
        if (onComplete) onComplete()
        toast.success('Processamento concluído!')
    }

    return (
        <div className="space-y-6">
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center hover:border-rose-500/30 transition-all cursor-pointer bg-white/5 group"
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={onFileSelect}
                />
                <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Selecionar Fotos</h3>
                <p className="text-zinc-500 text-sm font-medium">Arraste ou clique para selecionar as fotos do álbum.</p>
                <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-4">Watermark automática "REVELLE" será aplicada.</p>
            </div>

            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            Fila de Processamento ({files.length} arquivos)
                        </div>
                        {!isUploading && (
                            <Button size="sm" variant="ghost" className="text-xs text-rose-500 font-bold" onClick={() => setFiles([])}>
                                Limpar Tudo
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {files.map((f) => (
                            <div key={f.id} className="bg-neutral-900 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                                    <ImageIcon className="text-zinc-600 w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black uppercase truncate text-zinc-300 pr-4">{f.file.name}</span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {f.status === 'completed' ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            ) : f.status === 'error' ? (
                                                <AlertCircle className="w-4 h-4 text-rose-500" />
                                            ) : (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{f.status}</span>
                                            )}
                                            {!isUploading && f.status !== 'completed' && (
                                                <button onClick={() => removeFile(f.id)} className="text-zinc-600 hover:text-white transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <Progress value={f.progress} className="h-1 bg-white/5" indicatorClassName="bg-rose-600" />
                                </div>
                                <div className="w-24 shrink-0">
                                    <div className="relative">
                                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-rose-500" />
                                        <Input
                                            type="number"
                                            value={f.price}
                                            onChange={(e) => setFiles(prev => prev.map(x => x.id === f.id ? { ...x, price: Number(e.target.value) } : x))}
                                            className="h-9 pl-7 bg-black/40 border-white/5 rounded-lg text-[10px] font-black"
                                            disabled={isUploading || f.status === 'completed'}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={startUpload}
                        disabled={isUploading || files.every(f => f.status === 'completed')}
                        className="w-full h-16 bg-rose-600 hover:bg-rose-500 font-black uppercase text-xs tracking-widest shadow-2xl shadow-rose-600/20 rounded-2xl border-none"
                    >
                        {isUploading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processando Arquivos...
                            </span>
                        ) : (
                            `Processar e Publicar ${files.length} Fotos`
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
