-- ============================================
-- CONFIGURAÇÃO DE BUCKETS ANTIGOS
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Configurar tipos permitidos para 'documentos-escola'
-- Permite PDF, Word, Excel e Imagens (scans)
update storage.buckets
set allowed_mime_types = array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', -- .docx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', -- .xlsx
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/webp'
]
where id = 'documentos-escola';

-- 2. Configurar tipos permitidos para 'fotos-apresentacoes'
-- Permite apenas imagens
update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
]
where id = 'fotos-apresentacoes';

-- 3. Verificação
select id, allowed_mime_types 
from storage.buckets 
where id in ('documentos-escola', 'fotos-apresentacoes');
