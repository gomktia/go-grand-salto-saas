-- ============================================
-- SCHEMA: Sistema de Monitoras/Estagiárias
-- ============================================
-- Este schema permite que alunas também sejam monitoras em outras turmas,
-- com permissões limitadas para fazer chamada e acompanhar alunos.

-- 1. Adicionar 'monitora' ao enum de roles (se ainda não existir)
-- NOTA: Execute este comando separadamente se der erro
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'monitora' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'monitora';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Enum value monitora may already exist or enum does not exist';
END $$;

-- 2. Tabela de vínculo monitora-turma
-- Uma monitora pode estar vinculada a múltiplas turmas
CREATE TABLE IF NOT EXISTS monitoras_turmas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
    turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    escola_id UUID NOT NULL REFERENCES escolas(id) ON DELETE CASCADE,

    -- Permissões específicas da monitora nesta turma
    pode_chamada BOOLEAN DEFAULT true,           -- Pode registrar presença
    pode_avaliar BOOLEAN DEFAULT false,          -- Pode dar notas/avaliações
    pode_ver_observacoes BOOLEAN DEFAULT false,  -- Pode ver observações médicas
    pode_enviar_recados BOOLEAN DEFAULT false,   -- Pode enviar mensagens aos pais

    -- Metadata
    data_inicio DATE DEFAULT CURRENT_DATE,       -- Quando começou a monitorar
    data_fim DATE,                               -- Se saiu da monitoria
    ativo BOOLEAN DEFAULT true,
    observacoes TEXT,                            -- Notas da diretora sobre a monitora

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(perfil_id, turma_id)                  -- Uma monitora por turma (evita duplicatas)
);

-- 3. Tabela para suportar múltiplos perfis por usuário
-- Permite que uma pessoa seja aluna E monitora ao mesmo tempo
CREATE TABLE IF NOT EXISTS perfis_secundarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_principal_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
    role_secundario user_role NOT NULL,
    escola_id UUID NOT NULL REFERENCES escolas(id) ON DELETE CASCADE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Uma pessoa só pode ter um perfil secundário de cada tipo
    UNIQUE(perfil_principal_id, role_secundario)
);

