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

export default function WhiteLabelSettings() {
    const tenant = useTenant()
    const [primaryColor, setPrimaryColor] = useState(tenant?.primaryColor || '#ec4899')
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1500)
    }

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-32">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Enterprise Console
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Universo <span style={{ color: primaryColor }}>Branding</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm lg:text-lg">Controle total sobre a identidade visual da <strong className="text-foreground">{tenant?.nome}</strong>.</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Status do Tenant</p>
                        <p className="text-sm font-black text-emerald-500 uppercase tracking-tighter">Premium Active</p>
                    </div>
                </div>
            </header>

            <Tabs defaultValue="branding" className="space-y-10">
                <TabsList className="bg-card border-2 border-border p-2 h-16 rounded-[1.5rem] w-full lg:w-fit flex shadow-sm">
                    {[
                        { value: 'branding', label: 'Identidade', icon: Palette },
                        { value: 'dominio', label: 'Domínios', icon: Globe },
                        { value: 'email', label: 'E-mails', icon: Mail },
                        { value: 'seguranca', label: 'Segurança', icon: Lock },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex-1 lg:flex-none rounded-2xl px-8 gap-3 h-full uppercase text-[10px] font-black tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Branding Tab */}
                <TabsContent value="branding" className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Card className="bg-card border-border rounded-[2.5rem] shadow-sm">
                            <CardHeader className="p-10 pb-6">
                                <CardTitle className="text-xl font-black uppercase tracking-tight">Arquitetura Visual</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Logotipo e Símbolos Oficiais</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 pt-0 space-y-8">
                                <div className="flex flex-col md:flex-row items-center gap-10 p-8 rounded-[2rem] bg-muted/20 border-2 border-dashed border-border group hover:border-[var(--primary)]/50 transition-all cursor-pointer">
                                    <div className="w-32 h-32 rounded-3xl bg-card border border-border flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                                        {tenant?.logo_url ? (
                                            <img src={tenant.logo_url} alt="Logo" className="w-20 h-20 object-contain p-2" />
                                        ) : (
                                            <Upload className="w-10 h-10 text-muted-foreground group-hover:text-[var(--primary)] transition-colors" />
                                        )}
                                    </div>
                                    <div className="text-center md:text-left space-y-2">
                                        <p className="text-sm font-black uppercase tracking-tight">Mudar Assinatura Visual</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em] leading-relaxed">Formatos: PNG ou SVG transparente<br />Mínimo: 512x512px</p>
                                        <Button variant="outline" className="h-10 mt-2 px-6 rounded-xl border-border uppercase font-black text-[10px] tracking-widest hover:bg-muted">Procurar Arquivo</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border rounded-[2.5rem] shadow-sm">
                            <CardHeader className="p-10 pb-6">
                                <CardTitle className="text-xl font-black uppercase tracking-tight">Paleta de Atuação</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cores Primárias e Secundárias</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 pt-0 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cor de Destaque (Principal)</label>
                                        <div className="flex gap-4">
                                            <div className="flex-1 h-14 rounded-2xl border-2 border-border flex items-center px-6 gap-4 bg-muted/20 focus-within:border-[var(--primary)]/50 transition-all">
                                                <div className="w-8 h-8 rounded-xl shadow-lg border-2 border-white/20" style={{ backgroundColor: primaryColor }} />
                                                <Input
                                                    value={primaryColor}
                                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                                    className="border-none bg-transparent h-full font-mono text-sm font-black focus-visible:ring-0 px-0 uppercase"
                                                />
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl relative overflow-hidden border-2 border-border cursor-pointer shadow-lg hover:scale-105 transition-transform active:scale-95">
                                                <input
                                                    type="color"
                                                    value={primaryColor}
                                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                                    className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-4">
                                        {['#c72d1c', '#c29493', '#7d3e37', '#0c0b0b', '#f5eae6', '#ec4899'].map(c => (
                                            <div
                                                key={c}
                                                onClick={() => setPrimaryColor(c)}
                                                className="aspect-square rounded-2xl cursor-pointer border-4 transition-all hover:scale-110 shadow-lg active:scale-90"
                                                style={{ backgroundColor: c, borderColor: primaryColor === c ? 'white' : 'transparent' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-card border-border rounded-[2.5rem] shadow-sm overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)]/5 to-transparent h-full w-full opacity-50" style={{ '--primary': primaryColor } as React.CSSProperties} />
                        <CardHeader className="p-10 pb-6 relative z-10">
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Simulação de Ambiente</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 relative z-10">
                            <div className="p-10 rounded-[2rem] border-2 border-border bg-background grid grid-cols-1 md:grid-cols-3 gap-8 shadow-2xl items-center">
                                <Button className="h-14 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all outline-none border-none" style={{ backgroundColor: primaryColor }}>Botão Interativo</Button>
                                <Badge className="h-10 justify-center uppercase text-[10px] font-black tracking-widest rounded-full border-none shadow-md" style={{ backgroundColor: primaryColor }}>Tag de Status</Badge>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-4 h-4 rounded-full animate-ping" style={{ backgroundColor: primaryColor }} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sistema em Live</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Domínio Tab */}
                <TabsContent value="dominio" className="space-y-10">
                    <Card className="bg-card border-border rounded-[2.5rem] shadow-sm overflow-hidden">
                        <CardHeader className="p-10 border-b border-border/50 bg-muted/20">
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter">Endpoints DNS</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Hospedagem profissional sob seu próprio domínio</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Seu Domínio de Autoridade</label>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input placeholder="exemplo.com.br" className="h-16 rounded-2xl bg-muted/20 border-2 border-border text-lg font-bold px-6 focus:border-[var(--primary)]/50 transition-all" />
                                    <Button className="h-16 px-12 font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all" style={{ backgroundColor: primaryColor }}>Validar Configuração</Button>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-muted/10 border-2 border-border border-dashed space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
                                    <Server className="w-5 h-5 opacity-40" /> Registros de Apontamento
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs font-mono">
                                        <thead>
                                            <tr className="border-b-2 border-border text-muted-foreground font-black uppercase tracking-widest">
                                                <th className="pb-4 px-4">Tipo</th>
                                                <th className="pb-4 px-4">Host</th>
                                                <th className="pb-4 px-4">Valor de Destino</th>
                                                <th className="pb-4 px-4">Propagação</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-foreground/80">
                                            <tr className="border-b border-border/50 group hover:bg-muted/30 transition-all">
                                                <td className="py-5 px-4"><Badge className="bg-blue-500 font-bold">A</Badge></td>
                                                <td className="py-5 px-4 font-black">@</td>
                                                <td className="py-5 px-4 font-black">76.76.21.21</td>
                                                <td className="py-5 px-4 opacity-50 font-black">Automático</td>
                                            </tr>
                                            <tr className="group hover:bg-muted/30 transition-all">
                                                <td className="py-5 px-4"><Badge className="bg-violet-500 font-bold">CNAME</Badge></td>
                                                <td className="py-5 px-4 font-black">www</td>
                                                <td className="py-5 px-4 font-black">cname.grandsalto.cloud</td>
                                                <td className="py-5 px-4 opacity-50 font-black">Automático</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* E-mail Tab */}
                <TabsContent value="email" className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Card className="bg-card border-border rounded-[2.5rem] shadow-sm">
                            <CardHeader className="p-10">
                                <CardTitle className="text-xl font-black uppercase tracking-tight">Comunicação Transacional</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Configurações de Remetente</CardDescription>
                            </CardHeader>
                            <CardContent className="px-10 pb-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assinatura do Remetente</label>
                                        <Input defaultValue={tenant?.nome} className="h-14 bg-muted/20 border-2 border-border rounded-xl font-black px-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Canal de Atendimento</label>
                                        <Input placeholder="contato@seuespaco.com.br" className="h-14 bg-muted/20 border-2 border-border rounded-xl font-black px-6" />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-border space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Régua de Automação</h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Manual de Boas-Vindas', sub: 'Disparado na confirmação de vaga', status: 'Ativo', icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                            { label: 'Relatórios de Evolução', sub: 'Mensal (Todo dia 10)', status: 'Ativo', icon: Sparkles, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                                            { label: 'Link de Galeria Nova', sub: 'Após cada ensaio/evento', status: 'Inativo', icon: Layout, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-muted/20 border-2 border-border hover:bg-muted/40 transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-tight">{item.label}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase opacity-60">{item.sub}</p>
                                                    </div>
                                                </div>
                                                <Badge className={`${item.status === 'Ativo' ? 'bg-emerald-500' : 'bg-muted-foreground/30'} font-black text-[9px] uppercase`}>{item.status}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                            <CardHeader className="p-8 bg-muted/30 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-black uppercase tracking-widest">Mockup Mobile: Boas-Vindas</CardTitle>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg outline-none border-none"><Smartphone className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg outline-none border-none opacity-50"><Mail className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 bg-neutral-100 dark:bg-neutral-950/50 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-white/5 opacity-20" />
                                <div className="w-[85%] bg-white dark:bg-card my-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden border border-border/50 scale-95 lg:scale-100 origin-center transition-all">
                                    <div className="h-40 flex flex-col items-center justify-center text-center p-8 text-white relative" style={{ backgroundColor: primaryColor }}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                                        {tenant?.logo_url && <img src={tenant.logo_url} className="w-20 mb-3 relative z-10" alt="Logo" />}
                                        <h1 className="font-black text-xl uppercase tracking-tighter relative z-10 leading-none">Bem-vinda à {tenant?.nome}!</h1>
                                    </div>
                                    <div className="p-10 text-neutral-800 dark:text-neutral-200 space-y-6">
                                        <p className="text-sm font-black">Olá, <strong>Bailarina</strong>!</p>
                                        <p className="text-[12px] leading-relaxed font-medium opacity-80 italic">"A dança é a linguagem escondida da alma."</p>
                                        <p className="text-[12px] leading-relaxed font-bold">É uma alegria imensa ter você em nossa comunidade. Sua jornada artística começa agora e estaremos ao seu lado em cada passo.</p>
                                        <div className="py-6 border-y border-border/10">
                                            <div className="h-14 w-full rounded-2xl flex items-center justify-center text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg" style={{ backgroundColor: primaryColor }}>
                                                Descobrir Meu Painel
                                            </div>
                                        </div>
                                        <div className="pt-2 text-[10px] text-muted-foreground text-center font-black uppercase tracking-widest">
                                            <p className="mb-1">{tenant?.nome}</p>
                                            <p className="opacity-40">School of Arts & Movement</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[2rem] p-8 flex items-start gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                            <Shield size={100} className="text-emerald-500" />
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                            <Shield className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mb-1 leading-none uppercase tracking-tighter">Criptografia e Entrega Verificada</p>
                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/60 font-medium max-w-2xl">
                                Seu domínio está 100% autorizado via <strong>DKIM/SPF</strong>. Suas comunicações são assinadas digitalmente, garantindo que cheguem na caixa de entrada principal dos alunos com total segurança.
                            </p>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <footer className="fixed bottom-10 right-10 z-[100]">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-20 px-12 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] font-black uppercase tracking-[0.2em] text-sm gap-4 transition-all hover:scale-105 active:scale-95 border-none outline-none"
                    style={{ backgroundColor: primaryColor }}
                >
                    {isSaving ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <div className="flex items-center gap-4">
                            Consolidar Identity <Save className="w-6 h-6" />
                        </div>
                    )}
                </Button>
            </footer>
        </div>
    )
}

