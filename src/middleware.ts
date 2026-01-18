import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Middleware de Roteamento Multi-Tenant + Auth Protection
 * Protege rotas privadas e suporta domínios customizados
 */
export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // 1. Definir o domínio principal do SaaS
    const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'grandsalto.ia'

    // 2. Limpar o hostname para remover portas em desenvolvimento
    const currentHost = hostname.replace(':3000', '')

    // 3. Casos Especiais: Ignorar arquivos estáticos e API
    if (
        url.pathname.startsWith('/_next') ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/static') ||
        url.pathname.includes('.') // Ignora arquivos com extensão (favicon.ico, png, etc)
    ) {
        return NextResponse.next()
    }

    // 4. Criar cliente Supabase para verificar autenticação
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // 5. Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser()

    // 6. Definir rotas protegidas (que exigem login)
    const protectedRoutes = ['/diretora', '/professor', '/aluno', '/responsavel', '/superadmin']
    const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route))

    // 7. Redirecionar para login se não autenticado
    if (isProtectedRoute && !user) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirectTo', url.pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 8. Lógica de Domínio Customizado (Multi-Tenancy)
    const customDomainsMap: Record<string, string> = {
        'espacorevelle.com.br': 'espaco-revelle',
        'www.espacorevelle.com.br': 'espaco-revelle',
        'revelle.grandsalto.ia': 'espaco-revelle',
    }

    const tenantSlug = customDomainsMap[currentHost]

    if (tenantSlug) {
        if (url.pathname.startsWith(`/${tenantSlug}`)) {
            return response
        }

        // Faz o rewrite transparente
        const rewriteUrl = new URL(`/espaco-revelle${url.pathname}`, request.url)
        return NextResponse.rewrite(rewriteUrl, {
            request: {
                headers: response.headers,
            },
        })
    }

    // 9. Casos de Acesso via Caminho (Path-Based)
    if (url.pathname.startsWith('/espaco-revelle')) {
        return response
    }

    // 10. Lógica de Subdomínios Dinâmicos
    if (currentHost.endsWith(`.${mainDomain}`) && currentHost !== mainDomain) {
        const subdomain = currentHost.replace(`.${mainDomain}`, '')
        // Futuro: rotear para sites dinâmicos
    }

    // 11. Fluxo padrão
    return response
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
