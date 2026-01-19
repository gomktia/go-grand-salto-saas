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
    Lock,
    ShoppingBag,
    Sparkles,
    FolderOpen,
    ArrowUpRight,
    Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'

export default function SiteManagementPage() {
    const [activeTab, setActiveTab] = useState('blog')
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    return (
        <div className="space-y-10 p-1 pb-32">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-3">
                    <Badge variant="outline" className="border-pink-500/30 text-pink-500 bg-pink-500/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Content Management System
                    </Badge>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase flex items-center gap-4 leading-none">
                        Universo <span style={{ color: primaryColor }}>Digital</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg">Gerencie a vitrine pública da <strong className="text-foreground">{tenant?.nome}</strong> para seus alunos.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/espaco-revelle" target="_blank">
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 gap-3 uppercase font-black text-[10px] tracking-widest hover:bg-white/5 transition-all">
                            <Eye className="w-4 h-4" />
                            Visualizar Site
                        </Button>
                    </Link>
                    <Button className="h-14 px-8 rounded-2xl gap-3 uppercase font-black text-[10px] tracking-widest shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all border-none outline-none" style={{ backgroundColor: primaryColor }}>
                        <Plus className="w-5 h-5" />
                        Novo Conteúdo
                    </Button>
                </div>
            </header>

            <Tabs defaultValue="blog" className="space-y-10" onValueChange={setActiveTab}>
                <TabsList className="bg-card/50 backdrop-blur-xl border border-white/10 p-1.5 h-16 rounded-[1.5rem] w-full lg:w-fit flex shadow-2xl">
                    {[
                        { value: 'blog', label: 'Blog de Notícias', icon: FileText },
                        { value: 'albuns', label: 'Álbuns & Galeria', icon: ImageIcon },
                        { value: 'horarios', label: 'Grade de Horários', icon: CalendarIcon },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex-1 lg:flex-none rounded-2xl px-10 gap-3 h-full uppercase text-[10px] font-black tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
                        >
                            <tab.icon className="w-4 h-4" />
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
                            <BlogTab primaryColor={primaryColor} />
                        </TabsContent>

                        <TabsContent value="albuns" className="mt-0 outline-none">
                            <AlbumsTab primaryColor={primaryColor} />
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

function BlogTab({ primaryColor }: { primaryColor: string }) {
    const posts = [
        { id: 1, title: 'Inscrições Abertas para o Espetáculo 2026', date: '18 Jan 2026', status: 'Publicado', views: 450, category: 'EVENTOS' },
        { id: 2, title: 'Benefícios do Ballet para Crianças de 3 a 5 anos', date: '15 Jan 2026', status: 'Rascunho', views: 0, category: 'ARTIGOS' },
        { id: 3, title: 'Workshop de Jazz Contemporâneo com Prof. Carlos', date: '10 Jan 2026', status: 'Publicado', views: 1250, category: 'WORKSHOPS' },
    ]

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-pink-500 transition-colors" />
                    <Input placeholder="Pesquisar por título ou palavra-chave..." className="h-16 pl-14 pr-6 rounded-[1.25rem] bg-card border-white/5 focus-visible:ring-1 focus-visible:ring-pink-500/50 text-lg font-medium transition-all shadow-inner" />
                </div>
                <Button variant="outline" className="h-16 rounded-[1.25rem] border-white/10 uppercase font-black text-[10px] tracking-widest hover:bg-white/5">
                    Filtrar por Status
                </Button>
            </div>

            <Card className="bg-card/30 backdrop-blur-md border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Postagem</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Alcance</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Ações de Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                                            <div>
                                                <div className="font-black text-xl italic uppercase tracking-tighter text-white group-hover:text-pink-500 transition-colors">{post.title}</div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{post.category}</span>
                                                    <span className="text-[10px] text-muted-foreground/30">•</span>
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{post.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest ${post.status === 'Publicado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                                            {post.status}
                                        </Badge>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-mono font-bold text-white">{post.views.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl border border-white/5 hover:bg-white/5 hover:text-white transition-all">
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

function AlbumsTab({ primaryColor }: { primaryColor: string }) {
    const albums = [
        { id: 1, title: 'Quebra Nozes 2025', count: 145, type: 'Público', sales: 'R$ 0', image: 'https://images.unsplash.com/photo-1547153760-18fc21fca24b?q=80&w=600' },
        { id: 2, title: 'Ensaios de Verão', count: 48, type: 'Privado (Venda)', sales: 'R$ 1.250,00', image: 'https://images.unsplash.com/photo-1508700915892-45ecd05ae2ad?q=80&w=600' },
        { id: 3, title: 'Baby Class - Aula Aberta', count: 12, type: 'Público', sales: 'R$ 0', image: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=600' },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
                <Card key={album.id} className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-pink-500/30 transition-all shadow-xl">
                    <div className="aspect-[16/10] relative overflow-hidden">
                        <img src={album.image} alt={album.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute top-6 right-6">
                            <Badge className={`h-10 px-4 rounded-xl border-none font-black text-[9px] uppercase tracking-widest shadow-2xl ${album.type.includes('Venda') ? 'bg-violet-600 text-white' : 'bg-emerald-600 text-white'}`}>
                                {album.type === 'Público' ? <Globe className="w-3.5 h-3.5 mr-2" /> : <ShoppingBag className="w-3.5 h-3.5 mr-2" />}
                                {album.type}
                            </Badge>
                        </div>
                    </div>
                    <CardHeader className="p-8">
                        <CardTitle className="text-2xl font-black uppercase tracking-tight leading-none mb-2">{album.title}</CardTitle>
                        <CardDescription className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5" />
                            {album.count} arquivos na vitrine
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-0">
                        {album.type.includes('Venda') && (
                            <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10 flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Receita Acumulada</span>
                                <span className="font-mono text-lg font-black text-white">{album.sales}</span>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <Link href={`/espaco-revelle/galeria/${album.id}`} className="flex-1">
                                <Button className="w-full h-12 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                                    Explorar no Site
                                </Button>
                            </Link>
                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl border border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all shrink-0">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Card className="bg-white/[0.02] border-dashed border-4 border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:border-pink-500/40 hover:bg-pink-500/[0.02] transition-all group cursor-pointer shadow-inner">
                <div className="w-20 h-20 rounded-[2rem] bg-card border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-2xl">
                    <Plus className="w-10 h-10 text-muted-foreground group-hover:text-pink-500" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Novo Álbum</h4>
                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mt-2">Expanda seu portfólio</p>
            </Card>
        </div>
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
            <Card className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <header className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02]">
                    <div className="space-y-1">
                        <h3 className="font-black uppercase text-xl tracking-tight flex items-center gap-3">
                            <CalendarIcon style={{ color: primaryColor }} />
                            Grade Pública Estratégica
                        </h3>
                        <p className="text-muted-foreground text-sm font-medium">Estes horários são exibidos no site para converter novos alunos.</p>
                    </div>
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-white/10 text-[10px] uppercase font-black tracking-widest gap-2 bg-white/5 hover:bg-white/10">
                        <ArrowUpRight className="w-4 h-4" />
                        Sincronizar com Sistema
                    </Button>
                </header>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Modalidade de Aula</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Dias da Semana</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Faixa Horária</th>
                                <th className="p-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {schedules.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.active ? primaryColor : '#404040' }} />
                                            <div className="font-black text-xl italic uppercase tracking-tighter text-white group-hover:text-pink-500 transition-colors">{item.class}</div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 rounded-lg bg-card border border-white/5 text-sm font-black text-muted-foreground uppercase tracking-widest group-hover:text-white transition-colors">
                                                {item.days}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="text-lg font-mono font-black text-white">{item.time}</div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl border border-white/5 hover:bg-white/5 hover:text-white transition-all">
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
