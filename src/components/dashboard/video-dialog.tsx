'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle, CheckCircle2, Video, Star, StarOff, Youtube, Play } from 'lucide-react'
import { createVideoSite, updateVideoSite } from '@/app/actions/fotos-venda'

type VideoData = {
    id: string
    titulo: string
    descricao?: string
    url_video: string
    thumbnail_url?: string
    tipo: 'youtube' | 'vimeo' | 'storage'
    ordem: number
    is_destaque: boolean
}

type VideoDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    video?: VideoData | null
    onSuccess: () => void
}

function extractYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    return null
}

function extractVimeoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    return match ? match[1] : null
}

function detectVideoType(url: string): 'youtube' | 'vimeo' | 'storage' {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('vimeo.com')) return 'vimeo'
    return 'storage'
}

function getThumbnailFromUrl(url: string, tipo: string): string | null {
    if (tipo === 'youtube') {
        const videoId = extractYouTubeId(url)
        if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    return null
}

export function VideoDialog({ open, onOpenChange, video, onSuccess }: VideoDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        url_video: '',
        thumbnail_url: '',
        tipo: 'youtube' as 'youtube' | 'vimeo' | 'storage',
        ordem: 0,
        is_destaque: false,
    })

    useEffect(() => {
        if (video) {
            setFormData({
                titulo: video.titulo || '',
                descricao: video.descricao || '',
                url_video: video.url_video || '',
                thumbnail_url: video.thumbnail_url || '',
                tipo: video.tipo || 'youtube',
                ordem: video.ordem || 0,
                is_destaque: video.is_destaque || false,
            })
        } else {
            setFormData({
                titulo: '',
                descricao: '',
                url_video: '',
                thumbnail_url: '',
                tipo: 'youtube',
                ordem: 0,
                is_destaque: false,
            })
        }
        setError(null)
        setSuccess(false)
    }, [video, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const payload = {
                titulo: formData.titulo,
                descricao: formData.descricao || undefined,
                url_video: formData.url_video,
                thumbnail_url: formData.thumbnail_url || getThumbnailFromUrl(formData.url_video, formData.tipo) || undefined,
                tipo: formData.tipo,
                ordem: formData.ordem,
                is_destaque: formData.is_destaque,
            }

            if (video) {
                await updateVideoSite(video.id, payload)
            } else {
                await createVideoSite(payload)
            }

            setSuccess(true)
            setTimeout(() => {
                onSuccess()
                onOpenChange(false)
            }, 1000)

        } catch (err) {
            console.error('Erro ao salvar vídeo:', err)
            setError(err instanceof Error ? err.message : 'Erro ao salvar vídeo')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Auto-detect video type when URL changes
        if (field === 'url_video' && typeof value === 'string') {
            const detectedType = detectVideoType(value)
            setFormData(prev => ({
                ...prev,
                tipo: detectedType,
                url_video: value,
            }))
        }
    }

    const previewThumbnail = formData.thumbnail_url || getThumbnailFromUrl(formData.url_video, formData.tipo)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Video className="w-5 h-5 text-pink-500" />
                        {video ? 'Editar Vídeo' : 'Novo Vídeo'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                        {video
                            ? 'Atualize as informações do vídeo abaixo.'
                            : 'Adicione um novo vídeo para exibir no site.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-emerald-600 dark:text-emerald-300 leading-relaxed">
                                {video ? 'Vídeo atualizado com sucesso!' : 'Vídeo adicionado com sucesso!'}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="titulo" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Título *
                        </Label>
                        <Input
                            id="titulo"
                            value={formData.titulo}
                            onChange={(e) => handleChange('titulo', e.target.value)}
                            placeholder="Ex: Apresentação de Fim de Ano 2024"
                            className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            required
                            disabled={isLoading || success}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="url_video" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            URL do Vídeo *
                        </Label>
                        <div className="relative">
                            <Input
                                id="url_video"
                                type="url"
                                value={formData.url_video}
                                onChange={(e) => handleChange('url_video', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 pl-10"
                                required
                                disabled={isLoading || success}
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                {formData.tipo === 'youtube' ? (
                                    <Youtube className="w-4 h-4 text-red-500" />
                                ) : formData.tipo === 'vimeo' ? (
                                    <Play className="w-4 h-4 text-cyan-500" />
                                ) : (
                                    <Video className="w-4 h-4 text-zinc-400" />
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500">
                            Detectado: <span className="font-medium capitalize">{formData.tipo}</span>
                        </p>
                    </div>

                    {previewThumbnail && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Preview da Thumbnail
                            </Label>
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                <img
                                    src={previewThumbnail}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none'
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="descricao" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Descrição
                        </Label>
                        <textarea
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => handleChange('descricao', e.target.value)}
                            placeholder="Uma breve descrição do vídeo..."
                            rows={3}
                            className="flex w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-y"
                            disabled={isLoading || success}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail_url" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Thumbnail Personalizada (opcional)
                            </Label>
                            <Input
                                id="thumbnail_url"
                                type="url"
                                value={formData.thumbnail_url}
                                onChange={(e) => handleChange('thumbnail_url', e.target.value)}
                                placeholder="https://exemplo.com/thumb.jpg"
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ordem" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Ordem de Exibição
                            </Label>
                            <Input
                                id="ordem"
                                type="number"
                                min="0"
                                value={formData.ordem}
                                onChange={(e) => handleChange('ordem', parseInt(e.target.value) || 0)}
                                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                                disabled={isLoading || success}
                            />
                            <p className="text-xs text-zinc-500">Menor número = aparece primeiro</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="button"
                            onClick={() => handleChange('is_destaque', !formData.is_destaque)}
                            disabled={isLoading || success}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${formData.is_destaque
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                                }`}
                        >
                            {formData.is_destaque ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                            <span className="text-sm font-medium">
                                {formData.is_destaque ? 'Em Destaque' : 'Normal'}
                            </span>
                        </button>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-600 dark:text-blue-300">
                            <strong>Dica:</strong> Para vídeos do YouTube, a thumbnail é gerada automaticamente.
                            Vídeos em destaque aparecem em posições privilegiadas na galeria.
                        </p>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading || success}
                            className="border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || success}
                            className="bg-pink-600 hover:bg-pink-500 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Salvo!
                                </>
                            ) : (
                                video ? 'Atualizar Vídeo' : 'Adicionar Vídeo'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
