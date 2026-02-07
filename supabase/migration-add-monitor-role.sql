-- ============================================
-- MIGRAÇÃO: Adicionar role 'monitor' ao sistema
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Adicionar 'monitor' ao enum user_role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'monitor'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
  ) THEN
    ALTER TYPE user_role ADD VALUE 'monitor';
  END IF;
END $$;

-- 2. Adicionar coluna monitor_id na tabela turmas
ALTER TABLE public.turmas
  ADD COLUMN IF NOT EXISTS monitor_id uuid REFERENCES public.perfis(id);

-- Index para performance
CREATE INDEX IF NOT EXISTS idx_turmas_monitor ON public.turmas(monitor_id);

-- 3. Helper: Verifica se o usuário é professor da turma
CREATE OR REPLACE FUNCTION public.is_professor_of_turma(turma uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.turmas
    WHERE id = turma AND professor_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Helper: Verifica se o usuário é monitor da turma
CREATE OR REPLACE FUNCTION public.is_monitor_of_turma(turma uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.turmas
    WHERE id = turma AND monitor_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Helper: Verifica se o usuário é staff (professor ou monitor) de alguma turma na escola
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.perfis
    WHERE id = auth.uid() AND role IN ('professor', 'monitor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Atualizar is_diretora para incluir referência explícita
CREATE OR REPLACE FUNCTION public.is_diretora()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.perfis
    WHERE id = auth.uid() AND role IN ('diretora', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── RLS: TURMAS ─────────────────────────────────────────────────
-- Remover policy genérica que permite ver TODAS as turmas da escola
DROP POLICY IF EXISTS "School members can view classes" ON public.turmas;
DROP POLICY IF EXISTS "Diretora manages classes" ON public.turmas;
DROP POLICY IF EXISTS "Monitor views assigned classes" ON public.turmas;
DROP POLICY IF EXISTS "Professor views assigned classes" ON public.turmas;

-- Diretora/Super Admin: acesso total
CREATE POLICY "Diretora manages classes" ON public.turmas
  FOR ALL USING (is_diretora());

-- Professor: vê apenas turmas onde é professor
CREATE POLICY "Professor views assigned classes" ON public.turmas
  FOR SELECT USING (professor_id = auth.uid());

-- Monitor: vê APENAS turmas onde está alocado
CREATE POLICY "Monitor views assigned classes" ON public.turmas
  FOR SELECT USING (monitor_id = auth.uid());

-- Estudantes: vêem turmas onde estão matriculados
CREATE POLICY "Students view enrolled classes" ON public.turmas
  FOR SELECT USING (
    id IN (
      SELECT turma_id FROM public.matriculas_turmas
      WHERE estudante_id IN (
        SELECT id FROM public.estudantes WHERE perfil_id = auth.uid()
      )
    )
  );

-- ─── RLS: CHECKINS ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Staff can manage checkins" ON public.checkins;
DROP POLICY IF EXISTS "Diretora manages checkins" ON public.checkins;

-- Diretora: acesso total a checkins
CREATE POLICY "Diretora manages checkins" ON public.checkins
  FOR ALL USING (is_diretora());

-- Professor e Monitor: podem inserir checkins APENAS nas suas turmas
CREATE POLICY "Staff can manage checkins" ON public.checkins
  FOR INSERT WITH CHECK (
    turma_id IN (
      SELECT id FROM public.turmas
      WHERE professor_id = auth.uid() OR monitor_id = auth.uid()
    )
  );

-- Staff pode ver checkins das suas turmas
DROP POLICY IF EXISTS "Staff can view checkins" ON public.checkins;
CREATE POLICY "Staff can view checkins" ON public.checkins
  FOR SELECT USING (
    turma_id IN (
      SELECT id FROM public.turmas
      WHERE professor_id = auth.uid() OR monitor_id = auth.uid()
    )
    OR is_diretora()
  );

-- ─── RLS: MATRICULAS_TURMAS ─────────────────────────────────────
DROP POLICY IF EXISTS "Staff views enrollments" ON public.matriculas_turmas;

-- Professor e Monitor: vêem matrículas das suas turmas
CREATE POLICY "Staff views enrollments" ON public.matriculas_turmas
  FOR SELECT USING (
    turma_id IN (
      SELECT id FROM public.turmas
      WHERE professor_id = auth.uid() OR monitor_id = auth.uid()
    )
    OR is_diretora()
  );

-- ─── RLS: ESTUDANTES (adicionar acesso para staff) ──────────────
DROP POLICY IF EXISTS "Staff views students in their classes" ON public.estudantes;

CREATE POLICY "Staff views students in their classes" ON public.estudantes
  FOR SELECT USING (
    id IN (
      SELECT estudante_id FROM public.matriculas_turmas
      WHERE turma_id IN (
        SELECT id FROM public.turmas
        WHERE professor_id = auth.uid() OR monitor_id = auth.uid()
      )
    )
  );

-- ─── RLS: AGENDA_AULAS ──────────────────────────────────────────
DROP POLICY IF EXISTS "School members can view agenda" ON public.agenda_aulas;
DROP POLICY IF EXISTS "Diretora manages agenda" ON public.agenda_aulas;
DROP POLICY IF EXISTS "Staff views their agenda" ON public.agenda_aulas;

CREATE POLICY "Diretora manages agenda" ON public.agenda_aulas
  FOR ALL USING (is_diretora());

CREATE POLICY "Staff views their agenda" ON public.agenda_aulas
  FOR SELECT USING (
    turma_id IN (
      SELECT id FROM public.turmas
      WHERE professor_id = auth.uid() OR monitor_id = auth.uid()
    )
  );

-- ─── VERIFICAÇÃO ─────────────────────────────────────────────────
SELECT 'ENUM user_role:' AS status;
SELECT enumlabel FROM pg_enum
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

SELECT 'MONITOR_ID na turmas:' AS status;
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'turmas' AND column_name = 'monitor_id';

SELECT 'POLICIES atualizadas:' AS status;
SELECT policyname, tablename FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
