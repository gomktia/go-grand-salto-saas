'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPERS
// ============================================

async function getAuthenticatedMonitora() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        throw new Error('Não autenticado')
    }

    const { data: perfil } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!perfil) {
        throw new Error('Perfil não encontrado')
    }

    // Verificar se é monitora (role principal ou secundário)
    const isMonitoraPrincipal = perfil.role === 'monitor' || perfil.role === 'monitora'

    // Verificar perfil secundário
    const { data: perfilSecundario } = await supabase
        .from('perfis_secundarios')
        .select('*')
        .eq('perfil_principal_id', perfil.id)
        .eq('role_secundario', 'monitora')
        .eq('ativo', true)
        .single()

    const isMonitoraSecundaria = !!perfilSecundario

    if (!isMonitoraPrincipal && !isMonitoraSecundaria) {
        throw new Error('Acesso negado: usuário não é monitora')
    }

    return { user, perfil, supabase, isMonitoraSecundaria }
}

// ============================================
// DADOS DA MONITORA
// ============================================

export async function getPerfilMonitora() {
    const { perfil, supabase } = await getAuthenticatedMonitora()

    // Contar turmas que monitora
    const { count: totalTurmas } = await supabase
        .from('monitoras_turmas')
        .select('*', { count: 'exact', head: true })
        .eq('perfil_id', perfil.id)
        .eq('ativo', true)

    return {
        data: {
            id: perfil.id,
            nome: perfil.full_name,
            avatar_url: perfil.avatar_url,
            escola_id: perfil.escola_id,
            totalTurmas: totalTurmas || 0
        }
    }
}

// ============================================
// TURMAS DA MONITORA
// ============================================

