'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { studentSchema, bodyMetricsSchema, costumeSchema } from '@/lib/validations/admin'

export async function createStudent(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        fullName: formData.get('fullName'),
        guardianName: formData.get('guardianName'),
        guardianContact: formData.get('guardianContact'),
        status: formData.get('status'),
    }

    const validated = studentSchema.parse(rawData)

    const { data, error } = await supabase
        .from('estudantes')
        .insert([{
            // Note: school_id should be grabbed from session in a real app
            nome_responsavel: validated.guardianName,
            contato_responsavel: validated.guardianContact,
            status_matricula: validated.status,
        }])

    if (error) throw new Error(error.message)

    revalidatePath('/diretora/alunos')
    return { success: true }
}

export async function updateBodyMetrics(values: any) {
    const supabase = await createClient()
    const validated = bodyMetricsSchema.parse(values)

    const { data, error } = await supabase
        .from('metricas_corpo')
        .upsert([validated])

    if (error) throw new Error(error.message)

    revalidatePath('/diretora/alunos')
    return { success: true }
}
