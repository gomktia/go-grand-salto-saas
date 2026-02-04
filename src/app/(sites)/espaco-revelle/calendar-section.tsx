'use client'

import { useEffect, useState } from 'react'
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
        <section id="calendario" className="py-32 bg-neutral-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-[10px]">Upcoming Events</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white">Calendário <span className="text-rose-600">Revelle</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-white/5 rounded-[2rem] animate-pulse" />
                        ))
                    ) : (
                        eventos.map((evento: any, i: number) => {
                            const date = formatDate(evento.data_inicio)
                            return (
                                <Card key={i} className="bg-neutral-900/50 border-white/5 overflow-hidden group hover:border-rose-600/30 transition-all rounded-[2rem]">
                                    <CardContent className="p-6">
                                        <div className="flex gap-4 mb-4">
                                            <div className="shrink-0 w-16 h-16 rounded-2xl bg-rose-600/10 border border-rose-600/20 flex flex-col items-center justify-center">
                                                <div className="text-2xl font-black text-rose-500">{date.day}</div>
                                                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">{date.month}</div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[9px] font-black uppercase tracking-widest text-rose-500 mb-1.5">
                                                    {getTipoLabel(evento.tipo)}
                                                </div>
                                                <h3 className="font-bold text-sm leading-tight line-clamp-2 uppercase italic text-white group-hover:text-rose-500 transition-colors">
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
                            )
                        })
                    )}
                </div>

                {!isLoading && eventos.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5">
                        <Calendar className="w-16 h-16 mx-auto mb-6 text-zinc-700" />
                        <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Nenhum evento programado no momento</p>
                    </div>
                )}
            </div>
        </section>
    )
}
