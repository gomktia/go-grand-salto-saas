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
    Building,
    ClipboardCheck,
    Heart
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { TenantProvider, useTenant } from '@/hooks/use-tenant'
import { createClient } from '@/utils/supabase/client'
import { useTheme } from 'next-themes'

interface NavigationItem {
    name: string
    icon: React.ElementType
    href: string
}

const roleConfig: Record<string, { items: NavigationItem[], label: string }> = {
    diretora: {
        label: 'Diretora',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/diretora' },
            { name: 'CRM (Leads)', icon: Users, href: '/diretora/crm' },
            { name: 'Turmas', icon: BookOpen, href: '/diretora/turmas' },
            { name: 'Agenda', icon: Calendar, href: '/diretora/agenda' },
            { name: 'Alunos', icon: Users, href: '/diretora/alunos' },
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
        label: 'Aluno',
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
            { name: 'Financeiro', icon: CreditCard, href: '/superadmin/financeiro' },
            { name: 'Integracoes', icon: Zap, href: '/superadmin/integracoes' },
            { name: 'Suporte', icon: MessageSquare, href: '/superadmin/suporte' },
            { name: 'Admins', icon: Users, href: '/superadmin/admins' },
            { name: 'Logs', icon: Settings, href: '/superadmin/logs' },
            { name: 'Configuracoes', icon: Settings, href: '/superadmin/config' },
        ]
    },
    monitora: {
        label: 'Monitora',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/monitora' },
            { name: 'Minhas Turmas', icon: Users, href: '/monitora/turmas' },
            { name: 'Chamada Digital', icon: ClipboardCheck, href: '/monitora/chamada' },
        ]
    }
}

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const tenant = useTenant()

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const isDarkMode = mounted ? resolvedTheme === 'dark' : true

    const currentRole = pathname.split('/')[1] || 'diretora'
    const config = roleConfig[currentRole] || roleConfig.diretora

    // Prioritize tenant color, fallback to rose-500
    const primaryColor = tenant?.primaryColor || '#f43f5e'

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    const toggleTheme = (dark: boolean) => {
        setTheme(dark ? 'dark' : 'light')
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex overflow-x-hidden">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50
                           bg-white dark:bg-zinc-950
                           border-r border-zinc-200 dark:border-zinc-800
                           shadow-sm transition-all duration-300"
            >
                {/* Collapse Button */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 h-6 w-6 rounded-full
                               border border-zinc-200 dark:border-zinc-800
                               shadow-md z-50
                               bg-white dark:bg-zinc-900
                               text-zinc-500 dark:text-zinc-400
                               hover:bg-zinc-100 dark:hover:bg-zinc-800
                               transition-all"
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>

                {/* Logo Area */}
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} h-16 border-b border-zinc-100 dark:border-zinc-800 shrink-0`}>
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-rose-500/20"
                        style={{ backgroundColor: primaryColor }}
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
                            className="ml-3 flex flex-col overflow-hidden"
                        >
                            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                                {tenant?.nome || 'Grand Salto'}
                            </span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                                {config.label}
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    {config.items.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                                    ${isActive
                                        ? 'text-white shadow-lg shadow-rose-500/20'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-rose-600 dark:hover:text-rose-400'}
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                    style={isActive ? { backgroundColor: primaryColor } : {}}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 transition-all ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />

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
                                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-900 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[60] font-bold shadow-xl border border-white/10 transition-all">
                                            {item.name}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 shrink-0">
                    {!isCollapsed ? (
                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white dark:bg-zinc-800 border border-border">
                                    <Globe className="w-4 h-4" style={{ color: primaryColor }} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Loja Ativa</p>
                                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{tenant?.slug}.com.br</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Link href={`/${currentRole}/configuracoes`}>
                                <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    )}

                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-1`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                        {!isCollapsed && (
                            <span className="text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-widest">v2.1.0</span>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Content Area */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'}`}>
                {/* Header Desktop */}
                <header className="hidden lg:flex h-16 items-center justify-between px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Pesquisa rápida..."
                                className="pl-11 h-11 bg-zinc-100 dark:bg-zinc-900 border-transparent focus:bg-white dark:focus:bg-zinc-900 rounded-2xl w-full text-sm font-medium transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleTheme(false)}
                                className={`h-8 w-8 rounded-lg transition-all ${!isDarkMode ? 'bg-white shadow-sm text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Sun className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleTheme(true)}
                                className={`h-8 w-8 rounded-lg transition-all ${isDarkMode ? 'bg-zinc-800 shadow-sm text-blue-400' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                <Moon className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-950" />
                        </Button>

                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="text-right hidden xl:block">
                                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-500 transition-colors">Admin Escola</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{tenant?.nome}</p>
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-rose-500/50 transition-all p-0.5">
                                <AvatarImage src={tenant?.logo_url || "https://github.com/shadcn.png"} className="rounded-full" />
                                <AvatarFallback className="bg-rose-500 text-white text-xs font-black">AD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Mobile Header */}
                <header className="lg:hidden fixed top-0 w-full h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl z-[60] flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="text-zinc-600 dark:text-zinc-300">
                            <Menu className="w-6 h-6" />
                        </Button>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: primaryColor }}>
                            <Sparkles size={16} />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{tenant?.nome}</span>
                    </div>
                    <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-800">
                        <AvatarFallback className="bg-rose-500 text-white text-[10px]">AD</AvatarFallback>
                    </Avatar>
                </header>

                {/* Main Page Content */}
                <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 bg-zinc-50/50 dark:bg-zinc-950">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-[1600px] mx-auto w-full"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[70] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-[80] lg:hidden flex flex-col pt-4"
                        >
                            <div className="px-6 py-4 flex items-center justify-between">
                                <span className="font-black text-xl tracking-tighter text-gradient uppercase">{tenant?.nome}</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-5 h-5 text-zinc-500" />
                                </Button>
                            </div>
                            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                                {config.items.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}>
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </nav>
                            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl px-4 py-6"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    <span className="font-bold">Sair do Painel</span>
                                </Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
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
