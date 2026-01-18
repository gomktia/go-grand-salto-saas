'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    ShoppingBag,
    Download,
    Share2,
    CheckCircle2,
    X,
    ShieldCheck,
    Smartphone,
    Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'

// Mock de fotos do álbum
const albumPhotos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=2000', price: 15.00 },
    { id: 2, url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2000', price: 15.00 },
    { id: 3, url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=2000', price: 15.00 },
    { id: 4, url: 'https://images.unsplash.com/photo-1502519144081-acca18599776?q=80&w=2000', price: 15.00 },
    { id: 5, url: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2000', price: 18.00 },
    { id: 6, url: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=2000', price: 18.00 },
]

export default function AlbumGalleryPage({ params }: { params: { id: string } }) {
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null)
    const [cart, setCart] = useState<number[]>([])
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

    const toggleCart = (id: number) => {
        setCart(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    }

    const totalPrice = cart.length * 15.00 // Simplificação

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-red-500/30">
            {/* Header Fixo */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-2xl px-6 h-20 flex items-center justify-between">
                <Link href="/espaco-revelle" className="flex items-center gap-3 group">
                    <ArrowLeft className="w-5 h-5 text-neutral-500 group-hover:text-red-500 transition-colors" />
                    <span className="text-sm font-bold uppercase tracking-widest">Voltar ao Site</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Álbum</div>
                        <div className="text-sm font-black">Quebra Nozes 2025</div>
                    </div>
                    <Button
                        onClick={() => setIsCheckoutOpen(true)}
                        className={`bg-red-600 hover:bg-red-500 rounded-full px-6 transition-all ${cart.length > 0 ? 'scale-105' : 'opacity-50'}`}
                        disabled={cart.length === 0}
                    >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Comprar ({cart.length})
                    </Button>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20">
                {/* Intro do Álbum */}
                <div className="max-w-3xl mb-12">
                    <Badge className="bg-red-600 mb-4 uppercase text-[10px]">Venda de Fotos</Badge>
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">Quebra Nozes - 2025</h1>
                    <p className="text-neutral-500 text-lg leading-relaxed">
                        Reviva os momentos mágicos do nosso espetáculo. Escolha suas fotos favoritas para download em alta resolução (sem marca d'água).
                    </p>
                </div>

                {/* Grid de Fotos com Marca d'Água */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albumPhotos.map((photo) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <Card className="bg-neutral-900 border-white/5 overflow-hidden transition-all group-hover:border-red-600/30">
                                <div className="aspect-[3/4] relative cursor-zoom-in" onClick={() => setSelectedPhoto(photo)}>
                                    <Image
                                        src={photo.url}
                                        alt="Foto do Espetáculo"
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    {/* Marca d'Água CSS */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity">
                                        <div className="text-white font-black text-4xl uppercase -rotate-45 tracking-[0.5em] whitespace-nowrap">
                                            ESPAÇO REVELLE ESPAÇO REVELLE
                                        </div>
                                    </div>

                                    {/* Overlay de Ações */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <Button
                                            size="icon"
                                            className={`rounded-full transition-all ${cart.includes(photo.id) ? 'bg-red-600 text-white' : 'bg-black/60 text-white hover:bg-red-600'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleCart(photo.id);
                                            }}
                                        >
                                            {cart.includes(photo.id) ? <CheckCircle2 className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4 flex justify-between items-center bg-neutral-950/50 backdrop-blur-md">
                                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">ID: #{photo.id}025</div>
                                    <div className="text-sm font-black text-red-500 font-mono">R$ {photo.price.toFixed(2)}</div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Lightbox / Detalhe da Foto */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-full"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <X className="w-8 h-8" />
                        </Button>

                        <div className="max-w-5xl w-full h-full flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 h-full relative rounded-3xl overflow-hidden border border-white/10">
                                <Image src={selectedPhoto.url} alt="Close up" fill className="object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                    <div className="text-white font-black text-6xl uppercase -rotate-25 tracking-[1em] select-none">REVELLE</div>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-6">
                                <h3 className="text-3xl font-black uppercase tracking-tighter">Detalhe da Foto</h3>
                                <p className="text-neutral-500 text-sm">
                                    Ao adquirir esta foto, você receberá o arquivo digital em 4K (aprox. 12MB) liberado para impressão.
                                </p>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <div className="flex justify-between items-center text-xl font-mono font-black">
                                        <span>Total:</span>
                                        <span className="text-red-500">R$ {selectedPhoto.price.toFixed(2)}</span>
                                    </div>
                                    <Button
                                        className={`w-full h-14 font-bold rounded-xl ${cart.includes(selectedPhoto.id) ? 'bg-emerald-600' : 'bg-red-600 hover:bg-red-500'}`}
                                        onClick={() => toggleCart(selectedPhoto.id)}
                                    >
                                        {cart.includes(selectedPhoto.id) ? 'Remover do Carrinho' : 'Adicionar ao Carrinho'}
                                    </Button>
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
                        className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <Card className="bg-neutral-950 border-white/10 w-full max-w-lg p-8 space-y-8 relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4"
                                onClick={() => setIsCheckoutOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>

                            <div className="text-center">
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Finalizar Pedido</h2>
                                <p className="text-neutral-500 text-sm">Escaneie o QR Code abaixo para liberar seu download imediato.</p>
                            </div>

                            <div className="aspect-square w-64 mx-auto bg-white p-4 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                                {/* Simulação de QR Code PIX */}
                                <div className="text-black text-center space-y-2">
                                    <Smartphone className="w-12 h-12 mx-auto mb-2 text-red-600" />
                                    <div className="w-48 h-48 bg-neutral-200 rounded-xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#000_1px,_transparent_1px)] bg-[length:10px_10px] opacity-20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-32 h-32 border-4 border-black border-dashed rounded-lg opacity-40 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="text-xs text-neutral-400 uppercase font-bold tracking-widest">Valor a pagar:</div>
                                    <div className="text-2xl font-black text-emerald-500 font-mono">R$ {totalPrice.toFixed(2)}</div>
                                </div>

                                <Card className="bg-red-600/10 border-red-600/20 p-4 flex gap-4">
                                    <Info className="text-red-500 shrink-0 w-5 h-5" />
                                    <p className="text-[10px] text-red-200 leading-relaxed font-medium uppercase tracking-wider">
                                        Após o pagamento, o download das fotos originais em HD será liberado automaticamente aqui e enviado para seu e-mail.
                                    </p>
                                </Card>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3" />
                                Pagamento Seguro via Grand Salto Pay
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
