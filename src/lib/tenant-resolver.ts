/**
 * Utilitário de Resolução de Tenant
 * "Pensando Grande": Este arquivo centraliza a lógica de identificar qual escola
 * está sendo acessada, permitindo que o sistema seja 100% dinâmico.
 */

export interface TenantConfig {
    id: string;
    nome: string;
    slug: string;
    primaryColor: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    paperColor?: string;
    logo_url?: string;
}

// Simulando um banco de dados de tenants
const tenantsDB: Record<string, TenantConfig> = {
    'espaco-revelle': {
        id: '1',
        nome: 'Espaço Revelle',
        slug: 'espaco-revelle',
        primaryColor: '#c72d1c',   // Vermelho Vibrante
        secondaryColor: '#c29493', // Rosa Dusty
        accentColor: '#7d3e37',    // Bordo/Marrom Profundo
        backgroundColor: '#0c0b0b', // Preto Profundo (Base Dark)
        paperColor: '#f5eae6',      // Creme/Pergaminho (Base Light)
        logo_url: '/sites/espaco-revelle/logo.png'
    },
}

export function getTenantBySlug(slug: string): TenantConfig | null {
    return tenantsDB[slug] || null;
}

export function getTenantByHostname(hostname: string): TenantConfig | null {
    // Mesma lógica do middleware para mapear domínio -> slug
    const domainMap: Record<string, string> = {
        'espacorevelle.com.br': 'espaco-revelle',
        'revelle.grandsalto.ia': 'espaco-revelle'
    }

    const slug = domainMap[hostname];
    return slug ? getTenantBySlug(slug) : null;
}
