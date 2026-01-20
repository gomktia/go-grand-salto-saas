'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    UserCheck,
    Search,
    Plus,
    Ruler,
    MoreHorizontal,
    ArrowUpDown,
    Loader2,
    Edit,
    Trash2,
    Calendar,
    UserPlus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getStudents } from '@/app/actions/admin'
import { useTenant } from '@/hooks/use-tenant'
import { StudentDialog } from '@/components/dashboard/student-dialog'
import { DeleteStudentDialog } from '@/components/dashboard/delete-student-dialog'
import { BodyMetricsDialog } from '@/components/dashboard/body-metrics-dialog'
import { ResponsavelDialog } from '@/components/dashboard/responsavel-dialog'
import {
    Phone,
    Pencil
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Student = {
    id: string
    data_nascimento: string
    nome_responsavel: string
    contato_responsavel: string
    status_matricula: string
    observacoes_medicas?: string
    created_at: string
    metricas_corpo: Array<{
        busto: number
        cintura: number
        quadril: number
        altura: number
        torso: number
        data_medicao: string
    }>
}

export default function AlunosPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const [studentDialogOpen, setStudentDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [metricsDialogOpen, setMetricsDialogOpen] = useState(false)
    const [responsavelDialogOpen, setResponsavelDialogOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

    const tenant = useTenant()
    const primaryColor = tenant?.primaryColor || '#db2777'

    useEffect(() => {
        loadStudents()
    }, [])

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredStudents(students)
        } else {
            const filtered = students.filter(student =>
                student.nome_responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.contato_responsavel.includes(searchTerm)
            )
            setFilteredStudents(filtered)
        }
    }, [searchTerm, students])

    async function loadStudents() {
        try {
            setIsLoading(true)
            const result = await getStudents()
            setStudents(result.data || [])
            setFilteredStudents(result.data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar alunos')
            console.error('Erro ao carregar alunos:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddStudent = () => {
        setSelectedStudent(null)
        setStudentDialogOpen(true)
    }

    const handleEditStudent = (student: Student) => {
        setSelectedStudent(student)
        setStudentDialogOpen(true)
    }

    const handleDeleteStudent = (student: Student) => {
        setSelectedStudent(student)
        setDeleteDialogOpen(true)
    }

    const handleManageMetrics = (student: Student) => {
        setSelectedStudent(student)
        setMetricsDialogOpen(true)
    }

    const handleManageResponsaveis = (student: Student) => {
        setSelectedStudent(student)
        setResponsavelDialogOpen(true)
    }

    const handleSuccess = () => {
        loadStudents()
        setSelectedStudent(null)
    }

    const calculateAge = (birthDate: string) => {
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }
        return age
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Núcleo de Gestão Estudantil
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                        Controle de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Alunos</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleAddStudent}
                        style={{ backgroundColor: primaryColor }}
                        className="h-10 px-6 rounded-xl font-bold text-[10px] text-white shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-none"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        NOVO ALUNO
                    </Button>
                </div>
            </div>

            {/* Quick Stats & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Card className="lg:col-span-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-lg relative group">
                    <div className="space-y-3">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Busca Inteligente</div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Nome ou contato..."
                                className="pl-9 h-10 rounded-xl bg-zinc-100 dark:bg-black/40 border-none focus-visible:ring-1 focus-visible:ring-rose-500/50 transition-all text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-rose-500/30 transition-all">
                        <div className="flex flex-row items-center justify-between pb-1">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Total</div>
                            <div className="p-1.5 rounded-lg bg-blue-500/10">
                                <Users className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-zinc-900 dark:text-white">
                            {students.length}
                        </div>
                        <div className="text-[9px] text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                            Ativos no Sistema
                        </div>
                    </Card>

                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-rose-500/30 transition-all">
                        <div className="flex flex-row items-center justify-between pb-1">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Matrículas</div>
                            <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-zinc-900 dark:text-white">
                            {students.filter(s => s.status_matricula === 'ativo').length}
                        </div>
                        <div className="text-[9px] text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                            Status Regular
                        </div>
                    </Card>

                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-rose-500/30 transition-all">
                        <div className="flex flex-row items-center justify-between pb-1">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Métricas</div>
                            <div className="p-1.5 rounded-lg bg-amber-500/10">
                                <Ruler className="w-3.5 h-3.5 text-amber-500" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-zinc-900 dark:text-white">
                            {students.filter(s => (s.metricas_corpo?.length || 0) > 0).length}
                        </div>
                        <div className="text-[9px] text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                            Acompanhamento
                        </div>
                    </Card>
                </div>
            </div>

            {/* Table Container */}
            <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 overflow-hidden rounded-[2rem] shadow-xl">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-24 space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: primaryColor }} />
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-500">Sincronizando Base de Dados...</p>
                    </div>
                ) : error ? (
                    <div className="p-24 text-center">
                        <p className="text-red-600 dark:text-red-400 font-bold mb-4">{error}</p>
                        <Button onClick={loadStudents} variant="outline" className="rounded-2xl h-12 px-8 border-neutral-300 dark:border-neutral-700 font-bold uppercase text-[10px] tracking-widest">
                            Tentar Novamente
                        </Button>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-20 h-20 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-neutral-400" />
                        </div>
                        <p className="text-neutral-900 dark:text-white font-black uppercase text-xl tracking-tighter mb-2">Sem resultados</p>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-10 max-w-xs mx-auto">Não encontramos nenhum aluno com esta busca. Tente palavras-chave diferentes.</p>
                        <Button onClick={() => setSearchTerm('')} variant="outline" className="rounded-2xl h-12 px-8 border-neutral-300 dark:border-neutral-700 font-bold uppercase text-[10px] tracking-widest transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            Limpar Filtros
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-white/[0.02]">
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Identidade</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Contato</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Idade</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Status</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Métricas</th>
                                    <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {filteredStudents.map((student) => {
                                    const latestMetric = student.metricas_corpo?.[0]
                                    const age = calculateAge(student.data_nascimento)

                                    return (
                                        <tr key={student.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-all group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-zinc-100 dark:border-zinc-800">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.nome_responsavel}`} />
                                                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold">
                                                            {student.nome_responsavel.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-tight">{student.nome_responsavel}</p>
                                                        {student.observacoes_medicas && (
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                                <span className="text-[9px] text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest">Alerta Médico</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                                                        <Phone className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{student.contato_responsavel}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-tighter italic">
                                                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                                    {age} Anos
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <Badge className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border-none
                                                    ${student.status_matricula === 'ativo'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        : student.status_matricula === 'pendente'
                                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                            : 'bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'
                                                    }`}>
                                                    {student.status_matricula}
                                                </Badge>
                                            </td>
                                            <td className="p-6">
                                                {latestMetric ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center">
                                                            <Ruler className="w-4 h-4 text-pink-500" />
                                                        </div>
                                                        <div className="text-xs font-black font-mono tracking-tighter text-zinc-700 dark:text-zinc-300">
                                                            {latestMetric.busto} / {latestMetric.cintura} / {latestMetric.quadril}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleManageMetrics(student)}
                                                        variant="ghost"
                                                        className="text-[10px] text-pink-600 dark:text-pink-400 hover:text-pink-500 font-black uppercase tracking-[0.2em] p-0 h-auto underline underline-offset-4"
                                                    >
                                                        Adicionar
                                                    </Button>
                                                )}
                                            </td>
                                            <td className="p-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-all outline-none border-none">
                                                            <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-3 py-2">Comandos</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 mx-1" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditStudent(student)}
                                                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-pink-500 hover:text-white transition-all outline-none border-none"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                            Editar Perfil
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageMetrics(student)}
                                                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-blue-500 hover:text-white transition-all outline-none border-none"
                                                        >
                                                            <Ruler className="w-4 h-4" />
                                                            Métricas Pro
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageResponsaveis(student)}
                                                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-violet-500 hover:text-white transition-all outline-none border-none"
                                                        >
                                                            <UserPlus className="w-4 h-4" />
                                                            Responsáveis
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 mx-1" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteStudent(student)}
                                                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-red-500 hover:text-white transition-all text-red-500 outline-none border-none"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Excluir Aluno
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Dialogs */}
            <StudentDialog
                open={studentDialogOpen}
                onOpenChange={setStudentDialogOpen}
                student={selectedStudent}
                onSuccess={handleSuccess}
            />

            {selectedStudent && (
                <>
                    <DeleteStudentDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        studentId={selectedStudent.id}
                        studentName={selectedStudent.nome_responsavel}
                        onSuccess={handleSuccess}
                    />

                    <BodyMetricsDialog
                        open={metricsDialogOpen}
                        onOpenChange={setMetricsDialogOpen}
                        studentId={selectedStudent.id}
                        studentName={selectedStudent.nome_responsavel}
                        currentMetrics={selectedStudent.metricas_corpo?.[0]}
                        onSuccess={handleSuccess}
                    />

                    <ResponsavelDialog
                        open={responsavelDialogOpen}
                        onOpenChange={setResponsavelDialogOpen}
                        estudanteId={selectedStudent.id}
                        estudanteNome={selectedStudent.nome_responsavel}
                        onSuccess={handleSuccess}
                    />
                </>
            )}
        </div>
    )
}
