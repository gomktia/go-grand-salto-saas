'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { TenantConfig, getTenantBySlug } from '@/lib/tenant-resolver';

const TenantContext = createContext<TenantConfig | null>(null);

export function TenantProvider({ children, slug }: { children: ReactNode, slug: string }) {
    const tenant = getTenantBySlug(slug);

    return (
        <TenantContext.Provider value={tenant}>
            {children}
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const context = useContext(TenantContext);
    if (!context) {
        // Fallback para o tenant padrão se for a pioneira
        return getTenantBySlug('espaco-revelle');
    }
    return context;
}
