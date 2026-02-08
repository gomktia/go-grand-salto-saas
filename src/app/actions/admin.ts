'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import {
    studentSchema,
    studentUpdateSchema,
    bodyMetricsSchema,
    costumeSchema,
    turmaSchema,
    turmaUpdateSchema,
    agendaAulaSchema,
    agendaAulaUpdateSchema,
    matriculaSchema,
    tenantSettingsSchema
} from '@/lib/validations/admin'

/**
 * Helper para obter usuário autenticado e seu perfil
 */
async function getAuthenticatedUser() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('Não autenticado')
    }

    const { data: perfil, error: perfilError } = await supabase
        .from('perfis')
        .select('role, escola_id, full_name')
        .eq('id', user.id)
        .single()

    if (perfilError || !perfil) {
        throw new Error('Perfil não encontrado')
    }

    return { user, perfil }
}

/**
 * Helper para verificar se usuário é diretora
 */
function requireDiretora(role: string) {
    if (role !== 'diretora' && role !== 'super_admin') {
        throw new Error('Acesso negado. Apenas diretoras podem executar esta ação.')
    }
}

export async function createStudent(rawData: {
    data_nascimento: string
    nome_responsavel: string
    contato_responsavel: string
    status_matricula: string
    observacoes_medicas?: string
}) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()

    const validated = studentSchema.parse(rawData)

    // Tenant Isolation: Sempre usar escola_id do perfil autenticado
    const { data, error } = await supabase
        .from('estudantes')
        .insert([{
            escola_id: perfil.escola_id,
            data_nascimento: validated.data_nascimento,
            nome_responsavel: validated.nome_responsavel,
            contato_responsavel: validated.contato_responsavel,
            status_matricula: validated.status_matricula,
            observacoes_medicas: validated.observacoes_medicas || null,
        }])
        .select()
        .single()

    if (error) {
        console.error('Erro ao criar estudante:', error)
        throw new Error(`Erro ao criar estudante: ${error.message}`)
    }

    revalidatePath('/diretora/alunos')
    return { success: true, data }
}

export async function updateStudent(rawData: {
    id: string
    data_nascimento: string
    nome_responsavel: string
    contato_responsavel: string
    status_matricula: string
    observacoes_medicas?: string
}) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()
    const validated = studentUpdateSchema.parse(rawData)

    // Tenant Isolation: Verificar que o estudante pertence à escola do usuário
    const { data: existing } = await supabase
        .from('estudantes')
        .select('id')
        .eq('id', validated.id)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (!existing) {
        throw new Error('Estudante não encontrado ou você não tem permissão para editá-lo')
    }

    const { data, error } = await supabase
        .from('estudantes')
        .update({
            data_nascimento: validated.data_nascimento,
            nome_responsavel: validated.nome_responsavel,
            contato_responsavel: validated.contato_responsavel,
            status_matricula: validated.status_matricula,
            observacoes_medicas: validated.observacoes_medicas || null,
        })
        .eq('id', validated.id)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) {
        console.error('Erro ao atualizar estudante:', error)
        throw new Error(`Erro ao atualizar estudante: ${error.message}`)
    }

    revalidatePath('/diretora/alunos')
    return { success: true, data }
}

export async function deleteStudent(studentId: string) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()

    // Tenant Isolation: Verificar que o estudante pertence à escola do usuário
    const { data: existing } = await supabase
        .from('estudantes')
        .select('id, nome_responsavel')
        .eq('id', studentId)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (!existing) {
        throw new Error('Estudante não encontrado ou você não tem permissão para deletá-lo')
    }

    const { error } = await supabase
        .from('estudantes')
        .delete()
        .eq('id', studentId)
        .eq('escola_id', perfil.escola_id)

    if (error) {
        console.error('Erro ao deletar estudante:', error)
        throw new Error(`Erro ao deletar estudante: ${error.message}`)
    }

    revalidatePath('/diretora/alunos')
    return { success: true, message: `Estudante ${existing.nome_responsavel} removido com sucesso` }
}

