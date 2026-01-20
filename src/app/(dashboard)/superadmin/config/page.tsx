'use client'

import React, { useState } from 'react'
import {
    Settings,
    Shield,
    Bell,
    Lock,
    Save,
    Loader2,
    Monitor,
    Globe,
    CreditCard,
    AlertTriangle,
    Database
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function SuperAdminConfigPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [registrationsEnabled, setRegistrationsEnabled] = useState(true)

    const handleSave = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        toast.success('Configuracoes globais atualizadas com sucesso!')
    }

    return (
        <div className="p-4 lg:p-10 space-y-8 pb-24 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                        Configuracoes
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm lg:text-lg mt-2">
                        Gerencie ajustes globais do sistema e sua conta administrativa
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="h-12 px-8 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-violet-600/20"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvar Alteracoes
                </Button>
            </div>

            <Tabs defaultValue="geral" className="space-y-8">
                <TabsList className="bg-neutral-900 border border-white/5 p-1.5 rounded-2xl h-14 inline-flex w-full md:w-auto overflow-x-auto">
                    <TabsTrigger value="geral" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest min-w-[100px]">
                        <Settings className="w-4 h-4 mr-2" />
                        Sistema
                    </TabsTrigger>
                    <TabsTrigger value="seguranca" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest min-w-[100px]">
                        <Shield className="w-4 h-4 mr-2" />
                        Seguranca
                    </TabsTrigger>
                    <TabsTrigger value="notificacoes" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest min-w-[100px]">
                        <Bell className="w-4 h-4 mr-2" />
                        Notificacoes
                    </TabsTrigger>
                    <TabsTrigger value="planos" className="rounded-xl px-6 h-full data-[state=active]:bg-violet-600 data-[state=active]:text-white font-bold uppercase text-[10px] tracking-widest min-w-[100px]">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Planos
                    </TabsTrigger>
                </TabsList>

                {/* ABA GERAL */}
                <TabsContent value="geral" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Status do Sistema */}
                        <Card className="bg-neutral-900 border-white/5 rounded-3xl">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="flex items-center gap-3 text-white font-black uppercase tracking-tight">
                                    <Monitor className="w-5 h-5 text-violet-500" />
                                    Estado do Sistema
                                </CardTitle>
                                <CardDescription className="text-neutral-500 uppercase text-[10px] font-bold tracking-widest">
                                    Controle de disponibilidade e manutencao
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <div className="space-y-1">
                                        <div className="font-bold text-white">Modo Manutencao</div>
                                        <div className="text-xs text-neutral-400 max-w-[280px]">
                                            Bloqueia o acesso de todos os usuarios (exceto superadmins). Use com cautela.
                                        </div>
                                    </div>
                                    <Switch
                                        checked={maintenanceMode}
                                        onCheckedChange={setMaintenanceMode}
                                        className="data-[state=checked]:bg-violet-600"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <div className="space-y-1">
                                        <div className="font-bold text-white">Novos Cadastros</div>
                                        <div className="text-xs text-neutral-400 max-w-[280px]">
                                            Permitir que novas escolas se cadastrem automaticamente via landing page.
                                        </div>
                                    </div>
                                    <Switch
                                        checked={registrationsEnabled}
                                        onCheckedChange={setRegistrationsEnabled}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informacoes da Plataforma */}
                        <Card className="bg-neutral-900 border-white/5 rounded-3xl">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="flex items-center gap-3 text-white font-black uppercase tracking-tight">
                                    <Globe className="w-5 h-5 text-blue-500" />
                                    Identidade da Plataforma
                                </CardTitle>
                                <CardDescription className="text-neutral-500 uppercase text-[10px] font-bold tracking-widest">
                                    Informacoes publicas do SaaS
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Nome do Sistema</Label>
                                    <Input defaultValue="Grand Salto SaaS" className="bg-white/5 border-white/10 text-white h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Email de Suporte</Label>
                                    <Input defaultValue="suporte@grandsalto.com.br" className="bg-white/5 border-white/10 text-white h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Versao Atual</Label>
                                    <div className="flex items-center gap-3">
                                        <Input defaultValue="2.1.0" readOnly className="bg-white/5 border-white/10 text-neutral-500 h-12 rounded-xl" />
                                        <Button variant="outline" className="h-12 border-white/10 text-neutral-400 hover:text-white">Changelog</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ABA SEGURANCA */}
                <TabsContent value="seguranca" className="space-y-6">
                    <Card className="bg-neutral-900 border-white/5 rounded-3xl">
                        <CardHeader className="p-8">
                            <CardTitle className="flex items-center gap-3 text-white font-black uppercase tracking-tight">
                                <Lock className="w-5 h-5 text-emerald-500" />
                                Controle de Acesso e Seguranca
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Expiracao de Sessao (minutos)</Label>
                                    <Select defaultValue="60">
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-900 border-white/10">
                                            <SelectItem value="30">30 minutos</SelectItem>
                                            <SelectItem value="60">1 hora</SelectItem>
                                            <SelectItem value="240">4 horas</SelectItem>
                                            <SelectItem value="1440">24 horas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Politica de Senha</Label>
                                    <Select defaultValue="forte">
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-900 border-white/10">
                                            <SelectItem value="padrao">Padrao (Min. 6 caracteres)</SelectItem>
                                            <SelectItem value="forte">Forte (Letras, numeros e simbolos)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="h-px bg-white/5 w-full" />

                            <div className="space-y-4">
                                <h3 className="text-white font-bold uppercase tracking-tight">Backups e Dados</h3>
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" className="h-12 border-white/10 text-white hover:bg-white/5 rounded-xl flex-1">
                                        <Database className="w-4 h-4 mr-2 text-neutral-400" />
                                        Forcar Backup Manual
                                    </Button>
                                    <Button variant="outline" className="h-12 border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl flex-1">
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        Limpar Cache Global
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA NOTIFICACOES */}
                <TabsContent value="notificacoes" className="space-y-6">
                    <Card className="bg-neutral-900 border-white/5 rounded-3xl">
                        <CardHeader className="p-8">
                            <CardTitle className="flex items-center gap-3 text-white font-black uppercase tracking-tight">
                                <Bell className="w-5 h-5 text-amber-500" />
                                Comunicacao Global
                            </CardTitle>
                            <CardDescription className="text-neutral-500 uppercase text-[10px] font-bold tracking-widest">
                                Mensagens e alertas para todos os tenants
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Banner de Aviso Global</Label>
                                <Input
                                    placeholder="Ex: Manutencao programada para domingo as 03:00h"
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                />
                                <p className="text-[10px] text-neutral-500">
                                    Se preenchido, este aviso aparecera no topo de TODOS os dashboards de todas as escolas.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button className="bg-white text-black hover:bg-neutral-200 font-bold rounded-xl">
                                    Publicar Aviso
                                </Button>
                                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl">
                                    Limpar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA PLANOS */}
                <TabsContent value="planos" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Basic', 'Premium', 'Enterprise'].map((plano) => (
                            <Card key={plano} className="bg-neutral-900 border-white/5 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all cursor-pointer group">
                                <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge className="bg-violet-500/10 text-violet-400 border-none uppercase text-[9px] font-black tracking-widest group-hover:bg-violet-500 group-hover:text-white transition-all">
                                            {plano}
                                        </Badge>
                                        <Settings className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="text-3xl font-black text-white">
                                        {plano === 'Basic' && 'R$ 299'}
                                        {plano === 'Premium' && 'R$ 499'}
                                        {plano === 'Enterprise' && 'R$ 899'}
                                    </div>
                                    <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">/ mes</div>
                                </CardHeader>
                                <CardContent className="p-8 bg-black/20 h-full">
                                    <ul className="space-y-3">
                                        <li className="flex items-center text-xs text-neutral-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                                            {plano === 'Basic' ? 'Ate 200 alunos' : plano === 'Premium' ? 'Ate 1000 alunos' : 'Alunos Ilimitados'}
                                        </li>
                                        <li className="flex items-center text-xs text-neutral-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                                            Dashboard Financeiro
                                        </li>
                                        <li className="flex items-center text-xs text-neutral-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                                            Suporte {plano === 'Enterprise' ? 'VIP 24/7' : 'Comercial'}
                                        </li>
                                    </ul>
                                    <Button className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl">
                                        Editar Plano
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
