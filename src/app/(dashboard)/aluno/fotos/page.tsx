'use client'

import React, { useState, useEffect } from 'react'
import { getGaleriasAluno } from '@/app/actions/portal-aluno'
import { toast } from 'sonner'
import {
    Camera,
    Calendar,
    Loader2,
    Image as ImageIcon,
    Heart,
    Download,
    ChevronRight,
    Sparkles,
    Lock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/hooks/use-tenant'
import Link from 'next/link'
import { motion } from 'framer-motion'

type Galeria = {
    id: string
    evento_nome: string
    descricao?: string
    data_evento: string
    capa_url?: string
    is_public: boolean
    fotos: { count: number }[]
}

export default function AlunoFotosPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [isLoading, setIsLoading] = useState(true)
    const [galerias, setGalerias] = useState<Galeria[]>([])

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            setIsLoading(true)
            const result = await getGaleriasAluno()
            setGalerias(result.data as Galeria[])
        } catch (error) {
            toast.error('Erro ao carregar galerias')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Carregando suas fotos...
                </p>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Momentos Especiais
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Minhas <span style={{ color: primaryColor }}>Fotos</span>
                    </h1>
                    <p className="text-muted-foreground font-bold text-sm">
                        {galerias.length} galerias disponiveis
                    </p>
                </div>
                <Link href="/aluno">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                        Voltar ao Dashboard
                    </Button>
                </Link>
            </div>

            {/* Galerias */}
            {galerias.length === 0 ? (
                <Card className="bg-card border-border rounded-[3rem] p-12 text-center">
                    <Camera className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Nenhuma galeria disponivel</h3>
                    <p className="text-muted-foreground">As fotos dos eventos aparecerao aqui quando forem publicadas.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galerias.map((galeria, i) => (
                        <motion.div
                            key={galeria.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="bg-card border-border shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all cursor-pointer">
                                {/* Cover Image */}
                                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                                    {galeria.capa_url ? (
                                        <img
                                            src={galeria.capa_url}
                                            alt={galeria.evento_nome}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                                            <Camera className="w-16 h-16 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Hover Actions */}
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                        <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-black text-[10px] uppercase">
                                            <ImageIcon className="w-3 h-3 mr-1" />
                                            {galeria.fotos?.[0]?.count || 0} fotos
                                        </Badge>
                                        <div className="flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toast.success('Galeria favoritada!')
                                                }}
                                            >
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-black text-lg uppercase tracking-tight group-hover:text-[var(--primary)] transition-colors">
                                            {galeria.evento_nome}
                                        </h3>
                                        {galeria.descricao && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                {galeria.descricao}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {new Date(galeria.data_evento).toLocaleDateString('pt-BR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-3 rounded-lg font-black text-[10px] uppercase tracking-widest group-hover:bg-[var(--primary)] group-hover:text-white transition-all"
                                            onClick={() => toast.info('Visualizacao de galeria em desenvolvimento')}
                                        >
                                            Ver Fotos
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Premium Gallery CTA */}
            <Card className="bg-neutral-900 border-none shadow-2xl rounded-[3rem] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-transparent" style={{ '--primary': primaryColor } as React.CSSProperties} />
                <CardContent className="p-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-white">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Fotos em Alta Resolucao</h3>
                                <p className="text-white/60 font-bold text-sm mt-1">Adquira fotos profissionais sem marca dagua</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => toast.info('Loja de fotos em desenvolvimento')}
                            className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-sm bg-white text-black hover:bg-white/90"
                        >
                            <Lock className="w-5 h-5 mr-2" />
                            Acessar Loja
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
