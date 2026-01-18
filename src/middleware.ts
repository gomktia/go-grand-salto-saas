import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware de Roteamento Multi-Tenant
 * Pensa em "Grande": Suporta domínios customizados e subdomínios.
 */
export function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // 1. Definir o domínio principal do SaaS (ajuste conforme seu domínio real)
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

    // 4. Lógica de Domínio Customizado
    // Aqui simulamos uma busca que futuramente será no banco de dados ou Edge Config
    const customDomainsMap: Record<string, string> = {
        'espacorevelle.com.br': 'espaco-revelle',
        'www.espacorevelle.com.br': 'espaco-revelle',
        'revelle.grandsalto.ia': 'espaco-revelle', // Exemplo de subdomínio
    }

    const tenantSlug = customDomainsMap[currentHost]

    if (tenantSlug) {
        console.log(`[Middleware] Roteando domínio ${currentHost} para o tenant: ${tenantSlug}`)

        // Faz o rewrite para a pasta do site do cliente
        // O usuário vê 'espacorevelle.com.br/' mas o Next serve 'src/app/(sites)/espaco-revelle/page.tsx'
        return NextResponse.rewrite(new URL(`/espaco-revelle${url.pathname}`, request.url))
    }

    // 5. Lógica de Subdomínios Dinâmicos (ex: escola1.grandsalto.ia)
    if (currentHost.endsWith(`.${mainDomain}`) && currentHost !== mainDomain) {
        const subdomain = currentHost.replace(`.${mainDomain}`, '')
        // Aqui você poderia rotear para uma pasta genérica de sites dinâmicos
        // return NextResponse.rewrite(new URL(`/(sites)/${subdomain}${url.pathname}`, request.url))
    }

    // 6. Se for o domínio principal ou não houver match, segue o fluxo normal (Página de Vendas do SaaS)
    return NextResponse.next()
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
