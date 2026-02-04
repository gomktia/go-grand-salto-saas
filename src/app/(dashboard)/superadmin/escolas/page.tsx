'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search,
    Plus,
    Globe,
    MoreVertical,
    Shield,
    Filter,
    School,
    Loader2,
    Users,
    GraduationCap,
    Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { getEscolas, criarEscola } from '@/app/actions/superadmin'

type Escola = {
    id: string
    nome: string
    slug: string
    status: string
    plano: string
    created_at: string
    perfis: { count: number }[]
    estudantes: { count: number }[]
    turmas: { count: number }[]
}

export default function EscolasPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [escolas, setEscolas] = useState<Escola[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('todos')

    // New School Form State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [newSchoolData, setNewSchoolData] = useState({
        nome: '',
        slug: '',
        plano: 'basic'
    })

    useEffect(() => {
        loadEscolas()
    }, [])

    async function loadEscolas() {
        try {
            setIsLoading(true)
            const { data } = await getEscolas()
            setEscolas(data as Escola[])
        } catch (error) {
            console.error('Erro ao carregar escolas:', error)
            toast.error('Erro ao carregar lista de escolas')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCreateEscola() {
        if (!newSchoolData.nome || !newSchoolData.slug) {
            toast.error('Preencha todos os campos obrigatorios')
            return
        }

        try {
            setIsCreating(true)
            await criarEscola(newSchoolData)
            toast.success('Escola criada com sucesso!')
            setIsCreateDialogOpen(false)
            setNewSchoolData({ nome: '', slug: '', plano: 'basic' })
            loadEscolas()
        } catch (error) {
            console.error('Erro ao criar escola:', error)
            toast.error('Erro ao criar escola')
        } finally {
            setIsCreating(false)
        }
    }

    const filteredEscolas = escolas.filter(escola => {
        const matchesSearch = escola.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            escola.slug.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'todos' ? true : escola.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="p-4 lg:p-10 space-y-8 pb-24 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                        Gerenciar Escolas
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm lg:text-lg mt-2">
                        Administracao de tenants e franquias
                    </p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-12 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-violet-600/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Escola
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-neutral-900 border-white/10 sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-white font-black uppercase tracking-tight text-xl">Criar Nova Escola</DialogTitle>
                            <DialogDescription className="text-neutral-400">
                                Preencha os dados abaixo para inicializar um novo tenant no sistema.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-white text-xs uppercase font-bold tracking-widest">Nome da Escola</Label>
                                <Input
                                    className="bg-white/5 border-white/10 text-white"
                                    placeholder="Ex: Espaco Danca Vida"
                                    value={newSchoolData.nome}
                                    onChange={(e) => setNewSchoolData({ ...newSchoolData, nome: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white text-xs uppercase font-bold tracking-widest">Slug (URL)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        className="bg-white/5 border-white/10 text-white"
                                        placeholder="espacodanca"
                                        value={newSchoolData.slug}
                                        onChange={(e) => setNewSchoolData({ ...newSchoolData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    />
                                    <span className="text-neutral-500 text-xs font-bold">.grandsalto.ia</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white text-xs uppercase font-bold tracking-widest">Plano Inicial</Label>
                                <Select
                                    value={newSchoolData.plano}
                                    onValueChange={(v) => setNewSchoolData({ ...newSchoolData, plano: v })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-900 border-white/10">
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                                className="bg-transparent border-white/10 text-white hover:bg-white/5"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleCreateEscola}
                                disabled={isCreating}
                                className="bg-violet-600 hover:bg-violet-500 text-white"
                            >
                                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Escola'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                        placeholder="Buscar por nome ou slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-neutral-500"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48 h-12 bg-white/5 border-white/10 rounded-xl text-white">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-neutral-500" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-white/10">
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="setup">Setup</SelectItem>
                        <SelectItem value="suspenso">Suspenso</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
                    <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest mt-4">Carregando escolas...</p>
                </div>
            ) : filteredEscolas.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/5 dashed">
                    <School className="w-16 h-16 mx-auto text-neutral-700 mb-4" />
                    <h3 className="text-white font-bold text-lg">Nenhuma escola encontrada</h3>
                    <p className="text-neutral-500 text-sm mt-2">Tente ajustar seus filtros ou crie uma nova escola.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredEscolas.map((escola) => (
                        <div
                            key={escola.id}
                            className="group bg-neutral-900 border border-white/5 rounded-2xl p-6 hover:border-violet-500/30 transition-all cursor-pointer relative overflow-hidden"
                            onClick={() => router.push(`/superadmin/escola/${escola.id}`)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/0 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white text-lg uppercase group-hover:scale-105 transition-transform">
                                        {escola.nome.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-black text-white text-lg uppercase tracking-tight group-hover:text-violet-400 transition-colors">
                                                {escola.nome}
                                            </h3>
                                            <Badge className={escola.status === 'ativo'
                                                ? "bg-emerald-500/10 text-emerald-500 border-none uppercase text-[9px] font-black tracking-widest"
                                                : "bg-orange-500/10 text-orange-500 border-none uppercase text-[9px] font-black tracking-widest"
                                            }>
                                                {escola.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
                                            {escola.slug}.grandsalto.ia
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 text-right">
                                    <div className="hidden md:block">
                                        <div className="flex items-center gap-2 justify-end text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                                            <Users className="w-3 h-3" />
                                            Alunos
                                        </div>
                                        <p className="text-white font-black text-lg">{escola.estudantes?.[0]?.count || 0}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="flex items-center gap-2 justify-end text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                                            <GraduationCap className="w-3 h-3" />
                                            Turmas
                                        </div>
                                        <p className="text-white font-black text-lg">{escola.turmas?.[0]?.count || 0}</p>
                                    </div>
                                    <div className="hidden lg:block border-l border-white/10 pl-8">
                                        <div className="flex items-center gap-2 justify-end text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                                            Plano
                                        </div>
                                        <p className="text-violet-400 font-black text-lg uppercase">{escola.plano}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
