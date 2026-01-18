'use client'

import React, { useState } from 'react'
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Camera,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Zap,
    Sparkles,
    QrCode,
    ChevronRight,
    ChevronLeft,
    Sun,
    Moon,
    User,
    Calendar,
    ScanFace,
    MessageSquare,
    BookOpen,
    Globe,
    Building
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { TenantProvider, useTenant } from '@/hooks/use-tenant'

const roleConfig: Record<string, { items: any[], label: string }> = {
    diretora: {
        label: 'Diretora',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/diretora' },
            { name: 'CRM (Leads)', icon: Users, href: '/diretora/crm' },
            { name: 'Turmas', icon: BookOpen, href: '/diretora/turmas' },
            { name: 'Agenda', icon: Calendar, href: '/diretora/agenda' },
            { name: 'Alunas', icon: Users, href: '/diretora/alunos' },
            { name: 'Check-in Facial', icon: ScanFace, href: '/diretora/checkin' },
            { name: 'Figurinos', icon: ShoppingBag, href: '/diretora/estoque' },
            { name: 'Momento do Palco', icon: Camera, href: '/diretora/galeria' },
            { name: 'Gerenciar Site', icon: Globe, href: '/diretora/site' },
            { name: 'Comunicação', icon: MessageSquare, href: '/diretora/notificacoes' },
            { name: 'Financeiro', icon: CreditCard, href: '/diretora/financeiro' },
            { name: 'Configurações', icon: Settings, href: '/diretora/configuracoes' },
            { name: 'Meu Perfil', icon: User, href: '/diretora/perfil' },
        ]
    },
    professor: {
        label: 'Professor',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/professor' },
            { name: 'Minhas Turmas', icon: Users, href: '/professor/turmas' },
            { name: 'Diário de Classe', icon: BookOpen, href: '/professor/diario' },
        ]
    },
    aluno: {
        label: 'Aluna',
        items: [
            { name: 'Meu Painel', icon: LayoutDashboard, href: '/aluno' },
            { name: 'Minhas Aulas', icon: QrCode, href: '/aluno/aulas' },
            { name: 'Minhas Fotos', icon: Camera, href: '/aluno/fotos' },
        ]
    },
    responsavel: {
        label: 'Família',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/responsavel' },
            { name: 'Financeiro', icon: CreditCard, href: '/responsavel/financeiro' },
            { name: 'Galeria de Fotos', icon: Camera, href: '/responsavel/fotos' },
        ]
    },
    superadmin: {
        label: 'Super Admin',
        items: [
            { name: 'Visão Global', icon: Globe, href: '/superadmin' },
            { name: 'Escolas', icon: Building, href: '/superadmin/escolas' },
            { name: 'Configurações', icon: Settings, href: '/superadmin/config' },
        ]
    }
}

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(true)
    const pathname = usePathname()
    const tenant = useTenant()

    const currentRole = pathname.split('/')[1] || 'diretora'
    const config = roleConfig[currentRole] || roleConfig.diretora

    // Cores dinâmicas baseadas no tenant
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const secondaryColor = tenant?.secondaryColor || '#c29493'
    const accentColor = tenant?.accentColor || '#7d3e37'
    const bgColor = tenant?.backgroundColor || '#0c0b0b'
    const paperColor = tenant?.paperColor || '#f5eae6'

    return (
        <div
            className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-background text-foreground flex transition-colors duration-500`}
            style={{
                '--primary': primaryColor,
                '--secondary': secondaryColor,
                '--accent': accentColor,
                '--tenant-bg': bgColor,
                '--tenant-paper': paperColor
            } as React.CSSProperties}
        >
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 90 : 280 }}
                className="hidden lg:flex border-r border-border bg-card/80 backdrop-blur-xl sticky top-0 h-screen flex-col z-50 transition-all duration-300 relative group/sidebar"
            >
                {/* Collapse Button */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-9 h-6 w-6 rounded-full border shadow-sm z-50 bg-background text-foreground hover:bg-accent hidden group-hover/sidebar:flex items-center justify-center transition-opacity"
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>

                <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} h-20`}>
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-lg transition-transform hover:scale-110"
                        style={{ backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` }}
                    >
                        {tenant?.logo_url ? (
                            <img src={tenant.logo_url} alt="Logo" className="w-6 h-6 object-contain" />
                        ) : (
                            <Sparkles size={20} />
                        )}
                    </div>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col overflow-hidden"
                        >
                            <span className="text-lg font-black tracking-tighter leading-none uppercase truncate">
                                {tenant?.nome || 'Plataforma'}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                Painel de Gestão
                            </span>
                        </motion.div>
                    )}
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {config.items.map((item: any) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={`
                                    flex items-center gap-3 px-3 py-3 rounded-2xl transition-all group relative cursor-pointer
                                    ${isActive
                                        ? 'text-white'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                    style={isActive ? { backgroundColor: primaryColor, boxShadow: `0 4px 20px -5px ${primaryColor}50` } : {}}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'group-hover:text-foreground'}`} />

                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-semibold text-sm whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}

                                    {/* Tooltip for Collapsed State */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[60] font-bold uppercase tracking-widest border border-white/10 shadow-xl transition-opacity duration-200">
                                            {item.name}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-border/50 bg-background/30 backdrop-blur-sm">
                    {!isCollapsed ? (
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="p-4 rounded-2xl bg-muted/40 border border-border group transition-all hover:border-[var(--primary)]/30 hover:bg-muted/60"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-background border border-border/50">
                                    <Globe className="w-4 h-4" style={{ color: primaryColor }} />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loja Online</div>
                                    <div className="text-xs font-bold truncate">revelle.com.br</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-[10px] font-bold h-8 border-border hover:bg-background bg-transparent hover:text-[var(--primary)] transition-colors">
                                <Settings className="w-3 h-3 mr-2" />
                                Configurar
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="flex justify-center">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl">
                                <Settings className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className={`p-4 flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between'} pb-8`}>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                    </Button>
                    {!isCollapsed && (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">v1.2.0</span>
                    )}
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 w-full h-16 border-b border-border bg-background/80 backdrop-blur-xl z-[60] flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: primaryColor }}>
                        {tenant?.logo_url ? <img src={tenant.logo_url} className="w-5 h-5 object-contain" /> : <Sparkles className="text-white w-4 h-4" />}
                    </div>
                    <span className="font-black uppercase tracking-tighter text-sm">{tenant?.nome}</span>
                </div>
                <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={tenant?.logo_url || "https://github.com/shadcn.png"} />
                    <AvatarFallback>{tenant?.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </header>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-card border-r border-border z-[80] lg:hidden flex flex-col"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: primaryColor }}>
                                        <Sparkles size={18} className="text-white" />
                                    </div>
                                    <span className="text-xl font-black tracking-tighter uppercase">{tenant?.nome}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                                {config.items.map((item: any) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive ? 'text-white shadow-md' : 'text-muted-foreground hover:bg-muted'}`}
                                                style={isActive ? { backgroundColor: primaryColor } : {}}>
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-bold text-sm uppercase tracking-tight">{item.name}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 lg:pt-0">
                {/* Header Desktop */}
                <header className="hidden lg:flex h-20 border-b border-border items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Busca inteligente..."
                                className="pl-10 h-11 bg-muted/30 border-border w-full rounded-2xl focus:ring-2 focus:ring-[var(--primary)]/20 transition-all font-medium hover:bg-muted/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-muted/50 p-1.5 rounded-2xl border border-border">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDarkMode(false)}
                                className={`h-8 w-8 rounded-xl transition-all ${!isDarkMode ? 'bg-background shadow-sm text-[var(--primary)] scale-105' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Sun className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDarkMode(true)}
                                className={`h-8 w-8 rounded-xl transition-all ${isDarkMode ? 'bg-background shadow-sm text-[var(--primary)] scale-105' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Moon className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="h-8 w-px bg-border mx-1" />

                        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="text-right hidden xl:block">
                                <div className="text-sm font-black uppercase tracking-tighter truncate max-w-[150px]">{tenant?.nome}</div>
                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{config.label}</div>
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-[var(--primary)]/20 p-0.5 ring-offset-background transition-all hover:ring-2 ring-[var(--primary)]">
                                <AvatarImage src={tenant?.logo_url || "https://github.com/shadcn.png"} />
                                <AvatarFallback className="bg-[var(--primary)] text-white font-bold">{tenant?.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto bg-muted/5 p-4 lg:p-8 relative custom-scrollbar">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-[1600px] mx-auto space-y-8"
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <TenantProvider slug="espaco-revelle">
            <DashboardContent>
                {children}
            </DashboardContent>
        </TenantProvider>
    )
}
