'use client'

import React, { useState } from 'react'
import {
    Users,
    Shield,
    MoreVertical,
    Plus,
    Search,
    Mail,
    Lock,
    Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ADMINS = [
    { id: '1', name: 'Admin Master', email: 'admin@grandsalto.com.br', role: 'root', status: 'active', lastAccess: 'Agora' },
    { id: '2', name: 'Suporte Tecnico', email: 'tech@grandsalto.com.br', role: 'support', status: 'active', lastAccess: 'Ha 2 horas' },
    { id: '3', name: 'Financeiro', email: 'fin@grandsalto.com.br', role: 'finance', status: 'active', lastAccess: 'Ontem' },
]

export default function SuperAdminAdminsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'root': return <Badge className="bg-violet-500/10 text-violet-400 border-none uppercase text-[9px] font-black tracking-widest">Super Admin</Badge>
            case 'support': return <Badge className="bg-blue-500/10 text-blue-400 border-none uppercase text-[9px] font-black tracking-widest">Suporte</Badge>
            case 'finance': return <Badge className="bg-emerald-500/10 text-emerald-400 border-none uppercase text-[9px] font-black tracking-widest">Financeiro</Badge>
            default: return <Badge variant="outline">User</Badge>
        }
    }

    return (
        <div className="p-4 lg:p-10 space-y-8 pb-24 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                        Administradores
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm lg:text-lg mt-2">
                        Gerencie quem tem acesso ao painel global
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-12 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-violet-600/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-neutral-900 border-white/10 sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-white font-black uppercase tracking-tight">Adicionar Administrador</DialogTitle>
                            <DialogDescription className="text-neutral-400">
                                Crie um novo usuario com acesso ao painel Super Admin.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-white text-xs uppercase font-bold tracking-widest">Nome Completo</Label>
                                <Input className="bg-white/5 border-white/10 text-white" placeholder="Ex: Joao Silva" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white text-xs uppercase font-bold tracking-widest">Email</Label>
                                <Input className="bg-white/5 border-white/10 text-white" type="email" placeholder="joao@grandsalto.com.br" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white text-xs uppercase font-bold tracking-widest">Funcao (Role)</Label>
                                <Select>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-900 border-white/10">
                                        <SelectItem value="root">Super Admin (Acesso Total)</SelectItem>
                                        <SelectItem value="support">Suporte (Atendimento)</SelectItem>
                                        <SelectItem value="finance">Financeiro (Apenas Financeiro)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/5">Cancelar</Button>
                            <Button className="bg-violet-600 hover:bg-violet-500 text-white">Criar Acesso</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-neutral-900 border-white/5 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <CardTitle className="text-white font-black uppercase tracking-tight">Usuarios do Sistema</CardTitle>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <Input
                                placeholder="Buscar admin..."
                                className="h-10 pl-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-neutral-500"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {ADMINS.map((admin) => (
                            <div key={admin.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border border-white/10">
                                        <AvatarFallback className="bg-violet-600 text-white font-bold">
                                            {admin.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-white">{admin.name}</p>
                                            {getRoleBadge(admin.role)}
                                        </div>
                                        <p className="text-sm text-neutral-500">{admin.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Ultimo Acesso</p>
                                        <p className="text-white text-xs font-bold">{admin.lastAccess}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                                                <MoreVertical className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-neutral-900 border-white/10" align="end">
                                            <DropdownMenuLabel className="text-neutral-400 text-xs uppercase tracking-widest">Acoes</DropdownMenuLabel>
                                            <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                                                <Mail className="w-4 h-4 mr-2" />
                                                Enviar Email
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                                                <Lock className="w-4 h-4 mr-2" />
                                                Resetar Senha
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/10" />
                                            <DropdownMenuItem className="text-red-500 hover:bg-red-500/10 cursor-pointer">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remover Acesso
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
