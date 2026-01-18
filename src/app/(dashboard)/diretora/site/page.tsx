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
    MoreHorizontal,
    Eye,
    Edit2,
    Trash2,
    CheckCircle2,
    Globe,
    Lock,
    ShoppingBag
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SiteManagementPage() {
    const [activeTab, setActiveTab] = useState('blog')

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
                        <Layout className="text-pink-600" />
                        Editor do Site Público
                    </h1>
                    <p className="text-neutral-500">Gerencie o conteúdo que seu público vê no site oficial.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/espaco-revelle" target="_blank">
                        <Button variant="outline" className="border-white/10 gap-2">
                            <Eye className="w-4 h-4" />
                            Ver Site
                        </Button>
                    </Link>
                    <Button className="bg-pink-600 hover:bg-pink-500 gap-2">
                        <Plus className="w-4 h-4" />
                        Novo Conteúdo
                    </Button>
                </div>
            </header>

            <Tabs defaultValue="blog" className="space-y-8" onValueChange={setActiveTab}>
                <TabsList className="bg-neutral-900 border border-white/5 p-1 h-14 rounded-2xl">
                    <TabsTrigger value="blog" className="rounded-xl px-8 data-[state=active]:bg-pink-600 data-[state=active]:text-white gap-2 h-full uppercase text-[10px] font-bold tracking-widest transition-all">
                        <FileText className="w-4 h-4" />
                        Blog de Notícias
                    </TabsTrigger>
                    <TabsTrigger value="albuns" className="rounded-xl px-8 data-[state=active]:bg-pink-600 data-[state=active]:text-white gap-2 h-full uppercase text-[10px] font-bold tracking-widest transition-all">
                        <ImageIcon className="w-4 h-4" />
                        Álbuns & Galeria
                    </TabsTrigger>
                    <TabsTrigger value="horarios" className="rounded-xl px-8 data-[state=active]:bg-pink-600 data-[state=active]:text-white gap-2 h-full uppercase text-[10px] font-bold tracking-widest transition-all">
                        <CalendarIcon className="w-4 h-4" />
                        Grade de Horários
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="blog" className="space-y-6">
                    <BlogTab />
                </TabsContent>

                <TabsContent value="albuns" className="space-y-6">
                    <AlbumsTab />
                </TabsContent>

                <TabsContent value="horarios" className="space-y-6">
                    <SchedulesTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}

function BlogTab() {
    const posts = [
        { id: 1, title: 'Inscrições Abertas para o Espetáculo 2026', date: '18 Jan 2026', status: 'Publicado', views: 450 },
        { id: 2, title: 'Benefícios do Ballet para Crianças de 3 a 5 anos', date: '15 Jan 2026', status: 'Rascunho', views: 0 },
        { id: 3, title: 'Workshop de Jazz Contemporâneo com Prof. Carlos', date: '10 Jan 2026', status: 'Publicado', views: 1250 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <Input placeholder="Pesquisar posts..." className="bg-neutral-900/50 border-white/5 h-12" />
                <Button className="bg-white text-black hover:bg-neutral-200 h-12 px-6 font-bold uppercase text-[10px] tracking-widest">Filtrar</Button>
            </div>

            <Card className="bg-neutral-900/40 border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Título do Artigo</th>
                                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Status</th>
                                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Data</th>
                                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Views</th>
                                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-white group-hover:text-pink-500 transition-colors">{post.title}</div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className={post.status === 'Publicado' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-neutral-500'}>
                                            {post.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-neutral-500">{post.date}</td>
                                    <td className="p-4 text-sm font-mono text-neutral-300">{post.views}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:text-white"><Edit2 className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
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

function AlbumsTab() {
    const albums = [
        { id: 1, title: 'Quebra Nozes 2025', count: 145, type: 'Público', sales: 'R$ 0' },
        { id: 2, title: 'Ensaios de Verão', count: 48, type: 'Privado (Venda)', sales: 'R$ 1.250,00' },
        { id: 3, title: 'Baby Class - Aula Aberta', count: 12, type: 'Público', sales: 'R$ 0' },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
                <Card key={album.id} className="bg-neutral-900 border-white/5 overflow-hidden group hover:border-pink-500/30 transition-all">
                    <div className="aspect-video bg-neutral-800 relative flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-neutral-700" />
                        <div className="absolute top-4 right-4">
                            <Badge className={album.type.includes('Venda') ? 'bg-violet-600' : 'bg-emerald-600'}>
                                {album.type === 'Público' ? <Globe className="w-3 h-3 mr-1" /> : <ShoppingBag className="w-3 h-3 mr-1" />}
                                {album.type}
                            </Badge>
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">{album.title}</CardTitle>
                        <CardDescription>{album.count} fotos capturadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm text-neutral-500 italic">Vendas acumuladas:</span>
                            <span className="font-mono text-white font-bold">{album.sales}</span>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/espaco-revelle/galeria/${album.id}`} className="flex-1">
                                <Button className="w-full bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest h-11">Ver no Site</Button>
                            </Link>
                            <Button size="icon" variant="ghost" className="border border-white/5 h-11 w-11 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Card className="bg-neutral-900/40 border-dashed border-2 border-white/10 flex flex-col items-center justify-center p-12 hover:border-pink-500/40 transition-all group cursor-pointer">
                <Plus className="w-10 h-10 text-neutral-700 mb-4 group-hover:text-pink-500 group-hover:scale-110 transition-all" />
                <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Criar Novo Álbum</span>
            </Card>
        </div>
    )
}

function SchedulesTab() {
    const schedules = [
        { id: 1, class: 'Ballet Baby I', time: '14:00 - 15:00', days: 'Seg/Qua' },
        { id: 2, class: 'Contemporary Jazz', time: '19:00 - 20:30', days: 'Ter/Qui' },
        { id: 3, class: 'Hip Hop Kids', time: '10:00 - 11:00', days: 'Sábado' },
    ]

    return (
        <div className="space-y-6">
            <Card className="bg-neutral-900/40 border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold uppercase text-xs tracking-[0.2em]">Grade Pública de Aulas</h3>
                    <Button variant="outline" size="sm" className="border-white/10 text-[10px] uppercase font-bold tracking-widest">Sincronizar com Sistema</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Modalidade</th>
                                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Dias</th>
                                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Horário</th>
                                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                                    <td className="p-4 font-bold text-white">{item.class}</td>
                                    <td className="p-4 text-sm text-neutral-400">{item.days}</td>
                                    <td className="p-4 text-sm font-mono text-neutral-300">{item.time}</td>
                                    <td className="p-4 text-right">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:text-white"><Edit2 className="w-4 h-4" /></Button>
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

import Link from 'next/link'
