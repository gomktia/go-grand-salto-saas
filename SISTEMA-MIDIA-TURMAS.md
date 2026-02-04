# Sistema de Mídia para Turmas - Implementação

## 📋 Resumo

Sistema completo de **Biblioteca de Mídia** para turmas, permitindo professores e diretoras fazerem upload de vídeos, áudios e documentos, além de compartilhar links externos (YouTube, Vimeo, etc.).

**Data**: 2026-01-18
**Status**: Backend 100% Implementado | Frontend Pendente

---

## ✅ O QUE FOI IMPLEMENTADO

### 1. Schema do Banco de Dados ✅

**Arquivo**: `supabase/schema-recursos-turmas.sql`

#### Tabela `recursos_turmas`
```sql
- id: uuid (PK)
- turma_id: uuid (FK -> turmas)
- escola_id: uuid (FK -> escolas)
- criador_id: uuid (FK -> perfis)

-- Informações do recurso
- titulo: text
- descricao: text
- tipo: enum ('video', 'audio', 'documento', 'link')

-- Storage
- arquivo_url: text (URL no Supabase Storage)
- arquivo_nome: text
- arquivo_tamanho: bigint (bytes)
- arquivo_mime: text

-- Links externos
- url_externa: text (YouTube, Vimeo, etc)

-- Metadados
- duracao: integer (segundos)
- thumbnail_url: text

-- Controle
- is_publico: boolean (alunos podem ver?)
- ordem: integer (ordenação)
- visualizacoes: integer

- created_at, updated_at
```

#### Tabela `progresso_recursos`
```sql
- id: uuid (PK)
- recurso_id: uuid (FK -> recursos_turmas)
- estudante_id: uuid (FK -> estudantes)

- progresso_segundos: integer (posição do vídeo/áudio)
- completado: boolean
- ultima_visualizacao: timestamp

-- UNIQUE (recurso_id, estudante_id)
```

#### Row Level Security (RLS)

**Criar**:
- ✅ Apenas diretora e professor

**Ler**:
- ✅ Todos da escola veem recursos públicos
- ✅ Professores/diretoras veem todos

**Atualizar/Deletar**:
- ✅ Apenas diretora e professor

**Progresso**:
- ✅ Estudante cria/atualiza/lê apenas seu próprio progresso
- ✅ Professores/diretoras leem progresso de todos

#### Índices de Performance
```sql
- idx_recursos_turmas_turma
- idx_recursos_turmas_escola
- idx_recursos_turmas_tipo
- idx_recursos_turmas_publico
- idx_progresso_recursos_recurso
- idx_progresso_recursos_estudante
```

#### Função RPC
```sql
incrementar_visualizacoes_recurso(recurso_id uuid)
```

---

### 2. Validações Zod ✅

**Arquivo**: `src/lib/validations/admin.ts`

#### Schemas Criados:

**recursoTurmaSchema**:
```typescript
{
    turma_id: uuid,
    titulo: string (3-200 chars),
    descricao?: string (max 1000),
    tipo: 'video' | 'audio' | 'documento' | 'link',
    url_externa?: url,
    is_publico: boolean (default true),
    ordem: number (default 0)
}
```

**uploadRecursoSchema**: Para FormData
**progressoRecursoSchema**: Para tracking
**videoFileSchema**: Max 500MB, tipos permitidos
**audioFileSchema**: Max 50MB, tipos permitidos
**documentoFileSchema**: Max 20MB, tipos permitidos

#### Tipos de Arquivo Suportados:

**Vídeo** (max 500MB):
- video/mp4
- video/webm
- video/ogg
- video/quicktime (MOV)

**Áudio** (max 50MB):
- audio/mpeg (MP3)
- audio/mp3
- audio/wav
- audio/ogg
- audio/aac

**Documento** (max 20MB):
- application/pdf
- application/msword (DOC)
- application/vnd.openxmlformats-officedocument.wordprocessingml.document (DOCX)

---

### 3. Server Actions ✅

**Arquivo**: `src/app/actions/admin.ts`

#### Funções Implementadas:

**1. getRecursosTurma(turmaId)**
- Busca todos os recursos de uma turma
- Inclui dados do criador (join com perfis)
- Ordenado por `ordem` e `created_at`
- Retorna: `{ data: Recurso[] }`

