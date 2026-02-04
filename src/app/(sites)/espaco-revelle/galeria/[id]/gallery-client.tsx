'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    ShoppingBag,
    CheckCircle2,
    X,
    ShieldCheck,
    Smartphone,
    Info,
    Copy,
    QrCode,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { criarPedidoFotosComPix, verificarStatusPagamento } from '@/app/actions/pagamento'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Album = {
    id: string
    titulo: string
    descricao?: string
    is_venda_ativa: boolean
}

type Foto = {
    id: string
    url_watermark: string
    preco: number
    titulo?: string
}

type Props = {
    album: Album
    fotos: Foto[]
}

export function GalleryClient({ album, fotos }: Props) {
    const [selectedPhoto, setSelectedPhoto] = useState<Foto | null>(null)
    const [cart, setCart] = useState<string[]>([])
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [pedidoId, setPedidoId] = useState<string | null>(null)
    const [pixData, setPixData] = useState<{
        qr_code_base64: string
        copia_cola: string
        expiracao: string
    } | null>(null)

    const [checkoutData, setCheckoutData] = useState({
        nome_comprador: '',
        email_comprador: '',
        telefone_comprador: '',
    })

    // Verificar status do pagamento periodicamente
    React.useEffect(() => {
        if (!pedidoId || !pixData) return

        const interval = setInterval(async () => {
            const { pago, download_token } = await verificarStatusPagamento(pedidoId)
            if (pago) {
                toast.success('Pagamento confirmado! Redirecionando...')
                clearInterval(interval)
                // Redirecionar para página de download com o token
                window.location.href = `/espaco-revelle/download/${pedidoId}?token=${download_token}`
            }
        }, 5000) // Verificar a cada 5 segundos

        return () => clearInterval(interval)
    }, [pedidoId, pixData])

    const toggleCart = (id: string) => {
        setCart(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    }

    const cartPhotos = fotos.filter(f => cart.includes(f.id))
    const totalPrice = cartPhotos.reduce((sum, foto) => sum + Number(foto.preco), 0)

    const handleCheckout = async () => {
        if (!checkoutData.nome_comprador || !checkoutData.email_comprador) {
            toast.error('Preencha seu nome e e-mail')
            return
        }

        setIsProcessing(true)
        try {
            const result = await criarPedidoFotosComPix({
                fotos_ids: cart,
                nome_comprador: checkoutData.nome_comprador,
                email_comprador: checkoutData.email_comprador,
                telefone_comprador: checkoutData.telefone_comprador,
            })

            if (result.error) {
                toast.error(result.error)
                return
            }

            if (result.data) {
                setPedidoId(result.data.pedido.id)
                setPixData(result.data.pix)
                toast.success('Pedido criado! Aguardando pagamento...')
            }
        } catch (error: any) {
            toast.error(error.message || 'Erro ao criar pedido')
        } finally {
            setIsProcessing(false)
        }
    }

    const copyPix = () => {
        if (pixData) {
            navigator.clipboard.writeText(pixData.copia_cola)
            toast.success('Código PIX copiado!')
        }
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-rose-500/30">
            {/* Header Fixo */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-2xl px-6 h-20 flex items-center justify-between">
                <Link href="/espaco-revelle" className="flex items-center gap-3 group border-none">
                    <ArrowLeft className="w-5 h-5 text-neutral-500 group-hover:text-rose-500 transition-colors" />
                    <span className="text-sm font-black uppercase tracking-widest">Site Revelle</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Álbum</div>
                        <div className="text-sm font-black italic uppercase tracking-tighter">{album.titulo}</div>
                    </div>
                    <Button
                        onClick={() => setIsCheckoutOpen(true)}
                        className={`bg-rose-600 hover:bg-rose-500 rounded-full px-6 transition-all shadow-2xl shadow-rose-600/20 font-black uppercase text-[10px] tracking-widest border-none ${cart.length > 0 ? 'scale-105' : 'opacity-50'}`}
                        disabled={cart.length === 0 || !album.is_venda_ativa}
                    >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Comprar ({cart.length})
                    </Button>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20">
                {/* Intro do Álbum */}
                <div className="max-w-3xl mb-12 space-y-4">
                    <Badge className="bg-rose-600/10 text-rose-500 border border-rose-600/20 uppercase text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full">
                        {album.is_venda_ativa ? 'Private Collection • Venda Ativa' : 'Venda Encerrada'}
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">{album.titulo}</h1>
                    <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                        {album.descricao || 'Reviva os momentos mágicos. Escolha suas fotos favoritas para download em alta resolução (sem marca d\'água).'}
                    </p>
                </div>

                {/* Grid de Fotos com Marca d'Água */}
                {fotos.length === 0 ? (
                    <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-white/5">
                        <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">Nenhuma foto disponível neste álbum</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {fotos.map((photo) => (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                <Card className="bg-neutral-900 border-white/5 overflow-hidden transition-all group-hover:border-rose-600/30 rounded-[2rem] shadow-2xl">
                                    <div className="aspect-[3/4] relative cursor-zoom-in" onClick={() => setSelectedPhoto(photo)}>
                                        <Image
                                            src={photo.url_watermark}
                                            alt={photo.titulo || "Foto do Álbum"}
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                        {/* Marca d'Água CSS */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity overflow-hidden">
                                            <div className="text-white font-black text-4xl uppercase -rotate-45 tracking-[0.5em] whitespace-nowrap select-none">
                                                REVELLE REVELLE REVELLE REVELLE
                                            </div>
                                        </div>

                                        {/* Overlay de Ações */}
                                        {album.is_venda_ativa && (
                                            <div className="absolute top-6 right-6 z-20">
                                                <Button
                                                    size="icon"
                                                    className={`w-12 h-12 rounded-2xl transition-all shadow-2xl border-none ${cart.includes(photo.id) ? 'bg-rose-600 text-white scale-110 shadow-rose-600/30' : 'bg-black/60 text-white hover:bg-rose-600 hover:scale-110'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleCart(photo.id);
                                                    }}
                                                >
                                                    {cart.includes(photo.id) ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md">
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic">
                                            {photo.titulo || `Shot #${photo.id.slice(0, 8)}`}
                                        </div>
                                        <div className="text-lg font-black text-rose-500 font-mono tracking-tighter">
                                            R$ {Number(photo.preco).toFixed(2)}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Lightbox / Detalhe da Foto */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-8 right-8 text-white hover:bg-white/10 rounded-full w-14 h-14"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <X className="w-8 h-8" />
                        </Button>

                        <div className="max-w-6xl w-full h-full flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 h-full relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                                <Image src={selectedPhoto.url_watermark} alt="Close up" fill className="object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                    <div className="text-white font-black text-6xl md:text-8xl uppercase -rotate-25 tracking-[1em] select-none">REVELLE</div>
                                </div>
                            </div>

                            <div className="w-full md:w-96 space-y-8">
                                <div className="space-y-4">
                                    <Badge className="bg-rose-600/10 text-rose-500 border border-rose-600/20 uppercase text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full">Detalhes da Obra</Badge>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic">High Definition</h3>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                        Ao adquirir esta foto, você receberá o arquivo digital original em altíssima resolução, sem marcas d'água, ideal para impressões de grande formato e álbuns de luxo.
                                    </p>
                                </div>

                                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-6 shadow-2xl">
                                    <div className="flex justify-between items-center text-3xl font-mono font-black italic">
                                        <span className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-black not-italic">Investimento:</span>
                                        <span className="text-rose-500">R$ {Number(selectedPhoto.preco).toFixed(2)}</span>
                                    </div>
                                    {album.is_venda_ativa && (
                                        <Button
                                            className={`w-full h-16 font-black uppercase tracking-[0.1em] rounded-2xl text-xs transition-all shadow-2xl border-none ${cart.includes(selectedPhoto.id) ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20 text-white'}`}
                                            onClick={() => toggleCart(selectedPhoto.id)}
                                        >
                                            {cart.includes(selectedPhoto.id) ? 'Remover dO Carrinho' : 'Adicionar ao Carrinho'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Checkout Modal / PIX Generator */}
            <AnimatePresence>
                {isCheckoutOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <Card className="bg-neutral-950 border-white/10 w-full max-w-lg p-10 space-y-8 relative max-h-[95vh] overflow-y-auto rounded-[3rem] shadow-[0_0_100px_rgba(225,29,72,0.1)]">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-6 right-6 hover:bg-white/5 rounded-full"
                                onClick={() => {
                                    setIsCheckoutOpen(false);
                                    setPixData(null);
                                }}
                            >
                                <X className="w-6 h-6" />
                            </Button>

                            {!pixData ? (
                                <>
                                    <div className="text-center space-y-2">
                                        <Badge className="bg-rose-600/10 text-rose-500 border border-rose-600/20 uppercase text-[9px] font-black tracking-[0.3em] px-3 py-1 rounded-full mb-2">Checkout Seguro</Badge>
                                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Finalizar Pedido</h2>
                                        <p className="text-zinc-500 text-sm font-medium">Preencha seus dados para habilitar o pagamento via PIX.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nome Completo *</Label>
                                            <Input
                                                id="nome"
                                                value={checkoutData.nome_comprador}
                                                onChange={(e) => setCheckoutData({ ...checkoutData, nome_comprador: e.target.value })}
                                                placeholder="Como no seu documento"
                                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-rose-500/50 font-bold transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">E-mail para Entrega *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={checkoutData.email_comprador}
                                                onChange={(e) => setCheckoutData({ ...checkoutData, email_comprador: e.target.value })}
                                                placeholder="onde@recebera.as.fotos"
                                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-rose-500/50 font-bold transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefone" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">WhatsApp (Opcional)</Label>
                                            <Input
                                                id="telefone"
                                                value={checkoutData.telefone_comprador}
                                                onChange={(e) => setCheckoutData({ ...checkoutData, telefone_comprador: e.target.value })}
                                                placeholder="(00) 00000-0000"
                                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-rose-500/50 font-bold transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center p-6 bg-white/5 rounded-[2rem] border border-white/10 shadow-inner">
                                        <div className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] italic">Total da Coleção:</div>
                                        <div className="text-3xl font-black text-emerald-500 font-mono tracking-tighter">R$ {totalPrice.toFixed(2)}</div>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-rose-600/5 border border-rose-600/10 flex gap-4">
                                        <ShieldCheck className="text-rose-500 shrink-0 w-6 h-6" />
                                        <p className="text-[10px] text-rose-200/60 leading-relaxed font-bold uppercase tracking-wider">
                                            Proteção de Dados Garantida. Seu link de download será gerado imediatamente após a confirmação.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleCheckout}
                                        disabled={isProcessing}
                                        className="w-full h-16 bg-rose-600 hover:bg-rose-500 font-black uppercase tracking-widest text-xs shadow-2xl shadow-rose-600/30 rounded-2xl border-none"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Gerando PIX...
                                            </span>
                                        ) : 'Finalizar e Pagar'}
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-8 text-center py-4">
                                    <div className="space-y-2">
                                        <Badge className="bg-emerald-600/20 text-emerald-500 border border-emerald-600/20 uppercase text-[9px] font-black tracking-[0.3em] px-3 py-1 rounded-full">Pedido Gerado</Badge>
                                        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white">Pagamento PIX</h2>
                                        <p className="text-zinc-500 text-sm font-medium">Escaneie o QR Code ou copie a chave abaixo.</p>
                                    </div>

                                    <div className="mx-auto w-64 h-64 bg-white p-4 rounded-[2rem] shadow-2xl shadow-emerald-500/10 relative group">
                                        <img src={pixData.qr_code_base64} alt="QR Code PIX" className="w-full h-full" />
                                        <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2rem]">
                                            <QrCode className="w-12 h-12 text-black" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest ml-1">Copia e Cola:</div>
                                        <div className="flex gap-2">
                                            <Input
                                                readOnly
                                                value={pixData.copia_cola}
                                                className="h-14 bg-white/5 border-white/10 rounded-2xl font-mono text-[10px] text-zinc-400"
                                            />
                                            <Button
                                                size="icon"
                                                onClick={copyPix}
                                                className="h-14 w-14 bg-rose-600 hover:bg-rose-500 shrink-0 rounded-2xl border-none"
                                            >
                                                <Copy className="w-6 h-6" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
                                        <div className="flex justify-between items-center font-black">
                                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Valor Total:</span>
                                            <span className="text-2xl text-emerald-500 font-mono">R$ {totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="h-px bg-white/5" />
                                        <div className="flex items-start gap-4 text-left">
                                            <Smartphone className="text-rose-500 shrink-0 w-5 h-5" />
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed tracking-wider">
                                                Abra o app do seu banco, vá em PIX e escolha "Ler QR Code" ou "Pix Copia e Cola".
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Button
                                            onClick={() => window.open('https://wa.me/5555996504558?text=Oi, acabei de fazer um pedido de fotos!', '_blank')}
                                            variant="outline"
                                            className="w-full h-14 border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-widest rounded-2xl"
                                        >
                                            Já paguei / Suporte
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-2 text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                Ambiente Criptografado Grand Salto
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
