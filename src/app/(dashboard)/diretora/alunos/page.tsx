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

    const [studentDialogOpen, setStudentDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [metricsDialogOpen, setMetricsDialogOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Gestao de Alunos</h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                        Acompanhe matriculas e metricas corporais para figurinos.
                    </p>
                </div>
                <Button
                    onClick={handleAddStudent}
                    className="bg-pink-600 hover:bg-pink-500 text-white gap-2 h-10 px-5 rounded-xl font-semibold shadow-lg shadow-pink-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Novo Aluno
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                        placeholder="Buscar por responsavel ou contato..."
                        className="pl-10 h-10 rounded-xl
                            bg-white dark:bg-neutral-800
                            border-neutral-300 dark:border-neutral-700
                            text-neutral-900 dark:text-white
                            placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2 h-10 px-5 rounded-xl
                    border-neutral-300 dark:border-neutral-700
                    text-neutral-700 dark:text-neutral-200
                    hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <ArrowUpDown className="w-4 h-4" />
                    Ordenar
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Total de Alunos
                            </p>
                            <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{students.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Ativos
                            </p>
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                {students.filter(s => s.status_matricula === 'ativo').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Com Metricas
                            </p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {students.filter(s => s.metricas_corpo && s.metricas_corpo.length > 0).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                            <Ruler className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Table */}
            <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden rounded-xl shadow-sm">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
                        <Button onClick={loadStudents} variant="outline" className="border-neutral-300 dark:border-neutral-700">
                            Tentar Novamente
                        </Button>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center">
                        {searchTerm ? (
                            <>
                                <Search className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                                <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">Nenhum resultado encontrado</p>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Tente ajustar sua busca</p>
                                <Button onClick={() => setSearchTerm('')} variant="outline" className="border-neutral-300 dark:border-neutral-700">
                                    Limpar Busca
                                </Button>
                            </>
                        ) : (
                            <>
                                <Users className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                                <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">Nenhum aluno cadastrado</p>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Comece adicionando seu primeiro estudante</p>
                                <Button onClick={handleAddStudent} className="bg-pink-600 hover:bg-pink-500 text-white">
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
                                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                                        Responsavel
                                    </th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                                        Contato
                                    </th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                                        Idade
                                    </th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                                        Status
                                    </th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                                        Metricas (B/C/Q)
                                    </th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                                        Ultima Medicao
                                    </th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 text-right">
                                        Acoes
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => {
                                    const latestMetric = student.metricas_corpo?.[0]
                                    const age = calculateAge(student.data_nascimento)

                                    return (
                                        <tr key={student.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                        {student.nome_responsavel.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-neutral-900 dark:text-white">{student.nome_responsavel}</p>
                                                        {student.observacoes_medicas && (
                                                            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Obs. medica</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-neutral-700 dark:text-neutral-300">{student.contato_responsavel}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                                    {age} anos
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={`text-xs px-2.5 py-1 rounded-full font-medium
                                                    ${student.status_matricula === 'ativo'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                                        : student.status_matricula === 'pendente'
                                                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                                                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-600'
                                                    }`}>
                                                    {student.status_matricula}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {latestMetric ? (
                                                    <div className="flex items-center gap-2 text-sm font-mono text-neutral-700 dark:text-neutral-300">
                                                        <Ruler className="w-3.5 h-3.5 text-pink-500" />
                                                        {latestMetric.busto}/{latestMetric.cintura}/{latestMetric.quadril}
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleManageMetrics(student)}
                                                        className="text-sm text-pink-600 dark:text-pink-400 hover:text-pink-500 font-medium"
                                                    >
                                                        + Adicionar
                                                    </button>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-neutral-500 dark:text-neutral-400">
                                                {latestMetric?.data_medicao
                                                    ? new Date(latestMetric.data_medicao).toLocaleDateString('pt-BR')
                                                    : '-'
                                                }
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg
                                                            text-neutral-500 hover:text-neutral-700 dark:hover:text-white
                                                            hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48
                                                        bg-white dark:bg-neutral-900
                                                        border-neutral-200 dark:border-neutral-700
                                                        shadow-lg rounded-xl">
                                                        <DropdownMenuLabel className="text-neutral-500 dark:text-neutral-400 text-xs">
                                                            Acoes
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditStudent(student)}
                                                            className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-lg"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Editar Dados
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleManageMetrics(student)}
                                                            className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer rounded-lg"
                                                        >
                                                            <Ruler className="w-4 h-4 mr-2" />
                                                            Gerenciar Metricas
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-700" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteStudent(student)}
                                                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer rounded-lg"
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
