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
    const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null)
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false)

    return (
        <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full mb-2">
                        Planejamento Semanal
                    </Badge>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Agenda <span style={{ color: primaryColor }}>Escolar</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">Otimização de salas e horários na <strong className="text-foreground">{tenant?.nome}</strong>.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10 px-4 rounded-xl border-border font-bold text-xs bg-card hover:bg-muted transition-all">
                        <Filter className="w-3.5 h-3.5 mr-2" /> Filtrar Prof.
                    </Button>
                    <Button className="h-10 px-6 rounded-xl font-bold text-xs shadow-lg shadow-[var(--primary)]/20 border-none transition-all hover:scale-105 active:scale-95 text-white" style={{ backgroundColor: primaryColor }}>
                        <Plus className="w-4 h-4 mr-2" /> Novo Horário
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden relative border hover:border-border/80 transition-all">
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
                                    const event = mockEvents.find(e => e.day === dIdx && e.time === slot)
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
            <Dialog open={isNotifyModalOpen} onOpenChange={() => setIsNotifyModalOpen(false)}>
                <DialogContent className="sm:max-w-[400px] bg-card border-border rounded-3xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Enviar Notificação</DialogTitle>
                        <DialogDescription className="text-xs">
                            Para: Turma <strong style={{ color: primaryColor }}>{selectedEvent?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Canal</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button className="h-10 rounded-xl text-xs font-bold gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/10">
                                    WhatsApp
                                </Button>
                                <Button variant="outline" className="h-10 rounded-xl text-xs font-bold border-border">
                                    App Push
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mensagem</label>
                            <textarea
                                className="w-full h-24 bg-muted/40 border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 outline-none resize-none"
                                defaultValue={`Olá! Lembrando da aula de ${selectedEvent?.name} hoje às ${selectedEvent?.time}.`}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full h-11 rounded-xl font-bold text-xs shadow-md gap-2 text-white" style={{ backgroundColor: primaryColor }}>
                            <CheckCircle2 size={16} /> Enviar Agora
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

