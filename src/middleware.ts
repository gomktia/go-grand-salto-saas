import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Middleware de Roteamento Multi-Tenant + Auth Protection
 * Protege rotas privadas e suporta domínios customizados
 */
export async function middleware(request: NextRequest) {
    try {
        // 1. Inicializar response base
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })

        // Defesa: se não houver variáveis, não tente autênticar (evita crash no build/deploy)
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.warn('Variáveis de ambiente do Supabase não configuradas no Middleware.')
            return response
        }

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value)
                        })
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, options)
                        })
                    },
                },
            }
        )

        // 2. Verificar autenticação (refresca sessão se necessário)
        const { data: { user } } = await supabase.auth.getUser()

        // 3. Definir URL e Host
        const url = request.nextUrl
        const hostname = request.headers.get('host') || ''
        const currentHost = hostname.replace(':3000', '')
        const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'grandsalto.ia'

        // 4. Ignorar estáticos (redundante com matcher, mas seguro)
        if (
            url.pathname.startsWith('/_next') ||
            url.pathname.startsWith('/api') ||
            url.pathname.startsWith('/static') ||
            url.pathname.includes('.')
        ) {
            return response
        }

        // 5. Proteção de Rotas
        const protectedRoutes = ['/diretora', '/professor', '/monitor', '/aluno', '/responsavel', '/superadmin']
        const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route))

        if (isProtectedRoute && !user) {
            const loginUrl = request.nextUrl.clone()
            loginUrl.pathname = '/login'
            loginUrl.searchParams.set('redirectTo', url.pathname)
            return NextResponse.redirect(loginUrl)
        }

        // 6. Multi-Tenancy (Custom Domains & Subdomains)
        const customDomainsMap: Record<string, string> = {
            'espacorevelle.com.br': 'espaco-revelle',
            'www.espacorevelle.com.br': 'espaco-revelle',
            'revelle.grandsalto.ia': 'espaco-revelle',
        }
        const tenantSlug = customDomainsMap[currentHost]

        if (tenantSlug) {
            if (!url.pathname.startsWith(`/${tenantSlug}`)) {
                // Rewrite transparente: Mantém URL do navegador, serve conteúdo do tenant
                const rewriteUrl = request.nextUrl.clone()
                rewriteUrl.pathname = `/${tenantSlug}${url.pathname}`
                return NextResponse.rewrite(rewriteUrl)
            }
        }

        return response
    } catch (e) {
        // Fail-open: Em caso de erro grave no middleware, permite o acesso mas loga o erro
        console.error('Middleware Error:', e)
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        })
    }
}

export const config = {
    matcher: [
        /*
         * Captura todas as rotas para processamento do multi-tenancy,
         * exceto as rotas de sistema que já filtramos dentro do middleware.
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