-- 4. Índices para performance
CREATE INDEX IF NOT EXISTS idx_monitoras_turmas_perfil ON monitoras_turmas(perfil_id);
CREATE INDEX IF NOT EXISTS idx_monitoras_turmas_turma ON monitoras_turmas(turma_id);
CREATE INDEX IF NOT EXISTS idx_monitoras_turmas_escola ON monitoras_turmas(escola_id);
CREATE INDEX IF NOT EXISTS idx_monitoras_turmas_ativo ON monitoras_turmas(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_perfis_secundarios_principal ON perfis_secundarios(perfil_principal_id);

-- 5. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_monitoras_turmas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_monitoras_turmas_updated_at ON monitoras_turmas;
CREATE TRIGGER trigger_monitoras_turmas_updated_at
    BEFORE UPDATE ON monitoras_turmas
    FOR EACH ROW
    EXECUTE FUNCTION update_monitoras_turmas_updated_at();

-- 6. RLS Policies para monitoras_turmas
ALTER TABLE monitoras_turmas ENABLE ROW LEVEL SECURITY;

-- Diretora pode ver e gerenciar todas as monitoras da escola
CREATE POLICY "Diretora gerencia monitoras" ON monitoras_turmas
    FOR ALL
    USING (
        escola_id IN (
            SELECT escola_id FROM perfis
            WHERE id = auth.uid()
            AND (role = 'diretora' OR role = 'super_admin')
        )
    );

-- Monitora pode ver apenas seus próprios vínculos
CREATE POLICY "Monitora ve seus vinculos" ON monitoras_turmas
    FOR SELECT
    USING (perfil_id = auth.uid());

-- Professor pode ver monitoras das suas turmas
CREATE POLICY "Professor ve monitoras da turma" ON monitoras_turmas
    FOR SELECT
    USING (
        turma_id IN (
            SELECT id FROM turmas WHERE professor_id = auth.uid()
        )
    );

-- 7. RLS para perfis_secundarios
ALTER TABLE perfis_secundarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve seus perfis secundarios" ON perfis_secundarios
    FOR SELECT
    USING (perfil_principal_id = auth.uid());

CREATE POLICY "Diretora gerencia perfis secundarios" ON perfis_secundarios
    FOR ALL
    USING (
        escola_id IN (
            SELECT escola_id FROM perfis
            WHERE id = auth.uid()
            AND (role = 'diretora' OR role = 'super_admin')
        )
    );

-- 8. View útil para listar monitoras com detalhes
CREATE OR REPLACE VIEW view_monitoras_detalhes AS
SELECT
    mt.id,
    mt.turma_id,
    mt.escola_id,
    mt.pode_chamada,
    mt.pode_avaliar,
    mt.pode_ver_observacoes,
    mt.pode_enviar_recados,
    mt.ativo,
    mt.data_inicio,
    mt.created_at,
    p.id as perfil_id,
    p.full_name as monitora_nome,
    p.avatar_url as monitora_avatar,
    t.nome as turma_nome,
    t.nivel as turma_nivel,
    t.cor_etiqueta as turma_cor,
    e.nome as escola_nome
FROM monitoras_turmas mt
JOIN perfis p ON mt.perfil_id = p.id
JOIN turmas t ON mt.turma_id = t.id
JOIN escolas e ON mt.escola_id = e.id
WHERE mt.ativo = true;

-- 9. Função helper para verificar se usuário é monitora de uma turma
CREATE OR REPLACE FUNCTION is_monitora_da_turma(p_turma_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM monitoras_turmas
        WHERE perfil_id = auth.uid()
        AND turma_id = p_turma_id
        AND ativo = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Função helper para obter permissões da monitora em uma turma
CREATE OR REPLACE FUNCTION get_permissoes_monitora(p_turma_id UUID)
RETURNS TABLE (
    pode_chamada BOOLEAN,
    pode_avaliar BOOLEAN,
    pode_ver_observacoes BOOLEAN,
    pode_enviar_recados BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        mt.pode_chamada,
        mt.pode_avaliar,
        mt.pode_ver_observacoes,
        mt.pode_enviar_recados
    FROM monitoras_turmas mt
    WHERE mt.perfil_id = auth.uid()
    AND mt.turma_id = p_turma_id
    AND mt.ativo = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Função para verificar se usuário tem múltiplos perfis
CREATE OR REPLACE FUNCTION get_perfis_usuario()
RETURNS TABLE (
    role user_role,
    is_principal BOOLEAN
) AS $$
BEGIN
    -- Retorna o perfil principal
    RETURN QUERY
    SELECT p.role, true as is_principal
    FROM perfis p
    WHERE p.id = auth.uid();

    -- Retorna perfis secundários
    RETURN QUERY
    SELECT ps.role_secundario, false as is_principal
    FROM perfis_secundarios ps
    WHERE ps.perfil_principal_id = auth.uid()
    AND ps.ativo = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE monitoras_turmas IS 'Vínculo entre monitoras/estagiárias e as turmas que elas ajudam';
COMMENT ON TABLE perfis_secundarios IS 'Permite que usuários tenham múltiplos roles (ex: aluna + monitora)';
COMMENT ON COLUMN monitoras_turmas.pode_chamada IS 'Se a monitora pode registrar presença dos alunos';
COMMENT ON COLUMN monitoras_turmas.pode_avaliar IS 'Se a monitora pode dar notas de avaliação técnica';
COMMENT ON COLUMN monitoras_turmas.pode_ver_observacoes IS 'Se pode ver observações médicas e restrições dos alunos';
COMMENT ON COLUMN monitoras_turmas.pode_enviar_recados IS 'Se pode enviar notificações/recados para os pais';