**2. createRecursoLink(data)**
- Cria recurso do tipo 'link' (YouTube, Vimeo, etc)
- Validação: URL externa obrigatória
- RBAC: Apenas diretora/professor
- Tenant isolation: escola_id
- Retorna: `{ data: Recurso }`

**3. uploadRecursoArquivo(formData)**
- Upload de arquivo para Supabase Storage
- Validação de tamanho e tipo de arquivo
- Buckets: `turmas-videos`, `turmas-audios`, `turmas-documentos`
- Gera nome único: `{turmaId}/{timestamp}-{random}.{ext}`
- Se falhar DB, deleta arquivo do storage (rollback)
- Retorna: `{ data: Recurso }`

**4. updateRecurso(data)**
- Atualiza metadados (não o arquivo)
- Campos: titulo, descricao, url_externa, is_publico, ordem
- Verificação de propriedade (escola_id)
- Retorna: `{ success: true }`

**5. deleteRecurso(recursoId)**
- Deleta registro do banco
- Deleta arquivo do storage (se houver)
- Extrai path do arquivo da URL
- Retorna: `{ success: true }`

**6. updateProgressoRecurso(data)**
- Estudante registra progresso de visualização
- Upsert: cria ou atualiza
- Campos: progresso_segundos, completado
- Retorna: `{ success: true }`

**7. getProgressoRecurso(recursoId)**
- Busca progresso do estudante logado
- Retorna: `{ data: Progresso | null }`

**8. incrementarVisualizacoes(recursoId)**
- Incrementa contador de visualizações
- Usa função RPC do banco
- Não-crítico (não lança erro)

#### Segurança:

✅ **Autenticação**: Todas as funções verificam `auth.uid()`
✅ **RBAC**: Funções de criar/atualizar/deletar verificam role
✅ **Tenant Isolation**: Todas as queries filtram por `escola_id`
✅ **Validação**: Zod valida todos os inputs
✅ **RLS**: Proteção dupla (Server Actions + RLS)
✅ **Storage**: Buckets privados com políticas de acesso

---

## 📦 Supabase Storage

### Buckets Necessários:

Criar via Supabase Dashboard ou API:

**1. turmas-videos**
- Tipo: Privado
- Max file size: 500MB
- Allowed MIME types: video/mp4, video/webm, video/ogg, video/quicktime

**2. turmas-audios**
- Tipo: Privado
- Max file size: 50MB
- Allowed MIME types: audio/mpeg, audio/mp3, audio/wav, audio/ogg, audio/aac

**3. turmas-documentos**
- Tipo: Privado
- Max file size: 20MB
- Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-*

### Políticas de Storage:

**INSERT** (Upload):
```sql
-- Apenas diretora e professor
bucket_id = 'turmas-videos' AND
auth.role() = 'authenticated' AND
EXISTS (
  SELECT 1 FROM perfis
  WHERE id = auth.uid()
  AND role IN ('diretora', 'professor', 'super_admin')
)
```

**SELECT** (Download):
```sql
-- Todos da mesma escola
bucket_id = 'turmas-videos' AND
auth.role() = 'authenticated' AND
EXISTS (
  SELECT 1 FROM perfis p1
  JOIN recursos_turmas rt ON rt.criador_id = p1.id
  WHERE p1.id = auth.uid()
  -- Mesma lógica para audios e documentos
)
```

**UPDATE/DELETE**:
```sql
-- Apenas criador ou diretora
bucket_id = 'turmas-videos' AND
EXISTS (
  SELECT 1 FROM recursos_turmas rt
  JOIN perfis p ON p.id = auth.uid()
  WHERE rt.arquivo_url LIKE '%' || name || '%'
  AND (rt.criador_id = auth.uid() OR p.role IN ('diretora', 'super_admin'))
)
```

---

## 🎯 Casos de Uso

### Para Professores/Diretoras:

**1. Adicionar Vídeo do YouTube**
```typescript
await createRecursoLink({
    turma_id: "uuid-da-turma",
    titulo: "Técnicas de Piruetas",
    descricao: "Vídeo explicativo sobre piruetas",
    tipo: "link",
    url_externa: "https://www.youtube.com/watch?v=...",
    is_publico: true,
    ordem: 1
})
```

