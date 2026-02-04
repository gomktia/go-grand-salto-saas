'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    User,
    MapPin,
    Building2,
    ShieldCheck,
    CreditCard,
    Settings,
    Bell,
    Lock,
    Camera,
    Mail,
    Phone,
    Globe,
    Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useTenant } from '@/hooks/use-tenant'

export default function ProprietariaPerfilPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#db2777'

    return (
        <div className="space-y-8 pb-24">
            {/* Header Perfil */}
            <div className="relative h-64 lg:h-80 rounded-[3rem] overflow-hidden shadow-2xl group">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}dd, #1a1a1a)` }}
                />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000')] opacity-20 mix-blend-overlay bg-cover bg-center" />

                <div className="absolute bottom-10 left-10 flex flex-col md:flex-row items-end gap-10">
                    <div className="relative">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] border-8 border-white dark:border-neutral-900 shadow-2xl overflow-hidden glass transition-transform group-hover:scale-105">
                            <Avatar className="w-full h-full rounded-none">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className="text-2xl font-black">ER</AvatarFallback>
                            </Avatar>
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-4 bg-white dark:bg-neutral-800 rounded-2xl text-pink-500 shadow-xl border border-neutral-100 dark:border-white/10 hover:scale-110 active:scale-95 transition-all">
                            <Camera size={20} className="fill-pink-500/10" />
                        </button>
                    </div>
                    <div className="pb-4 space-y-3">
                        <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] backdrop-blur-xl">
                            Intelligence Core • Root
                        </Badge>
                        <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                            {tenant?.nome || 'Espaço Revelle'}
                        </h1>
                        <p className="text-white/60 flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                            <MapPin size={14} className="text-white/40" /> Santa Maria, RS • Est. 2024
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Coluna Esquerda */}
                <div className="space-y-8">
                    <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-8 rounded-[2.5rem] shadow-sm glass">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-pink-500/10 rounded-xl">
                                    <User className="w-5 h-5 text-pink-500" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest">Credenciais Mestras</h3>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { label: 'E-mail Comercial', val: 'direcao@espacorevelle.com.br', icon: Mail },
                                    { label: 'WhatsApp Direto', val: '(55) 99999-9999', icon: Phone },
                                    { label: 'Domínio Ativo', val: 'espacorevelle.com.br', icon: Globe },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1.5 group">
                                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">{item.label}</p>
                                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-neutral-100 dark:border-white/5 transition-colors group-hover:border-pink-500/30">
                                            <item.icon size={14} className="text-neutral-400" />
                                            <span className="text-sm font-black tracking-tight">{item.val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full h-14 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest transition-all hover:scale-[1.02] active:scale-95">
                                Editar Assinatura
                            </Button>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-none p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={100} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-white/20 text-white border-none font-black text-[10px] uppercase">Plano Elite</Badge>
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black uppercase tracking-tighter">Status: Operacional</h4>
                                <p className="text-xs font-medium text-emerald-100 mt-1">Sua infraestrutura de IA e gestão está ativa e otimizada.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Coluna Direita */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-10 rounded-[3rem] shadow-sm glass">
                        <div className="space-y-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <Building2 className="w-6 h-6 text-violet-500" />
                                        Setup da Academia
                                    </h3>
                                    <p className="text-neutral-500 font-medium">Configure a identidade e as automações para seus <strong>Alunos</strong>.</p>
                                </div>
                                <Button className="h-12 px-8 rounded-xl bg-pink-500 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-pink-500/20">
                                    Exportar Dados
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Nome Fantasia</label>
                                        <Input defaultValue={tenant?.nome} className="h-14 rounded-2xl bg-neutral-50 dark:bg-black/20 border-neutral-100 dark:border-white/5 font-black px-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Identificação Fiscal</label>
                                        <Input defaultValue="XX.XXX.XXX/0001-XX" className="h-14 rounded-2xl bg-neutral-50 dark:bg-black/20 border-neutral-100 dark:border-white/5 font-black px-6" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: 'WhatsApp Automação', desc: 'Disparos ativos às 09:00', icon: Bell },
                                        { label: 'Deep Learning Visual', desc: 'Análise de biomecânica ativa', icon: Sparkles },
                                    ].map((feat, i) => (
                                        <div key={i} className="p-6 rounded-[2rem] bg-neutral-50 dark:bg-black/20 border border-neutral-100 dark:border-white/5 flex items-center justify-between group hover:border-pink-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
                                                    <feat.icon className="w-4 h-4 text-pink-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-tight">{feat.label}</p>
                                                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{feat.desc}</p>
                                                </div>
                                            </div>
                                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative shadow-inner">
                                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-100 dark:border-white/5">
                                <div className="p-6 rounded-[2rem] bg-neutral-100/50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 flex items-center gap-4 group cursor-pointer hover:bg-white hover:shadow-xl transition-all">
                                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                        <CreditCard className="w-5 h-5 text-violet-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Financeiro</p>
                                        <p className="text-xs font-black uppercase">Recebimento Integrado</p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-neutral-100/50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 flex items-center gap-4 group cursor-pointer hover:bg-white hover:shadow-xl transition-all">
                                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                        <Lock className="w-5 h-5 text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Privacidade</p>
                                        <p className="text-xs font-black uppercase">Segurança & Acessos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
