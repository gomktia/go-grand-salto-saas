-- Migration: Adicionar campos de cadastro de escola para emissão de nota fiscal
-- Data: 2026-01-20

-- =============================================
-- CAMPOS DA EMPRESA (PARA NOTA FISCAL)
-- =============================================
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS razao_social TEXT;
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS cnpj VARCHAR(14) UNIQUE;
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS inscricao_estadual VARCHAR(20);
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS inscricao_municipal VARCHAR(20);

-- =============================================
-- ENDEREÇO
-- =============================================
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS cep VARCHAR(8);
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS logradouro TEXT;
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS numero VARCHAR(20);
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS complemento TEXT;
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS bairro TEXT;
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS cidade TEXT;
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS estado VARCHAR(2);

-- =============================================
-- CONTATO
-- =============================================
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS telefone VARCHAR(11);
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(11);
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS website TEXT;

-- =============================================
-- STATUS E ASSINATURA
-- =============================================
-- Adicionar coluna status (não existia antes)
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ativo';

-- Adicionar coluna de período de cobrança
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS periodo_cobranca VARCHAR(10) DEFAULT 'mensal';

-- Adicionar data de fim do trial
ALTER TABLE escolas ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ;

-- Adicionar constraint de status após criar a coluna
DO $$
BEGIN
    -- Remover constraint antiga se existir
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'escolas_status_check') THEN
        ALTER TABLE escolas DROP CONSTRAINT escolas_status_check;
    END IF;

    -- Adicionar nova constraint
    ALTER TABLE escolas ADD CONSTRAINT escolas_status_check
        CHECK (status IN ('ativo', 'inativo', 'trial', 'suspenso', 'cancelado'));
EXCEPTION
    WHEN others THEN
        NULL; -- Ignorar erros
END $$;

-- Adicionar constraint de período de cobrança
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'escolas_periodo_cobranca_check') THEN
        ALTER TABLE escolas DROP CONSTRAINT escolas_periodo_cobranca_check;
    END IF;

    ALTER TABLE escolas ADD CONSTRAINT escolas_periodo_cobranca_check
        CHECK (periodo_cobranca IN ('mensal', 'anual'));
EXCEPTION
    WHEN others THEN
        NULL;
END $$;

-- =============================================
-- CAMPOS DO PERFIL (RESPONSÁVEL)
-- =============================================
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS cpf VARCHAR(11);
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS telefone VARCHAR(11);
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS is_owner BOOLEAN DEFAULT false;

-- =============================================
-- TABELA DE ASSINATURAS
-- =============================================
CREATE TABLE IF NOT EXISTS assinaturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escola_id UUID NOT NULL REFERENCES escolas(id) ON DELETE CASCADE,
    plano VARCHAR(20) NOT NULL,
    periodo VARCHAR(10) NOT NULL DEFAULT 'mensal',
    status VARCHAR(20) NOT NULL DEFAULT 'trial',
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    data_inicio TIMESTAMPTZ,
    data_fim TIMESTAMPTZ,
    valor_mensal DECIMAL(10,2),
    valor_anual DECIMAL(10,2),
    asaas_subscription_id TEXT,
    asaas_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(escola_id)
);

-- Adicionar constraints na tabela assinaturas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assinaturas_plano_check') THEN
        ALTER TABLE assinaturas ADD CONSTRAINT assinaturas_plano_check
            CHECK (plano IN ('starter', 'professional', 'enterprise', 'free', 'pro'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assinaturas_periodo_check') THEN
        ALTER TABLE assinaturas ADD CONSTRAINT assinaturas_periodo_check
            CHECK (periodo IN ('mensal', 'anual'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assinaturas_status_check') THEN
        ALTER TABLE assinaturas ADD CONSTRAINT assinaturas_status_check
            CHECK (status IN ('trial', 'ativo', 'cancelado', 'suspenso', 'inadimplente'));
    END IF;
EXCEPTION
    WHEN others THEN
        NULL;
END $$;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;

-- Política para superadmins verem todas as assinaturas
DO $$
BEGIN
    DROP POLICY IF EXISTS "Superadmins podem ver todas assinaturas" ON assinaturas;
    CREATE POLICY "Superadmins podem ver todas assinaturas" ON assinaturas
        FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM perfis
                WHERE perfis.id = auth.uid()
                AND perfis.role = 'superadmin'
            )
        );
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- Política para diretores verem assinaturas de sua escola
DO $$
BEGIN
    DROP POLICY IF EXISTS "Diretores podem ver assinatura de sua escola" ON assinaturas;
    CREATE POLICY "Diretores podem ver assinatura de sua escola" ON assinaturas
        FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM perfis
                WHERE perfis.id = auth.uid()
                AND perfis.escola_id = assinaturas.escola_id
                AND perfis.role = 'diretora'
            )
        );
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_escolas_cnpj ON escolas(cnpj);
CREATE INDEX IF NOT EXISTS idx_escolas_slug ON escolas(slug);
CREATE INDEX IF NOT EXISTS idx_escolas_status ON escolas(status);
CREATE INDEX IF NOT EXISTS idx_escolas_trial_end ON escolas(trial_end_date);
CREATE INDEX IF NOT EXISTS idx_assinaturas_escola ON assinaturas(escola_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_perfis_cpf ON perfis(cpf);

-- =============================================
-- FUNÇÃO E TRIGGER PARA VERIFICAR TRIAL
-- =============================================
CREATE OR REPLACE FUNCTION check_trial_expired()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'trial' AND NEW.trial_end_date IS NOT NULL AND NEW.trial_end_date < NOW() THEN
        NEW.status := 'suspenso';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_check_trial_expired ON escolas;
CREATE TRIGGER trigger_check_trial_expired
    BEFORE UPDATE ON escolas
    FOR EACH ROW
    EXECUTE FUNCTION check_trial_expired();

-- =============================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =============================================
COMMENT ON COLUMN escolas.razao_social IS 'Razão social da empresa para emissão de NF';
COMMENT ON COLUMN escolas.cnpj IS 'CNPJ da empresa (apenas números)';
COMMENT ON COLUMN escolas.inscricao_estadual IS 'Inscrição estadual da empresa';
COMMENT ON COLUMN escolas.inscricao_municipal IS 'Inscrição municipal da empresa';
COMMENT ON COLUMN escolas.trial_end_date IS 'Data de término do período de teste gratuito';
COMMENT ON COLUMN escolas.periodo_cobranca IS 'Período de cobrança: mensal ou anual';
COMMENT ON COLUMN escolas.status IS 'Status da escola: ativo, inativo, trial, suspenso, cancelado';
COMMENT ON COLUMN perfis.is_owner IS 'Indica se é o proprietário/responsável principal da escola';
COMMENT ON TABLE assinaturas IS 'Controle de assinaturas e planos das escolas';
