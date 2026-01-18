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
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false)

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-7xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Planejamento Semanal
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Agenda <span style={{ color: primaryColor }}>Escolar</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm lg:text-lg">Otimização máxima de salas e horários na <strong className="text-foreground">{tenant?.nome}</strong>.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 border-border font-black text-[10px] uppercase tracking-widest bg-card hover:bg-muted transition-all">
                        <Filter className="w-4 h-4 mr-2" /> Filtrar Prof.
                    </Button>
                    <Button className="h-16 px-10 rounded-2xl font-black uppercase tracking-tighter text-lg shadow-2xl shadow-[var(--primary)]/30 border-none transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: primaryColor }}>
                        <Plus className="w-5 h-5 mr-1" /> Novo Horário
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <Card className="bg-card border-border shadow-2xl rounded-[3rem] overflow-hidden relative border-2 border-transparent hover:border-border transition-all">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px]">
                        {/* Calendar Header */}
                        <div className="grid grid-cols-7 border-b border-border bg-muted/20">
                            <div className="p-6 border-r border-border text-[10px] font-black text-muted-foreground uppercase flex items-center justify-center tracking-[0.2em]">Horário</div>
                            {daysOfWeek.map((day, idx) => (
                                <div key={idx} className="p-6 border-r border-border last:border-r-0 text-center">
                                    <span className="text-xs font-black uppercase tracking-widest text-foreground">{day}</span>
                                </div>
                            ))}
                        </div>

                        {/* Calendar Body */}
                        {timeSlots.map((slot, sIdx) => (
                            <div key={sIdx} className="grid grid-cols-7 border-b border-border last:border-b-0 group">
                                <div className="p-6 border-r border-border bg-muted/10 flex items-center justify-center text-xs font-black text-muted-foreground tracking-tighter">
                                    {slot}
                                </div>
                                {daysOfWeek.map((_, dIdx) => {
                                    const event = mockEvents.find(e => e.day === dIdx && e.time === slot)
                                    return (
                                        <div
                                            key={dIdx}
                                            className="p-1 border-r border-border last:border-r-0 min-h-[100px] relative hover:bg-muted/30 transition-colors"
                                        >
                                            {event && (
                                                <motion.div
                                                    layoutId={`event-${event.id}`}
                                                    onClick={() => setSelectedEvent(event)}
                                                    whileHover={{ scale: 1.02, rotate: 1 }}
                                                    className={`w-full h-full rounded-2xl p-4 text-white shadow-xl cursor-pointer transition-all flex flex-col justify-between border-2 border-white/10`}
                                                    style={{ backgroundColor: event.color.startsWith('var') ? primaryColor : event.color }}
                                                >
                                                    <div className="space-y-1">
                                                        <div className="text-[11px] font-black uppercase tracking-tight leading-none truncate">{event.name}</div>
                                                        <div className="text-[9px] opacity-70 font-black uppercase tracking-widest">{event.teacher}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-1.5 text-[9px] bg-white/20 px-2 py-1 rounded-full font-black uppercase tracking-tighter">
                                                            <MapPin size={10} /> {event.room}
                                                        </div>
                                                        <Sparkles size={12} className="opacity-40" />
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
            <div className="flex flex-wrap gap-4 p-6 bg-muted/20 rounded-[2rem] border border-dashed border-border">
                <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm text-[10px] font-black uppercase tracking-[0.1em]">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} /> Baby & Kids
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm text-[10px] font-black uppercase tracking-[0.1em]">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#c29493' }} /> Iniciante
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm text-[10px] font-black uppercase tracking-[0.1em]">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7d3e37' }} /> Avançado
                </div>
            </div>

            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent className="sm:max-w-md bg-card border-border rounded-[3rem] p-10">
                    <DialogHeader>
                        <div className="flex flex-col items-center text-center gap-6 mb-8 pt-4">
                            <div
                                className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-transform hover:rotate-6`}
                                style={{ backgroundColor: selectedEvent?.color.startsWith('var') ? primaryColor : selectedEvent?.color }}
                            >
                                <FullCalendar size={48} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-2">
                                <DialogTitle className="text-3xl font-black uppercase tracking-tighter leading-none">{selectedEvent?.name}</DialogTitle>
                                <DialogDescription className="font-black uppercase tracking-widest text-[10px]" style={{ color: primaryColor }}>Mestra Da Aula: {selectedEvent?.teacher}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[1.5rem] bg-muted/30 border border-border/50">
                                <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2">Horário Real</div>
                                <div className="text-sm font-black flex items-center gap-2">
                                    <Clock size={16} style={{ color: primaryColor }} /> {selectedEvent?.time}
                                </div>
                            </div>
                            <div className="p-6 rounded-[1.5rem] bg-muted/30 border border-border/50">
                                <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2">Ambiente</div>
                                <div className="text-sm font-black flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500" /> {selectedEvent?.room}
                                </div>
                            </div>
                        </div>

                        <Card className="bg-muted/10 border-border p-6 rounded-[2rem] border-dashed">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Users size={16} /> Alunas Matriculadas
                                </span>
                                <Badge className="bg-foreground text-background font-black py-1 px-4 rounded-full">12 / 15</Badge>
                            </div>
                            <div className="flex -space-x-4 items-center">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-card bg-neutral-200" />
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-card bg-neutral-900 flex items-center justify-center text-xs text-white font-black">+7</div>
                            </div>
                        </Card>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-6">
                        <Button
                            onClick={() => setIsNotifyModalOpen(true)}
                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Bell size={18} /> Notificar Turma
                        </Button>
                        <Button variant="ghost" className="h-14 w-14 p-0 rounded-2xl text-destructive hover:bg-destructive/10">
                            <Trash2 size={24} />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Notification Modal */}
            <Dialog open={isNotifyModalOpen} onOpenChange={() => setIsNotifyModalOpen(false)}>
                <DialogContent className="sm:max-w-md bg-card border-border rounded-[3rem] p-10">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Disparo de Notificação</DialogTitle>
                        <DialogDescription className="font-medium text-sm mt-2">
                            Aviso automático para os pais da turma <strong style={{ color: primaryColor }}>{selectedEvent?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Canal de Comunicação</label>
                            <div className="flex gap-3">
                                <Button className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                    WhatsApp
                                </Button>
                                <Button variant="outline" className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-border bg-muted/50">
                                    App Push
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground font-black">Conteúdo da Mensagem</label>
                            <textarea
                                className="w-full min-h-[120px] bg-muted/30 border border-border rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                                defaultValue={`Olá! Passando para lembrar da aula de ${selectedEvent?.name} hoje às ${selectedEvent?.time} na ${selectedEvent?.room}. Esperamos vocês 🩰✨`}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-2xl gap-3 transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: primaryColor }}>
                            <CheckCircle2 size={20} /> Disparar Agora
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

