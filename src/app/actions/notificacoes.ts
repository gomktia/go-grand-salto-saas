'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================
// TIPOS DE NOTIFICAÇÃO
// ============================================

export type NotificationType =
    | 'alerta'           // Alertas urgentes (faltas, saúde)
    | 'financeiro'       // Pagamentos, vencimentos
    | 'pedagogico'       // Avaliações, progresso
    | 'evento'           // Eventos, apresentações
    | 'informativo'      // Comunicados gerais
    | 'matricula'        // Matrículas, turmas

export type NotificationSubtype =
    // Faltas
    | 'faltas_consecutivas'
    | 'falta_aula'
    | 'baixa_frequencia_turma'
    // Financeiro
    | 'vencimento_proximo'
    | 'pagamento_atrasado'
    | 'pagamento_confirmado'
    | 'boleto_gerado'
    // Pedagógico
    | 'avaliacao_disponivel'
    | 'progresso_aluno'
    | 'metrica_corporal'
    // Evento
    | 'evento_proximo'
    | 'apresentacao'
    | 'recesso'
    // Matrícula
    | 'nova_matricula'
    | 'matricula_renovacao'
    | 'mudanca_turma'
    // Sistema
    | 'boas_vindas'
    | 'mudanca_horario'
    | 'comunicado_geral'

interface NotificationPayload {
    titulo: string
    mensagem: string
    tipo: NotificationType
    subtipo: NotificationSubtype
    destinatario_id: string | null
    escola_id: string
    referencia_id?: string
    automatica?: boolean
    canal?: 'app' | 'email' | 'whatsapp'
}

// ============================================
// HELPERS
// ============================================

async function getAuthenticatedUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) throw new Error('Não autenticado')

    const { data: perfil } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!perfil) throw new Error('Perfil não encontrado')

    return { user, perfil, supabase }
}

async function createNotification(
    supabase: Awaited<ReturnType<typeof createClient>>,
    payload: NotificationPayload
) {
    const { error } = await supabase
        .from('notificacoes')
        .insert({
            titulo: payload.titulo,
            mensagem: payload.mensagem,
            tipo: payload.tipo,
            subtipo: payload.subtipo,
            destinatario_id: payload.destinatario_id,
            escola_id: payload.escola_id,
            referencia_id: payload.referencia_id || null,
            automatica: payload.automatica || false,
            canal: payload.canal || 'app',
            lido: false,
        })

    if (error) {
        console.error('Erro ao criar notificação:', error)
    }

    return !error
}

async function createBulkNotifications(
    supabase: Awaited<ReturnType<typeof createClient>>,
    payloads: NotificationPayload[]
) {
    if (payloads.length === 0) return 0

    const records = payloads.map(p => ({
        titulo: p.titulo,
        mensagem: p.mensagem,
        tipo: p.tipo,
        subtipo: p.subtipo,
        destinatario_id: p.destinatario_id,
        escola_id: p.escola_id,
        referencia_id: p.referencia_id || null,
        automatica: p.automatica || false,
        canal: p.canal || 'app',
        lido: false,
    }))

    const { error } = await supabase
        .from('notificacoes')
        .insert(records)

    if (error) {
        console.error('Erro ao criar notificações em lote:', error)
        return 0
    }

    return records.length
}

// ============================================
// BUSCAR RESPONSÁVEIS DE UM ESTUDANTE
// ============================================

async function getResponsaveisDoEstudante(
    supabase: Awaited<ReturnType<typeof createClient>>,
    estudanteId: string
): Promise<{ perfil_id: string; nome: string; email: string }[]> {
    const { data } = await supabase
        .from('estudantes_responsaveis')
        .select(`
            responsaveis (
                perfil_id,
                nome_completo,
                email
            )
        `)
        .eq('estudante_id', estudanteId)
        .eq('recebe_notificacoes', true)

    return (data || [])
        .map((d: any) => d.responsaveis)
        .filter(Boolean)
        .map((r: any) => ({
            perfil_id: r.perfil_id,
            nome: r.nome_completo,
            email: r.email,
        }))
}

