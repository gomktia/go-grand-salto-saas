'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Camera,
    Heart,
    Share2,
    Download,
    Maximize2,
    Upload,
    MoreVertical,
    Zap,
    CheckCircle2,
    Loader2,
    FileText,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCompletion } from '@ai-sdk/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { checkSchoolFinanceStatus } from '@/lib/check-finance'

const mockPhotos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=2000', favorites: 12, category: 'Ensaio' },
    { id: 2, url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2000', favorites: 8, category: 'Apresentação' },
    { id: 3, url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=2000', favorites: 25, category: 'Bastidores' },
    { id: 4, url: 'https://images.unsplash.com/photo-1502519144081-acca18599776?q=80&w=2000', favorites: 15, category: 'Ensaio' },
]

export default function MomentoDoPalco() {
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [isIAModalOpen, setIsIAModalOpen] = useState(false)
    const [financeStatus, setFinanceStatus] = useState({ isAdimplente: true, daysOverdue: 0 })

    const { complete, completion, isLoading, handleSubmit } = useCompletion({
        api: '/api/ai',
    })

    if (!financeStatus.isAdimplente) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6 text-white">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Acesso Suspenso</h2>
                    <p className="text-neutral-400 max-w-md">
                        Identificamos uma pendência financeira no <strong>Espaço Revelle</strong>.
                        O acesso a novas fotos da galeria foi temporariamente restrito.
                    </p>
                </div>
                <Link href="/diretora/financeiro">
                    <Button className="bg-red-600 hover:bg-red-500 h-12 px-8 rounded-xl font-bold">
                        Regularizar Agora
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8 p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-pink-500 bg-clip-text text-transparent">
                        Momento do Palco
                    </h1>
                    <p className="text-neutral-400 mt-2">Destaques do <strong>Espaço Revelle</strong>.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setIsIAModalOpen(true)}
                        className="bg-violet-600 hover:bg-violet-500 gap-2 shadow-lg shadow-violet-600/20"
                    >
                        <Zap className="w-4 h-4" />
                        IA Content Assistant
                    </Button>
                    <Button className="bg-pink-600 hover:bg-pink-500 gap-2">
                        <Upload className="w-4 h-4" />
                        Subir Fotos
                    </Button>
                </div>
            </div>

            {/* Galeria Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockPhotos.map((photo) => (
                    <motion.div
                        key={photo.id}
                        whileHover={{ y: -5 }}
                        className="group relative cursor-pointer"
                    >
                        <Card className="bg-neutral-900 border-white/5 overflow-hidden aspect-[3/4] transition-all group-hover:border-pink-500/30">
                            <img
                                src={photo.url}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                alt="Ballet Performance"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                <div className="flex items-center justify-between">
                                    <Badge className="bg-pink-600 border-none text-[10px]">{photo.category}</Badge>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/10 hover:bg-pink-600">
                                        <Heart className="w-4 h-4 fill-white" />
                                    </Button>
                                </div>
                            </div>
                            <div className="absolute top-4 left-4 flex items-center gap-1.5 p-2 rounded-full bg-black/40 backdrop-blur-md">
                                <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                                <span className="text-[10px] font-bold">{photo.favorites} favoritos</span>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* IA Modal */}
            <Dialog open={isIAModalOpen} onOpenChange={setIsIAModalOpen}>
                <DialogContent className="bg-neutral-950 border-white/10 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Zap className="text-violet-500 w-5 h-5" />
                            Gerar Post de Blog com IA
                        </DialogTitle>
                        <DialogDescription className="text-neutral-500">
                            Nossa IA irá analisar as fotos do evento e criar um artigo completo para o Espaço Revelle.
                        </DialogDescription>
                    </DialogHeader>

                    {!completion ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Nome do Evento</label>
                                <Input placeholder="Ex: Espetáculo Quebra Nozes 2025" className="bg-white/5 border-white/10" id="eventName" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">O que aconteceu?</label>
                                <Textarea placeholder="Descreva brevemente a emoção e o que foi apresentado..." className="bg-white/5 border-white/10 min-h-[100px]" id="description" />
                            </div>
                            <Button
                                onClick={() => complete('Gerar post completo para o evento')}
                                disabled={isLoading}
                                className="w-full bg-violet-600 hover:bg-violet-500 h-11"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Criar Artigo SEO'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                                {completion}
                            </div>
                            <div className="flex gap-3">
                                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Publicar no Blog
                                </Button>
                                <Button variant="outline" onClick={() => setIsIAModalOpen(false)} className="border-white/10">
                                    Fechar
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