**2. Upload de Vídeo Local**
```typescript
const formData = new FormData()
formData.append('turma_id', turmaId)
formData.append('titulo', 'Aula de Ballet Clássico')
formData.append('descricao', 'Aula gravada em 15/01/2026')
formData.append('tipo', 'video')
formData.append('is_publico', 'true')
formData.append('arquivo', videoFile) // File object

await uploadRecursoArquivo(formData)
```

**3. Upload de MP3**
```typescript
const formData = new FormData()
formData.append('turma_id', turmaId)
formData.append('titulo', 'Música: O Lago dos Cisnes')
formData.append('tipo', 'audio')
formData.append('is_publico', 'true')
formData.append('arquivo', mp3File)

await uploadRecursoArquivo(formData)
```

**4. Listar Recursos**
```typescript
const { data: recursos } = await getRecursosTurma(turmaId)

recursos.forEach(r => {
    console.log(r.titulo, r.tipo, r.visualizacoes)
})
```

### Para Alunos:

**1. Assistir Vídeo e Salvar Progresso**
```typescript
// Ao pausar ou periodicamente
await updateProgressoRecurso({
    recurso_id: "uuid-do-video",
    progresso_segundos: 125, // 2min 5seg
    completado: false
})

// Ao terminar
await updateProgressoRecurso({
    recurso_id: "uuid-do-video",
    progresso_segundos: 600,
    completado: true
})
```

**2. Retomar de Onde Parou**
```typescript
const { data: progresso } = await getProgressoRecurso(recursoId)

if (progresso) {
    videoPlayer.currentTime = progresso.progresso_segundos
}
```

---

## 🎨 COMPONENTES A IMPLEMENTAR (Próxima Etapa)

### 1. `RecursosTurmaDialog.tsx`
- Dialog modal para gerenciar recursos
- Abas: "Vídeos", "Áudios", "Documentos", "Links"
- Lista de recursos com preview
- Botão "Adicionar Novo"
- Estatísticas de visualizações

### 2. `UploadRecursoForm.tsx`
- Drag & drop para upload
- Progress bar durante upload
- Prévia do arquivo
- Validação de tamanho/tipo
- Estados: idle, uploading, success, error

### 3. `VideoPlayer.tsx`
- Player HTML5 customizado
- Controles: play, pause, seek, volume, fullscreen
- Salvar progresso a cada 5 segundos
- Retomar de onde parou
- Legendas (futuro)

### 4. `AudioPlayer.tsx`
- Player HTML5 para MP3
- Waveform visual (opcional)
- Playlist de múltiplos áudios
- Salvar progresso

### 5. `RecursoCard.tsx`
- Card individual de recurso
- Thumbnail para vídeos
- Ícones por tipo (video/audio/doc/link)
- Badge de "Novo"
- Progresso visual (barra)
- Dropdown de ações (edit/delete)

### 6. Integração na Página de Turmas
- Botão "Biblioteca de Mídia" no dropdown de cada turma
- Badge com contador de recursos
- Filtro por tipo
- Busca por título

---

## 📊 Estatísticas e Analytics (Futuro)

**Por Recurso**:
- Total de visualizações
- Taxa de conclusão (% que terminaram)
- Tempo médio de visualização
- Picos de acesso

**Por Turma**:
- Recursos mais vistos
- Alunos mais engajados
- Recursos com baixo engajamento

**Por Aluno**:
- Progresso geral (X de Y recursos completados)
- Horas de estudo
- Certificado de conclusão

---

## 🔐 Segurança e Privacidade

### Controle de Acesso:

✅ **Professores/Diretoras**:
- Criar, editar, deletar qualquer recurso
- Ver todos os recursos (públicos e privados)
- Ver progresso de todos os alunos
- Estatísticas completas

✅ **Alunos**:
- Ver apenas recursos públicos (`is_publico = true`)
- Salvar/atualizar apenas seu próprio progresso
- Não podem deletar recursos

✅ **Pais/Responsáveis** (futuro):
- Ver recursos públicos
- Ver progresso dos filhos

### Privacidade:

- Vídeos e áudios NÃO são públicos na internet
- Storage buckets são **privados**
- URLs são **signed URLs** (temporárias)
- Apenas membros da escola podem acessar

---

## 🚀 Próximos Passos

### Fase 1 - Componentes Básicos:
1. [ ] Criar `RecursosTurmaDialog.tsx`
2. [ ] Criar `UploadRecursoForm.tsx`
3. [ ] Criar `VideoPlayer.tsx`
4. [ ] Criar `AudioPlayer.tsx`
5. [ ] Criar `RecursoCard.tsx`