// ============================================
// BUSCAR DIRETORA DA ESCOLA
// ============================================

async function getDiretorasDaEscola(
    supabase: Awaited<ReturnType<typeof createClient>>,
    escolaId: string
): Promise<{ id: string; full_name: string }[]> {
    const { data } = await supabase
        .from('perfis')
        .select('id, full_name')
        .eq('escola_id', escolaId)
        .in('role', ['diretora', 'super_admin'])

    return data || []
}

// ============================================
// BUSCAR PROFESSOR DA TURMA
// ============================================

async function getProfessorDaTurma(
    supabase: Awaited<ReturnType<typeof createClient>>,
    turmaId: string
): Promise<{ id: string; full_name: string } | null> {
    const { data } = await supabase
        .from('turmas')
        .select('professor_id, perfis!turmas_professor_id_fkey(id, full_name)')
        .eq('id', turmaId)
        .single()

    if (!data?.professor_id) return null
    return (data as any).perfis || null
}

// ============================================
// 1. VERIFICAR FALTAS CONSECUTIVAS
// ============================================

/**
 * Verifica faltas consecutivas de todos os alunos de uma escola.
 * Para cada turma, compara as últimas N aulas agendadas (por dia_semana)
 * com os checkins registrados. Se o aluno não fez checkin nas últimas N aulas,
 * gera alerta.
 */
export async function verificarFaltasConsecutivas(escolaId: string) {
    const supabase = await createClient()

    // Buscar configuração da escola
    const { data: config } = await supabase
        .from('config_notificacoes')
        .select('*')
        .eq('escola_id', escolaId)
        .single()

    const limiarFaltas = config?.faltas_consecutivas_alerta || 3

    // Buscar todas as turmas ativas da escola com agenda
    const { data: turmas } = await supabase
        .from('turmas')
        .select(`
            id,
            nome,
            professor_id,
            agenda_aulas (dia_semana, hora_inicio),
            matriculas_turmas (
                estudante_id,
                status,
                estudantes (
                    id,
                    nome_responsavel,
                    perfil_id
                )
            )
        `)
        .eq('escola_id', escolaId)

    if (!turmas || turmas.length === 0) return { alertas: 0 }

    let totalAlertas = 0

    for (const turma of turmas) {
        const agenda = (turma.agenda_aulas || []) as any[]
        const matriculas = ((turma.matriculas_turmas || []) as any[])
            .filter((m: any) => m.status === 'ativo')

        if (agenda.length === 0 || matriculas.length === 0) continue

        // Calcular as últimas N datas de aula baseado na agenda semanal
        const diasAula = agenda.map((a: any) => a.dia_semana)
        const ultimasAulas = getUltimasNDatasAula(diasAula, limiarFaltas)

        if (ultimasAulas.length < limiarFaltas) continue

        for (const matricula of matriculas) {
            const estudanteId = matricula.estudante_id

            // Verificar checkins do aluno nessas datas
            const { count } = await supabase
                .from('checkins')
                .select('*', { count: 'exact', head: true })
                .eq('estudante_id', estudanteId)
                .eq('turma_id', turma.id)
                .gte('created_at', ultimasAulas[ultimasAulas.length - 1].toISOString())

            const presencas = count || 0

            if (presencas === 0) {
                // Verificar se já existe alerta não resolvido
                const { data: alertaExistente } = await supabase
                    .from('alertas_faltas')
                    .select('id')
                    .eq('estudante_id', estudanteId)
                    .eq('turma_id', turma.id)
                    .eq('resolvido', false)
                    .single()

                if (alertaExistente) continue // Já alertado

                // Criar registro de alerta
                await supabase
                    .from('alertas_faltas')
                    .insert({
                        escola_id: escolaId,
                        estudante_id: estudanteId,
                        turma_id: turma.id,
                        faltas_consecutivas: limiarFaltas,
                        notificacao_enviada: true,
                    })

                const nomeAluno = matricula.estudantes?.nome_responsavel || 'Aluno'

                // Notificar responsáveis
                if (config?.notificar_responsavel_falta !== false) {
                    const responsaveis = await getResponsaveisDoEstudante(supabase, estudanteId)
                    for (const resp of responsaveis) {
                        if (resp.perfil_id) {
                            await createNotification(supabase, {
                                titulo: `Alerta de Faltas – ${nomeAluno}`,
                                mensagem: `${nomeAluno} faltou ${limiarFaltas} aulas consecutivas na turma ${turma.nome}. Entre em contato com a escola para regularizar.`,
                                tipo: 'alerta',
                                subtipo: 'faltas_consecutivas',
                                destinatario_id: resp.perfil_id,
                                escola_id: escolaId,
                                referencia_id: estudanteId,
                                automatica: true,
                            })
                        }
                    }
                }

                // Notificar diretora
                if (config?.notificar_diretora_falta !== false) {
                    const diretoras = await getDiretorasDaEscola(supabase, escolaId)
                    for (const dir of diretoras) {
                        await createNotification(supabase, {
                            titulo: `Alerta: ${nomeAluno} – ${limiarFaltas} faltas consecutivas`,
                            mensagem: `O aluno ${nomeAluno} faltou ${limiarFaltas} aulas seguidas na turma ${turma.nome}. Recomendamos contato imediato com o responsável.`,
                            tipo: 'alerta',
                            subtipo: 'faltas_consecutivas',
                            destinatario_id: dir.id,
                            escola_id: escolaId,
                            referencia_id: estudanteId,
                            automatica: true,
                        })
                    }
                }

                // Notificar professora
                if (config?.notificar_professora_falta !== false) {
                    const professor = await getProfessorDaTurma(supabase, turma.id)
                    if (professor) {
                        await createNotification(supabase, {
                            titulo: `Alerta de faltas: ${nomeAluno}`,
                            mensagem: `${nomeAluno} acumulou ${limiarFaltas} faltas consecutivas na sua turma ${turma.nome}.`,
                            tipo: 'alerta',
                            subtipo: 'faltas_consecutivas',
                            destinatario_id: professor.id,
                            escola_id: escolaId,
                            referencia_id: estudanteId,
                            automatica: true,
                        })
                    }
                }

                totalAlertas++
            }
        }
    }

    return { alertas: totalAlertas }
}

