/**
 * Sistema de Roles do Grand Salto
 *
 * Estes valores DEVEM corresponder exatamente ao enum `user_role`
 * definido no Supabase (tabela perfis.role).
 */

export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    DIRETORA: 'diretora',
    PROFESSOR: 'professor',
    MONITOR: 'monitor',
    ESTUDANTE: 'estudante',
    RESPONSAVEL: 'responsavel',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

/**
 * Mapeamento de role → rota do dashboard
 */
export const ROLE_ROUTES: Record<UserRole, string> = {
    [USER_ROLES.SUPER_ADMIN]: '/superadmin',
    [USER_ROLES.DIRETORA]: '/diretora',
    [USER_ROLES.PROFESSOR]: '/professor',
    [USER_ROLES.MONITOR]: '/monitor',
    [USER_ROLES.ESTUDANTE]: '/aluno',
    [USER_ROLES.RESPONSAVEL]: '/responsavel',
}

/**
 * Labels em português para exibir na UI
 */
export const ROLE_LABELS: Record<UserRole, string> = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.DIRETORA]: 'Diretora',
    [USER_ROLES.PROFESSOR]: 'Professora',
    [USER_ROLES.MONITOR]: 'Monitor(a)',
    [USER_ROLES.ESTUDANTE]: 'Aluna',
    [USER_ROLES.RESPONSAVEL]: 'Responsável',
}

/**
 * Roles com acesso administrativo (gerenciam a escola)
 */
export const ADMIN_ROLES: UserRole[] = [
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.DIRETORA,
]

/**
 * Roles com acesso a turmas (lecionam ou auxiliam)
 */
export const STAFF_ROLES: UserRole[] = [
    USER_ROLES.PROFESSOR,
    USER_ROLES.MONITOR,
]

/**
 * Verifica se o role tem permissão de administrador
 */
export function isAdmin(role: UserRole): boolean {
    return ADMIN_ROLES.includes(role)
}

/**
 * Verifica se o role é staff (professor ou monitor)
 */
export function isStaff(role: UserRole): boolean {
    return STAFF_ROLES.includes(role)
}

/**
 * Rota protegida correspondente ao role
 */
export function getRouteForRole(role: string): string {
    // Suporte a formatos legados
    if (role === 'superadmin') return '/superadmin'
    if (role === 'responsavel') return '/responsavel'
    return ROLE_ROUTES[role as UserRole] || '/diretora'
}
