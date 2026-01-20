'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    Search,
    Eye,
    Download,
    Send,
    Copy,
    Filter,
    DollarSign,
    Image as ImageIcon,
    User,
    Mail,
    Phone,
    ExternalLink,
    Loader2,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTenant } from '@/hooks/use-tenant'
import { getPedidosFotos, confirmarPagamentoPedido } from '@/app/actions/fotos-venda'
import { reenviarEmailDownload } from '@/app/actions/download-fotos'
import { toast } from 'sonner'

interface Pedido {
    id: string
    nome_comprador: string
    email_comprador: string
    telefone_comprador?: string
    valor_total: number
    quantidade_fotos: number
    status: 'pendente' | 'pago' | 'cancelado' | 'atrasado'
    metodo_pagamento: string
    liberado_para_download: boolean
    download_token: string
    download_expira_em?: string
    created_at: string
    itens: Array<{
        id: string
        foto?: {
            id: string
            titulo?: string
            url_watermark?: string
            preco: number
        }
    }>
}

const STATUS_CONFIG = {
    pendente: {
        label: 'Pendente',
        color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        icon: Clock,
    },
    pago: {
        label: 'Pago',
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: CheckCircle2,
    },
    cancelado: {
        label: 'Cancelado',
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
        icon: XCircle,
    },
    atrasado: {
        label: 'Atrasado',
        color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        icon: AlertCircle,
    },
}

