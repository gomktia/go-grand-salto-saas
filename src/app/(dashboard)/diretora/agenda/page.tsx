'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MapPin,
    Bell,
    Users,
    Filter,
    CheckCircle2,
    Trash2,
    Calendar as FullCalendar,
    Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useTenant } from '@/hooks/use-tenant'
import { getTurmas, enviarNotificacaoGrupo } from '@/app/actions/admin'
import { NotificacaoTurmaDialog } from '@/components/dashboard/notificacao-turma-dialog'
import { toast } from 'sonner'

const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

const mockEvents = [
    { id: 1, day: 0, time: '14:00', name: 'Baby Ballet II', teacher: 'Marina', room: 'Sala 01', level: 'Baby', color: 'var(--primary)' },
    { id: 2, day: 1, time: '16:00', name: 'Jazz Juvenil A', teacher: 'Ricardo', room: 'Sala Principal', level: 'Iniciante', color: '#c29493' },
    { id: 3, day: 2, time: '14:00', name: 'Baby Ballet II', teacher: 'Marina', room: 'Sala 01', level: 'Baby', color: 'var(--primary)' },
    { id: 4, day: 3, time: '19:00', name: 'Contemporâneo', teacher: 'Cláudia', room: 'Sala 02', level: 'Avançado', color: '#7d3e37' },
    { id: 5, day: 4, time: '10:00', name: 'Ponta Iniciante', teacher: 'Beatriz', room: 'Sala 01', level: 'Intermediário', color: '#c72d1c' },
]

export default function AgendaPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false)
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    React.useEffect(() => {
        loadAgenda()
    }, [])

    async function loadAgenda() {
        try {
            setLoading(true)
            const result = await getTurmas()
            const turmas = result.data || []

            const agendaEvents: any[] = []
            turmas.forEach((turma: any) => {
                turma.agenda_aulas?.forEach((aula: any) => {
                    agendaEvents.push({
                        id: `${turma.id}-${aula.id}`,
                        day: (aula.dia_semana - 1 + 7) % 7, // Adjusting to 0 = Monday if needed, or keeping as is
                        time: aula.hora_inicio.substring(0, 5),
                        name: turma.nome,
                        teacher: turma.perfis?.full_name || 'Prof. não definido',
                        room: aula.sala || 'Sala Principal',
                        level: turma.nivel,
                        color: turma.cor_etiqueta || primaryColor,
                        turmaId: turma.id,
                        matriculas: turma.matriculas_turmas || []
                    })
                })
            })
            setEvents(agendaEvents)
        } catch (error) {
            toast.error('Erro ao carregar agenda')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Planejamento Semanal de Aulas
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Agenda <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Escolar</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-10 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-[10px] text-zinc-600 dark:text-zinc-400 uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                        <Filter className="w-3.5 h-3.5 mr-2" />
                        PROFESSORES
                    </Button>
                    <Button
                        onClick={() => { }}
                        className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        NOVO HORÁRIO
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <Card className="bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[800px]">
                        {/* Calendar Header */}
                        <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                            <div className="p-4 border-r border-border flex items-center justify-center tracking-wider uppercase text-[10px]">Horário</div>
                            {daysOfWeek.map((day, idx) => (
                                <div key={idx} className="p-4 border-r border-border last:border-r-0 text-center uppercase tracking-wider text-[10px]">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Body */}
                        {timeSlots.map((slot, sIdx) => (
                            <div key={sIdx} className="grid grid-cols-7 border-b border-border last:border-b-0 group">
                                <div className="p-4 border-r border-border bg-muted/10 flex items-center justify-center text-xs font-medium text-muted-foreground">
                                    {slot}
                                </div>
                                {daysOfWeek.map((_, dIdx) => {
                                    const event = events.find(e => {
                                        // Simple comparison, might need refinement if slot/time format differs
                                        return e.day === dIdx && e.time.startsWith(slot.substring(0, 2))
                                    })
                                    return (
                                        <div
                                            key={dIdx}
                                            className="p-1 border-r border-border last:border-r-0 min-h-[90px] relative hover:bg-muted/20 transition-colors"
                                        >
                                            {event && (
                                                <motion.div
                                                    layoutId={`event-${event.id}`}
                                                    onClick={() => setSelectedEvent(event)}
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    className="w-full h-full rounded-xl p-3 text-white shadow-md cursor-pointer transition-all flex flex-col justify-between border border-white/5"
                                                    style={{ backgroundColor: event.color.startsWith('var') ? primaryColor : event.color }}
                                                >
                                                    <div className="space-y-0.5">
                                                        <div className="text-[11px] font-bold leading-tight truncate">{event.name}</div>
                                                        <div className="text-[9px] opacity-80 font-medium uppercase tracking-wide truncate">{event.teacher}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-1 text-[9px] bg-black/20 px-1.5 py-0.5 rounded-md font-semibold">
                                                            <MapPin size={9} /> {event.room}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Quick Stats / Legend */}
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} /> Baby & Kids
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#c29493' }} /> Iniciante
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7d3e37' }} /> Avançado
                </div>
            </div>

            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent className="sm:max-w-md bg-card border-border rounded-3xl p-6">
                    <DialogHeader>
                        <div className="flex items-start gap-5 mb-2">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
                                style={{ backgroundColor: selectedEvent?.color.startsWith('var') ? primaryColor : selectedEvent?.color }}
                            >
                                <FullCalendar size={28} />
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-xl font-bold leading-tight">{selectedEvent?.name}</DialogTitle>
                                <DialogDescription className="font-semibold text-xs flex items-center gap-2 text-muted-foreground">
                                    <span style={{ color: primaryColor }}>{selectedEvent?.teacher}</span> • {selectedEvent?.level}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-3 py-4">
                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Horário</span>
                            <div className="text-sm font-bold flex items-center gap-2">
                                <Clock size={14} className="text-muted-foreground" /> {selectedEvent?.time}
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Sala</span>
                            <div className="text-sm font-bold flex items-center gap-2">
                                <MapPin size={14} className="text-muted-foreground" /> {selectedEvent?.room}
                            </div>
                        </div>
                    </div>

                    <Card className="bg-muted/20 border-dashed border-border p-4 rounded-2xl mb-2">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                                <Users size={14} /> Alunos (12/15)
                            </span>
                            <Badge variant="secondary" className="text-[10px] h-5">Vagas: 3</Badge>
                        </div>
                        <div className="flex -space-x-2 items-center">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-neutral-200" />
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-card bg-neutral-800 flex items-center justify-center text-[10px] text-white font-bold">+7</div>
                        </div>
                    </Card>

                    <DialogFooter className="flex gap-2 mt-2">
                        <Button
                            onClick={() => setIsNotifyModalOpen(true)}
                            className="flex-1 h-11 rounded-xl font-bold text-xs gap-2 shadow-lg transition-all text-white"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Bell size={16} /> Notificar
                        </Button>
                        <Button variant="outline" className="h-11 w-11 p-0 rounded-xl text-destructive hover:bg-destructive/10 border-border">
                            <Trash2 size={18} />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Notification Modal */}
            {selectedEvent && (
                <NotificacaoTurmaDialog
                    open={isNotifyModalOpen}
                    onOpenChange={setIsNotifyModalOpen}
                    turmaId={selectedEvent.turmaId}
                    turmaNome={selectedEvent.name}
                />
            )}
        </div>
    )
}