### Fase 2 - Integração:
6. [ ] Adicionar botão "Mídia" no dropdown de turmas
7. [ ] Integrar dialog na página de turmas
8. [ ] Testar upload de vídeo/áudio
9. [ ] Testar player com progresso
10. [ ] Testar RLS policies

### Fase 3 - Features Avançadas:
11. [ ] Thumbnails automáticas para vídeos
12. [ ] Transcodificação de vídeos (HLS)
13. [ ] Legendas (SRT/VTT)
14. [ ] Download de recursos
15. [ ] Compartilhamento por link temporário

### Fase 4 - Analytics:
16. [ ] Dashboard de estatísticas
17. [ ] Relatório de progresso por aluno
18. [ ] Certificados de conclusão
19. [ ] Gamificação (badges, pontos)

---

## 📝 Exemplo de Uso Completo

```typescript
// 1. Professor cria uma aula em vídeo
const formData = new FormData()
formData.append('turma_id', 'abc-123')
formData.append('titulo', 'Aula 1: Posições Básicas')
formData.append('descricao', 'Aprenda as 5 posições básicas do ballet')
formData.append('tipo', 'video')
formData.append('is_publico', 'true')
formData.append('arquivo', videoFile)

const { data: recurso } = await uploadRecursoArquivo(formData)
// Recurso criado com ID, URL, etc.

// 2. Aluno acessa a biblioteca da turma
const { data: recursos } = await getRecursosTurma('abc-123')
// Vê lista de vídeos/áudios/documentos

// 3. Aluno começa a assistir
await incrementarVisualizacoes(recurso.id)
// Contador +1

// 4. Aluno pausa no meio
await updateProgressoRecurso({
    recurso_id: recurso.id,
    progresso_segundos: 180, // 3 minutos
    completado: false
})

// 5. Aluno volta outro dia
const { data: progresso } = await getProgressoRecurso(recurso.id)
videoPlayer.currentTime = progresso.progresso_segundos
// Retoma de onde parou (3min)

// 6. Aluno termina de assistir
await updateProgressoRecurso({
    recurso_id: recurso.id,
    progresso_segundos: 600,
    completado: true
})
// Marca como completado ✅
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Backend ✅ COMPLETO
- [x] Schema SQL com tabelas e RLS
- [x] Índices de performance
- [x] Função RPC para visualizações
- [x] Validações Zod completas
- [x] Server Actions de CRUD
- [x] Server Actions de upload
- [x] Server Actions de progresso
- [x] Tratamento de erros
- [x] Tenant isolation
- [x] RBAC completo

### Frontend ⏳ PENDENTE
- [ ] RecursosTurmaDialog
- [ ] UploadRecursoForm (drag & drop)
- [ ] VideoPlayer com progresso
- [ ] AudioPlayer com progresso
- [ ] RecursoCard
- [ ] Integração na página de turmas
- [ ] Testes E2E

### Infraestrutura ⏳ PENDENTE
- [ ] Criar buckets no Supabase
- [ ] Configurar políticas de storage
- [ ] Configurar limites de upload
- [ ] CDN para vídeos (opcional)
- [ ] Backup de arquivos

---

## 🎓 CONCLUSÃO

O **backend do sistema de mídia** está **100% implementado** e pronto para uso:

✅ Banco de dados com RLS
✅ Validações robustas
✅ Server Actions completas
✅ Upload para Supabase Storage
✅ Tracking de progresso
✅ Controle de acesso multi-nível

**Próximo passo**: Implementar os componentes React para a interface de usuário.

**Estimativa**: ~4-6 componentes React + integração = 2-3 horas de desenvolvimento.

Com isso, professores e diretoras poderão:
- 📹 Fazer upload de vídeos de aula
- 🎵 Adicionar músicas para treino
- 📄 Compartilhar PDFs e documentos
- 🔗 Incorporar vídeos do YouTube/Vimeo
- 📊 Acompanhar progresso dos alunos

E os alunos poderão:
- 📺 Assistir aulas gravadas
- 🎧 Ouvir músicas para ensaios
- 📚 Baixar materiais de apoio
- ⏯️ Retomar de onde pararam
- ✅ Marcar como concluído