export default function PedidosFotosPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [confirming, setConfirming] = useState(false)

    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'

    useEffect(() => {
        loadPedidos()
    }, [statusFilter])

    async function loadPedidos() {
        try {
            setLoading(true)
            const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined
            const result = await getPedidosFotos(filters)
            setPedidos(result.data)
        } catch (error) {
            toast.error('Erro ao carregar pedidos')
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmPayment = async () => {
        if (!selectedPedido) return

        setConfirming(true)
        try {
            await confirmarPagamentoPedido(selectedPedido.id, 'manual-confirmation')
            toast.success('Pagamento confirmado com sucesso!')
            setConfirmDialogOpen(false)
            setSelectedPedido(null)
            loadPedidos()
        } catch (error) {
            toast.error('Erro ao confirmar pagamento')
        } finally {
            setConfirming(false)
        }
    }

    const handleCopyDownloadLink = async (pedido: Pedido) => {
        const link = `${window.location.origin}/espaco-revelle/download/${pedido.id}?token=${pedido.download_token}`
        await navigator.clipboard.writeText(link)
        toast.success('Link de download copiado!')
    }

    const handleResendEmail = async (pedidoId: string) => {
        try {
            const result = await reenviarEmailDownload(pedidoId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Link de download gerado!')
                if (result.downloadLink) {
                    await navigator.clipboard.writeText(`${window.location.origin}${result.downloadLink}`)
                    toast.info('Link copiado para a area de transferencia')
                }
            }
        } catch (error) {
            toast.error('Erro ao reenviar e-mail')
        }
    }

    const filteredPedidos = pedidos.filter(pedido => {
        const matchesSearch =
            pedido.nome_comprador.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pedido.email_comprador.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    const stats = {
        total: pedidos.length,
        pendentes: pedidos.filter(p => p.status === 'pendente').length,
        pagos: pedidos.filter(p => p.status === 'pago').length,
        valorTotal: pedidos.filter(p => p.status === 'pago').reduce((acc, p) => acc + Number(p.valor_total), 0),
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Vendas de Fotos
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Pedidos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Fotos</span>
                    </h1>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-zinc-900 dark:text-white">{stats.total}</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Pedidos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-zinc-900 dark:text-white">{stats.pendentes}</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Pendentes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-zinc-900 dark:text-white">{stats.pagos}</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Pagos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-zinc-900 dark:text-white">
                                    R$ {stats.valorTotal.toFixed(0)}
                                </p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Faturado</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <Input
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 pl-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'pendente', 'pago', 'cancelado'].map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'outline'}
                            onClick={() => setStatusFilter(status)}
                            className={`h-12 px-4 rounded-xl uppercase text-[10px] font-bold tracking-wider ${
                                statusFilter === status
                                    ? 'bg-rose-600 text-white border-rose-600'
                                    : 'border-zinc-200 dark:border-zinc-800'
                            }`}
                        >
                            {status === 'all' ? 'Todos' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Pedidos List */}
            <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                    </div>
                ) : filteredPedidos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Package className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mb-4" />
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Nenhum pedido encontrado</h3>
                        <p className="text-zinc-500">Nao ha pedidos com os filtros selecionados.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        <AnimatePresence>
                            {filteredPedidos.map((pedido, index) => {
                                const StatusIcon = STATUS_CONFIG[pedido.status]?.icon || Clock
                                const statusConfig = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.pendente

                                return (
                                    <motion.div
                                        key={pedido.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            {/* Info */}
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                                                    <ImageIcon className="w-7 h-7 text-rose-500" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-black text-lg text-zinc-900 dark:text-white">
                                                            {pedido.nome_comprador}
                                                        </h3>
                                                        <Badge className={`${statusConfig.color} border font-bold text-[9px] uppercase tracking-wider`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {statusConfig.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="w-4 h-4" />
                                                            {pedido.email_comprador}
                                                        </span>
                                                        {pedido.telefone_comprador && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="w-4 h-4" />
                                                                {pedido.telefone_comprador}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <ImageIcon className="w-4 h-4" />
                                                            {pedido.quantidade_fotos} fotos
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-zinc-400 mt-1">
                                                        Pedido em {new Date(pedido.created_at).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Value & Actions */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-zinc-900 dark:text-white">
                                                        R$ {Number(pedido.valor_total).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 uppercase">
                                                        {pedido.metodo_pagamento === 'pix' ? 'PIX' : pedido.metodo_pagamento}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2">
                                                    {pedido.status === 'pendente' && (
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedPedido(pedido)
                                                                setConfirmDialogOpen(true)
                                                            }}
                                                            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                                            Confirmar
                                                        </Button>
                                                    )}

                                                    {pedido.status === 'pago' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => handleCopyDownloadLink(pedido)}
                                                                className="h-10 px-4 rounded-xl border-zinc-200 dark:border-zinc-700 font-bold text-[10px] uppercase tracking-wider"
                                                            >
                                                                <Copy className="w-4 h-4 mr-1" />
                                                                Link
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => handleResendEmail(pedido.id)}
                                                                className="h-10 px-4 rounded-xl border-zinc-200 dark:border-zinc-700 font-bold text-[10px] uppercase tracking-wider"
                                                            >
                                                                <Send className="w-4 h-4 mr-1" />
                                                                Reenviar
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fotos Preview */}
                                        {pedido.itens && pedido.itens.length > 0 && (
                                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                                {pedido.itens.slice(0, 6).map((item) => (
                                                    item.foto?.url_watermark && (
                                                        <div
                                                            key={item.id}
                                                            className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800"
                                                        >
                                                            <img
                                                                src={item.foto.url_watermark}
                                                                alt={item.foto.titulo || 'Foto'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )
                                                ))}
                                                {pedido.itens.length > 6 && (
                                                    <div className="w-16 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-bold text-zinc-500">
                                                            +{pedido.itens.length - 6}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </Card>

            {/* Confirm Payment Dialog */}
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Confirmar Pagamento
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                            Confirme que o pagamento foi recebido para liberar o download das fotos.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPedido && (
                        <div className="py-4 space-y-4">
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Comprador:</span>
                                    <span className="font-bold text-zinc-900 dark:text-white">{selectedPedido.nome_comprador}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">E-mail:</span>
                                    <span className="font-medium text-zinc-900 dark:text-white">{selectedPedido.email_comprador}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Quantidade:</span>
                                    <span className="font-bold text-zinc-900 dark:text-white">{selectedPedido.quantidade_fotos} fotos</span>
                                </div>
                                <div className="flex justify-between text-lg pt-2 border-t border-zinc-200 dark:border-zinc-700">
                                    <span className="text-zinc-500">Valor Total:</span>
                                    <span className="font-black text-emerald-600">R$ {Number(selectedPedido.valor_total).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                    Ao confirmar, o comprador recebera um link para download das fotos em alta resolucao.
                                    O link sera valido por 7 dias.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDialogOpen(false)}
                            disabled={confirming}
                            className="border-zinc-200 dark:border-zinc-700"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmPayment}
                            disabled={confirming}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                            {confirming ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Confirmando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Confirmar Pagamento
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
