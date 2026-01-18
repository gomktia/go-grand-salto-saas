'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    Search,
    Plus,
    Ruler,
    MoreHorizontal,
    ArrowUpDown,
    Loader2,
    Edit,
    Trash2,
    Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getStudents } from '@/app/actions/admin'
import { StudentDialog } from '@/components/dashboard/student-dialog'
import { DeleteStudentDialog } from '@/components/dashboard/delete-student-dialog'
import { BodyMetricsDialog } from '@/components/dashboard/body-metrics-dialog'
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

    // Dialogs state
    const [studentDialogOpen, setStudentDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [metricsDialogOpen, setMetricsDialogOpen] = useState(false)

    // Selected student for editing/deleting
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

    useEffect(() => {
        loadStudents()
    }, [])

    useEffect(() => {
        // Filtrar estudantes baseado na busca
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
        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestão de Alunos</h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        Acompanhe matrículas e métricas corporais para figurinos.
                    </p>
                </div>
                <Button
                    onClick={handleAddStudent}
                    className="bg-pink-600 hover:bg-pink-500 gap-2 h-11 px-6 rounded-xl font-semibold"
                >
                    <Plus className="w-4 h-4" />
                    Novo Aluno
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
                    <Input
                        placeholder="Buscar por responsável ou contato..."
                        className="pl-10 bg-neutral-900/50 border-white/5 h-11 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="border-white/5 gap-2 h-11 px-6 rounded-xl">
                    <ArrowUpDown className="w-4 h-4" />
                    Ordenar
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-neutral-900/50 border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total de Alunos</p>
                            <p className="text-3xl font-bold text-white mt-2">{students.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-pink-500" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-neutral-900/50 border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Ativos</p>
                            <p className="text-3xl font-bold text-emerald-500 mt-2">
                                {students.filter(s => s.status_matricula === 'ativo').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-500" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-neutral-900/50 border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Com Métricas</p>
                            <p className="text-3xl font-bold text-blue-500 mt-2">
                                {students.filter(s => s.metricas_corpo && s.metricas_corpo.length > 0).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Ruler className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Table */}
            <Card className="bg-neutral-900/50 border-white/5 overflow-hidden rounded-2xl">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <p className="text-red-400 text-sm mb-4">{error}</p>
                        <Button onClick={loadStudents} variant="outline" className="border-white/10">
                            Tentar Novamente
                        </Button>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center">
                        {searchTerm ? (
                            <>
                                <Search className="w-12 h-12 mx-auto text-neutral-600 mb-4" />
                                <p className="text-neutral-400 font-medium mb-2">Nenhum resultado encontrado</p>
                                <p className="text-neutral-500 text-sm mb-6">
                                    Tente ajustar sua busca
                                </p>
                                <Button onClick={() => setSearchTerm('')} variant="outline" className="border-white/10">
                                    Limpar Busca
                                </Button>
                            </>
                        ) : (
                            <>
                                <Users className="w-12 h-12 mx-auto text-neutral-600 mb-4" />
                                <p className="text-neutral-400 font-medium mb-2">Nenhum aluno cadastrado</p>
                                <p className="text-neutral-500 text-sm mb-6">Comece adicionando seu primeiro estudante</p>
                                <Button onClick={handleAddStudent} className="bg-pink-600 hover:bg-pink-500">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Adicionar Primeiro Aluno
                                </Button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Responsável</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Contato</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Idade</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Status</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Métricas (B/C/Q)</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Última Medição</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-neutral-400 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => {
                                    const latestMetric = student.metricas_corpo?.[0]
                                    const age = calculateAge(student.data_nascimento)

                                    return (
                                        <tr key={student.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {student.nome_responsavel.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white">{student.nome_responsavel}</p>
                                                        {student.observacoes_medicas && (
                                                            <p className="text-xs text-amber-400">⚠ Obs. médica</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-neutral-300">{student.contato_responsavel}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-sm text-neutral-300">
                                                    <Calendar className="w-3 h-3 text-neutral-500" />
                                                    {age} anos
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        student.status_matricula === 'ativo'
                                                            ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                                                            : student.status_matricula === 'pendente'
                                                            ? 'text-amber-400 border-amber-500/20 bg-amber-500/10'
                                                            : 'text-neutral-500 border-white/10'
                                                    }
                                                >
                                                    {student.status_matricula}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {latestMetric ? (
                                                    <div className="flex items-center gap-2 text-sm font-mono text-neutral-300">
                                                        <Ruler className="w-3 h-3 text-pink-500" />
                                                        {latestMetric.busto}/{latestMetric.cintura}/{latestMetric.quadril}
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleManageMetrics(student)}
                                                        className="text-xs text-pink-400 hover:text-pink-300 underline"
                                                    >
                                                        Adicionar
                                                    </button>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-neutral-500">
                                                {latestMetric?.data_medicao
                                                    ? new Date(latestMetric.data_medicao).toLocaleDateString('pt-BR')
                                                    : '-'
                                                }
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-lg">
                                                            <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-neutral-900 border-white/10 w-48">
                                                        <DropdownMenuLabel className="text-neutral-400 text-xs">Ações</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditStudent(student)}
                                                            className="text-white hover:bg-white/5 cursor-pointer"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Editar Dados
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageMetrics(student)}
                                                            className="text-white hover:bg-white/5 cursor-pointer"
                                                        >
                                                            <Ruler className="w-4 h-4 mr-2" />
                                                            Gerenciar Métricas
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteStudent(student)}
                                                            className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Deletar Aluno
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
                </>
            )}
        </div>
    )
}
