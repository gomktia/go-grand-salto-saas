'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { getEventosCalendario } from '@/app/actions/fotos-venda'

export function CalendarSection() {
    const [eventos, setEventos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchEventos() {
            try {
                const { data } = await getEventosCalendario(true)
                if (data.length > 0) {
                    setEventos(data.slice(0, 4))
                }
            } catch (e) {
                console.error('Erro ao buscar eventos:', e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchEventos()
    }, [])

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('pt-BR', { month: 'short' }),
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
    }

    const getTipoLabel = (tipo: string) => {
        const tipos: Record<string, string> = {
            'evento': 'Evento',
            'aula_aberta': 'Aula Aberta',
            'recital': 'Recital',
            'feriado': 'Feriado'
        }
        return tipos[tipo] || 'Evento'
    }

    if (!isLoading && eventos.length === 0) return null

    return (
        <section id="calendario" className="py-24 bg-zinc-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#800020]/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#800020]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-16 space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#800020] font-black uppercase tracking-[0.4em] text-[9px]">Próximos Eventos</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white">
                        Calendário <span className="text-[#800020]">Revelle</span>
                    </h2>
                </motion.div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-white/5 rounded-[2rem] animate-pulse" />
                        ))
                    ) : (
                        eventos.map((evento: any, i: number) => {
                            const date = formatDate(evento.data_inicio)
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                >
                                    <Card className="bg-zinc-900/50 border-white/5 overflow-hidden group hover:border-[#800020]/30 transition-all rounded-[2rem] hover:-translate-y-2 duration-500">
                                        <CardContent className="p-6">
                                            <div className="flex gap-4 mb-4">
                                                <motion.div
                                                    className="shrink-0 w-16 h-16 rounded-2xl bg-[#800020]/10 border border-[#800020]/20 flex flex-col items-center justify-center"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <div className="text-2xl font-black text-[#800020]">{date.day}</div>
                                                    <div className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">{date.month}</div>
                                                </motion.div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[9px] font-black uppercase tracking-widest text-[#800020] mb-1.5">
                                                        {getTipoLabel(evento.tipo)}
                                                    </div>
                                                    <h3 className="font-bold text-sm leading-tight line-clamp-2 uppercase italic text-white group-hover:text-[#800020] transition-colors">
                                                        {evento.titulo}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-[11px] text-zinc-500">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-zinc-600" />
                                                    <span className="font-medium">{date.time}</span>
                                                </div>
                                                {evento.local && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                                                        <span className="line-clamp-1 font-medium">{evento.local}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })
                    )}
                </div>

                {/* Empty State */}
                {!isLoading && eventos.length === 0 && (
                    <motion.div
                        className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Calendar className="w-16 h-16 mx-auto mb-6 text-zinc-700" />
                        <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Nenhum evento programado no momento</p>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
