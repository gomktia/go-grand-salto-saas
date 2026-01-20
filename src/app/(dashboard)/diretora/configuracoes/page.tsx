'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Palette,
    Globe,
    Mail,
    Shield,
    Upload,
    Check,
    Server,
    Smartphone,
    Save,
    Layout,
    Sparkles,
    Settings,
    Cpu,
    Lock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTenant } from '@/hooks/use-tenant'
import { updateTenantSettings } from '@/app/actions/admin'
import { toast } from 'sonner'

export default function WhiteLabelSettings() {
    const tenant = useTenant()
    const [primaryColor, setPrimaryColor] = useState(tenant?.primaryColor || '#ec4899')
    const [escolaNome, setEscolaNome] = useState(tenant?.nome || '')
    const [logoUrl, setLogoUrl] = useState(tenant?.logo_url || '')
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateTenantSettings({
                nome: escolaNome,
                logo_url: logoUrl,
                primary_color: primaryColor
            })
            toast.success('Configurações salvas com sucesso!')
        } catch (error) {
            toast.error('Erro ao salvar configurações')
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 pb-24">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Enterprise Control Panel
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Universo <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">Configurações</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                        <Cpu className="w-4 h-4 text-zinc-400" />
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 opacity-60">Tenant Status</p>
                            <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-tight">Active Premium</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-zinc-500/10 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none bg-zinc-900 dark:bg-white dark:text-zinc-900"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'SALVANDO...' : 'SALVAR'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="branding" className="space-y-6">
                <TabsList className="bg-zinc-100 dark:bg-zinc-800/50 p-1 h-11 rounded-xl w-full lg:w-fit flex shadow-inner">
                    {[
                        { value: 'branding', label: 'Marca', icon: Palette },
                        { value: 'dominio', label: 'Domínios', icon: Globe },
                        { value: 'email', label: 'E-mails', icon: Mail },
                        { value: 'seguranca', label: 'Segurança', icon: Lock },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex-1 lg:flex-none rounded-lg px-6 gap-2 h-full uppercase text-[9px] font-bold tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-zinc-500"
                        >
                            <tab.icon className="w-3 h-3" /> {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Branding Tab */}
                <TabsContent value="branding" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm">
                            <CardHeader className="p-6 pb-4">
                                <CardTitle className="text-base font-bold uppercase tracking-tight text-zinc-900 dark:text-white">Assinatura Visual</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-6">
                                <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl bg-zinc-50 dark:bg-black/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 group hover:border-emerald-500/30 transition-all cursor-pointer">
                                    <div className="w-24 h-24 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                        {tenant?.logo_url ? (
                                            <img src={tenant.logo_url} alt="Logo" className="w-20 h-20 object-contain p-2" />
                                        ) : (
                                            <Upload className="w-10 h-10 text-muted-foreground transition-colors" />
                                        )}
                                    </div>
                                    <div className="text-center md:text-left space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-100">Logotipo Oficial</p>
                                        <Input
                                            value={logoUrl}
                                            onChange={(e) => setLogoUrl(e.target.value)}
                                            placeholder="URL da logo..."
                                            className="h-8 mt-2 text-[10px] bg-white dark:bg-zinc-900"
                                        />
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mt-2">Formatos: PNG ou SVG transparente</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm">
                            <CardHeader className="p-6 pb-4">
                                <CardTitle className="text-base font-bold uppercase tracking-tight text-zinc-900 dark:text-white">Cores da Instituição</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg shadow-sm"
                                                style={{ backgroundColor: primaryColor }}
                                            />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Cor Primária</p>
                                                <p className="text-[9px] text-zinc-500 font-bold uppercase">{primaryColor}</p>
                                            </div>
                                        </div>
                                        <Input
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="w-10 h-10 p-1 bg-white dark:bg-zinc-900 border-none rounded-lg cursor-pointer"
                                        />
                                    </div>
                                    <div className="grid grid-cols-6 gap-2">
                                        {['#c72d1c', '#c29493', '#7d3e37', '#0c0b0b', '#f5eae6', '#ec4899'].map(c => (
                                            <div
                                                key={c}
                                                onClick={() => setPrimaryColor(c)}
                                                className="aspect-square rounded-lg cursor-pointer border-2 transition-all hover:scale-105 active:scale-95"
                                                style={{ backgroundColor: c, borderColor: primaryColor === c ? (primaryColor === '#ffffff' ? '#000000' : 'white') : 'transparent' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent h-full w-full opacity-50" />
                        <CardHeader className="p-6 pb-4 relative z-10">
                            <CardTitle className="text-base font-bold uppercase tracking-tight text-zinc-900 dark:text-white">Simulação de Ambiente</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 relative z-10">
                            <div className="p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm items-center">
                                <Button className="h-10 font-bold uppercase tracking-widest text-[10px] rounded-lg shadow-md hover:scale-[1.02] active:scale-95 transition-all border-none text-white" style={{ backgroundColor: primaryColor }}>Botão Interativo</Button>
                                <Badge className="h-10 justify-center uppercase text-[10px] font-bold tracking-widest rounded-lg border-none shadow-sm text-white" style={{ backgroundColor: primaryColor }}>Tag de Status</Badge>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Sistema em Live</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Domínio Tab */}
                <TabsContent value="dominio" className="space-y-6">
                    <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <CardHeader className="p-6 border-b border-zinc-50 dark:border-zinc-800">
                            <CardTitle className="text-lg font-bold uppercase tracking-tight text-zinc-900 dark:text-white">Domínios Personalizados</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Seu Domínio de Autoridade</label>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <Input placeholder="exemplo.com.br" className="h-10 rounded-lg bg-zinc-50 dark:bg-black/20 border-zinc-200 dark:border-zinc-800 text-sm font-bold px-4 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-none" />
                                    <Button
                                        onClick={() => toast.info('A validação de DNS está sendo processada pelo Cloudflare.')}
                                        className="h-10 px-6 font-bold uppercase text-[10px] tracking-widest rounded-lg shadow-sm hover:opacity-90 transition-all border-none bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                                    >
                                        Validar DNS
                                    </Button>
                                </div>
                            </div>

                            <div className="p-5 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-zinc-800 space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-zinc-500">
                                    <Server className="w-4 h-4 opacity-40" /> Registros de Apontamento
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-[10px] font-mono">
                                        <thead>
                                            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest">
                                                <th className="pb-2 px-2">Tipo</th>
                                                <th className="pb-2 px-2">Host</th>
                                                <th className="pb-2 px-2">Valor</th>
                                                <th className="pb-2 px-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-zinc-600 dark:text-zinc-400">
                                            <tr className="border-b border-zinc-100 dark:border-zinc-800/50 group">
                                                <td className="py-3 px-2 font-bold text-blue-500">A</td>
                                                <td className="py-3 px-2 font-bold">@</td>
                                                <td className="py-3 px-2 font-bold opacity-80">76.76.21.21</td>
                                                <td className="py-3 px-2"><Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/5 text-[8px] font-bold uppercase">OK</Badge></td>
                                            </tr>
                                            <tr className="group">
                                                <td className="py-3 px-2 font-bold text-violet-500">CNAME</td>
                                                <td className="py-3 px-2 font-bold">www</td>
                                                <td className="py-3 px-2 font-bold opacity-80">cname.grandsalto.cloud</td>
                                                <td className="py-3 px-2"><Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/5 text-[8px] font-bold uppercase">OK</Badge></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* E-mail Tab */}
                <TabsContent value="email" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm">
                            <CardHeader className="p-6">
                                <CardTitle className="text-lg font-bold uppercase tracking-tight text-zinc-900 dark:text-white">Comunicação Transacional</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nome do Remetente (Escola)</label>
                                        <Input
                                            value={escolaNome}
                                            onChange={(e) => setEscolaNome(e.target.value)}
                                            className="h-10 bg-zinc-50 dark:bg-black/20 border-zinc-200 dark:border-zinc-800 rounded-lg font-bold px-4 text-sm shadow-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">E-mail de Resposta</label>
                                        <Input placeholder="contato@seuespaco.com.br" className="h-10 bg-zinc-50 dark:bg-black/20 border-zinc-200 dark:border-zinc-800 rounded-lg font-bold px-4 text-sm shadow-none" />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Automações Ativas</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Boas-Vindas', status: 'Ativo', icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                            { label: 'Relatórios Mensais', status: 'Ativo', icon: Sparkles, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                                            { label: 'Avisos Financeiros', status: 'Ativo', icon: Lock, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-zinc-800">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                                    </div>
                                                    <p className="text-[11px] font-bold uppercase tracking-tight text-zinc-700 dark:text-zinc-300">{item.label}</p>
                                                </div>
                                                <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[8px] uppercase">Ativo</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <CardHeader className="p-4 bg-zinc-50 dark:bg-black/20 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Preview Mobile</CardTitle>
                                    <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
                                <div className="w-[240px] bg-white dark:bg-neutral-900 shadow-2xl rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                    <div className="h-24 flex flex-col items-center justify-center text-center p-4 text-white" style={{ backgroundColor: primaryColor }}>
                                        {tenant?.logo_url && <img src={tenant.logo_url} className="w-12 mb-2" alt="Logo" />}
                                        <h1 className="font-bold text-xs uppercase tracking-tighter">Bem-vinda!</h1>
                                    </div>
                                    <div className="p-5 text-neutral-800 dark:text-neutral-200 space-y-4">
                                        <p className="text-[10px] font-bold uppercase opacity-60 italic">&quot;A dança é a alma em movimento.&quot;</p>
                                        <p className="text-[10px] leading-relaxed font-bold">Olá! É um prazer ter você em nossa comunidade artística.</p>
                                        <div className="h-10 w-full rounded-lg flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-widest shadow-md" style={{ backgroundColor: primaryColor }}>
                                            Acessar Painel
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                            <Shield className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-tight uppercase tracking-tight">Criptografia e Entrega Verificada</p>
                            <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60 font-medium">
                                Seu domínio está autorizado via <strong>DKIM/SPF</strong>. Garantimos que seus e-mails cheguem na caixa de entrada com segurança.
                            </p>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
