'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Layout,
    FileText,
    Image as ImageIcon,
    Calendar as CalendarIcon,
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    Globe,
    ShoppingBag,
    ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'
import { getPostsBlog, deletePostBlog, updatePostBlog } from '@/app/actions/blog'
import { getVideosSite, deleteVideoSite, getEventosCalendario, deleteEventoCalendario, getAlbunsVenda } from '@/app/actions/fotos-venda'
import { toast } from 'sonner'
import { BlogDialog } from '@/components/dashboard/blog-dialog'
import { VideoDialog } from '@/components/dashboard/video-dialog'
import { EventoDialog } from '@/components/dashboard/evento-dialog'

export default function SiteManagementPage() {
    const [activeTab, setActiveTab] = useState('blog')
    const [blogDialogOpen, setBlogDialogOpen] = useState(false)
    const [videoDialogOpen, setVideoDialogOpen] = useState(false)
    const [eventoDialogOpen, setEventoDialogOpen] = useState(false)
    const [postToEdit, setPostToEdit] = useState<any>(null)
    const [videoToEdit, setVideoToEdit] = useState<any>(null)
    const [eventoToEdit, setEventoToEdit] = useState<any>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Dialogs */}
            <BlogDialog
                open={blogDialogOpen}
                onOpenChange={(open) => {
                    setBlogDialogOpen(open)
                    if (!open) setPostToEdit(null)
                }}
                post={postToEdit}
                onSuccess={handleRefresh}
            />
            <VideoDialog
                open={videoDialogOpen}
                onOpenChange={(open) => {
                    setVideoDialogOpen(open)
                    if (!open) setVideoToEdit(null)
                }}
                video={videoToEdit}
                onSuccess={handleRefresh}
            />
            <EventoDialog
                open={eventoDialogOpen}
                onOpenChange={(open) => {
                    setEventoDialogOpen(open)
                    if (!open) setEventoToEdit(null)
                }}
                evento={eventoToEdit}
                onSuccess={handleRefresh}
            />

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Website Content Management System (CMS)
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Vitrine <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Digital</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Link href={`/${tenant?.slug || 'home'}`} target="_blank">
                        <Button variant="outline" className="h-10 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                            <Eye className="w-3.5 h-3.5 mr-2" />
                            VER SITE
                        </Button>
                    </Link>
                    <Button
                        onClick={() => setBlogDialogOpen(true)}
                        className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        NOVO POST
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="blog" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="bg-zinc-100 dark:bg-zinc-800/50 p-1 h-11 rounded-xl w-full lg:w-fit flex shadow-inner">
                    {[
                        { value: 'blog', label: 'Blog', icon: FileText },
                        { value: 'videos', label: 'Vídeos', icon: ShoppingBag },
                        { value: 'calendario', label: 'Eventos', icon: CalendarIcon },
                        { value: 'horarios', label: 'Grade', icon: Layout },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex-1 lg:flex-none rounded-lg px-8 gap-2 h-full uppercase text-[9px] font-bold tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-zinc-500"
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TabsContent value="blog" className="mt-0 outline-none">
                            <BlogTab
                                primaryColor={primaryColor}
                                refreshKey={refreshKey}
                                onNewPost={() => { setPostToEdit(null); setBlogDialogOpen(true); }}
                                onEditPost={(post) => { setPostToEdit(post); setBlogDialogOpen(true); }}
                            />
                        </TabsContent>
                        ...
                        <TabsContent value="videos" className="mt-0 outline-none">
                            <VideosTab
                                primaryColor={primaryColor}
                                refreshKey={refreshKey}
                                onNewVideo={() => { setVideoToEdit(null); setVideoDialogOpen(true); }}
                                onEditVideo={(video) => { setVideoToEdit(video); setVideoDialogOpen(true); }}
                            />
                        </TabsContent>

                        <TabsContent value="calendario" className="mt-0 outline-none">
                            <EventsTab
                                primaryColor={primaryColor}
                                refreshKey={refreshKey}
                                onNewEvento={() => { setEventoToEdit(null); setEventoDialogOpen(true); }}
                                onEditEvento={(evento) => { setEventoToEdit(evento); setEventoDialogOpen(true); }}
                            />
                        </TabsContent>

                        <TabsContent value="horarios" className="mt-0 outline-none">
                            <SchedulesTab primaryColor={primaryColor} />
                        </TabsContent>
                    </motion.div>
                </AnimatePresence>
            </Tabs>
        </div>
    )
}

