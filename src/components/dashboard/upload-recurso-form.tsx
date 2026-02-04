'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Upload,
    Link as LinkIcon,
    File,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Video,
    Music,
    FileText
} from 'lucide-react'
import { createRecursoMetadata, createRecursoLink } from '@/app/actions/admin'
import { createClient } from '@/utils/supabase/client'
import { Card } from '@/components/ui/card'

type UploadRecursoFormProps = {
    turmaId: string
    onSuccess: () => void
    onCancel: () => void
}

type UploadMode = 'file' | 'link'
type TipoArquivo = 'video' | 'audio' | 'documento'

export function UploadRecursoForm({ turmaId, onSuccess, onCancel }: UploadRecursoFormProps) {
    const [mode, setMode] = useState<UploadMode>('file')
    const [tipo, setTipo] = useState<TipoArquivo>('video')
    const [arquivo, setArquivo] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        url_externa: '',
        is_publico: true
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    const maxSizes = {
        video: 500 * 1024 * 1024, // 500MB
        audio: 50 * 1024 * 1024,  // 50MB
        documento: 20 * 1024 * 1024 // 20MB
    }

    const acceptedTypes = {
        video: 'video/mp4,video/webm,video/ogg,video/quicktime',
        audio: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac',
        documento: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file) {
            validateAndSetFile(file)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            validateAndSetFile(file)
        }
    }

    const validateAndSetFile = (file: File) => {
        // Verificar tamanho
        if (file.size > maxSizes[tipo]) {
            const maxMB = maxSizes[tipo] / (1024 * 1024)
            setError(`Arquivo muito grande. Máximo: ${maxMB}MB`)
            return
        }

        setArquivo(file)
        setError(null)

        // Auto-preencher título se estiver vazio
        if (!formData.titulo) {
            const fileName = file.name.replace(/\.[^/.]+$/, '')
            setFormData(prev => ({ ...prev, titulo: fileName }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setProgress(0)

        try {
            if (mode === 'file') {
                if (!arquivo) {
                    throw new Error('Selecione um arquivo')
                }

                // 1. Preparar Upload Client-Side
                const supabase = createClient()

                const bucketMap = {
                    video: 'turmas-videos',
                    audio: 'turmas-audios',
                    documento: 'turmas-documentos',
                }
                const bucket = bucketMap[tipo]

                const fileExt = arquivo.name.split('.').pop()
                const fileName = `${turmaId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

                // Simular progresso inicial
                const progressInterval = setInterval(() => {
                    setProgress(prev => Math.min(prev + 5, 90))
                }, 500)

                // 2. Fazer Upload para Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, arquivo, {
                        cacheControl: '3600',
                        upsert: false,
                    })

                clearInterval(progressInterval)

                if (uploadError) {
                    throw new Error(`Erro no upload: ${uploadError.message}`)
                }

                setProgress(95)

                // 3. Obter URL Pública
                const { data: { publicUrl } } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(fileName)

                // 4. Salvar Metadados no Banco (Server Action)
                await createRecursoMetadata({
                    turma_id: turmaId,
                    titulo: formData.titulo,
                    descricao: formData.descricao,
                    tipo: tipo,
                    is_publico: formData.is_publico,
                    arquivo_url: publicUrl,
                    arquivo_nome: arquivo.name,
                    arquivo_tamanho: arquivo.size,
                    arquivo_mime: arquivo.type,
                })

                setProgress(100)
            } else {
                // Modo link (Server Action direto)
                if (!formData.url_externa) {
                    throw new Error('Digite a URL do vídeo')
                }

                await createRecursoLink({
                    turma_id: turmaId,
                    titulo: formData.titulo,
                    descricao: formData.descricao,
                    tipo: 'link',
                    url_externa: formData.url_externa,
                    is_publico: formData.is_publico,
                    ordem: 0
                })
            }

            setSuccess(true)
            setTimeout(() => {
                onSuccess()
            }, 1500)

        } catch (err) {
            console.error('Erro ao fazer upload:', err)
            setError(err instanceof Error ? err.message : 'Erro ao fazer upload')
            setProgress(0)
        } finally {
            setIsLoading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
                <Button
                    type="button"
                    variant={mode === 'file' ? 'default' : 'ghost'}
                    onClick={() => setMode('file')}
                    className="flex-1"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload de Arquivo
                </Button>
                <Button
                    type="button"
                    variant={mode === 'link' ? 'default' : 'ghost'}
                    onClick={() => setMode('link')}
                    className="flex-1"
                >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Link YouTube/Vimeo
                </Button>
            </div>

            {/* File Upload Mode */}
            {mode === 'file' && (
                <>
                    {/* Tipo de Arquivo */}
                    <div className="space-y-2">
                        <Label>Tipo de Arquivo</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                type="button"
                                variant={tipo === 'video' ? 'default' : 'outline'}
                                onClick={() => setTipo('video')}
                                className="flex flex-col h-auto py-3"
                            >
                                <Video className="w-5 h-5 mb-1" />
                                <span className="text-xs">Vídeo</span>
                                <span className="text-[10px] text-muted-foreground">Max 500MB</span>
                            </Button>
                            <Button
                                type="button"
                                variant={tipo === 'audio' ? 'default' : 'outline'}
                                onClick={() => setTipo('audio')}
                                className="flex flex-col h-auto py-3"
                            >
                                <Music className="w-5 h-5 mb-1" />
                                <span className="text-xs">Áudio</span>
                                <span className="text-[10px] text-muted-foreground">Max 50MB</span>
                            </Button>
                            <Button
                                type="button"
                                variant={tipo === 'documento' ? 'default' : 'outline'}
                                onClick={() => setTipo('documento')}
                                className="flex flex-col h-auto py-3"
                            >
                                <FileText className="w-5 h-5 mb-1" />
                                <span className="text-xs">Documento</span>
                                <span className="text-[10px] text-muted-foreground">Max 20MB</span>
                            </Button>
                        </div>
                    </div>

                    {/* Drag & Drop Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                            ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                        `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={acceptedTypes[tipo]}
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {arquivo ? (
                            <div className="space-y-2">
                                <File className="w-12 h-12 mx-auto text-primary" />
                                <p className="font-semibold text-foreground">{arquivo.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(arquivo.size)}</p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setArquivo(null)
                                    }}
                                >
                                    <X className="w-3 h-3 mr-1" />
                                    Remover
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                                <p className="font-semibold text-foreground">
                                    Arraste ou clique para selecionar
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {tipo === 'video' && 'MP4, WebM, MOV (máx 500MB)'}
                                    {tipo === 'audio' && 'MP3, WAV, OGG (máx 50MB)'}
                                    {tipo === 'documento' && 'PDF, DOC, DOCX (máx 20MB)'}
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Link Mode */}
            {mode === 'link' && (
                <div className="space-y-2">
                    <Label htmlFor="url_externa">URL do Vídeo *</Label>
                    <Input
                        id="url_externa"
                        type="url"
                        value={formData.url_externa}
                        onChange={(e) => setFormData({ ...formData, url_externa: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="bg-background border-border"
                        required={mode === 'link'}
                    />
                    <p className="text-xs text-muted-foreground">
                        Cole o link do YouTube ou Vimeo aqui
                    </p>
                </div>
            )}

            {/* Título */}
            <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Aula de Piruetas Básicas"
                    className="bg-background border-border"
                    required
                />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
                <Label htmlFor="descricao">Descrição (opcional)</Label>
                <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva o conteúdo deste recurso..."
                    rows={3}
                    className="bg-background border-border resize-none"
                />
            </div>

            {/* Visibilidade */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_publico"
                    checked={formData.is_publico}
                    onChange={(e) => setFormData({ ...formData, is_publico: e.target.checked })}
                    className="w-4 h-4"
                />
                <Label htmlFor="is_publico" className="cursor-pointer">
                    Visível para alunos
                </Label>
            </div>

            {/* Progress Bar */}
            {isLoading && progress > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Enviando...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-500">Upload realizado com sucesso!</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading || (mode === 'file' && !arquivo)}
                    className="flex-1"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            {mode === 'file' ? 'Fazer Upload' : 'Adicionar Link'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
