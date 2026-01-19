import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { getEventosCalendario } from '@/app/actions/fotos-venda'

export async function CalendarSection() {
    let eventos = []

    try {
        const result = await getEventosCalendario(true) // isPublic = true
        eventos = result.data.slice(0, 4) // Show next 4 events
    } catch (e: any) {
        console.log('Calendar events not available yet, using fallback')
        // Fallback events
        eventos = [
            {
                titulo: "Apresentação de Final de Ano",
                data_inicio: "2026-12-20T19:00:00",
                local: "Teatro Municipal",
                tipo: "recital",
                cor: "#ec4899"
            },
            {
                titulo: "Aula Experimental Gratuita",
                data_inicio: "2026-02-15T14:00:00",
                local: "Espaço Revelle",
                tipo: "aula_aberta",
                cor: "#22c55e"
            }
        ]
    }

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

    return (
        <section id="calendario" className="py-32 bg-neutral-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Próximos Eventos</span>
                    <h2 className="text-5xl font-black tracking-tighter uppercase">Calendário <span className="text-red-600">Revelle</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {eventos.map((evento: any, i: number) => {
                        const date = formatDate(evento.data_inicio)
                        return (
                            <Card key={i} className="bg-neutral-900/50 border-white/5 overflow-hidden group hover:border-red-600/30 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex gap-4 mb-4">
                                        <div className="shrink-0 w-16 h-16 rounded-2xl bg-red-600/10 border border-red-600/20 flex flex-col items-center justify-center">
                                            <div className="text-2xl font-bold text-red-500">{date.day}</div>
                                            <div className="text-[10px] font-bold uppercase text-neutral-400">{date.month}</div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[9px] font-bold uppercase tracking-wider text-red-500 mb-1.5">
                                                {getTipoLabel(evento.tipo)}
                                            </div>
                                            <h3 className="font-bold text-sm leading-tight line-clamp-2">
                                                {evento.titulo}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-[11px] text-neutral-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-neutral-600" />
                                            <span>{date.time}</span>
                                        </div>
                                        {evento.local && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                                                <span className="line-clamp-1">{evento.local}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {eventos.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-neutral-700" />
                        <p className="text-neutral-500 text-sm">Nenhum evento programado no momento</p>
                    </div>
                )}
            </div>
        </section>
    )
}
