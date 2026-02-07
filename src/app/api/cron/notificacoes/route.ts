import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import {
    verificarFaltasConsecutivas,
    verificarVencimentosProximos,
    verificarMensalidadesAtrasadas,
    verificarBaixaFrequenciaTurmas,
} from '@/app/actions/notificacoes'

/**
 * CRON: Verifica faltas consecutivas, vencimentos e atrasos para TODAS as escolas.
 *
 * Configurar no Vercel Cron (vercel.json):
 *   Executa diariamente às 08:00 UTC (05:00 BRT)
 *
 * Protegido por CRON_SECRET para evitar execução não autorizada.
 */

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 segundos para processar todas as escolas

export async function GET(request: NextRequest) {
    try {
        // Validar autorização
        const authHeader = request.headers.get('authorization')
        const cronSecret = process.env.CRON_SECRET

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Usar service role para acessar todas as escolas
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        )

        // Buscar todas as escolas ativas
        const { data: escolas, error } = await supabaseAdmin
            .from('escolas')
            .select('id, nome')

        if (error || !escolas) {
            return NextResponse.json(
                { error: 'Erro ao buscar escolas', details: error?.message },
                { status: 500 }
            )
        }

        const resultados = {
            escolas_processadas: 0,
            total_alertas_faltas: 0,
            total_lembretes_vencimento: 0,
            total_alertas_atraso: 0,
            total_alertas_frequencia: 0,
            erros: [] as string[],
        }

        for (const escola of escolas) {
            try {
                // 1. Verificar faltas consecutivas
                const faltas = await verificarFaltasConsecutivas(escola.id)
                resultados.total_alertas_faltas += faltas.alertas

                // 2. Verificar vencimentos próximos
                const vencimentos = await verificarVencimentosProximos(escola.id)
                resultados.total_lembretes_vencimento += vencimentos.enviados

                // 3. Verificar mensalidades atrasadas
                const atrasos = await verificarMensalidadesAtrasadas(escola.id)
                resultados.total_alertas_atraso += atrasos.enviados

                // 4. Verificar baixa frequência (apenas uma vez por semana - segunda-feira)
                const hoje = new Date()
                if (hoje.getDay() === 1) {
                    const frequencia = await verificarBaixaFrequenciaTurmas(escola.id)
                    resultados.total_alertas_frequencia += frequencia.alertas
                }

                resultados.escolas_processadas++
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Erro desconhecido'
                resultados.erros.push(`${escola.nome}: ${msg}`)
                console.error(`Cron error for escola ${escola.nome}:`, err)
            }
        }

        console.log('Cron notificações executado:', resultados)

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            ...resultados,
        })
    } catch (error) {
        console.error('Cron notificações - erro fatal:', error)
        return NextResponse.json(
            { error: 'Erro interno no cron' },
            { status: 500 }
        )
    }
}
