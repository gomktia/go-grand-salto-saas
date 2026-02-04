'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Camera,
    Plus,
    FolderOpen,
    AlertCircle,
    Calendar,
    Image as ImageIcon,
    MoreVertical,
    Trash2,
    Eye,
    EyeOff,
    CheckCircle2,
    X,
    FolderPlus,
    Upload
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createAlbumVenda, deleteAlbumVenda, updateAlbumVenda } from '@/app/actions/fotos-venda'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UploadFotosVenda } from '@/components/dashboard/upload-fotos-venda'

type Album = {
    id: string
    titulo: string
    descricao?: string
    evento_data?: string
    capa_url?: string
    is_publico: boolean
    is_venda_ativa: boolean
    preco_padrao: number
    fotos?: { count: number }[]
}

type Props = {
    albums: Album[]
}

export function ClientGalleryContent({ albums }: Props) {
    const tenant = useTenant()
    const router = useRouter()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null)

    const [albumData, setAlbumData] = useState({
        titulo: '',
        descricao: '',
        evento_data: new Date().toISOString().split('T')[0],
        preco_padrao: 15,
        is_publico: true,
        is_venda_ativa: true
    })

    const handleSaveAlbum = async () => {
        if (!albumData.titulo) {
            toast.error('Título é obrigatório')
            return
        }

        setIsSubmitting(true)
        try {
            if (editingAlbumId) {
                await updateAlbumVenda(editingAlbumId, albumData)
                toast.success('Álbum atualizado!')
            } else {
                await createAlbumVenda(albumData)
                toast.success('Álbum criado com sucesso!')
            }
            setIsCreateModalOpen(false)
            setEditingAlbumId(null)
            setAlbumData({
                titulo: '',
                descricao: '',
                evento_data: new Date().toISOString().split('T')[0],
                preco_padrao: 15,
                is_publico: true,
                is_venda_ativa: true
            })
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const openEditAlbum = (album: Album) => {
        setEditingAlbumId(album.id)
        setAlbumData({
            titulo: album.titulo,
            descricao: album.descricao || '',
            evento_data: album.evento_data?.split('T')[0] || new Date().toISOString().split('T')[0],
            preco_padrao: album.preco_padrao,
            is_publico: album.is_publico,
            is_venda_ativa: album.is_venda_ativa
        })
        setIsCreateModalOpen(true)
    }

    const handleDeleteAlbum = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este álbum?')) return

        try {
            await deleteAlbumVenda(id)
            toast.success('Álbum excluído')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const toggleStatus = async (album: Album, field: 'is_publico' | 'is_venda_ativa') => {
        try {
            await updateAlbumVenda(album.id, { [field]: !album[field] })
            toast.success('Status atualizado')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Gestão de Acervo e Vendas
                        </span>
                    </div>
                    <h1 className="text-xl md:text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                        Galeria <span className="text-zinc-500">Comercial</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-12 px-6 rounded-2xl font-black text-[10px] text-white shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none bg-rose-600 hover:bg-rose-500"
                    >
                        <FolderPlus className="w-4 h-4 mr-2" />
                        NOVO ÁLBUM
                    </Button>
                </div>
            </div>

            {/* Albums Grid */}
            {albums.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/5 rounded-[3rem] text-center">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                        <Camera className="w-10 h-10 text-zinc-700" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2 italic">Nenhum Álbum Ativo</h3>
                    <p className="text-zinc-500 text-sm font-medium max-w-xs mx-auto">Comece criando um álbum para organizar as fotos e disponibilizar para venda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {albums.map((album) => (
                        <Card key={album.id} className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden group hover:border-rose-500/30 transition-all shadow-sm">
                            <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                {album.capa_url ? (
                                    <Image src={album.capa_url} alt={album.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Camera className="w-12 h-12 text-zinc-300 dark:text-zinc-700 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Badge className={`uppercase text-[8px] font-black tracking-widest px-2 py-1 rounded-lg ${album.is_publico ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'}`}>
                                        {album.is_publico ? 'Público' : 'Privado'}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <Button
                                        onClick={() => {
                                            setSelectedAlbumId(album.id)
                                            setIsUploadModalOpen(true)
                                        }}
                                        className="h-10 px-4 rounded-xl bg-black/60 backdrop-blur-md text-white border-none font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                    >
                                        <Upload className="w-3.5 h-3.5 mr-2" />
                                        Upload de Fotos
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-tight">{album.titulo}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                                                {album.evento_data ? new Date(album.evento_data).toLocaleDateString('pt-BR') : 'S/ Data'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                                                {album.fotos?.[0]?.count || 0} fotos
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-[10px] font-black italic text-rose-500 uppercase tracking-widest">R$ {Number(album.preco_padrao).toFixed(2)}</div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 rounded-lg text-zinc-400 hover:text-blue-500"
                                                onClick={() => openEditAlbum(album)}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-rose-500" onClick={() => toggleStatus(album, 'is_publico')}>
                                                {album.is_publico ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-rose-400 hover:text-rose-600" onClick={() => handleDeleteAlbum(album.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-50 dark:border-white/5 mt-auto">
                                    <Link href={`/espaco-revelle/galeria/${album.id}`} target="_blank">
                                        <Button variant="outline" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                                            Visualizar no Site
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Album Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
                setIsCreateModalOpen(open)
                if (!open) {
                    setEditingAlbumId(null)
                    setAlbumData({
                        titulo: '',
                        descricao: '',
                        evento_data: new Date().toISOString().split('T')[0],
                        preco_padrao: 15,
                        is_publico: true,
                        is_venda_ativa: true
                    })
                }
            }}>
                <DialogContent className="bg-neutral-950 border-white/10 text-white max-w-lg rounded-[2.5rem] p-10">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">
                            {editingAlbumId ? 'Editar Álbum' : 'Novo Álbum'}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium">
                            {editingAlbumId ? 'Atualize as informações do álbum selecionado.' : 'Configure o álbum e defina o preço base das fotos.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Título do Álbum *</Label>
                            <Input
                                value={albumData.titulo}
                                onChange={(e) => setAlbumData({ ...albumData, titulo: e.target.value })}
                                placeholder="Ex: Espetáculo de Encerramento 2024"
                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-rose-500/50 font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Data do Evento</Label>
                                <Input
                                    type="date"
                                    value={albumData.evento_data}
                                    onChange={(e) => setAlbumData({ ...albumData, evento_data: e.target.value })}
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-rose-500/50 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Preço p/ Foto (R$)</Label>
                                <Input
                                    type="number"
                                    value={albumData.preco_padrao}
                                    onChange={(e) => setAlbumData({ ...albumData, preco_padrao: Number(e.target.value) })}
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-rose-500/50 font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Descrição</Label>
                            <Textarea
                                value={albumData.descricao}
                                onChange={(e) => setAlbumData({ ...albumData, descricao: e.target.value })}
                                placeholder="Detalhes sobre o evento..."
                                className="bg-white/5 border-white/10 rounded-2xl focus:border-rose-500/50 min-h-[100px] p-4 font-medium"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                                <Label className="text-sm font-bold block">Público no Site</Label>
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Visível para todos os visitantes</span>
                            </div>
                            <Switch
                                checked={albumData.is_publico}
                                onCheckedChange={(val) => setAlbumData({ ...albumData, is_publico: val })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={handleSaveAlbum}
                            disabled={isSubmitting}
                            className="w-full h-16 bg-rose-600 hover:bg-rose-500 font-black uppercase text-xs tracking-widest shadow-2xl shadow-rose-600/20 rounded-2xl border-none"
                        >
                            {isSubmitting ? 'SALVANDO...' : editingAlbumId ? 'ATUALIZAR ÁLBUM' : 'CRIAR ÁLBUM AGORA'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upload Modal */}
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogContent className="bg-neutral-950 border-white/10 text-white max-w-2xl rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Upload em Lote</DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium">As fotos selecionadas serão processadas com marca d'água antes do envio.</DialogDescription>
                    </DialogHeader>

                    {selectedAlbumId && (
                        <UploadFotosVenda
                            albumId={selectedAlbumId}
                            onComplete={() => {
                                setIsUploadModalOpen(false)
                                router.refresh()
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
import Link from 'next/link'
