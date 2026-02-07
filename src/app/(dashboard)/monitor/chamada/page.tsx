'use client'

import React, { useState, useEffect } from 'react'
import { getMinhasTurmasMonitora, getAlunosTurmaMonitora, registrarPresencaMonitora } from '@/app/actions/monitora'
import { toast } from 'sonner'
import {
    CheckCircle2,
    XCircle,
    Calendar,
    Loader2,
    Users,
    Save,
    ClipboardCheck,
    AlertCircle
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

export default function MonitoraChamadaPage() {
    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#ec4899'
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingAlunos, setIsLoadingAlunos] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [turmas, setTurmas] = useState<any[]>([])
    const [selectedTurmaId, setSelectedTurmaId] = useState<string>('')
    const [selectedTurma, setSelectedTurma] = useState<any>(null)
    const [alunos, setAlunos] = useState<any[]>([])
    const [permissoes, setPermissoes] = useState<any>(null)
    const [attendance, setAttendance] = useState<Record<string, boolean>>({})

    useEffect(() => {
        loadTurmas()
    }, [])

    useEffect(() => {
        if (selectedTurmaId) {
            loadAlunos(selectedTurmaId)
        }
    }, [selectedTurmaId])

    async function loadTurmas() {
        try {
            setIsLoading(true)
            const result = await getMinhasTurmasMonitora()
            // Filtrar apenas turmas com permissão de chamada
            const turmasComPermissao = result.data.filter((v: any) => v.pode_chamada)
            setTurmas(turmasComPermissao)

            if (turmasComPermissao.length > 0) {
                const firstTurma = turmasComPermissao[0].turma
                setSelectedTurmaId(Array.isArray(firstTurma) ? firstTurma[0]?.id : firstTurma?.id)
                setSelectedTurma(turmasComPermissao[0])
            }
        } catch (error: any) {
            toast.error(error.message || 'Erro ao carregar turmas')
        } finally {
            setIsLoading(false)
        }
    }

    async function loadAlunos(turmaId: string) {
        try {
            setIsLoadingAlunos(true)
            const result = await getAlunosTurmaMonitora(turmaId)
            setAlunos(result.data)
            setPermissoes(result.permissoes)

            // Initialize attendance
            const initial: Record<string, boolean> = {}
            result.data.forEach((m: any) => {
                initial[m.estudante.id] = false
            })
            setAttendance(initial)

            // Update selected turma
            const turma = turmas.find(v => {
                const t = v.turma
                const tId = Array.isArray(t) ? t[0]?.id : t?.id
                return tId === turmaId
            })
            setSelectedTurma(turma)
        } catch (error: any) {
            toast.error(error.message || 'Erro ao carregar alunos')
        } finally {
            setIsLoadingAlunos(false)
        }
    }

    const toggleAttendance = (estudanteId: string) => {
        setAttendance(prev => ({
            ...prev,
            [estudanteId]: !prev[estudanteId]
        }))
    }

    const markAllPresent = () => {
        const updated: Record<string, boolean> = {}
        alunos.forEach((m: any) => {
            updated[m.estudante.id] = true
        })
        setAttendance(updated)
    }

    const markAllAbsent = () => {
        const updated: Record<string, boolean> = {}
        alunos.forEach((m: any) => {
            updated[m.estudante.id] = false
        })
        setAttendance(updated)
    }

    const handleSaveAttendance = async () => {
        if (!selectedTurmaId) return

        const presencas = Object.entries(attendance).map(([id, present]) => ({
            estudante_id: id,
            presente: present
        }))

        try {
            setIsSaving(true)
            const result = await registrarPresencaMonitora({
                turma_id: selectedTurmaId,
                presencas
            })
            toast.success(`Chamada salva! ${result.presentes} alunos presentes.`)
        } catch (error: any) {
            toast.error(error.message || 'Erro ao salvar chamada')
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
                    Carregando...
                </p>
            </div>
        )
    }

    if (turmas.length === 0) {
        return (
            <div className="p-4 lg:p-10 max-w-3xl mx-auto">
                <Card className="bg-card border-border rounded-[3rem] p-12 text-center">
                    <AlertCircle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Sem Permissao de Chamada</h3>
                    <p className="text-muted-foreground mb-6">
                        Voce nao possui permissao para fazer chamada em nenhuma turma.
                        Fale com a diretora para solicitar acesso.
                    </p>
                    <Link href="/monitor">
                        <Button variant="outline" className="rounded-2xl font-bold">
                            Voltar ao Dashboard
                        </Button>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-10 space-y-10 max-w-4xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <Badge variant="outline" className="border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5 px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.2em] rounded-full">
                        Chamada Digital
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                        Registro de <span style={{ color: primaryColor }}>Presenca</span>
                    </h1>
                    <p className="text-muted-foreground font-bold text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <Link href="/monitor">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                        Voltar
                    </Button>
                </Link>
            </div>

            {/* Turma Selector */}
            <Card className="bg-card border-border shadow-sm rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight">Selecione a Turma</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest">
                                Turmas com permissao de chamada
                            </CardDescription>
                        </div>
                        <Select
                            value={selectedTurmaId}
                            onValueChange={setSelectedTurmaId}
                        >
                            <SelectTrigger className="w-full md:w-[300px] h-14 rounded-2xl font-bold">
                                <SelectValue placeholder="Selecione uma turma" />
                            </SelectTrigger>
                            <SelectContent>
                                {turmas.map((vinculo) => {
                                    const t = vinculo.turma
                                    const tId = Array.isArray(t) ? t[0]?.id : t?.id
                                    const tNome = Array.isArray(t) ? t[0]?.nome : t?.nome
                                    const tNivel = Array.isArray(t) ? t[0]?.nivel : t?.nivel
                                    return (
                                        <SelectItem key={tId} value={tId}>
                                            {tNome} - {tNivel}
                                        </SelectItem>
                                    )
                                })}
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
                                    style={{ backgroundColor: selectedTurma.turma?.cor_etiqueta || primaryColor }}
                                >
                                    <ClipboardCheck className="w-7 h-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                                        {Array.isArray(selectedTurma.turma) ? selectedTurma.turma[0]?.nome : selectedTurma.turma?.nome}
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
                        {isLoadingAlunos ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
                            </div>
                        ) : alunos.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                                <p className="text-muted-foreground font-bold">Nenhum aluno matriculado nesta turma</p>
                            </div>
                        ) : (
                            alunos.map((m: any) => (
                                <div
                                    key={m.estudante.id}
                                    onClick={() => toggleAttendance(m.estudante.id)}
                                    className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${attendance[m.estudante.id]
                                            ? 'bg-emerald-500/5 border-emerald-500/30'
                                            : 'bg-muted/20 border-transparent hover:border-muted-foreground/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                                            <AvatarImage src={m.estudante.perfis?.avatar_url} />
                                            <AvatarFallback className="bg-muted font-black" style={{ color: primaryColor }}>
                                                {m.estudante.perfis?.full_name?.charAt(0) || m.estudante.nome_responsavel?.charAt(0) || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-black text-lg uppercase tracking-tight">
                                                {m.estudante.perfis?.full_name || m.estudante.nome_responsavel || 'Aluno'}
                                            </p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                Matricula ativa
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {attendance[m.estudante.id] ? (
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
                        {alunos.length > 0 && (
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
                                Salvar Chamada
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