function BlogTab({ primaryColor, refreshKey, onNewPost, onEditPost }: { primaryColor: string; refreshKey: number; onNewPost: () => void; onEditPost: (post: any) => void }) {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    React.useEffect(() => {
        loadPosts()
    }, [refreshKey])

    async function loadPosts() {
        try {
            setLoading(true)
            const result = await getPostsBlog()
            setPosts(result.data)
        } catch (error) {
            toast.error('Erro ao carregar posts')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja excluir este post?')) return
        try {
            await deletePostBlog(id)
            toast.success('Post excluído com sucesso!')
            loadPosts()
        } catch (error) {
            toast.error('Erro ao excluir post')
        }
    }

    const handleToggleStatus = async (post: any) => {
        try {
            await updatePostBlog(post.id, { is_publicado: !post.is_publicado })
            toast.success(`Post ${!post.is_publicado ? 'publicado' : 'movido para rascunho'}`)
            loadPosts()
        } catch (error) {
            toast.error('Erro ao atualizar status')
        }
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-pink-500 transition-colors" />
                    <Input placeholder="Pesquisar por título ou palavra-chave..." className="h-16 pl-14 pr-6 rounded-[1.25rem] bg-card border-zinc-200 dark:border-white/5 focus-visible:ring-1 focus-visible:ring-pink-500/50 text-lg font-medium transition-all shadow-inner" />
                </div>
                <Button
                    onClick={() => toast.info('A filtragem avançada de posts será liberada em breve.')}
                    variant="outline"
                    className="h-16 rounded-[1.25rem] border-zinc-200 dark:border-white/10 uppercase font-black text-[10px] tracking-widest hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                    Filtrar por Status
                </Button>
            </div>

            <Card className="bg-white/50 dark:bg-card/30 backdrop-blur-md border-zinc-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02]">
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Postagem</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Alcance</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Ações de Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors group border-b border-zinc-50 dark:border-white/5">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                                            <div>
                                                <div className="font-black text-xl italic uppercase tracking-tighter text-zinc-900 dark:text-white group-hover:text-pink-500 transition-colors">{post.titulo || post.title}</div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{post.categoria}</span>
                                                    <span className="text-[10px] text-muted-foreground/30">•</span>
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                        {post.data_publicacao ? new Date(post.data_publicacao).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <Badge
                                            onClick={() => handleToggleStatus(post)}
                                            className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest cursor-pointer hover:opacity-80 transition-all ${post.is_publicado ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}
                                        >
                                            {post.is_publicado ? 'Publicado' : 'Rascunho'}
                                        </Badge>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-mono font-bold text-zinc-900 dark:text-white">{(post.visualizacoes || 0).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Button
                                                onClick={() => onEditPost(post)}
                                                size="icon"
                                                variant="ghost"
                                                className="h-12 w-12 rounded-xl border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(post.id)}
                                                size="icon"
                                                variant="ghost"
                                                className="h-12 w-12 rounded-xl border border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

function VideosTab({ primaryColor, refreshKey, onNewVideo, onEditVideo }: { primaryColor: string; refreshKey: number; onNewVideo: () => void; onEditVideo: (video: any) => void }) {
    const [videos, setVideos] = useState<any[]>([])

    const loadVideos = async () => {
        const result = await getVideosSite()
        setVideos(result.data)
    }

    React.useEffect(() => {
        loadVideos()
    }, [refreshKey])

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja excluir este vídeo?')) return
        try {
            await deleteVideoSite(id)
            toast.success('Vídeo excluído com sucesso!')
            loadVideos()
        } catch (error) {
            toast.error('Erro ao excluir vídeo')
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
                <Card key={video.id} className="bg-white/50 dark:bg-card/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/30 transition-all shadow-xl flex flex-col">
                    <div className="aspect-video relative overflow-hidden cursor-pointer" onClick={() => onEditVideo(video)}>
                        <img src={video.thumbnail_url || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071'} alt={video.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 className="w-12 h-12 text-white opacity-80 group-hover:scale-125 transition-transform" />
                        </div>
                    </div>
                    <CardHeader className="p-8 flex-1">
                        <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-2xl font-black uppercase tracking-tight leading-loose line-clamp-2">{video.titulo}</CardTitle>
                            <Button
                                onClick={() => handleDelete(video.id)}
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <CardDescription className="uppercase text-[10px] font-black tracking-widest text-muted-foreground line-clamp-2 mt-4">
                            {video.descricao || 'Sem descrição'}
                        </CardDescription>
                    </CardHeader>
                </Card>
            ))}
            <Card
                onClick={onNewVideo}
                className="bg-zinc-50 dark:bg-white/[0.02] border-dashed border-4 border-zinc-200 dark:border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all group cursor-pointer shadow-inner h-full"
            >
                <div className="w-20 h-20 rounded-[2rem] bg-card border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-2xl">
                    <Plus className="w-10 h-10 text-muted-foreground group-hover:text-blue-500" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Novo Vídeo</h4>
            </Card>
        </div>
    )
}

function EventsTab({ primaryColor, refreshKey, onNewEvento, onEditEvento }: { primaryColor: string; refreshKey: number; onNewEvento: () => void; onEditEvento: (evento: any) => void }) {
    const [eventos, setEventos] = useState<any[]>([])

    const loadEvents = async () => {
        const result = await getEventosCalendario(false)
        setEventos(result.data)
    }

    React.useEffect(() => {
        loadEvents()
    }, [refreshKey])

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja excluir este evento?')) return
        try {
            await deleteEventoCalendario(id)
            toast.success('Evento excluído com sucesso!')
            loadEvents()
        } catch (error) {
            toast.error('Erro ao excluir evento')
        }
    }

    return (
        <Card className="bg-white/50 dark:bg-card/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <header className="p-8 border-b border-zinc-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-50 dark:bg-white/[0.02]">
                <div className="space-y-1">
                    <h3 className="font-black uppercase text-xl tracking-tight flex items-center gap-3">
                        <CalendarIcon style={{ color: primaryColor }} />
                        Eventos Programados
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">Estes eventos aparecem no site público.</p>
                </div>
                <Button
                    onClick={onNewEvento}
                    className="h-12 px-6 rounded-xl text-[10px] uppercase font-black tracking-widest gap-2 bg-rose-600 hover:bg-rose-500 text-white border-none shadow-lg shadow-rose-500/20"
                >
                    <Plus className="w-4 h-4" />
                    NOVO EVENTO
                </Button>
            </header>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-zinc-200 dark:border-white/5">
                            <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Evento</th>
                            <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Data e Local</th>
                            <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                            <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                        {eventos.map((item) => (
                            <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors group">
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.cor || primaryColor }} />
                                        <div>
                                            <div className="font-black text-xl italic uppercase tracking-tighter text-zinc-900 dark:text-white group-hover:text-rose-500 transition-colors">{item.titulo}</div>
                                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{item.tipo}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                                            {new Date(item.data_inicio).toLocaleDateString()}
                                        </div>
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.local || 'Local não informado'}</div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest ${item.is_publico ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                                        {item.is_publico ? 'Público' : 'Interno'}
                                    </Badge>
                                </td>
                                <td className="p-8 text-right">
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            onClick={() => onEditEvento(item)}
                                            size="icon"
                                            variant="ghost"
                                            className="h-12 w-12 rounded-xl border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(item.id)}
                                            size="icon"
                                            variant="ghost"
                                            className="h-12 w-12 rounded-xl border border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

function SchedulesTab({ primaryColor }: { primaryColor: string }) {
    const schedules = [
        { id: 1, class: 'Ballet Baby I', time: '14:00 - 15:00', days: 'Seg/Qua', active: true },
        { id: 2, class: 'Contemporary Jazz', time: '19:00 - 20:30', days: 'Ter/Qui', active: true },
        { id: 3, class: 'Hip Hop Kids', time: '10:00 - 11:00', days: 'Sábado', active: false },
    ]

    return (
        <div className="space-y-8">
            <Card className="bg-white/50 dark:bg-card/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <header className="p-8 border-b border-zinc-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-50 dark:bg-white/[0.02]">
                    <div className="space-y-1">
                        <h3 className="font-black uppercase text-xl tracking-tight flex items-center gap-3">
                            <CalendarIcon style={{ color: primaryColor }} />
                            Grade Pública Estratégica
                        </h3>
                        <p className="text-muted-foreground text-sm font-medium">Estes horários são exibidos no site para converter novos alunos.</p>
                    </div>
                    <Button
                        onClick={() => toast.info('A sincronização automática de grade está em desenvolvimento.')}
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-white/10 text-[10px] uppercase font-black tracking-widest gap-2 bg-white/5 hover:bg-white/10"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        Sincronizar com Sistema
                    </Button>
                </header>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.01]">
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Modalidade de Aula</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Dias da Semana</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Faixa Horária</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                            {schedules.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.active ? primaryColor : '#404040' }} />
                                            <div className="font-black text-xl italic uppercase tracking-tighter text-zinc-900 dark:text-white group-hover:text-pink-500 transition-colors">{item.class}</div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-card border border-zinc-200 dark:border-white/5 text-sm font-black text-zinc-500 dark:text-muted-foreground uppercase tracking-widest group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                                {item.days}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="text-lg font-mono font-black text-zinc-900 dark:text-white">{item.time}</div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl border border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
