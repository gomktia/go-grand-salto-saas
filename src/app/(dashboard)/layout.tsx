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
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { TenantProvider, useTenant } from '@/hooks/use-tenant'
import { createClient } from '@/utils/supabase/client'

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
            { name: 'Comunicacao', icon: MessageSquare, href: '/diretora/notificacoes' },
            { name: 'Financeiro', icon: CreditCard, href: '/diretora/financeiro' },
            { name: 'Configuracoes', icon: Settings, href: '/diretora/configuracoes' },
            { name: 'Meu Perfil', icon: User, href: '/diretora/perfil' },
        ]
    },
    professor: {
        label: 'Professor',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/professor' },
            { name: 'Minhas Turmas', icon: Users, href: '/professor/turmas' },
            { name: 'Diario de Classe', icon: BookOpen, href: '/professor/diario' },
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
        label: 'Familia',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/responsavel' },
            { name: 'Financeiro', icon: CreditCard, href: '/responsavel/financeiro' },
            { name: 'Galeria de Fotos', icon: Camera, href: '/responsavel/fotos' },
        ]
    },
    superadmin: {
        label: 'Super Admin',
        items: [
            { name: 'Visao Global', icon: Globe, href: '/superadmin' },
            { name: 'Escolas', icon: Building, href: '/superadmin/escolas' },
            { name: 'Configuracoes', icon: Settings, href: '/superadmin/config' },
        ]
    }
}

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(true)
    const pathname = usePathname()
    const router = useRouter()
    const tenant = useTenant()

    const currentRole = pathname.split('/')[1] || 'diretora'
    const config = roleConfig[currentRole] || roleConfig.diretora

    const primaryColor = tenant?.primaryColor || '#e11d48'

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className={`${isDarkMode ? 'dark' : ''} min-h-screen flex`}>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50
                           bg-white dark:bg-neutral-900
                           border-r border-neutral-200 dark:border-neutral-800
                           shadow-sm"
            >
                {/* Collapse Button */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-9 h-6 w-6 rounded-full
                               border border-neutral-300 dark:border-neutral-700
                               shadow-md z-50
                               bg-white dark:bg-neutral-800
                               text-neutral-600 dark:text-neutral-300
                               hover:bg-neutral-100 dark:hover:bg-neutral-700
                               opacity-0 group-hover:opacity-100 hover:opacity-100
                               transition-all"
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>

                {/* Logo */}
                <div className={`p-5 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} h-20 border-b border-neutral-200 dark:border-neutral-800`}>
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-lg transition-transform hover:scale-105"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {tenant?.logo_url ? (
                            <img src={tenant.logo_url} alt="Logo" className="w-6 h-6 object-contain" />
                        ) : (
                            <Sparkles size={22} />
                        )}
                    </div>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col overflow-hidden"
                        >
                            <span className="text-base font-bold tracking-tight leading-none truncate text-neutral-900 dark:text-white">
                                {tenant?.nome || 'Plataforma'}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1">
                                Painel de Gestao
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {config.items.map((item: any) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative cursor-pointer
                                    ${isActive
                                        ? 'text-white shadow-md'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'}
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                    style={isActive ? { backgroundColor: primaryColor } : {}}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />

                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-medium text-sm whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}

                                    {/* Tooltip for Collapsed State */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-3 px-3 py-2 bg-neutral-900 dark:bg-neutral-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[60] font-medium shadow-xl border border-neutral-700 transition-opacity duration-200">
                                            {item.name}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    {!isCollapsed ? (
                        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 shadow-sm">
                                    <Globe className="w-4 h-4" style={{ color: primaryColor }} />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Loja Online</div>
                                    <div className="text-sm font-bold truncate text-neutral-900 dark:text-white">revelle.com.br</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-9
                                border-neutral-300 dark:border-neutral-600
                                bg-white dark:bg-neutral-700
                                text-neutral-700 dark:text-neutral-200
                                hover:bg-neutral-100 dark:hover:bg-neutral-600">
                                <Settings className="w-3.5 h-3.5 mr-2" />
                                Configurar
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                                <Settings className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className={`p-4 flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between'} pb-6`}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                    {!isCollapsed && (
                        <span className="text-xs font-medium text-neutral-400">v1.2.0</span>
                    )}
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 w-full h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl z-[60] flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="text-neutral-700 dark:text-neutral-300">
                        <Menu className="w-6 h-6" />
                    </Button>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: primaryColor }}>
                        {tenant?.logo_url ? <img src={tenant.logo_url} className="w-5 h-5 object-contain" /> : <Sparkles className="text-white w-5 h-5" />}
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white text-sm">{tenant?.nome}</span>
                </div>
                <Avatar className="h-9 w-9 border-2 border-neutral-200 dark:border-neutral-700">
                    <AvatarImage src={tenant?.logo_url || "https://github.com/shadcn.png"} />
                    <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                        {tenant?.nome?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
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
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[300px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-[80] lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-5 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: primaryColor }}>
                                        <Sparkles size={20} className="text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-neutral-900 dark:text-white">{tenant?.nome}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                                {config.items.map((item: any) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'text-white shadow-md' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                                                style={isActive ? { backgroundColor: primaryColor } : {}}>
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-semibold text-sm">{item.name}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </nav>
                            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="w-full justify-start text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Sair
                                </Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={`flex-1 flex flex-col min-h-screen ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'} transition-all duration-300`}>
                {/* Header Desktop */}
                <header className="hidden lg:flex h-16 border-b border-neutral-200 dark:border-neutral-800 items-center justify-between px-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-10 h-10
                                    bg-neutral-100 dark:bg-neutral-800
                                    border-neutral-200 dark:border-neutral-700
                                    text-neutral-900 dark:text-white
                                    placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                                    w-full rounded-xl
                                    focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500
                                    transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDarkMode(false)}
                                className={`h-8 w-8 rounded-lg transition-all ${!isDarkMode
                                    ? 'bg-white shadow-sm text-amber-500'
                                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                            >
                                <Sun className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDarkMode(true)}
                                className={`h-8 w-8 rounded-lg transition-all ${isDarkMode
                                    ? 'bg-neutral-700 shadow-sm text-blue-400'
                                    : 'text-neutral-500 hover:text-neutral-700'}`}
                            >
                                <Moon className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </Button>

                        <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-1 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="text-right hidden xl:block">
                                <div className="text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[150px]">{tenant?.nome}</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{config.label}</div>
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-neutral-200 dark:border-neutral-700 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 transition-all hover:ring-2 ring-pink-500">
                                <AvatarImage src={tenant?.logo_url || "https://github.com/shadcn.png"} />
                                <AvatarFallback className="font-bold text-white" style={{ backgroundColor: primaryColor }}>
                                    {tenant?.nome?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 p-4 lg:p-6 pt-20 lg:pt-6 custom-scrollbar">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="max-w-[1600px] mx-auto"
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
