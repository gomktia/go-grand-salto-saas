import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ATENÇÃO: Este endpoint é temporário e deve ser removido após o uso!
// Ele configura o superadmin do sistema

export async function GET() {
    try {
        // Usar service role key para ter permissão total
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        const adminUserId = '0f8ef5c1-16f4-4fcc-a391-1fbd6611f7c0'
        const adminEmail = 'superadmin@grandsalto.com.br'

        // Verificar se o perfil já existe
        const { data: existingProfile } = await supabaseAdmin
            .from('perfis')
            .select('*')
            .eq('id', adminUserId)
            .single()

        if (existingProfile) {
            // Atualizar para superadmin
            const { error: updateError } = await supabaseAdmin
                .from('perfis')
                .update({
                    role: 'superadmin',
                    is_owner: true,
                    full_name: 'Super Administrador'
                })
                .eq('id', adminUserId)

            if (updateError) {
                return NextResponse.json({
                    success: false,
                    error: `Erro ao atualizar: ${updateError.message}`
                }, { status: 500 })
            }

            return NextResponse.json({
                success: true,
                message: 'Perfil atualizado para superadmin!',
                email: adminEmail,
                role: 'superadmin'
            })
        } else {
            // Criar novo perfil
            const { error: insertError } = await supabaseAdmin
                .from('perfis')
                .insert({
                    id: adminUserId,
                    escola_id: null,
                    full_name: 'Super Administrador',
                    email: adminEmail,
                    role: 'superadmin',
                    is_owner: true
                })

            if (insertError) {
                return NextResponse.json({
                    success: false,
                    error: `Erro ao criar perfil: ${insertError.message}`
                }, { status: 500 })
            }

            return NextResponse.json({
                success: true,
                message: 'Perfil superadmin criado com sucesso!',
                email: adminEmail,
                role: 'superadmin'
            })
        }

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: `Erro: ${error}`
        }, { status: 500 })
    }
}
