'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    ArrowLeft,
    Globe,
    Users,
    GraduationCap,
    Layers,
    DollarSign,
    Settings,
    Save,
    Loader2,
    AlertCircle,
    Shield,
    Link2,
    Palette,
    Phone,
    Mail,
    MapPin,
    Instagram,
    MessageCircle,
    Facebook,
    User,
    Clock,
    Activity,
    CheckCircle2,
    ExternalLink
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import {
    getEscolaParaSuporte,
    atualizarConfiguracaoEscola,
    getUsuariosEscola,
    getTurmasEscola
} from '@/app/actions/superadmin'

type Escola = {
    id: string
    nome: string
    slug: string
    dominio_customizado?: string
    plano: string
    status: string
    cor_primaria?: string
    logo_url?: string
    endereco?: string
    telefone?: string
    email?: string
    instagram?: string
    facebook?: string
    whatsapp?: string
    created_at: string
}

type Estatisticas = {
    totalAlunos: number
    totalProfessores: number
    totalTurmas: number
    totalResponsaveis: number
    mrr: number
}

type Admin = {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    created_at: string
}

type Usuario = {
    id: string
    full_name: string
    email: string
    role: string
    avatar_url?: string
    created_at: string
    last_sign_in_at?: string
}

type Turma = {
    id: string
    nome: string
    nivel: string
    cor_etiqueta: string
    vagas_max: number
    perfis?: { full_name: string }
    matriculas_turmas: { count: number }[]
}

