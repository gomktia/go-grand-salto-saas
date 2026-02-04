'use client'

import React, { useState, useEffect } from 'react'
import { getMinhasTurmas, registrarFrequencia } from '@/app/actions/professor'
import { toast } from 'sonner'
import {
    CheckCircle2,
    XCircle,
    Calendar,
    Clock,
    Loader2,
    BookOpen,
    Users,
    Save,
    ChevronDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTenant } from '@/hooks/use-tenant'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'

export default function ProfessorDiarioPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [turmas, setTurmas] = useState<any[]>([])
    const [selectedTurma, setSelectedTurma] = useState<any>(null)
    const [attendance, setAttendance] = useState<Record<string, boolean>>({})

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            setIsLoading(true)
            const result = await getMinhasTurmas()
            setTurmas(result.data)
            if (result.data.length > 0) {
                selectTurma(result.data[0])
            }
        } catch (error) {
            toast.error('Erro ao carregar turmas')
        } finally {
            setIsLoading(false)
        }
    }

    function selectTurma(turma: any) {
        setSelectedTurma(turma)
        const initial: Record<string, boolean> = {}
        turma.matriculas_turmas?.forEach((m: any) => {
            initial[m.estudantes.id] = false
        })
        setAttendance(initial)
    }

    const toggleAttendance = (estudanteId: string) => {
        setAttendance(prev => ({
            ...prev,
            [estudanteId]: !prev[estudanteId]
        }))
    }

    const markAllPresent = () => {
        const updated: Record<string, boolean> = {}
        selectedTurma?.matriculas_turmas?.forEach((m: any) => {
            updated[m.estudantes.id] = true
        })
        setAttendance(updated)
    }

    const markAllAbsent = () => {
        const updated: Record<string, boolean> = {}
        selectedTurma?.matriculas_turmas?.forEach((m: any) => {
            updated[m.estudantes.id] = false
        })
        setAttendance(updated)
    }

    const handleSaveAttendance = async () => {
        if (!selectedTurma) return

        const presencas = Object.entries(attendance).map(([id, present]) => ({
            estudante_id: id,
            presente: present
        }))

        try {
            setIsSaving(true)
            await registrarFrequencia({
                turma_id: selectedTurma.id,
                presencas
            })
            toast.success('Diario de classe salvo com sucesso!')
        } catch (error) {
            toast.error('Erro ao salvar diario')
        } finally {
            setIsSaving(false)
        }
    }

    const presentCount = Object.values(attendance).filter(Boolean).length
    const totalCount = Object.keys(attendance).length

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Carregando diario de classe...
                </p>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-5xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Registro de Presenca
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Diario de <span style={{ color: primaryColor }}>Classe</span>
                    </h1>
                    <p className="text-muted-foreground font-bold text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <Link href="/professor">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                        Voltar ao Dashboard
                    </Button>
                </Link>
            </div>

            {turmas.length === 0 ? (
                <Card className="bg-card border-border rounded-[3rem] p-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Nenhuma turma encontrada</h3>
                    <p className="text-muted-foreground">Voce ainda nao possui turmas atribuidas.</p>
                </Card>
            ) : (
                <>
                    {/* Turma Selector */}
                    <Card className="bg-card border-border shadow-sm rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg font-black uppercase tracking-tight">Selecione a Turma</CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest">
                                        Escolha a turma para registrar a presenca
                                    </CardDescription>
                                </div>
                                <Select
                                    value={selectedTurma?.id}
                                    onValueChange={(value) => {
                                        const turma = turmas.find(t => t.id === value)
                                        if (turma) selectTurma(turma)
                                    }}
                                >
                                    <SelectTrigger className="w-full md:w-[300px] h-14 rounded-2xl font-bold">
                                        <SelectValue placeholder="Selecione uma turma" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {turmas.map((turma) => (
                                            <SelectItem key={turma.id} value={turma.id}>
                                                {turma.nome} - {turma.nivel}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Attendance Card */}
                    {selectedTurma && (
                        <Card className="bg-card border-border shadow-sm rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-8 border-b border-border/50 bg-muted/20">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl"
                                            style={{ backgroundColor: selectedTurma.cor_etiqueta || primaryColor }}
                                        >
                                            {selectedTurma.nome?.charAt(0)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                                                {selectedTurma.nome}
                                            </CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {totalCount} alunos
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                    {presentCount} presentes
                                                </span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={markAllPresent}
                                            className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Todos Presentes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={markAllAbsent}
                                            className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Limpar
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                {selectedTurma.matriculas_turmas?.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                                        <p className="text-muted-foreground font-bold">Nenhum aluno matriculado nesta turma</p>
                                    </div>
                                ) : (
                                    selectedTurma.matriculas_turmas?.map((m: any) => (
                                        <div
                                            key={m.estudantes.id}
                                            onClick={() => toggleAttendance(m.estudantes.id)}
                                            className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${
                                                attendance[m.estudantes.id]
                                                    ? 'bg-emerald-500/5 border-emerald-500/30'
                                                    : 'bg-muted/20 border-transparent hover:border-muted-foreground/20'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                                                    <AvatarImage src={m.estudantes.perfis?.avatar_url} />
                                                    <AvatarFallback className="bg-muted font-black" style={{ color: primaryColor }}>
                                                        {m.estudantes.nome_responsavel?.charAt(0) || 'A'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-black text-lg uppercase tracking-tight">
                                                        {m.estudantes.nome_responsavel || 'Aluno'}
                                                    </p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                        {m.estudantes.perfis?.full_name || 'Nome completo'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {attendance[m.estudantes.id] ? (
                                                    <Badge className="bg-emerald-500 text-white border-none px-4 py-2 font-black text-[10px] uppercase tracking-widest">
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Presente
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground px-4 py-2 font-black text-[10px] uppercase tracking-widest">
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Ausente
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* Save Button */}
                                {selectedTurma.matriculas_turmas?.length > 0 && (
                                    <Button
                                        onClick={handleSaveAttendance}
                                        disabled={isSaving}
                                        className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl transition-all hover:scale-[1.02] text-white mt-8"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-6 h-6 animate-spin mr-3" />
                                        ) : (
                                            <Save className="w-6 h-6 mr-3" />
                                        )}
                                        Salvar Diario de Classe
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    )
}