/**
 * Calcula as últimas N datas em que houve aula, baseado nos dias da semana
 */
function getUltimasNDatasAula(diasSemana: number[], quantidade: number): Date[] {
    const datas: Date[] = []
    const hoje = new Date()
    hoje.setHours(23, 59, 59, 999)

    let cursor = new Date(hoje)
    cursor.setDate(cursor.getDate() - 1) // Começar de ontem

    while (datas.length < quantidade && datas.length < 30) {
        if (diasSemana.includes(cursor.getDay())) {
            datas.push(new Date(cursor))
        }
        cursor.setDate(cursor.getDate() - 1)
    }

    return datas
}

// ============================================
// 2. RESOLVER ALERTA DE FALTAS (quando aluno retorna)
// ============================================

export async function resolverAlertaFalta(estudanteId: string, turmaId: string) {
    const { perfil, supabase } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('alertas_faltas')
        .update({
            resolvido: true,
            resolvido_em: new Date().toISOString(),
        })
        .eq('estudante_id', estudanteId)
        .eq('turma_id', turmaId)
        .eq('resolvido', false)
        .eq('escola_id', perfil.escola_id)

    if (error) throw new Error(`Erro ao resolver alerta: ${error.message}`)

    return { success: true }
}

// ============================================
// 3. NOTIFICAÇÕES DE PAGAMENTO
// ============================================

/**
 * Verifica mensalidades próximas do vencimento e envia lembretes
 */