export async function getMinhasTurmasMonitora() {
    const { perfil, supabase } = await getAuthenticatedMonitora()

    const { data, error } = await supabase
        .from('monitoras_turmas')
        .select(`
            id,
            pode_chamada,
            pode_avaliar,
            pode_ver_observacoes,
            pode_enviar_recados,
            data_inicio,
            turma:turmas (
                id,
                nome,
                nivel,
                cor_etiqueta,
                vagas_max,
                professor_id,
                professor:perfis!turmas_professor_id_fkey (
                    full_name,
                    avatar_url
                ),
                matriculas_turmas (
                    id,
                    status,
                    estudante:estudantes (
                        id,
                        nome_responsavel,
                        data_nascimento,
                        status_matricula,
                        perfis (
                            full_name,
                            avatar_url
                        )
                    )
                ),
                agenda_aulas (
                    id,
                    dia_semana,
                    hora_inicio,
                    hora_fim,
                    sala
                )
            )
        `)
        .eq('perfil_id', perfil.id)
        .eq('ativo', true)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao buscar turmas: ${error.message}`)

    // Normalizar dados - Usando 'any' para evitar erros de spread com tipos inferidos complexos do Supabase
    const transformedData = (data as any)?.map((vinculo: any) => ({
        ...vinculo,
        turma: Array.isArray(vinculo.turma) ? {
            ...vinculo.turma[0],
            professor: Array.isArray(vinculo.turma[0]?.professor) ? vinculo.turma[0].professor[0] : vinculo.turma[0]?.professor
        } : {
            ...(vinculo.turma || {}),
            professor: Array.isArray(vinculo.turma?.professor) ? vinculo.turma.professor[0] : vinculo.turma?.professor
        }
    }))

    return { data: transformedData || [] }
}

// ============================================
// ALUNOS DE UMA TURMA (para chamada)
// ============================================

export async function getAlunosTurmaMonitora(turmaId: string) {
    const { perfil, supabase } = await getAuthenticatedMonitora()

    // Verificar se a monitora tem acesso a esta turma
    const { data: vinculo } = await supabase
        .from('monitoras_turmas')
        .select('*')
        .eq('perfil_id', perfil.id)
        .eq('turma_id', turmaId)
        .eq('ativo', true)
        .single()

    if (!vinculo) {
        throw new Error('Você não tem acesso a esta turma')
    }

    // Buscar alunos da turma
    const { data, error } = await supabase
        .from('matriculas_turmas')
        .select(`
            id,
            status,
            estudante:estudantes (
                id,
                nome_responsavel,
                data_nascimento,
                status_matricula,
                ${vinculo.pode_ver_observacoes ? 'observacoes_medicas,' : ''}
                perfis (
                    full_name,
                    avatar_url
                )
            )
        `)
        .eq('turma_id', turmaId)
        .eq('status', 'ativo')

    if (error) throw new Error(`Erro ao buscar alunos: ${error.message}`)

    // Normalizar dados
    const transformedData = data?.map((m: any) => ({
        ...m,
        estudante: {
            ...m.estudante,
            perfis: Array.isArray(m.estudante?.perfis) ? m.estudante.perfis[0] : m.estudante?.perfis
        }
    }))

    return {
        data: transformedData || [],
        permissoes: {
            pode_chamada: vinculo.pode_chamada,
            pode_avaliar: vinculo.pode_avaliar,
            pode_ver_observacoes: vinculo.pode_ver_observacoes,
            pode_enviar_recados: vinculo.pode_enviar_recados
        }
    }
}

// ============================================
// REGISTRAR PRESENÇA (CHAMADA)
// ============================================

export async function registrarPresencaMonitora(params: {
    turma_id: string
    presencas: { estudante_id: string; presente: boolean }[]
}) {
    const { perfil, supabase } = await getAuthenticatedMonitora()

    // Verificar se a monitora tem permissão de chamada nesta turma
    const { data: vinculo } = await supabase
        .from('monitoras_turmas')
        .select('pode_chamada')
        .eq('perfil_id', perfil.id)
        .eq('turma_id', params.turma_id)
        .eq('ativo', true)
        .single()

    if (!vinculo) {
        throw new Error('Você não tem acesso a esta turma')
    }

    if (!vinculo.pode_chamada) {
        throw new Error('Você não tem permissão para fazer chamada nesta turma')
    }

    // Criar registros de checkin apenas para os presentes
    const checkins = params.presencas
        .filter(p => p.presente)
        .map(p => ({
            estudante_id: p.estudante_id,
            turma_id: params.turma_id,
            escola_id: perfil.escola_id,
            metodo: 'monitora_app',
            registrado_por: perfil.id
        }))

    if (checkins.length > 0) {
        const { error } = await supabase
            .from('checkins')
            .insert(checkins)

        if (error) throw new Error(`Erro ao registrar presença: ${error.message}`)
    }

    revalidatePath('/monitor')
    return { success: true, presentes: checkins.length }
}

// ============================================
// ESTATÍSTICAS DA MONITORA
// ============================================

export async function getEstatisticasMonitora() {
    const { perfil, supabase } = await getAuthenticatedMonitora()

    // Total de turmas
    const { count: totalTurmas } = await supabase
        .from('monitoras_turmas')
        .select('*', { count: 'exact', head: true })
        .eq('perfil_id', perfil.id)
        .eq('ativo', true)

    // Buscar IDs das turmas que monitora
    const { data: vinculos } = await supabase
        .from('monitoras_turmas')
        .select('turma_id')
        .eq('perfil_id', perfil.id)
        .eq('ativo', true)

    const turmaIds = vinculos?.map(v => v.turma_id) || []

    // Total de alunos nas turmas que monitora
    let totalAlunos = 0
    if (turmaIds.length > 0) {
        const { count } = await supabase
            .from('matriculas_turmas')
            .select('*', { count: 'exact', head: true })
            .in('turma_id', turmaIds)
            .eq('status', 'ativo')

        totalAlunos = count || 0
    }

    // Chamadas feitas hoje
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const { count: chamadasHoje } = await supabase
        .from('checkins')
        .select('*', { count: 'exact', head: true })
        .eq('registrado_por', perfil.id)
        .gte('created_at', hoje.toISOString())

    return {
        data: {
            totalTurmas: totalTurmas || 0,
            totalAlunos,
            chamadasHoje: chamadasHoje || 0
        }
    }
}

// ============================================
// VERIFICAR SE USUÁRIO TEM MÚLTIPLOS PERFIS
// ============================================

export async function getMultiplosPerfis() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        throw new Error('Não autenticado')
    }

    const { data: perfil } = await supabase
        .from('perfis')
        .select('id, role, full_name, avatar_url, escola_id')
        .eq('id', user.id)
        .single()

    if (!perfil) {
        throw new Error('Perfil não encontrado')
    }

    // Buscar perfis secundários
    const { data: perfisSecundarios } = await supabase
        .from('perfis_secundarios')
        .select('role_secundario')
        .eq('perfil_principal_id', perfil.id)
        .eq('ativo', true)

    const roles = [
        { role: perfil.role, isPrincipal: true }
    ]

    if (perfisSecundarios) {
        perfisSecundarios.forEach(ps => {
            roles.push({ role: ps.role_secundario, isPrincipal: false })
        })
    }

    return {
        data: {
            perfil,
            roles,
            hasMultipleRoles: roles.length > 1
        }
    }
}

// ============================================
// PRÓXIMAS AULAS DA MONITORA (HOJE)
// ============================================

export async function getProximasAulasMonitora() {
    const { perfil, supabase } = await getAuthenticatedMonitora()

    // Buscar turmas que monitora
    const { data: vinculos } = await supabase
        .from('monitoras_turmas')
        .select('turma_id')
        .eq('perfil_id', perfil.id)
        .eq('ativo', true)

    if (!vinculos || vinculos.length === 0) {
        return { data: [] }
    }

    const turmaIds = vinculos.map(v => v.turma_id)
    const hoje = new Date().getDay()

    // Buscar aulas de hoje
    const { data, error } = await supabase
        .from('agenda_aulas')
        .select(`
            id,
            dia_semana,
            hora_inicio,
            hora_fim,
            sala,
            turma:turmas (
                id,
                nome,
                nivel,
                cor_etiqueta
            )
        `)
        .in('turma_id', turmaIds)
        .eq('dia_semana', hoje)
        .order('hora_inicio', { ascending: true })

    if (error) throw new Error(`Erro ao buscar aulas: ${error.message}`)

    // Normalizar dados
    const transformedData = data?.map((aula: any) => ({
        ...aula,
        turma: Array.isArray(aula.turma) ? aula.turma[0] : aula.turma
    }))

    return { data: transformedData || [] }
}
