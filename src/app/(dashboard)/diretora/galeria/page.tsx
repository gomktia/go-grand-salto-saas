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
    Sparkles,
    Plus,
    FolderOpen,
    CheckCircle2,
    Loader2,
    FileText,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
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

export default function GaleriaPage() {
    const [isIAModalOpen, setIsIAModalOpen] = useState(false)
    const [financeStatus, setFinanceStatus] = useState({ isAdimplente: true, daysOverdue: 0 })

    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#db2777'

    if (!financeStatus.isAdimplente) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border-2 border-dashed border-red-500/30">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Acesso Suspenso</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-md font-medium">
                        Identificamos uma pendência financeira em seu sistema.
                        O acesso ao acervo digital foi temporariamente restrito para o <strong>{tenant?.nome}</strong>.
                    </p>
                </div>
                <Link href="/diretora/financeiro">
                    <Button className="bg-red-600 hover:bg-red-500 h-14 px-10 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-500/20 transition-all hover:scale-105">
                        Regularizar Agora
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 italic mb-2">Acervo Digital de Elite</h2>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-neutral-900 dark:text-white flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-pink-600" />
                        Momento do Palco
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">Capture e eternize a evolução artística de seus <strong>Alunos</strong>.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-neutral-200 dark:border-neutral-800 gap-2 font-bold uppercase text-[10px] tracking-widest glass">
                        Criar Álbum
                    </Button>
                    <Button
                        style={{ backgroundColor: primaryColor }}
                        className="h-14 px-8 rounded-2xl text-white gap-2 font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-pink-500/20 hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Upload de Fotos
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="md:col-span-1 lg:col-span-1 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-8 rounded-[2rem] shadow-sm glass">
                    <div className="space-y-6">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Diretório Central</div>
                        <div className="space-y-2">
                            {['Espetáculo 2025', 'Ensaios Abertos', 'Bastidores', 'Gala de Inverno'].map((folder) => (
                                <Button key={folder} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-neutral-100 dark:hover:bg-white/5 group">
                                    <FolderOpen className="w-4 h-4 text-neutral-400 group-hover:text-pink-500 transition-colors" />
                                    {folder}
                                </Button>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-neutral-100 dark:border-white/5 space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                <span>Storage</span>
                                <span>24.8%</span>
                            </div>
                            <div className="h-2 w-full bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-pink-500 transition-all" style={{ width: '24.8%' }} />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="md:col-span-1 lg:col-span-3 space-y-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {mockPhotos.map((photo) => (
                            <motion.div
                                key={photo.id}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="aspect-[3/4] rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-xl border border-neutral-200 dark:border-white/5 bg-neutral-100 dark:bg-neutral-800"
                            >
                                <img
                                    src={photo.url}
                                    alt="Palco Performance"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                                        <Badge className="bg-white/20 backdrop-blur-md text-white border-none uppercase text-[9px] font-black tracking-widest px-3 py-1 scale-90 origin-left">{photo.category}</Badge>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-pink-500 transition-all pointer-events-auto">
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-blue-500 transition-all pointer-events-auto">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-1.5 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                        <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                                        <span className="text-[10px] font-black text-white">{photo.favorites}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* AI Content Assistant Panel */}
                    <Card className="bg-gradient-to-br from-neutral-900 to-black border-none rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-[1.6] group-hover:rotate-0 transition-all duration-1000">
                            <Sparkles size={200} className="text-pink-500" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="relative">
                                <div className="p-8 rounded-[2.5rem] bg-pink-500/10 border border-pink-500/20 backdrop-blur-3xl">
                                    <Sparkles className="w-12 h-12 text-pink-500 animate-pulse" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-black animate-bounce">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-3 text-center md:text-left">
                                <Badge className="bg-pink-500/20 text-pink-500 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] mb-2">Copiloto Criativo Ativo</Badge>
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Assistente de Conteúdo IA</h3>
                                <p className="text-neutral-400 text-sm max-w-xl font-medium">Nossa IA analisa suas fotos de palco, identifica as emoções e gera legendas poéticas para seu Instagram e posts otimizados para seu blog automaticamente.</p>
                            </div>
                            <Button
                                onClick={() => setIsIAModalOpen(true)}
                                className="h-16 px-10 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
                            >
                                Iniciar Automação <Zap className="ml-2 w-4 h-4 fill-current" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* IA Modal */}
            <Dialog open={isIAModalOpen} onOpenChange={setIsIAModalOpen}>
                <DialogContent className="bg-neutral-950 border-white/10 text-white max-w-2xl rounded-[3rem] p-0 overflow-hidden glass">
                    <div className="p-10 space-y-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center">
                                    <Zap className="text-violet-500 w-5 h-5 fill-current" />
                                </div>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Motor Criativo de Elite</DialogTitle>
                            </div>
                            <DialogDescription className="text-neutral-500 font-medium">Analisando atmosfera e movimento para criar sua narrativa digital.</DialogDescription>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Contexto do Evento</label>
                                <Input placeholder="Ex: Grande Espetáculo 2025 - Teatro Municipal" className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-pink-500/50 transition-all font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Atmosfera Desejada</label>
                                <Textarea placeholder="Poética, inspiradora, técnica, bastidores..." className="bg-white/5 border-white/10 min-h-[120px] rounded-2xl focus:border-pink-500/50 transition-all resize-none p-6" />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Button className="flex-1 h-14 bg-pink-600 hover:bg-pink-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-pink-600/20">
                                Gerar Legenda Instagram
                            </Button>
                            <Button variant="outline" className="flex-1 h-14 border-white/10 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-white/5">
                                Gerar Post Blog
                            </Button>
                        </div>
                    </div>
                    <div className="bg-neutral-900/50 p-6 border-t border-white/5 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600 italic">Powered by Grand Salto Quantum Engine</p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
