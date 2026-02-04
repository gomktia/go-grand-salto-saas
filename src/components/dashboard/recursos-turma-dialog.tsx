'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Library,
    Plus,
    Search,
    Video,
    Music,
    FileText,
    Link as LinkIcon,
    Loader2,
    AlertCircle
} from 'lucide-react'
import { getRecursosTurma, deleteRecurso } from '@/app/actions/admin'
import { RecursoCard } from './recurso-card'
import { UploadRecursoForm } from './upload-recurso-form'
import { VideoPlayer } from './video-player'
import { AudioPlayer } from './audio-player'
import { motion, AnimatePresence } from 'framer-motion'

type Recurso = {
    id: string
    titulo: string
    descricao?: string
    tipo: 'video' | 'audio' | 'documento' | 'link'
    arquivo_url?: string
    url_externa?: string
    thumbnail_url?: string
    duracao?: number
    visualizacoes: number
    is_publico: boolean
    created_at: string
    criador?: {
        full_name: string
        role: string
    }
}

type RecursosTurmaDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    turmaId: string
    turmaNome: string
    canEdit?: boolean
}

type View = 'list' | 'upload' | 'player'
type Filter = 'todos' | 'video' | 'audio' | 'documento' | 'link'

export function RecursosTurmaDialog({
    open,
    onOpenChange,
    turmaId,
    turmaNome,
    canEdit = false
}: RecursosTurmaDialogProps) {
    const [recursos, setRecursos] = useState<Recurso[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [view, setView] = useState<View>('list')
    const [filter, setFilter] = useState<Filter>('todos')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null)

    useEffect(() => {
        if (open) {
            loadRecursos()
        } else {
            // Reset ao fechar
            setView('list')
            setFilter('todos')
            setSearchQuery('')
            setSelectedRecurso(null)
        }
    }, [open, turmaId])

    async function loadRecursos() {
        try {
            setIsLoading(true)
            setError(null)
            const result = await getRecursosTurma(turmaId)
            setRecursos(result.data || [])
        } catch (err) {
            console.error('Erro ao carregar recursos:', err)
            setError(err instanceof Error ? err.message : 'Erro ao carregar recursos')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (recursoId: string) => {
        if (!confirm('Tem certeza que deseja deletar este recurso?')) return

        try {
            await deleteRecurso(recursoId)
            await loadRecursos()
        } catch (err) {
            console.error('Erro ao deletar:', err)
            alert('Erro ao deletar recurso')
        }
    }

    const handlePlay = (recurso: Recurso) => {
        setSelectedRecurso(recurso)
        setView('player')
    }

    const handleUploadSuccess = () => {
        setView('list')
        loadRecursos()
    }

    // Filtrar recursos
    const filteredRecursos = recursos.filter(r => {
        const matchFilter = filter === 'todos' || r.tipo === filter
        const matchSearch = searchQuery === '' ||
            r.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.descricao?.toLowerCase().includes(searchQuery.toLowerCase())

        return matchFilter && matchSearch
    })

    // Contar por tipo
    const counts = {
        todos: recursos.length,
        video: recursos.filter(r => r.tipo === 'video' || r.tipo === 'link').length,
        audio: recursos.filter(r => r.tipo === 'audio').length,
        documento: recursos.filter(r => r.tipo === 'documento').length,
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] bg-card border-border p-0 gap-0">
                <DialogHeader className="p-6 pb-4 border-b border-border">
                    <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Library className="w-5 h-5 text-primary" />
                        Biblioteca de Mídia - {turmaNome}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {view === 'list' && 'Vídeos, áudios e documentos para os alunos'}
                        {view === 'upload' && 'Adicionar novo recurso'}
                        {view === 'player' && selectedRecurso?.titulo}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {/* List View */}
                        {view === 'list' && (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6 space-y-6"
                            >
                                {/* Header Actions */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Search */}
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar recursos..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 bg-background border-border"
                                        />
                                    </div>

                                    {/* Add Button */}
                                    {canEdit && (
                                        <Button
                                            onClick={() => setView('upload')}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Adicionar
                                        </Button>
                                    )}
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        variant={filter === 'todos' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setFilter('todos')}
                                        className="rounded-full"
                                    >
                                        Todos ({counts.todos})
                                    </Button>
                                    <Button
                                        variant={filter === 'video' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setFilter('video')}
                                        className="rounded-full"
                                    >
                                        <Video className="w-3 h-3 mr-1.5" />
                                        Vídeos ({counts.video})
                                    </Button>
                                    <Button
                                        variant={filter === 'audio' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setFilter('audio')}
                                        className="rounded-full"
                                    >
                                        <Music className="w-3 h-3 mr-1.5" />
                                        Áudios ({counts.audio})
                                    </Button>
                                    <Button
                                        variant={filter === 'documento' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setFilter('documento')}
                                        className="rounded-full"
                                    >
                                        <FileText className="w-3 h-3 mr-1.5" />
                                        Documentos ({counts.documento})
                                    </Button>
                                </div>

                                {/* Loading */}
                                {isLoading && (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                )}

                                {/* Error */}
                                {error && !isLoading && (
                                    <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-destructive font-semibold">Erro ao carregar recursos</p>
                                            <p className="text-xs text-destructive/80 mt-1">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Empty State */}
                                {!isLoading && !error && filteredRecursos.length === 0 && (
                                    <div className="text-center py-12">
                                        <Library className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-foreground font-semibold mb-1">
                                            {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum recurso ainda'}
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-6">
                                            {searchQuery
                                                ? 'Tente outra busca'
                                                : canEdit
                                                    ? 'Adicione vídeos, áudios ou documentos para sua turma'
                                                    : 'O professor ainda não adicionou recursos'
                                            }
                                        </p>
                                        {canEdit && !searchQuery && (
                                            <Button onClick={() => setView('upload')}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Adicionar Primeiro Recurso
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Grid de Recursos */}
                                {!isLoading && !error && filteredRecursos.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredRecursos.map((recurso) => (
                                            <RecursoCard
                                                key={recurso.id}
                                                recurso={recurso}
                                                onPlay={() => handlePlay(recurso)}
                                                onDelete={canEdit ? () => handleDelete(recurso.id) : undefined}
                                                showActions={canEdit}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Upload View */}
                        {view === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6"
                            >
                                <UploadRecursoForm
                                    turmaId={turmaId}
                                    onSuccess={handleUploadSuccess}
                                    onCancel={() => setView('list')}
                                />
                            </motion.div>
                        )}

                        {/* Player View */}
                        {view === 'player' && selectedRecurso && (
                            <motion.div
                                key="player"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6 space-y-4"
                            >
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setView('list')
                                        setSelectedRecurso(null)
                                    }}
                                    className="mb-4"
                                >
                                    ← Voltar
                                </Button>

                                {selectedRecurso.tipo === 'audio' ? (
                                    <AudioPlayer
                                        recursoId={selectedRecurso.id}
                                        titulo={selectedRecurso.titulo}
                                        url={selectedRecurso.arquivo_url || ''}
                                    />
                                ) : (
                                    <VideoPlayer
                                        recursoId={selectedRecurso.id}
                                        titulo={selectedRecurso.titulo}
                                        url={selectedRecurso.arquivo_url}
                                        urlExterna={selectedRecurso.url_externa}
                                        tipo={selectedRecurso.tipo === 'link' ? 'link' : 'video'}
                                    />
                                )}

                                {/* Descrição */}
                                {selectedRecurso.descricao && (
                                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                        <h4 className="font-semibold text-foreground text-sm mb-2">Descrição</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {selectedRecurso.descricao}
                                        </p>
                                    </div>
                                )}

                                {/* Info */}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <Badge variant="outline">{selectedRecurso.tipo}</Badge>
                                    <span>👁 {selectedRecurso.visualizacoes} visualizações</span>
                                    {selectedRecurso.criador && (
                                        <span>Por: {selectedRecurso.criador.full_name}</span>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    )
}