export async function verificarVencimentosProximos(escolaId: string) {
    const supabase = await createClient()

    const { data: config } = await supabase
        .from('config_notificacoes')
        .select('*')
        .eq('escola_id', escolaId)
        .single()

    if (config?.notificar_responsavel_vencimento === false) return { enviados: 0 }

    const diasAntes = config?.dias_antes_vencimento || 3
    const hoje = new Date()
    const dataLimite = new Date(hoje)
    dataLimite.setDate(dataLimite.getDate() + diasAntes)

    // Buscar mensalidades pendentes com vencimento próximo
    const { data: mensalidades } = await supabase
        .from('mensalidades')
        .select(`
            id,
            valor,
            data_vencimento,
            mes_referencia,
            ano_referencia,
            estudante_id,
            estudantes (
                id,
                nome_responsavel,
                perfil_id
            )
        `)
        .eq('escola_id', escolaId)
        .eq('status', 'pendente')
        .gte('data_vencimento', hoje.toISOString().split('T')[0])
        .lte('data_vencimento', dataLimite.toISOString().split('T')[0])

    if (!mensalidades || mensalidades.length === 0) return { enviados: 0 }

    const notifications: NotificationPayload[] = []

    for (const m of mensalidades) {
        const estudante = (m as any).estudantes
        if (!estudante) continue

        const nomeAluno = estudante.nome_responsavel || 'Aluno'
        const valor = Number(m.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

        const responsaveis = await getResponsaveisDoEstudante(supabase, m.estudante_id)

        for (const resp of responsaveis) {
            if (resp.perfil_id) {
                notifications.push({
                    titulo: `Lembrete: Mensalidade de ${meses[m.mes_referencia]}`,
                    mensagem: `A mensalidade de ${meses[m.mes_referencia]}/${m.ano_referencia} de ${nomeAluno} no valor de ${valor} vence em ${new Date(m.data_vencimento).toLocaleDateString('pt-BR')}. Evite juros!`,
                    tipo: 'financeiro',
                    subtipo: 'vencimento_proximo',
                    destinatario_id: resp.perfil_id,
                    escola_id: escolaId,
                    referencia_id: m.id,
                    automatica: true,
                })
            }
        }
    }

    const enviados = await createBulkNotifications(supabase, notifications)
    return { enviados }
}

/**
 * Verifica mensalidades atrasadas e notifica responsáveis e diretora
 */
export async function verificarMensalidadesAtrasadas(escolaId: string) {
    const supabase = await createClient()

    const { data: config } = await supabase
        .from('config_notificacoes')
        .select('*')
        .eq('escola_id', escolaId)
        .single()

    const hoje = new Date().toISOString().split('T')[0]

    const { data: atrasadas } = await supabase
        .from('mensalidades')
        .select(`
            id,
            valor,
            data_vencimento,
            mes_referencia,
            ano_referencia,
            estudante_id,
            estudantes (
                id,
                nome_responsavel
            )
        `)
        .eq('escola_id', escolaId)
        .eq('status', 'pendente')
        .lt('data_vencimento', hoje)

    if (!atrasadas || atrasadas.length === 0) return { enviados: 0 }

    // Atualizar status para 'atrasado'
    const idsAtrasados = atrasadas.map(m => m.id)
    await supabase
        .from('mensalidades')
        .update({ status: 'atrasado' })
        .in('id', idsAtrasados)

    const notifications: NotificationPayload[] = []
    const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    for (const m of atrasadas) {
        const estudante = (m as any).estudantes
        if (!estudante) continue
        const nomeAluno = estudante.nome_responsavel || 'Aluno'
        const valor = Number(m.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

        // Notificar responsáveis
        if (config?.notificar_responsavel_atraso !== false) {
            const responsaveis = await getResponsaveisDoEstudante(supabase, m.estudante_id)
            for (const resp of responsaveis) {
                if (resp.perfil_id) {
                    notifications.push({
                        titulo: `Mensalidade em atraso – ${meses[m.mes_referencia]}`,
                        mensagem: `A mensalidade de ${meses[m.mes_referencia]}/${m.ano_referencia} de ${nomeAluno} (${valor}) está em atraso. Regularize para evitar problemas.`,
                        tipo: 'financeiro',
                        subtipo: 'pagamento_atrasado',
                        destinatario_id: resp.perfil_id,
                        escola_id: escolaId,
                        referencia_id: m.id,
                        automatica: true,
                    })
                }
            }
        }
    }

    // Notificar diretora com resumo
    if (config?.notificar_diretora_atraso !== false) {
        const diretoras = await getDiretorasDaEscola(supabase, escolaId)
        const totalValor = atrasadas.reduce((sum, m) => sum + Number(m.valor), 0)
        const valorFormatado = totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

        for (const dir of diretoras) {
            notifications.push({
                titulo: `Resumo: ${atrasadas.length} mensalidades em atraso`,
                mensagem: `Existem ${atrasadas.length} mensalidades em atraso totalizando ${valorFormatado}. Acesse o painel financeiro para detalhes.`,
                tipo: 'financeiro',
                subtipo: 'pagamento_atrasado',
                destinatario_id: dir.id,
                escola_id: escolaId,
                automatica: true,
            })
        }
    }

    const enviados = await createBulkNotifications(supabase, notifications)
    return { enviados }
}

/**
 * Notificar pagamento confirmado
 */
export async function notificarPagamentoConfirmado(params: {
    escola_id: string
    estudante_id: string
    valor: number
    mes_referencia: number
    ano_referencia: number
}) {
    const supabase = await createClient()
    const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const valor = params.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const responsaveis = await getResponsaveisDoEstudante(supabase, params.estudante_id)

    for (const resp of responsaveis) {
        if (resp.perfil_id) {
            await createNotification(supabase, {
                titulo: 'Pagamento confirmado',
                mensagem: `Recebemos o pagamento de ${valor} referente a ${meses[params.mes_referencia]}/${params.ano_referencia}. Obrigada!`,
                tipo: 'financeiro',
                subtipo: 'pagamento_confirmado',
                destinatario_id: resp.perfil_id,
                escola_id: params.escola_id,
                automatica: true,
            })
        }
    }
}

// ============================================
// 4. NOTIFICAÇÕES PEDAGÓGICAS
// ============================================

/**
 * Notificar responsáveis sobre avaliação do aluno
 */
export async function notificarAvaliacaoDisponivel(params: {
    escola_id: string
    estudante_id: string
    turma_nome: string
    periodo: string
}) {
    const supabase = await createClient()
    const { perfil } = await getAuthenticatedUser()

    const responsaveis = await getResponsaveisDoEstudante(supabase, params.estudante_id)

    for (const resp of responsaveis) {
        if (resp.perfil_id) {
            await createNotification(supabase, {
                titulo: `Nova avaliação disponível`,
                mensagem: `A avaliação de ${params.periodo} na turma ${params.turma_nome} já está disponível no portal. Acesse para conferir o progresso.`,
                tipo: 'pedagogico',
                subtipo: 'avaliacao_disponivel',
                destinatario_id: resp.perfil_id,
                escola_id: params.escola_id,
                referencia_id: params.estudante_id,
                automatica: false,
            })
        }
    }
}

/**
 * Notificar turma sobre mudança de horário
 */
export async function notificarMudancaHorario(params: {
    escola_id: string
    turma_id: string
    turma_nome: string
    descricao: string
}) {
    const { perfil, supabase } = await getAuthenticatedUser()

    // Buscar todos os alunos da turma
    const { data: matriculas } = await supabase
        .from('matriculas_turmas')
        .select(`
            estudante_id,
            estudantes (
                estudantes_responsaveis (
                    responsaveis (perfil_id)
                )
            )
        `)
        .eq('turma_id', params.turma_id)
        .eq('status', 'ativo')

    const notifications: NotificationPayload[] = []

    // Notificar responsáveis
    const perfilIds = new Set<string>()
    matriculas?.forEach((m: any) => {
        m.estudantes?.estudantes_responsaveis?.forEach((er: any) => {
            if (er.responsaveis?.perfil_id) {
                perfilIds.add(er.responsaveis.perfil_id)
            }
        })
    })

    for (const perfilId of perfilIds) {
        notifications.push({
            titulo: `Mudança de horário – ${params.turma_nome}`,
            mensagem: params.descricao,
            tipo: 'informativo',
            subtipo: 'mudanca_horario',
            destinatario_id: perfilId,
            escola_id: params.escola_id,
            referencia_id: params.turma_id,
            automatica: false,
        })
    }

    // Notificar professor da turma
    const professor = await getProfessorDaTurma(supabase, params.turma_id)
    if (professor) {
        notifications.push({
            titulo: `Mudança de horário – ${params.turma_nome}`,
            mensagem: params.descricao,
            tipo: 'informativo',
            subtipo: 'mudanca_horario',
            destinatario_id: professor.id,
            escola_id: params.escola_id,
            referencia_id: params.turma_id,
            automatica: false,
        })
    }

    await createBulkNotifications(supabase, notifications)
    revalidatePath('/diretora/notificacoes')
    return { success: true, total: notifications.length }
}

// ============================================
// 5. NOTIFICAÇÕES DE EVENTOS
// ============================================

/**
 * Notificar todos sobre evento/apresentação
 */
export async function notificarEvento(params: {
    escola_id: string
    titulo: string
    descricao: string
    data_evento: string
    turma_ids?: string[] // Se vazio, notifica toda a escola
}) {
    const { perfil, supabase } = await getAuthenticatedUser()

    const notifications: NotificationPayload[] = []
    const perfilIds = new Set<string>()

    if (params.turma_ids && params.turma_ids.length > 0) {
        // Notificar apenas turmas específicas
        for (const turmaId of params.turma_ids) {
            const { data: matriculas } = await supabase
                .from('matriculas_turmas')
                .select(`
                    estudante_id,
                    estudantes (
                        estudantes_responsaveis (
                            responsaveis (perfil_id)
                        )
                    )
                `)
                .eq('turma_id', turmaId)
                .eq('status', 'ativo')

            matriculas?.forEach((m: any) => {
                m.estudantes?.estudantes_responsaveis?.forEach((er: any) => {
                    if (er.responsaveis?.perfil_id) {
                        perfilIds.add(er.responsaveis.perfil_id)
                    }
                })
            })

            // Notificar professor
            const professor = await getProfessorDaTurma(supabase, turmaId)
            if (professor) perfilIds.add(professor.id)
        }
    } else {
        // Notificar toda a escola - buscar todos responsáveis
        const { data: responsaveis } = await supabase
            .from('responsaveis')
            .select('perfil_id')
            .eq('escola_id', params.escola_id)
            .eq('ativo', true)

        responsaveis?.forEach(r => {
            if (r.perfil_id) perfilIds.add(r.perfil_id)
        })

        // Notificar todos os professores
        const { data: professores } = await supabase
            .from('perfis')
            .select('id')
            .eq('escola_id', params.escola_id)
            .eq('role', 'professor')

        professores?.forEach(p => perfilIds.add(p.id))
    }

    const dataFormatada = new Date(params.data_evento).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    })

    for (const perfilId of perfilIds) {
        notifications.push({
            titulo: params.titulo,
            mensagem: `${params.descricao}\n\nData: ${dataFormatada}`,
            tipo: 'evento',
            subtipo: 'evento_proximo',
            destinatario_id: perfilId,
            escola_id: params.escola_id,
            automatica: false,
        })
    }

    await createBulkNotifications(supabase, notifications)
    revalidatePath('/diretora/notificacoes')
    return { success: true, total: notifications.length }
}

