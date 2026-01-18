import { z } from 'zod'

export const studentSchema = z.object({
    fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    birthDate: z.string().optional(),
    guardianName: z.string().min(3, 'Nome do responsável é obrigatório'),
    guardianContact: z.string().min(8, 'Contato inválido'),
    status: z.enum(['ativo', 'inativo', 'pendente']).default('ativo'),
})

export const bodyMetricsSchema = z.object({
    estudante_id: z.string().uuid(),
    busto: z.number().min(0).optional(),
    cintura: z.number().min(0).optional(),
    quadril: z.number().min(0).optional(),
    altura: z.number().min(0).optional(),
    torso: z.number().min(0).optional(),
})

export const costumeSchema = z.object({
    nome: z.string().min(2, 'Nome é obrigatório'),
    tamanho: z.string(),
    quantidade: z.number().int().min(0),
    preco_locacao: z.number().min(0).optional(),
    status_limpeza: z.enum(['limpo', 'lavando', 'sujo']).default('limpo'),
})
