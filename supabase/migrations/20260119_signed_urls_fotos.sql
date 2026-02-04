-- ============================================
-- MIGRAÇÃO: Sistema de Download Seguro de Fotos
-- Data: 2026-01-19
-- ============================================

-- 1. RPC para incrementar vendas de foto
CREATE OR REPLACE FUNCTION increment_vendas_foto(foto_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.fotos_venda
    SET vendas = COALESCE(vendas, 0) + 1
    WHERE id = foto_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RPC para incrementar visualizações de post
CREATE OR REPLACE FUNCTION increment_visualizacoes_post(post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.posts_blog
    SET visualizacoes = COALESCE(visualizacoes, 0) + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Tabela de logs de download (auditoria)
CREATE TABLE IF NOT EXISTS public.download_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pedido_id UUID REFERENCES public.pedidos_fotos(id) ON DELETE CASCADE,
    foto_id UUID REFERENCES public.fotos_venda(id) ON DELETE SET NULL,
    ip_address TEXT,
    user_agent TEXT,
    downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para consultas de auditoria
CREATE INDEX IF NOT EXISTS idx_download_logs_pedido ON public.download_logs(pedido_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_foto ON public.download_logs(foto_id);

-- RLS para download_logs
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Apenas diretoras podem ver logs
CREATE POLICY "Diretoras podem ver logs de download"
ON public.download_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.perfis
        WHERE perfis.id = auth.uid()
        AND perfis.role IN ('diretora', 'super_admin')
    )
);

-- Sistema pode inserir logs
CREATE POLICY "Sistema pode inserir logs"
ON public.download_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Adicionar coluna de token único para downloads sem login
ALTER TABLE public.pedidos_fotos
ADD COLUMN IF NOT EXISTS download_token UUID DEFAULT gen_random_uuid();

-- Index para busca por token
CREATE INDEX IF NOT EXISTS idx_pedidos_fotos_token ON public.pedidos_fotos(download_token);

-- 5. Storage Policies para bucket fotos-venda
-- NOTA: Execute manualmente no Supabase Dashboard se o bucket não existir

-- Policy: Diretoras podem fazer upload
-- CREATE POLICY "Diretoras podem upload fotos"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--     bucket_id = 'fotos-venda'
--     AND EXISTS (
--         SELECT 1 FROM public.perfis
--         WHERE perfis.id = auth.uid()
--         AND perfis.role IN ('diretora', 'super_admin')
--     )
-- );

-- Policy: Todos podem visualizar watermarks (pasta watermark/)
-- CREATE POLICY "Publico pode ver watermarks"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (
--     bucket_id = 'fotos-venda'
--     AND (storage.foldername(name))[1] = 'watermark'
-- );

-- Policy: Apenas autenticados podem ver originais via signed URL
-- CREATE POLICY "Autenticados podem ver originais"
-- ON storage.objects FOR SELECT
-- TO authenticated
-- USING (
--     bucket_id = 'fotos-venda'
--     AND (storage.foldername(name))[1] = 'original'
-- );

-- Policy: Diretoras podem deletar
-- CREATE POLICY "Diretoras podem deletar fotos"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--     bucket_id = 'fotos-venda'
--     AND EXISTS (
--         SELECT 1 FROM public.perfis
--         WHERE perfis.id = auth.uid()
--         AND perfis.role IN ('diretora', 'super_admin')
--     )
-- );

-- 6. Função para verificar se download é permitido
CREATE OR REPLACE FUNCTION verificar_download_permitido(p_pedido_id UUID, p_token UUID DEFAULT NULL)
RETURNS TABLE (
    permitido BOOLEAN,
    motivo TEXT,
    pedido_id UUID,
    email_comprador TEXT
) AS $$
DECLARE
    v_pedido RECORD;
BEGIN
    -- Buscar pedido
    SELECT * INTO v_pedido
    FROM public.pedidos_fotos
    WHERE id = p_pedido_id;

    -- Pedido não encontrado
    IF v_pedido IS NULL THEN
        RETURN QUERY SELECT false, 'Pedido não encontrado'::TEXT, NULL::UUID, NULL::TEXT;
        RETURN;
    END IF;

    -- Verificar token se fornecido
    IF p_token IS NOT NULL AND v_pedido.download_token != p_token THEN
        RETURN QUERY SELECT false, 'Token inválido'::TEXT, v_pedido.id, v_pedido.email_comprador;
        RETURN;
    END IF;

    -- Verificar status de pagamento
    IF v_pedido.status != 'pago' THEN
        RETURN QUERY SELECT false, 'Pagamento não confirmado'::TEXT, v_pedido.id, v_pedido.email_comprador;
        RETURN;
    END IF;

    -- Verificar se download está liberado
    IF NOT v_pedido.liberado_para_download THEN
        RETURN QUERY SELECT false, 'Download não liberado'::TEXT, v_pedido.id, v_pedido.email_comprador;
        RETURN;
    END IF;

    -- Verificar expiração
    IF v_pedido.download_expira_em IS NOT NULL AND v_pedido.download_expira_em < NOW() THEN
        RETURN QUERY SELECT false, 'Link de download expirado'::TEXT, v_pedido.id, v_pedido.email_comprador;
        RETURN;
    END IF;

    -- Tudo OK
    RETURN QUERY SELECT true, 'Download permitido'::TEXT, v_pedido.id, v_pedido.email_comprador;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
