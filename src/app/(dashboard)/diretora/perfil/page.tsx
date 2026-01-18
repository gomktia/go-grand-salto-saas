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
    LogOut,
    Mail,
    Phone,
    Globe
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function ProprietariaPerfilPage() {
    return (
        <div className="p-4 lg:p-10 space-y-8 pb-24">
            {/* Header Perfil */}
            <div className="relative h-48 lg:h-64 rounded-[2.5rem] bg-gradient-to-r from-pink-600 to-violet-600 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6 lg:left-10 flex flex-col md:flex-row items-end gap-6">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 lg:h-32 lg:w-32 border-4 border-background shadow-2xl">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 p-2 bg-pink-500 rounded-full text-white shadow-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="pb-2">
                        <Badge className="bg-white/20 text-white border-none mb-2 backdrop-blur-md">Proprietária & Diretora</Badge>
                        <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter shadow-sm">
                            Espaço Revelle
                        </h1>
                        <p className="text-white/80 flex items-center gap-2 text-sm mt-1">
                            <MapPin size={14} /> Santa Maria, RS • Membro desde 2024
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                {/* Coluna Esquerda: Informações Gerais */}
                <div className="space-y-6">
                    <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <User className="w-4 h-4 text-pink-500" />
                                Dados da Dona
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-muted-foreground uppercase font-bold">Email Comercial</label>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-muted-foreground" />
                                    <span>direcao@espacorevelle.com.br</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-muted-foreground uppercase font-bold">WhatsApp</label>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={14} className="text-muted-foreground" />
                                    <span>(55) 99999-9999</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-muted-foreground uppercase font-bold">Website</label>
                                <div className="flex items-center gap-2 text-sm">
                                    <Globe size={14} className="text-muted-foreground" />
                                    <span>www.espacorevelle.com.br</span>
                                </div>
                            </div>
                            <Button className="w-full mt-4 bg-muted hover:bg-muted/80 text-foreground border-none font-bold rounded-xl h-10">
                                Editar Perfil
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-sm rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Verificação & Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                <span className="text-xs font-bold text-emerald-600">Assinatura Ativa</span>
                                <Badge className="bg-emerald-500 text-white border-none text-[10px]">Elite</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground leading-relaxed px-1">
                                Sua conta possui acesso aos recursos avançados de IA e Gestão Multi-unidade.
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Direita: Configurações da Escola */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-card border-border shadow-sm rounded-[2rem]">
                        <CardHeader className="p-8 border-b border-border/50">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Building2 className="text-violet-500" />
                                Configurações da Unidade
                            </CardTitle>
                            <CardDescription>Personalize a experiência das suas alunas no portal.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nome de Exibição</label>
                                        <Input defaultValue="Espaço Revelle" className="bg-muted/30 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CNPJ</label>
                                        <Input defaultValue="XX.XXX.XXX/0001-XX" className="bg-muted/30 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 rounded-2xl border border-divider flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold">Cobrança Automática</div>
                                            <div className="text-xs text-muted-foreground">Envio via WhatsApp às 09:00</div>
                                        </div>
                                        <div className="w-10 h-5 bg-pink-500 rounded-full relative">
                                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-divider flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold">Assistente de Fotos IA</div>
                                            <div className="text-xs text-muted-foreground">Habilitar no Momento do Palco</div>
                                        </div>
                                        <div className="w-10 h-5 bg-pink-500 rounded-full relative">
                                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button className="mt-10 bg-pink-600 hover:bg-pink-500 text-white font-bold px-10 rounded-2xl h-12 shadow-xl shadow-pink-600/20">
                                Salvar Alterações
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-card border-border shadow-sm rounded-[2rem] hover:border-pink-500/30 transition-all cursor-pointer">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-500">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Métodos de Recebimento</div>
                                    <div className="text-[10px] text-muted-foreground">Pix, Cartão, Boleto</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border shadow-sm rounded-[2rem] hover:border-violet-500/30 transition-all cursor-pointer">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-500">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Segurança & Acessos</div>
                                    <div className="text-[10px] text-muted-foreground">Gerenciar Professores</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
