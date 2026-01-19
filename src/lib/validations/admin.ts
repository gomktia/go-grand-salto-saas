import { z } from 'zod'

export const studentSchema = z.object({
    data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
    nome_responsavel: z.string().min(3, 'Nome do responsável deve ter pelo menos 3 caracteres'),
    contato_responsavel: z.string().min(8, 'Contato deve ter pelo menos 8 caracteres'),
    status_matricula: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
    observacoes_medicas: z.string().optional(),
})

export const studentUpdateSchema = z.object({
    id: z.string().uuid(),
    data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
    nome_responsavel: z.string().min(3, 'Nome do responsável deve ter pelo menos 3 caracteres'),
    contato_responsavel: z.string().min(8, 'Contato deve ter pelo menos 8 caracteres'),
    status_matricula: z.enum(['ativo', 'inativo', 'pendente']),
    observacoes_medicas: z.string().optional(),
})

export const bodyMetricsSchema = z.object({
    estudante_id: z.string().uuid(),
    busto: z.number().min(0).max(200).optional(),
    cintura: z.number().min(0).max(200).optional(),
    quadril: z.number().min(0).max(200).optional(),
    altura: z.number().min(0).max(250).optional(),
    torso: z.number().min(0).max(200).optional(),
    data_medicao: z.string().optional(),
})

export const bodyMetricsInputSchema = z.object({
    estudante_id: z.string().uuid(),
    busto: z.string().transform(val => val ? parseFloat(val) : undefined),
    cintura: z.string().transform(val => val ? parseFloat(val) : undefined),
    quadril: z.string().transform(val => val ? parseFloat(val) : undefined),
    altura: z.string().transform(val => val ? parseFloat(val) : undefined),
    torso: z.string().transform(val => val ? parseFloat(val) : undefined),
})

export const costumeSchema = z.object({
    nome: z.string().min(2, 'Nome é obrigatório'),
    tamanho: z.string(),
    quantidade: z.number().int().min(0),
    preco_locacao: z.number().min(0).optional(),
    status_limpeza: z.enum(['limpo', 'lavando', 'sujo']).default('limpo'),
})

// Turmas
export const turmaSchema = z.object({
    nome: z.string().min(2, 'Nome da turma é obrigatório'),
    nivel: z.string().min(1, 'Nível é obrigatório'),
    vagas_max: z.number().int().min(1, 'Número de vagas deve ser maior que 0').max(50, 'Máximo de 50 vagas'),
    cor_etiqueta: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida').optional(),
    professor_id: z.string().uuid().optional(),
})

export const turmaUpdateSchema = z.object({
    id: z.string().uuid(),
    nome: z.string().min(2, 'Nome da turma é obrigatório'),
    nivel: z.string().min(1, 'Nível é obrigatório'),
    vagas_max: z.number().int().min(1, 'Número de vagas deve ser maior que 0').max(50, 'Máximo de 50 vagas'),
    cor_etiqueta: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida').optional(),
    professor_id: z.string().uuid().optional(),
})

// Horários/Agenda
export const agendaAulaSchema = z.object({
    turma_id: z.string().uuid(),
    dia_semana: z.number().int().min(0, 'Dia inválido').max(6, 'Dia inválido'),
    hora_inicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
    hora_fim: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
    sala: z.string().optional(),
})

export const agendaAulaUpdateSchema = z.object({
    id: z.string().uuid(),
    dia_semana: z.number().int().min(0).max(6),
    hora_inicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    hora_fim: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    sala: z.string().optional(),
})

// Matrículas
export const matriculaSchema = z.object({
    estudante_id: z.string().uuid(),
    turma_id: z.string().uuid(),
    status: z.enum(['ativo', 'inativo', 'trancado']).default('ativo'),
})

// Recursos de Turmas (Mídia)
export const recursoTurmaSchema = z.object({
    turma_id: z.string().uuid('ID da turma inválido'),
    titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200, 'Título muito longo'),
    descricao: z.string().max(1000, 'Descrição muito longa').optional(),
    tipo: z.enum(['video', 'audio', 'documento', 'link'], {
        message: 'Tipo deve ser: video, audio, documento ou link'
    }),
    url_externa: z.string().url('URL inválida').optional(),
    is_publico: z.boolean().default(true),
    ordem: z.number().int().min(0).default(0),
})

export const recursoTurmaUpdateSchema = recursoTurmaSchema.extend({
    id: z.string().uuid('ID do recurso inválido'),
})

// Upload de arquivo (FormData)
export const uploadRecursoSchema = z.object({
    turma_id: z.string().uuid(),
    titulo: z.string().min(3).max(200),
    descricao: z.string().max(1000).optional(),
    tipo: z.enum(['video', 'audio', 'documento']),
    is_publico: z.boolean().default(true),
    ordem: z.number().int().min(0).default(0),
    // Arquivo será validado separadamente (tamanho, tipo MIME)
})

// Progresso de visualização
export const progressoRecursoSchema = z.object({
    recurso_id: z.string().uuid('ID do recurso inválido'),
    progresso_segundos: z.number().int().min(0, 'Progresso não pode ser negativo'),
    completado: z.boolean().default(false),
})

// Validação de arquivo de vídeo
export const videoFileSchema = z.object({
    size: z.number().max(500 * 1024 * 1024, 'Vídeo deve ter no máximo 500MB'),
    type: z.string().refine(
        (type) => ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'].includes(type),
        'Formato de vídeo não suportado. Use: MP4, WebM, OGG ou MOV'
    ),
})

// Validação de arquivo de áudio
export const audioFileSchema = z.object({
    size: z.number().max(50 * 1024 * 1024, 'Áudio deve ter no máximo 50MB'),
    type: z.string().refine(
        (type) => ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac'].includes(type),
        'Formato de áudio não suportado. Use: MP3, WAV, OGG ou AAC'
    ),
})

// Validação de arquivo de documento
export const documentoFileSchema = z.object({
    size: z.number().max(20 * 1024 * 1024, 'Documento deve ter no máximo 20MB'),
    type: z.string().refine(
        (type) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(type),
        'Formato de documento não suportado. Use: PDF, DOC ou DOCX'
    ),
})

// Configurações do Tenant (White Label)
export const tenantSettingsSchema = z.object({
    nome: z.string().min(2, 'Nome da escola é obrigatório').optional(),
    logo_url: z.string().url('URL da logo inválida').optional().or(z.literal('')),
    primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida').optional(),
})