export default function EscolaSuportePage() {
    const params = useParams()
    const router = useRouter()
    const escolaId = params.id as string

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [escola, setEscola] = useState<Escola | null>(null)
    const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
    const [admins, setAdmins] = useState<Admin[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [turmas, setTurmas] = useState<Turma[]>([])

    // Form state
    const [formData, setFormData] = useState({
        nome: '',
        slug: '',
        dominio_customizado: '',
        plano: '',
        status: '',
        cor_primaria: '',
        endereco: '',
        telefone: '',
        email: '',
        instagram: '',
        facebook: '',
        whatsapp: ''
    })

    useEffect(() => {
        if (escolaId) loadData()
    }, [escolaId])

    async function loadData() {
        try {
            setIsLoading(true)
            setError(null)

            const [escolaRes, usuariosRes, turmasRes] = await Promise.all([
                getEscolaParaSuporte(escolaId),
                getUsuariosEscola(escolaId),
                getTurmasEscola(escolaId)
            ])

            setEscola(escolaRes.data.escola)
            setEstatisticas(escolaRes.data.estatisticas)
            setAdmins(escolaRes.data.admins)
            setUsuarios(usuariosRes.data as Usuario[])
            setTurmas(turmasRes.data as Turma[])

            // Populate form
            const e = escolaRes.data.escola
            setFormData({
                nome: e.nome || '',
                slug: e.slug || '',
                dominio_customizado: e.dominio_customizado || '',
                plano: e.plano || 'basic',
                status: e.status || 'ativo',
                cor_primaria: e.cor_primaria || '#ec4899',
                endereco: e.endereco || '',
                telefone: e.telefone || '',
                email: e.email || '',
                instagram: e.instagram || '',
                facebook: e.facebook || '',
                whatsapp: e.whatsapp || ''
            })
        } catch (err) {
            console.error('Erro ao carregar dados:', err)
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSave() {
        try {
            setIsSaving(true)
            await atualizarConfiguracaoEscola(escolaId, formData)
            toast.success('Configuracoes salvas com sucesso!')
            loadData()
        } catch (err) {
            toast.error('Erro ao salvar configuracoes')
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const getRoleBadge = (role: string) => {
        const config: Record<string, { label: string; className: string }> = {
            admin: { label: 'Admin', className: 'bg-violet-500/10 text-violet-500' },
            professor: { label: 'Professor', className: 'bg-blue-500/10 text-blue-500' },
            aluno: { label: 'Aluno', className: 'bg-emerald-500/10 text-emerald-500' },
            pai: { label: 'Responsavel', className: 'bg-amber-500/10 text-amber-500' },
        }
        const c = config[role] || { label: role, className: 'bg-neutral-500/10 text-neutral-500' }
        return <Badge className={`${c.className} border-none text-[9px] font-black uppercase tracking-widest`}>{c.label}</Badge>
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Carregando dados da escola...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-8">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-red-500 font-bold text-center">{error}</p>
                <Button onClick={() => router.push('/superadmin')} variant="outline" className="rounded-xl">
                    Voltar ao Painel
                </Button>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-10 space-y-8 pb-24 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => router.push('/superadmin')}
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-violet-600 text-white border-none px-3 py-1 font-black uppercase tracking-widest text-[9px] rounded-full">
                                <Shield className="w-3 h-3 mr-1" />
                                MODO SUPORTE
                            </Badge>
                        </div>
                        <h1 className="text-2xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none mt-2">
                            {escola?.nome}
                        </h1>
                        <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest mt-1">
                            {escola?.slug}.grandsalto.ia
                            {escola?.dominio_customizado && (
                                <span className="text-violet-400 ml-2">• {escola.dominio_customizado}</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-12 px-8 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Salvar Alteracoes
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Alunos', value: estatisticas?.totalAlunos || 0, icon: GraduationCap, color: 'text-emerald-500' },
                    { label: 'Professores', value: estatisticas?.totalProfessores || 0, icon: Users, color: 'text-blue-500' },
                    { label: 'Turmas', value: estatisticas?.totalTurmas || 0, icon: Layers, color: 'text-violet-500' },
                    { label: 'Responsaveis', value: estatisticas?.totalResponsaveis || 0, icon: Users, color: 'text-amber-500' },
                    { label: 'MRR', value: formatCurrency(estatisticas?.mrr || 0), icon: DollarSign, color: 'text-emerald-500' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-neutral-900 border-white/5 rounded-2xl">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                            <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="config" className="space-y-6">
                <TabsList className="bg-neutral-900 border border-white/5 p-1.5 rounded-2xl h-14">
                    <TabsTrigger value="config" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest">
                        <Settings className="w-4 h-4 mr-2" />
                        Configuracoes
                    </TabsTrigger>
                    <TabsTrigger value="usuarios" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest">
                        <Users className="w-4 h-4 mr-2" />
                        Usuarios ({usuarios.length})
                    </TabsTrigger>
                    <TabsTrigger value="turmas" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest">
                        <Layers className="w-4 h-4 mr-2" />
                        Turmas ({turmas.length})
                    </TabsTrigger>
                </TabsList>

                {/* Configuracoes Tab */}
                <TabsContent value="config" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Dados Basicos */}
                        <Card className="bg-neutral-900 border-white/5 rounded-2xl">
                            <CardHeader className="p-6 border-b border-white/5">
                                <CardTitle className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-violet-500" />
                                    Dados Basicos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nome da Escola</Label>
                                    <Input
                                        value={formData.nome}
                                        onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                        className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Slug (URL)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={formData.slug}
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                            className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                                        />
                                        <span className="text-neutral-500 text-xs whitespace-nowrap">.grandsalto.ia</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Plano</Label>
                                        <Select value={formData.plano} onValueChange={v => setFormData({ ...formData, plano: v })}>
                                            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="basic">Basic</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</Label>
                                        <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                                            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ativo">Ativo</SelectItem>
                                                <SelectItem value="inativo">Inativo</SelectItem>
                                                <SelectItem value="setup">Em Setup</SelectItem>
                                                <SelectItem value="suspenso">Suspenso</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dominio Customizado */}
                        <Card className="bg-neutral-900 border-white/5 rounded-2xl">
                            <CardHeader className="p-6 border-b border-white/5">
                                <CardTitle className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                    <Link2 className="w-5 h-5 text-violet-500" />
                                    Dominio Customizado
                                </CardTitle>
                                <CardDescription className="text-neutral-500 text-xs">
                                    Configure o dominio proprio da escola
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Dominio Customizado</Label>
                                    <Input
                                        value={formData.dominio_customizado}
                                        onChange={e => setFormData({ ...formData, dominio_customizado: e.target.value })}
                                        placeholder="ex: www.minhaescola.com.br"
                                        className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                                    />
                                </div>
                                <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                                    <p className="text-violet-300 text-xs font-bold mb-2">Instrucoes para configurar:</p>
                                    <ol className="text-violet-300/70 text-[10px] space-y-1 list-decimal list-inside">
                                        <li>Adicione um registro CNAME apontando para: <code className="bg-white/10 px-1 rounded">proxy.grandsalto.ia</code></li>
                                        <li>Aguarde a propagacao do DNS (ate 24h)</li>
                                        <li>O SSL sera gerado automaticamente</li>
                                    </ol>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Cor Primaria</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="color"
                                            value={formData.cor_primaria}
                                            onChange={e => setFormData({ ...formData, cor_primaria: e.target.value })}
                                            className="h-12 w-16 bg-white/5 border-white/10 rounded-xl cursor-pointer"
                                        />
                                        <Input
                                            value={formData.cor_primaria}
                                            onChange={e => setFormData({ ...formData, cor_primaria: e.target.value })}
                                            className="h-12 bg-white/5 border-white/10 rounded-xl text-white flex-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contato */}
                        <Card className="bg-neutral-900 border-white/5 rounded-2xl">
                            <CardHeader className="p-6 border-b border-white/5">
                                <CardTitle className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-violet-500" />
                                    Contato
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <Input
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Telefone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <Input
                                            value={formData.telefone}
                                            onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                                            className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Endereco</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <Input
                                            value={formData.endereco}
                                            onChange={e => setFormData({ ...formData, endereco: e.target.value })}
                                            className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Redes Sociais */}
                        <Card className="bg-neutral-900 border-white/5 rounded-2xl">
                            <CardHeader className="p-6 border-b border-white/5">
                                <CardTitle className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                    <Instagram className="w-5 h-5 text-violet-500" />
                                    Redes Sociais
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Instagram</Label>
                                    <div className="relative">
                                        <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <Input
                                            value={formData.instagram}
                                            onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                            placeholder="@usuario"
                                            className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">WhatsApp</Label>
                                    <div className="relative">
                                        <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <Input
                                            value={formData.whatsapp}
                                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                            placeholder="5511999999999"
                                            className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Facebook</Label>
                                    <div className="relative">
                                        <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <Input
                                            value={formData.facebook}
                                            onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                                            className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Admins da Escola */}
                    <Card className="bg-neutral-900 border-white/5 rounded-2xl">
                        <CardHeader className="p-6 border-b border-white/5">
                            <CardTitle className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                <Shield className="w-5 h-5 text-violet-500" />
                                Administradores da Escola
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {admins.length === 0 ? (
                                <p className="text-neutral-500 text-center py-8">Nenhum administrador cadastrado</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {admins.map((admin) => (
                                        <div key={admin.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                            <Avatar className="h-12 w-12 border border-white/10">
                                                <AvatarImage src={admin.avatar_url} />
                                                <AvatarFallback className="bg-violet-500/20 text-violet-300 font-bold">
                                                    {admin.full_name?.charAt(0) || 'A'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white text-sm truncate">{admin.full_name}</p>
                                                <p className="text-neutral-500 text-xs truncate">{admin.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Usuarios Tab */}
                <TabsContent value="usuarios">
                    <Card className="bg-neutral-900 border-white/5 rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                            {usuarios.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Users className="w-12 h-12 mx-auto text-neutral-700 mb-4" />
                                    <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Nenhum usuario cadastrado</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {usuarios.map((usuario) => (
                                        <div key={usuario.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 border border-white/10">
                                                    <AvatarImage src={usuario.avatar_url} />
                                                    <AvatarFallback className="bg-white/10 text-white font-bold">
                                                        {usuario.full_name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-white">{usuario.full_name}</p>
                                                    <p className="text-neutral-500 text-xs">{usuario.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {getRoleBadge(usuario.role)}
                                                <div className="text-right hidden md:block">
                                                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Criado em</p>
                                                    <p className="text-white text-xs font-bold">{formatDate(usuario.created_at)}</p>
                                                </div>
                                                {usuario.last_sign_in_at && (
                                                    <div className="text-right hidden lg:block">
                                                        <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Ultimo acesso</p>
                                                        <p className="text-white text-xs font-bold">{formatDate(usuario.last_sign_in_at)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Turmas Tab */}
                <TabsContent value="turmas">
                    <Card className="bg-neutral-900 border-white/5 rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                            {turmas.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Layers className="w-12 h-12 mx-auto text-neutral-700 mb-4" />
                                    <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Nenhuma turma cadastrada</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {turmas.map((turma) => (
                                        <div key={turma.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: turma.cor_etiqueta + '20' }}
                                                >
                                                    <Layers className="w-5 h-5" style={{ color: turma.cor_etiqueta }} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{turma.nome}</p>
                                                    <p className="text-neutral-500 text-xs">{turma.nivel}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Alunos</p>
                                                    <p className="text-white font-bold">
                                                        {turma.matriculas_turmas?.[0]?.count || 0}/{turma.vagas_max}
                                                    </p>
                                                </div>
                                                {turma.perfis && (
                                                    <div className="text-right hidden md:block">
                                                        <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Professor</p>
                                                        <p className="text-white font-bold text-xs">{turma.perfis.full_name}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
