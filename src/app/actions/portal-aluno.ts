'use server'

import { createClient } from '@/utils/supabase/server'

// ============================================
// HELPERS
// ============================================

async function getAuthenticatedAluno() {
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

    // Verificar se é aluno (role = 'aluno')
    if (perfil.role !== 'aluno') {
        throw new Error('Acesso negado: apenas alunos')
    }

    // Buscar dados do estudante
    const { data: estudante } = await supabase
        .from('estudantes')
        .select(`
            *,
            matriculas_turmas (
                id,
                status,
                turma:turmas (
                    id,
                    nome,
                    nivel,
                    cor_etiqueta,
                    professor_id,
                    perfis:perfis!turmas_professor_id_fkey (
                        full_name,
                        avatar_url
                    )
                )
            )
        `)
        .eq('perfil_id', perfil.id)
        .single()

    if (!estudante) {
        throw new Error('Estudante não encontrado')
    }

    return { user, perfil, estudante, supabase }
}

// ============================================
// DADOS DO PERFIL DO ALUNO
// ============================================

export async function getPerfilAluno() {
    const { perfil, estudante } = await getAuthenticatedAluno()

    // Calcular idade
    const dataNascimento = new Date(estudante.data_nascimento)
    const hoje = new Date()
    const idade = hoje.getFullYear() - dataNascimento.getFullYear()

    return {
        data: {
            id: estudante.id,
            nome: perfil.full_name,
            avatar_url: perfil.avatar_url,
            idade,
            status_matricula: estudante.status_matricula,
            turmas: estudante.matriculas_turmas?.filter((m: any) => m.status === 'ativo').map((m: any) => ({
                id: m.turma?.id,
                nome: m.turma?.nome,
                nivel: m.turma?.nivel,
                cor: m.turma?.cor_etiqueta,
                professor: m.turma?.perfis?.full_name,
            })) || [],
        }
    }
}

// ============================================
// AGENDA DE AULAS DO ALUNO
// ============================================

export async function getAgendaAluno() {
    const { estudante, supabase } = await getAuthenticatedAluno()

    // Buscar IDs das turmas ativas do aluno
    const turmaIds = estudante.matriculas_turmas
        ?.filter((m: any) => m.status === 'ativo')
        .map((m: any) => m.turma?.id)
        .filter(Boolean) || []

    if (turmaIds.length === 0) {
        return { data: [] }
    }

    // Buscar agenda das turmas
    const { data, error } = await supabase
        .from('agenda_aulas')
        .select(`
            *,
            turma:turmas (
                id,
                nome,
                nivel,
                cor_etiqueta,
                perfis:perfis!turmas_professor_id_fkey (
                    full_name
                )
            )
        `)
        .in('turma_id', turmaIds)
        .order('dia_semana', { ascending: true })

    if (error) throw new Error(`Erro ao buscar agenda: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// MÉTRICAS DE EVOLUÇÃO DO ALUNO
// ============================================

export async function getMetricasAluno() {
    const { estudante, supabase } = await getAuthenticatedAluno()

    // Buscar avaliações do aluno
    const { data: avaliacoes } = await supabase
        .from('avaliacoes_alunos')
        .select('*')
        .eq('estudante_id', estudante.id)
        .order('created_at', { ascending: false })
        .limit(1)

    // Valores padrão se não houver avaliações
    const metricas = avaliacoes?.[0] || {
        tecnica: 50,
        musicalidade: 50,
        presenca_palco: 50,
        disciplina: 50,
    }

    // Buscar total de presenças no mês
    const mesAtual = new Date().getMonth() + 1
    const anoAtual = new Date().getFullYear()
    const dataInicio = new Date(anoAtual, mesAtual - 1, 1).toISOString()
    const dataFim = new Date(anoAtual, mesAtual, 0, 23, 59, 59).toISOString()

    const { count: presencasMes } = await supabase
        .from('checkins')
        .select('*', { count: 'exact', head: true })
        .eq('estudante_id', estudante.id)
        .gte('created_at', dataInicio)
        .lte('created_at', dataFim)

    // Calcular streak (dias consecutivos)
    const { data: checkins } = await supabase
        .from('checkins')
        .select('created_at')
        .eq('estudante_id', estudante.id)
        .order('created_at', { ascending: false })
        .limit(30)

    let streak = 0
    if (checkins && checkins.length > 0) {
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)

        let dataAnterior = hoje
        for (const checkin of checkins) {
            const dataCheckin = new Date(checkin.created_at)
            dataCheckin.setHours(0, 0, 0, 0)

            const diffDias = Math.floor((dataAnterior.getTime() - dataCheckin.getTime()) / (1000 * 60 * 60 * 24))

            if (diffDias <= 1) {
                streak++
                dataAnterior = dataCheckin
            } else {
                break
            }
        }
    }

    return {
        data: {
            tecnica: metricas.tecnica || 50,
            musicalidade: metricas.musicalidade || 50,
            presenca_palco: metricas.presenca_palco || 50,
            disciplina: metricas.disciplina || 50,
            presencasMes: presencasMes || 0,
            streak,
        }
    }
}

// ============================================
// GALERIAS DISPONÍVEIS PARA O ALUNO
// ============================================

export async function getGaleriasAluno() {
    const { estudante, supabase } = await getAuthenticatedAluno()

    const { data, error } = await supabase
        .from('galerias_fotos')
        .select(`
            *,
            fotos:fotos(count)
        `)
        .eq('escola_id', estudante.escola_id)
        .eq('is_public', true)
        .order('data_evento', { ascending: false })
        .limit(4)

    if (error) throw new Error(`Erro ao buscar galerias: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// NOTIFICAÇÕES DO ALUNO
// ============================================

export async function getNotificacoesAluno() {
    const { perfil, supabase } = await getAuthenticatedAluno()

    const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .or(`destinatario_id.eq.${perfil.id},destinatario_id.is.null`)
        .eq('escola_id', perfil.escola_id)
        .order('created_at', { ascending: false })
        .limit(10)

    if (error) throw new Error(`Erro ao buscar notificações: ${error.message}`)

    return { data: data || [] }
}
