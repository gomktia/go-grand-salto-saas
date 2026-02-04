'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Video,
    Music,
    FileText,
    Link as LinkIcon,
    Play,
    MoreVertical,
    Eye,
    Clock,
    Trash2,
    Edit
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { motion } from 'framer-motion'

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

type RecursoCardProps = {
    recurso: Recurso
    onPlay: () => void
    onEdit?: () => void
    onDelete?: () => void
    showActions?: boolean
}

const formatDuracao = (segundos?: number) => {
    if (!segundos) return null

    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60

    if (horas > 0) {
        return `${horas}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
    }
    return `${minutos}:${segs.toString().padStart(2, '0')}`
}

const formatData = (dataStr: string) => {
    const data = new Date(dataStr)
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(data)
}

export function RecursoCard({
    recurso,
    onPlay,
    onEdit,
    onDelete,
    showActions = false
}: RecursoCardProps) {
    const IconMap = {
        video: Video,
        audio: Music,
        documento: FileText,
        link: LinkIcon
    }

    const ColorMap = {
        video: 'text-purple-500',
        audio: 'text-blue-500',
        documento: 'text-orange-500',
        link: 'text-green-500'
    }

    const BgMap = {
        video: 'bg-purple-500/10',
        audio: 'bg-blue-500/10',
        documento: 'bg-orange-500/10',
        link: 'bg-green-500/10'
    }

    const Icon = IconMap[recurso.tipo]
    const colorClass = ColorMap[recurso.tipo]
    const bgClass = BgMap[recurso.tipo]

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
        >
            <Card className="overflow-hidden bg-card border-border hover:border-primary/20 transition-all group">
                {/* Thumbnail/Preview */}
                <div className={`relative h-40 ${bgClass} flex items-center justify-center overflow-hidden`}>
                    {recurso.thumbnail_url ? (
                        <img
                            src={recurso.thumbnail_url}
                            alt={recurso.titulo}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Icon className={`w-16 h-16 ${colorClass}`} />
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="lg"
                            onClick={onPlay}
                            className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-black"
                        >
                            <Play className="w-6 h-6 fill-current" />
                        </Button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="secondary" className="text-[10px] font-semibold uppercase bg-black/60 text-white border-0">
                            {recurso.tipo}
                        </Badge>
                        {!recurso.is_publico && (
                            <Badge variant="secondary" className="text-[10px] font-semibold uppercase bg-yellow-500/80 text-black border-0">
                                Privado
                            </Badge>
                        )}
                    </div>

                    {/* Duração */}
                    {recurso.duracao && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-xs font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuracao(recurso.duracao)}
                        </div>
                    )}

                    {/* Actions Menu */}
                    {showActions && (
                        <div className="absolute top-3 right-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white border-0"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card border-border">
                                    {onEdit && (
                                        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </DropdownMenuItem>
                                    )}
                                    {onDelete && (
                                        <>
                                            <DropdownMenuSeparator className="bg-border" />
                                            <DropdownMenuItem
                                                onClick={onDelete}
                                                className="text-destructive cursor-pointer focus:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Deletar
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-2 leading-tight">
                        {recurso.titulo}
                    </h3>

                    {recurso.descricao && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {recurso.descricao}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{recurso.visualizacoes}</span>
                            </div>
                            <span>•</span>
                            <span>{formatData(recurso.created_at)}</span>
                        </div>

                        {recurso.criador && (
                            <span className="text-[10px] font-medium truncate max-w-[100px]">
                                {recurso.criador.full_name}
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