export async function getStudentById(studentId: string) {
    const { user, perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('estudantes')
        .select(`
            *,
            metricas_corpo (
                id,
                busto,
                cintura,
                quadril,
                altura,
                torso,
                data_medicao
            )
        `)
        .eq('id', studentId)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (error) {
        console.error('Erro ao buscar estudante:', error)
        throw new Error(`Erro ao buscar estudante: ${error.message}`)
    }

    return { success: true, data }
}

export async function updateBodyMetrics(values: any) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()
    const validated = bodyMetricsSchema.parse(values)

    // Tenant Isolation: Garantir que a métrica pertence à escola do usuário
    const { data, error } = await supabase
        .from('metricas_corpo')
        .upsert([{
            ...validated,
            escola_id: perfil.escola_id
        }])
        .select()

    if (error) {
        console.error('Erro ao atualizar métricas:', error)
        throw new Error(`Erro ao atualizar métricas: ${error.message}`)
    }

    revalidatePath('/diretora/alunos')
    return { success: true, data }
}

export async function getStudents() {
    const { user, perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    // Tenant Isolation: Apenas estudantes da escola do usuário
    const { data, error } = await supabase
        .from('estudantes')
        .select(`
            *,
            metricas_corpo (
                busto,
                cintura,
                quadril,
                altura,
                torso,
                data_medicao
            )
        `)
        .eq('escola_id', perfil.escola_id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erro ao buscar estudantes:', error)
        throw new Error(`Erro ao buscar estudantes: ${error.message}`)
    }

    // Normalizar métricas (pegar a mais recente se for array)
    const transformedData = data?.map(estudante => ({
        ...estudante,
        metricas_corpo: Array.isArray(estudante.metricas_corpo) ? estudante.metricas_corpo[0] : estudante.metricas_corpo
    }))

    return { success: true, data: transformedData || [] }
}

export async function getStats() {
    const { perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    // 1. Total de Alunos Ativos
    const { count: totalStudents } = await supabase
        .from('estudantes')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)
        .eq('status_matricula', 'ativo')

    // 2. Total de Turmas
    const { count: totalTurmas } = await supabase
        .from('turmas')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)

    // 3. Novas Matrículas (últimos 30 dias)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { count: newStudents } = await supabase
        .from('estudantes')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)
        .gte('created_at', thirtyDaysAgo)

    // 4. Liquidez / Financeiro (simplificado)
    const mesAtual = new Date().getMonth() + 1
    const anoAtual = new Date().getFullYear()

    const { data: mensalidades } = await supabase
        .from('mensalidades')
        .select('status, valor')
        .eq('ano_referencia', anoAtual)
        .eq('mes_referencia', mesAtual)
        .eq('escola_id', perfil.escola_id)

    const totalExpected = mensalidades?.reduce((acc, m) => acc + Number(m.valor), 0) || 0
    const totalPaid = mensalidades?.filter(m => m.status === 'pago').reduce((acc, m) => acc + Number(m.valor), 0) || 0
    const liquidity = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0

    return {
        success: true,
        data: {
            totalStudents: totalStudents || 0,
            totalTurmas: totalTurmas || 0,
            newStudents: newStudents || 0,
            liquidity: liquidity || 0,
            totalPaid: totalPaid || 0,
            totalExpected: totalExpected || 0
        }
    }
}

// ==================== TURMAS ====================