// ============================================
// 6. NOTIFICAÇÕES DE MATRÍCULA
// ============================================

/**
 * Notificar diretora sobre nova matrícula
 */
export async function notificarNovaMatricula(params: {
    escola_id: string
    estudante_nome: string
    turma_nome: string
}) {
    const supabase = await createClient()

    const diretoras = await getDiretorasDaEscola(supabase, params.escola_id)

    for (const dir of diretoras) {
        await createNotification(supabase, {
            titulo: 'Nova matrícula realizada',
            mensagem: `${params.estudante_nome} foi matriculado(a) na turma ${params.turma_nome}.`,
            tipo: 'matricula',
            subtipo: 'nova_matricula',
            destinatario_id: dir.id,
            escola_id: params.escola_id,
            automatica: true,
        })
    }
}

/**
 * Notificar professora sobre novo aluno na turma
 */
export async function notificarNovoAlunoTurma(params: {
    escola_id: string
    turma_id: string
    turma_nome: string
    estudante_nome: string
}) {
    const supabase = await createClient()

    const professor = await getProfessorDaTurma(supabase, params.turma_id)
    if (professor) {
        await createNotification(supabase, {
            titulo: `Novo aluno na turma ${params.turma_nome}`,
            mensagem: `${params.estudante_nome} foi matriculado(a) na sua turma ${params.turma_nome}.`,
            tipo: 'matricula',
            subtipo: 'nova_matricula',
            destinatario_id: professor.id,
            escola_id: params.escola_id,
            automatica: true,
        })
    }
}

// ============================================
// 7. NOTIFICAÇÃO DE BOAS-VINDAS
// ============================================

export async function notificarBoasVindas(params: {
    escola_id: string
    destinatario_id: string
    nome: string
    escola_nome: string
}) {
    const supabase = await createClient()

    await createNotification(supabase, {
        titulo: `Bem-vindo(a) à ${params.escola_nome}!`,
        mensagem: `Olá, ${params.nome}! É uma alegria ter você conosco. Explore o portal para acompanhar tudo sobre a jornada na dança.`,
        tipo: 'informativo',
        subtipo: 'boas_vindas',
        destinatario_id: params.destinatario_id,
        escola_id: params.escola_id,
        automatica: true,
    })
}

// ============================================
// 8. BUSCAR NOTIFICAÇÕES DO USUÁRIO
// ============================================

export async function getMinhasNotificacoes(limite: number = 30) {
    const { user, perfil, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('escola_id', perfil.escola_id)
        .or(`destinatario_id.eq.${user.id},destinatario_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(limite)

    if (error) throw new Error(`Erro ao buscar notificações: ${error.message}`)

    return { data: data || [] }
}

export async function getContagemNaoLidas() {
    const { user, perfil, supabase } = await getAuthenticatedUser()

    const { count, error } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', perfil.escola_id)
        .or(`destinatario_id.eq.${user.id},destinatario_id.is.null`)
        .eq('lido', false)

    if (error) return { count: 0 }

    return { count: count || 0 }
}

export async function marcarComoLida(notificacaoId: string) {
    const { supabase } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('notificacoes')
        .update({ lido: true })
        .eq('id', notificacaoId)

    if (error) throw new Error(`Erro ao marcar como lida: ${error.message}`)

    return { success: true }
}

export async function marcarTodasComoLidas() {
    const { user, perfil, supabase } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('notificacoes')
        .update({ lido: true })
        .eq('escola_id', perfil.escola_id)
        .or(`destinatario_id.eq.${user.id},destinatario_id.is.null`)
        .eq('lido', false)

    if (error) throw new Error(`Erro ao marcar notificações: ${error.message}`)

    revalidatePath('/responsavel')
    revalidatePath('/professor')
    revalidatePath('/diretora')
    return { success: true }
}

// ============================================
// 9. ALERTAS ATIVOS (para dashboard da diretora)
// ============================================

export async function getAlertasAtivos() {
    const { perfil, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('alertas_faltas')
        .select(`
            *,
            estudantes (
                id,
                nome_responsavel,
                perfil_id
            ),
            turmas (
                id,
                nome
            )
        `)
        .eq('escola_id', perfil.escola_id)
        .eq('resolvido', false)
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar alertas: ${error.message}`)

    return { data: data || [] }
}

// ============================================
// 10. CONFIGURAÇÕES DE NOTIFICAÇÃO
// ============================================

export async function getConfigNotificacoes() {
    const { perfil, supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('config_notificacoes')
        .select('*')
        .eq('escola_id', perfil.escola_id)
        .single()

    if (error && error.code !== 'PGRST116') {
        throw new Error(`Erro ao buscar configurações: ${error.message}`)
    }

    // Retornar defaults se não existir
    return {
        data: data || {
            faltas_consecutivas_alerta: 3,
            notificar_responsavel_falta: true,
            notificar_diretora_falta: true,
            notificar_professora_falta: true,
            notificar_responsavel_vencimento: true,
            dias_antes_vencimento: 3,
            notificar_responsavel_atraso: true,
            notificar_diretora_atraso: true,
            notificar_responsavel_avaliacao: true,
            notificar_responsavel_evento: true,
            canal_padrao: 'app',
        }
    }
}

export async function updateConfigNotificacoes(rawData: Record<string, unknown>) {
    const { perfil, supabase } = await getAuthenticatedUser()

    if (!['diretora', 'super_admin'].includes(perfil.role)) {
        throw new Error('Acesso negado')
    }

    const { data, error } = await supabase
        .from('config_notificacoes')
        .upsert({
            escola_id: perfil.escola_id,
            ...rawData,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'escola_id' })
        .select()
        .single()

    if (error) throw new Error(`Erro ao atualizar configurações: ${error.message}`)

    revalidatePath('/diretora/notificacoes')
    return { success: true, data }
}

// ============================================
// 11. NOTIFICAÇÃO PÓS-CHAMADA (para professor/monitor)
// ============================================

/**
 * Chamada após registrar frequência - notifica responsáveis dos faltantes
 */
export async function notificarFaltaAula(params: {
    escola_id: string
    turma_id: string
    turma_nome: string
    faltantes: { estudante_id: string; nome: string }[]
}) {
    const supabase = await createClient()

    const notifications: NotificationPayload[] = []

    for (const faltante of params.faltantes) {
        const responsaveis = await getResponsaveisDoEstudante(supabase, faltante.estudante_id)

        for (const resp of responsaveis) {
            if (resp.perfil_id) {
                notifications.push({
                    titulo: `Falta registrada – ${params.turma_nome}`,
                    mensagem: `${faltante.nome} não compareceu à aula de hoje na turma ${params.turma_nome}.`,
                    tipo: 'alerta',
                    subtipo: 'falta_aula',
                    destinatario_id: resp.perfil_id,
                    escola_id: params.escola_id,
                    referencia_id: faltante.estudante_id,
                    automatica: true,
                })
            }
        }
    }

    await createBulkNotifications(supabase, notifications)
    return { enviados: notifications.length }
}

// ============================================
// 12. BAIXA FREQUÊNCIA DA TURMA (para diretora)
// ============================================

export async function verificarBaixaFrequenciaTurmas(escolaId: string) {
    const supabase = await createClient()
    const LIMIAR_BAIXA_FREQUENCIA = 60 // percentual

    const { data: turmas } = await supabase
        .from('turmas')
        .select(`
            id,
            nome,
            professor_id,
            matriculas_turmas (count)
        `)
        .eq('escola_id', escolaId)

    if (!turmas) return { alertas: 0 }

    const notifications: NotificationPayload[] = []
    const hoje = new Date()
    const seteDiasAtras = new Date(hoje)
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)

    for (const turma of turmas) {
        const totalAlunos = (turma.matriculas_turmas as any)?.[0]?.count || 0
        if (totalAlunos === 0) continue

        // Checkins da última semana nesta turma
        const { count: totalCheckins } = await supabase
            .from('checkins')
            .select('*', { count: 'exact', head: true })
            .eq('turma_id', turma.id)
            .gte('created_at', seteDiasAtras.toISOString())

        // Considerar que houve ~2 aulas na semana
        const esperado = totalAlunos * 2
        const taxa = esperado > 0 ? ((totalCheckins || 0) / esperado) * 100 : 100

        if (taxa < LIMIAR_BAIXA_FREQUENCIA) {
            const diretoras = await getDiretorasDaEscola(supabase, escolaId)
            for (const dir of diretoras) {
                notifications.push({
                    titulo: `Baixa frequência: ${turma.nome}`,
                    mensagem: `A turma ${turma.nome} teve apenas ${Math.round(taxa)}% de frequência na última semana. Recomendamos investigar.`,
                    tipo: 'alerta',
                    subtipo: 'baixa_frequencia_turma',
                    destinatario_id: dir.id,
                    escola_id: escolaId,
                    referencia_id: turma.id,
                    automatica: true,
                })
            }
        }
    }

    await createBulkNotifications(supabase, notifications)
    return { alertas: notifications.length }
}