export async function createTurma(rawData: {
    nome: string
    nivel: string
    vagas_max: number
    cor_etiqueta?: string
    professor_id?: string
}) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()
    const validated = turmaSchema.parse(rawData)

    const { data, error } = await supabase
        .from('turmas')
        .insert([{
            escola_id: perfil.escola_id,
            nome: validated.nome,
            nivel: validated.nivel,
            vagas_max: validated.vagas_max,
            cor_etiqueta: validated.cor_etiqueta || '#ec4899',
            professor_id: validated.professor_id || null,
        }])
        .select()
        .single()

    if (error) {
        console.error('Erro ao criar turma:', error)
        throw new Error(`Erro ao criar turma: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { success: true, data }
}

export async function updateTurma(rawData: {
    id: string
    nome: string
    nivel: string
    vagas_max: number
    cor_etiqueta?: string
    professor_id?: string
}) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()
    const validated = turmaUpdateSchema.parse(rawData)

    // Verificar ownership
    const { data: existing } = await supabase
        .from('turmas')
        .select('id')
        .eq('id', validated.id)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (!existing) {
        throw new Error('Turma não encontrada ou você não tem permissão para editá-la')
    }

    const { data, error } = await supabase
        .from('turmas')
        .update({
            nome: validated.nome,
            nivel: validated.nivel,
            vagas_max: validated.vagas_max,
            cor_etiqueta: validated.cor_etiqueta || '#ec4899',
            professor_id: validated.professor_id || null,
        })
        .eq('id', validated.id)
        .eq('escola_id', perfil.escola_id)
        .select()
        .single()

    if (error) {
        console.error('Erro ao atualizar turma:', error)
        throw new Error(`Erro ao atualizar turma: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { success: true, data }
}

export async function deleteTurma(turmaId: string) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()

    // Verificar ownership
    const { data: existing } = await supabase
        .from('turmas')
        .select('id, nome')
        .eq('id', turmaId)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (!existing) {
        throw new Error('Turma não encontrada ou você não tem permissão para deletá-la')
    }

    const { error } = await supabase
        .from('turmas')
        .delete()
        .eq('id', turmaId)
        .eq('escola_id', perfil.escola_id)

    if (error) {
        console.error('Erro ao deletar turma:', error)
        throw new Error(`Erro ao deletar turma: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { success: true, message: `Turma ${existing.nome} removida com sucesso` }
}

export async function getTurmas() {
    const { user, perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('turmas')
        .select(`
            *,
            perfis:professor_id (
                id,
                full_name
            ),
            matriculas_turmas (
                id,
                status,
                estudantes:estudante_id (
                    id,
                    nome_responsavel,
                    data_nascimento,
                    status_matricula
                )
            ),
            agenda_aulas (
                id,
                dia_semana,
                hora_inicio,
                hora_fim,
                sala
            )
        `)
        .eq('escola_id', perfil.escola_id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erro ao buscar turmas:', error)
        throw new Error(`Erro ao buscar turmas: ${error.message}`)
    }

    // Normalizar dados
    const transformedData = (data as any)?.map((turma: any) => ({
        ...turma,
        professor: Array.isArray(turma.perfis) ? turma.perfis[0] : turma.perfis,
        matriculas: turma.matriculas_turmas?.map((m: any) => ({
            ...m,
            estudante: Array.isArray(m.estudantes) ? m.estudantes[0] : m.estudantes
        }))
    }))

    return { success: true, data: transformedData || [] }
}

export async function getTurmaById(turmaId: string) {
    const { user, perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('turmas')
        .select(`
            *,
            perfis:professor_id (
                id,
                full_name
            ),
            matriculas_turmas (
                id,
                status,
                estudantes (
                    id,
                    nome_responsavel,
                    data_nascimento,
                    status_matricula
                )
            ),
            agenda_aulas (
                id,
                dia_semana,
                hora_inicio,
                hora_fim,
                sala
            )
        `)
        .eq('id', turmaId)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (error) {
        console.error('Erro ao buscar turma:', error)
        throw new Error(`Erro ao buscar turma: ${error.message}`)
    }

    // Normalizar dados
    const transformedData = {
        ...(data as any),
        professor: Array.isArray((data as any).perfis) ? (data as any).perfis[0] : (data as any).perfis,
        matriculas: (data as any).matriculas_turmas?.map((m: any) => ({
            ...m,
            estudante: Array.isArray(m.estudantes) ? m.estudantes[0] : m.estudantes
        }))
    }

    return { success: true, data: transformedData }
}

// ==================== HORÁRIOS/AGENDA ====================

export async function createAgendaAula(rawData: {
    turma_id: string
    dia_semana: number
    hora_inicio: string
    hora_fim: string
    sala?: string
}) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()
    const validated = agendaAulaSchema.parse(rawData)

    // Verificar que a turma pertence à escola
    const { data: turma } = await supabase
        .from('turmas')
        .select('id, escola_id')
        .eq('id', validated.turma_id)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (!turma) {
        throw new Error('Turma não encontrada')
    }

    const { data, error } = await supabase
        .from('agenda_aulas')
        .insert([{
            turma_id: validated.turma_id,
            escola_id: perfil.escola_id,
            dia_semana: validated.dia_semana,
            hora_inicio: validated.hora_inicio,
            hora_fim: validated.hora_fim,
            sala: validated.sala || null,
        }])
        .select()
        .single()

    if (error) {
        console.error('Erro ao criar horário:', error)
        throw new Error(`Erro ao criar horário: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { success: true, data }
}

export async function updateAgendaAula(rawData: {
    id: string
    dia_semana: number
    hora_inicio: string
    hora_fim: string
    sala?: string
}) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()
    const validated = agendaAulaUpdateSchema.parse(rawData)

    // Verificar ownership via turma
    const { data: existing } = await supabase
        .from('agenda_aulas')
        .select('id, escola_id')
        .eq('id', validated.id)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (!existing) {
        throw new Error('Horário não encontrado')
    }

    const { data, error } = await supabase
        .from('agenda_aulas')
        .update({
            dia_semana: validated.dia_semana,
            hora_inicio: validated.hora_inicio,
            hora_fim: validated.hora_fim,
            sala: validated.sala || null,
        })
        .eq('id', validated.id)
        .select()
        .single()

    if (error) {
        console.error('Erro ao atualizar horário:', error)
        throw new Error(`Erro ao atualizar horário: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { success: true, data }
}

export async function deleteAgendaAula(agendaId: string) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()

    // Verificar ownership
    const { data: existing } = await supabase
        .from('agenda_aulas')
        .select('id')
        .eq('id', agendaId)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (!existing) {
        throw new Error('Horário não encontrado')
    }

    const { error } = await supabase
        .from('agenda_aulas')
        .delete()
        .eq('id', agendaId)

    if (error) {
        console.error('Erro ao deletar horário:', error)
        throw new Error(`Erro ao deletar horário: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { success: true }
}

// ==================== MATRÍCULAS ====================

export async function createMatricula(rawData: {
    estudante_id: string
    turma_id: string
    status?: string
}) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()
    const validated = matriculaSchema.parse(rawData)

    // Verificar que turma e estudante pertencem à escola
    const [turmaCheck, estudanteCheck] = await Promise.all([
        supabase.from('turmas').select('id').eq('id', validated.turma_id).eq('escola_id', perfil.escola_id).single(),
        supabase.from('estudantes').select('id').eq('id', validated.estudante_id).eq('escola_id', perfil.escola_id).single()
    ])

    if (!turmaCheck.data || !estudanteCheck.data) {
        throw new Error('Turma ou estudante não encontrado')
    }

    const { data, error } = await supabase
        .from('matriculas_turmas')
        .insert([{
            estudante_id: validated.estudante_id,
            turma_id: validated.turma_id,
            escola_id: perfil.escola_id,
            status: validated.status || 'ativo',
        }])
        .select()
        .single()

    if (error) {
        console.error('Erro ao criar matrícula:', error)
        throw new Error(`Erro ao criar matrícula: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    revalidatePath('/diretora/alunos')
    return { success: true, data }
}

export async function deleteMatricula(matriculaId: string) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()

    // Verificar ownership
    const { data: existing } = await supabase
        .from('matriculas_turmas')
        .select('id')
        .eq('id', matriculaId)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (!existing) {
        throw new Error('Matrícula não encontrada')
    }

    const { error } = await supabase
        .from('matriculas_turmas')
        .delete()
        .eq('id', matriculaId)

    if (error) {
        console.error('Erro ao deletar matrícula:', error)
        throw new Error(`Erro ao deletar matrícula: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    revalidatePath('/diretora/alunos')
    return { success: true }
}

// ============================================
// RECURSOS DE TURMAS (MÍDIA)
// ============================================

import {
    recursoTurmaSchema,
    recursoTurmaUpdateSchema,
    uploadRecursoSchema,
    progressoRecursoSchema,
    videoFileSchema,
    audioFileSchema,
    documentoFileSchema
} from '@/lib/validations/admin'

/**
 * Buscar todos os recursos de uma turma
 */
export async function getRecursosTurma(turmaId: string) {
    const supabase = await createClient()
    const { user, perfil } = await getAuthenticatedUser()

    const { data: recursos, error } = await supabase
        .from('recursos_turmas')
        .select(`
            *,
            criador:criador_id (
                id,
                full_name,
                role
            )
        `)
        .eq('turma_id', turmaId)
        .eq('escola_id', perfil.escola_id)
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Erro ao buscar recursos:', error)
        throw new Error(`Erro ao buscar recursos: ${error.message}`)
    }

    return { data: recursos || [] }
}

/**
 * Criar recurso via URL externa (ex: YouTube, Vimeo)
 */
export async function createRecursoLink(rawData: unknown) {
    const supabase = await createClient()
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = recursoTurmaSchema.parse(rawData)

    if (validated.tipo !== 'link') {
        throw new Error('Esta função é apenas para recursos do tipo link')
    }

    if (!validated.url_externa) {
        throw new Error('URL externa é obrigatória para recursos do tipo link')
    }

    const { data, error } = await supabase
        .from('recursos_turmas')
        .insert({
            ...validated,
            escola_id: perfil.escola_id,
            criador_id: user.id,
        })
        .select()
        .single()

    if (error) {
        console.error('Erro ao criar recurso:', error)
        throw new Error(`Erro ao criar recurso: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { data }
}

/**
 * Criar metadados do recurso após upload via cliente (para arquivos grandes)
 */
export async function createRecursoMetadata(rawData: {
    turma_id: string
    titulo: string
    descricao?: string
    tipo: 'video' | 'audio' | 'documento'
    is_publico: boolean
    arquivo_url: string
    arquivo_nome: string
    arquivo_tamanho: number
    arquivo_mime: string
}) {
    const supabase = await createClient()
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    // Validar dados básicos
    const dadosValidados = uploadRecursoSchema.parse({
        turma_id: rawData.turma_id,
        titulo: rawData.titulo,
        descricao: rawData.descricao,
        tipo: rawData.tipo,
        is_publico: rawData.is_publico,
        ordem: 0,
    })

    // Criar registro no banco
    const { data: recurso, error: dbError } = await supabase
        .from('recursos_turmas')
        .insert({
            turma_id: dadosValidados.turma_id,
            escola_id: perfil.escola_id,
            criador_id: user.id,
            titulo: dadosValidados.titulo,
            descricao: dadosValidados.descricao,
            tipo: dadosValidados.tipo,
            arquivo_url: rawData.arquivo_url,
            arquivo_nome: rawData.arquivo_nome,
            arquivo_tamanho: rawData.arquivo_tamanho,
            arquivo_mime: rawData.arquivo_mime,
            is_publico: dadosValidados.is_publico,
            ordem: dadosValidados.ordem,
        })
        .select()
        .single()

    if (dbError) {
        console.error('Erro ao salvar recurso no banco:', dbError)
        throw new Error(`Erro ao salvar recurso: ${dbError.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { data: recurso }
}

/**
 * Upload de arquivo (vídeo, áudio ou documento) para Supabase Storage (Server-Side)
 * @deprecated Use client-side upload + createRecursoMetadata para arquivos grandes (>4.5MB)
 */
export async function uploadRecursoArquivo(formData: FormData) {
    const supabase = await createClient()
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    // Extrair dados do FormData
    const turma_id = formData.get('turma_id') as string
    const titulo = formData.get('titulo') as string
    const descricao = formData.get('descricao') as string | null
    const tipo = formData.get('tipo') as 'video' | 'audio' | 'documento'
    const is_publico = formData.get('is_publico') === 'true'
    const arquivo = formData.get('arquivo') as File

    if (!arquivo) {
        throw new Error('Arquivo é obrigatório')
    }

    // Validar dados básicos
    const dadosValidados = uploadRecursoSchema.parse({
        turma_id,
        titulo,
        descricao: descricao || undefined,
        tipo,
        is_publico,
        ordem: 0,
    })

    // Validar arquivo baseado no tipo
    const fileData = {
        size: arquivo.size,
        type: arquivo.type,
    }

    if (tipo === 'video') {
        videoFileSchema.parse(fileData)
    } else if (tipo === 'audio') {
        audioFileSchema.parse(fileData)
    } else if (tipo === 'documento') {
        documentoFileSchema.parse(fileData)
    }

    // Determinar bucket baseado no tipo
    const bucketMap = {
        video: 'turmas-videos',
        audio: 'turmas-audios',
        documento: 'turmas-documentos',
    }
    const bucket = bucketMap[tipo]

    // Gerar nome único para o arquivo
    const fileExt = arquivo.name.split('.').pop()
    const fileName = `${turma_id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, arquivo, {
            cacheControl: '3600',
            upsert: false,
        })

    if (uploadError) {
        console.error('Erro ao fazer upload:', uploadError)
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`)
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

    // Criar registro no banco
    const { data: recurso, error: dbError } = await supabase
        .from('recursos_turmas')
        .insert({
            turma_id: dadosValidados.turma_id,
            escola_id: perfil.escola_id,
            criador_id: user.id,
            titulo: dadosValidados.titulo,
            descricao: dadosValidados.descricao,
            tipo: dadosValidados.tipo,
            arquivo_url: publicUrl,
            arquivo_nome: arquivo.name,
            arquivo_tamanho: arquivo.size,
            arquivo_mime: arquivo.type,
            is_publico: dadosValidados.is_publico,
            ordem: dadosValidados.ordem,
        })
        .select()
        .single()

    if (dbError) {
        // Se falhar, tentar deletar o arquivo do storage
        await supabase.storage.from(bucket).remove([fileName])
        console.error('Erro ao salvar recurso no banco:', dbError)
        throw new Error(`Erro ao salvar recurso: ${dbError.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { data: recurso }
}

/**
 * Atualizar recurso (metadados apenas, não o arquivo)
 */
export async function updateRecurso(rawData: unknown) {
    const supabase = await createClient()
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const validated = recursoTurmaUpdateSchema.parse(rawData)

    // Verificar se o recurso existe e pertence à escola
    const { data: existing } = await supabase
        .from('recursos_turmas')
        .select('id, escola_id')
        .eq('id', validated.id)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (!existing) {
        throw new Error('Recurso não encontrado')
    }

    const { error } = await supabase
        .from('recursos_turmas')
        .update({
            titulo: validated.titulo,
            descricao: validated.descricao,
            url_externa: validated.url_externa,
            is_publico: validated.is_publico,
            ordem: validated.ordem,
        })
        .eq('id', validated.id)

    if (error) {
        console.error('Erro ao atualizar recurso:', error)
        throw new Error(`Erro ao atualizar recurso: ${error.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { success: true }
}

/**
 * Deletar recurso (e arquivo do storage se houver)
 */
export async function deleteRecurso(recursoId: string) {
    const supabase = await createClient()
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    // Buscar recurso para pegar informações do arquivo
    const { data: recurso, error: fetchError } = await supabase
        .from('recursos_turmas')
        .select('*')
        .eq('id', recursoId)
        .eq('escola_id', perfil.escola_id)
        .single()

    if (fetchError || !recurso) {
        throw new Error('Recurso não encontrado')
    }

    // Se tiver arquivo no storage, deletar
    if (recurso.arquivo_url && recurso.tipo !== 'link') {
        const bucketMap = {
            video: 'turmas-videos',
            audio: 'turmas-audios',
            documento: 'turmas-documentos',
        }
        const bucket = bucketMap[recurso.tipo as keyof typeof bucketMap]

        if (bucket) {
            // Extrair path do arquivo da URL
            const url = new URL(recurso.arquivo_url)
            const filePath = url.pathname.split(`/${bucket}/`)[1]

            if (filePath) {
                await supabase.storage.from(bucket).remove([filePath])
            }
        }
    }

    // Deletar registro do banco
    const { error: deleteError } = await supabase
        .from('recursos_turmas')
        .delete()
        .eq('id', recursoId)

    if (deleteError) {
        console.error('Erro ao deletar recurso:', deleteError)
        throw new Error(`Erro ao deletar recurso: ${deleteError.message}`)
    }

    revalidatePath('/diretora/turmas')
    return { success: true }
}

/**
 * Registrar progresso de visualização (estudante)
 */
export async function updateProgressoRecurso(rawData: unknown) {
    const supabase = await createClient()
    const { user } = await getAuthenticatedUser()

    const validated = progressoRecursoSchema.parse(rawData)

    // Buscar estudante_id do usuário logado
    const { data: estudante } = await supabase
        .from('estudantes')
        .select('id')
        .eq('perfil_id', user.id)
        .single()

    if (!estudante) {
        throw new Error('Estudante não encontrado')
    }

    // Upsert (insert ou update)
    const { error } = await supabase
        .from('progresso_recursos')
        .upsert({
            recurso_id: validated.recurso_id,
            estudante_id: estudante.id,
            progresso_segundos: validated.progresso_segundos,
            completado: validated.completado,
            ultima_visualizacao: new Date().toISOString(),
        }, {
            onConflict: 'recurso_id,estudante_id'
        })

    if (error) {
        console.error('Erro ao atualizar progresso:', error)
        throw new Error(`Erro ao atualizar progresso: ${error.message}`)
    }

    return { success: true }
}

/**
 * Buscar progresso de um recurso (estudante)
 */
export async function getProgressoRecurso(recursoId: string) {
    const supabase = await createClient()
    const { user } = await getAuthenticatedUser()

    // Buscar estudante_id
    const { data: estudante } = await supabase
        .from('estudantes')
        .select('id')
        .eq('perfil_id', user.id)
        .single()

    if (!estudante) {
        return { data: null }
    }

    const { data: progresso } = await supabase
        .from('progresso_recursos')
        .select('*')
        .eq('recurso_id', recursoId)
        .eq('estudante_id', estudante.id)
        .single()

    return { data: progresso }
}

/**
 * Incrementar contador de visualizações
 */
export async function incrementarVisualizacoes(recursoId: string) {
    const supabase = await createClient()

    const { error } = await supabase.rpc('incrementar_visualizacoes_recurso', {
        recurso_id: recursoId
    })

    if (error) {
        console.error('Erro ao incrementar visualizações:', error)
        // Não lançar erro, apenas logar (não é crítico)
    }

    return { success: true }
}

// ==================== CONFIGURAÇÕES / TENANT ====================

export async function updateTenantSettings(rawData: {
    nome?: string
    logo_url?: string
    primary_color?: string
}) {
    const { user, perfil } = await getAuthenticatedUser()
    requireDiretora(perfil.role)

    const supabase = await createClient()
    const validated = tenantSettingsSchema.parse(rawData)

    const { data, error } = await supabase
        .from('escolas')
        .update({
            nome: validated.nome,
            logo_url: validated.logo_url,
            configuracoes: {
                primary_color: validated.primary_color
            }
        })
        .eq('id', perfil.escola_id)
        .select()
        .single()

    if (error) {
        console.error('Erro ao atualizar configurações:', error)
        throw new Error(`Erro ao atualizar configurações: ${error.message}`)
    }

    revalidatePath('/diretora/configuracoes')
    return { success: true, data }
}

export async function sendNotification(rawData: {
    titulo: string
    mensagem: string
    tipo: 'geral' | 'financeiro' | 'evento'
    destinatario_id?: string
}) {
    const { perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('notificacoes')
        .insert([{
            ...rawData,
            escola_id: perfil.escola_id,
            lido: false
        }])
        .select()
        .single()

    if (error) throw new Error(`Erro ao enviar notificação: ${error.message}`)

    revalidatePath('/diretora/notificacoes')
    revalidatePath('/responsavel')
    return { success: true, data }
}

// ============================================
// SISTEMA DE NOTIFICAÇÕES AVANÇADO
// ============================================

/**
 * Busca opções de destinatários para notificações
 * Retorna turmas, contagem de inadimplentes, total de responsáveis
 */
export async function getDestinatariosNotificacao() {
    const { perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    // Buscar turmas da escola
    const { data: turmas } = await supabase
        .from('turmas')
        .select(`
            id,
            nome,
            nivel,
            cor_etiqueta,
            matriculas_turmas (count)
        `)
        .eq('escola_id', perfil.escola_id)
        .order('nome')

    // Buscar total de responsáveis
    const { count: totalResponsaveis } = await supabase
        .from('responsaveis')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)

    // Buscar inadimplentes (mensalidades pendentes ou atrasadas)
    const mesAtual = new Date().getMonth() + 1
    const anoAtual = new Date().getFullYear()

    const { data: mensalidadesPendentes } = await supabase
        .from('mensalidades')
        .select(`
            estudante_id,
            estudantes!inner (
                id,
                escola_id
            )
        `)
        .eq('estudantes.escola_id', perfil.escola_id)
        .in('status', ['pendente', 'atrasado'])
        .lte('mes_referencia', mesAtual)
        .lte('ano_referencia', anoAtual)

    // Contar estudantes únicos inadimplentes
    const estudantesInadimplentes = new Set(mensalidadesPendentes?.map(m => m.estudante_id) || [])

    return {
        data: {
            turmas: turmas?.map(t => ({
                id: t.id,
                nome: t.nome,
                nivel: t.nivel,
                cor: t.cor_etiqueta,
                totalAlunos: t.matriculas_turmas?.[0]?.count || 0
            })) || [],
            totalResponsaveis: totalResponsaveis || 0,
            totalInadimplentes: estudantesInadimplentes.size
        }
    }
}

/**
 * Envia notificação para grupo específico
 */
export async function enviarNotificacaoGrupo(rawData: {
    titulo: string
    mensagem: string
    tipo: 'geral' | 'financeiro' | 'evento'
    grupo: 'todos' | 'turma' | 'inadimplentes'
    turma_id?: string
}) {
    const { perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    let destinatarios: string[] = []

    if (rawData.grupo === 'todos') {
        // Buscar todos os responsáveis da escola
        const { data: responsaveis } = await supabase
            .from('responsaveis')
            .select('perfil_id')
            .eq('escola_id', perfil.escola_id)

        destinatarios = responsaveis?.map(r => r.perfil_id).filter(Boolean) as string[] || []
    }
    else if (rawData.grupo === 'turma' && rawData.turma_id) {
        // Buscar responsáveis dos alunos da turma específica
        const { data: matriculas } = await supabase
            .from('matriculas_turmas')
            .select(`
                estudantes!inner (
                    id,
                    estudantes_responsaveis (
                        responsaveis (
                            perfil_id
                        )
                    )
                )
            `)
            .eq('turma_id', rawData.turma_id)
            .eq('status', 'ativo')

        // Extrair perfil_ids dos responsáveis
        matriculas?.forEach((m: any) => {
            m.estudantes?.estudantes_responsaveis?.forEach((er: any) => {
                if (er.responsaveis?.perfil_id) {
                    destinatarios.push(er.responsaveis.perfil_id)
                }
            })
        })
        // Remover duplicados
        destinatarios = [...new Set(destinatarios)]
    }
    else if (rawData.grupo === 'inadimplentes') {
        // Buscar responsáveis de alunos inadimplentes
        const mesAtual = new Date().getMonth() + 1
        const anoAtual = new Date().getFullYear()

        const { data: mensalidadesPendentes } = await supabase
            .from('mensalidades')
            .select(`
                estudantes!inner (
                    id,
                    escola_id,
                    estudantes_responsaveis (
                        responsaveis (
                            perfil_id
                        )
                    )
                )
            `)
            .eq('estudantes.escola_id', perfil.escola_id)
            .in('status', ['pendente', 'atrasado'])
            .lte('mes_referencia', mesAtual)
            .lte('ano_referencia', anoAtual)

        mensalidadesPendentes?.forEach((m: any) => {
            m.estudantes?.estudantes_responsaveis?.forEach((er: any) => {
                if (er.responsaveis?.perfil_id) {
                    destinatarios.push(er.responsaveis.perfil_id)
                }
            })
        })
        destinatarios = [...new Set(destinatarios)]
    }

    // Se não houver destinatários específicos, enviar para todos (broadcast)
    if (destinatarios.length === 0) {
        // Enviar notificação broadcast (destinatario_id = null)
        const { error } = await supabase
            .from('notificacoes')
            .insert([{
                titulo: rawData.titulo,
                mensagem: rawData.mensagem,
                tipo: rawData.tipo,
                escola_id: perfil.escola_id,
                destinatario_id: null,
                lido: false
            }])

        if (error) throw new Error(`Erro ao enviar notificação: ${error.message}`)
    } else {
        // Criar uma notificação para cada destinatário
        const notificacoes = destinatarios.map(destId => ({
            titulo: rawData.titulo,
            mensagem: rawData.mensagem,
            tipo: rawData.tipo,
            escola_id: perfil.escola_id,
            destinatario_id: destId,
            lido: false
        }))

        const { error } = await supabase
            .from('notificacoes')
            .insert(notificacoes)

        if (error) throw new Error(`Erro ao enviar notificações: ${error.message}`)
    }

    revalidatePath('/diretora/notificacoes')
    revalidatePath('/responsavel')

    return {
        success: true,
        totalEnviados: destinatarios.length || 1,
        grupo: rawData.grupo
    }
}

/**
 * Busca histórico de notificações enviadas pela escola
 */
export async function getHistoricoNotificacoes(limite: number = 20) {
    const { perfil } = await getAuthenticatedUser()
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('notificacoes')
        .select(`
            id,
            titulo,
            mensagem,
            tipo,
            destinatario_id,
            created_at,
            perfis:perfis!notificacoes_destinatario_id_fkey (
                full_name
            )
        `)
        .eq('escola_id', perfil.escola_id)
        .order('created_at', { ascending: false })
        .limit(limite)

    if (error) throw new Error(`Erro ao buscar histórico: ${error.message}`)

    // Agrupar por created_at para mostrar envios em lote
    const agrupado = data?.reduce((acc: any[], notif: any) => {
        const existente = acc.find(
            n => n.titulo === notif.titulo &&
                n.mensagem === notif.mensagem &&
                Math.abs(new Date(n.created_at).getTime() - new Date(notif.created_at).getTime()) < 60000
        )

        if (existente) {
            existente.totalDestinatarios++
        } else {
            acc.push({
                ...notif,
                totalDestinatarios: 1,
                destinatarioNome: notif.perfis?.full_name || 'Todos'
            })
        }
        return acc
    }, [])

    return { data: agrupado || [] }
}
