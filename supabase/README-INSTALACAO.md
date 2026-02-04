# Instalação do Banco de Dados - Grand Salto

Execute os arquivos SQL nesta ordem no Supabase SQL Editor:

## 📋 Ordem de Execução

### 1️⃣ Schema Principal (OBRIGATÓRIO)
**Arquivo:** `schema.sql`

Este arquivo cria todas as tabelas base do sistema:
- ✅ escolas
- ✅ perfis
- ✅ estudantes
- ✅ turmas
- ✅ matriculas_turmas
- ✅ estoque_figurinos
- ✅ galerias_fotos
- ✅ posts_blog
- ✅ metricas_corpo
- ✅ e outras tabelas essenciais

**⚠️ Execute PRIMEIRO antes de qualquer outro arquivo!**

---

### 2️⃣ Sistema de Mídia para Turmas (OPCIONAL)
**Arquivo:** `EXECUTAR-ESTE-ARQUIVO.sql`

Este arquivo adiciona o sistema de biblioteca de mídia:
- ✅ Tabela `recursos_turmas` (vídeos, áudios, documentos, links)
- ✅ Tabela `progresso_recursos` (tracking de visualização)
- ✅ Buckets de Storage (turmas-videos, turmas-audios, turmas-documentos)
- ✅ Políticas RLS completas

**Execute DEPOIS do schema.sql**

---

### 3️⃣ Dados de Exemplo (OPCIONAL)
**Arquivo:** `seed.sql`

Dados de exemplo para testar o sistema.

**Execute por último, se desejar dados de teste**

---

## 🚀 Como Executar

1. Acesse: https://oymqqxcmbesqczpkedya.supabase.co
2. Menu lateral → **SQL Editor**
3. Clique em **"New Query"**
4. Copie e cole o conteúdo do arquivo
5. Clique em **"Run"**

---

## ✅ Checklist de Instalação

- [ ] Executei `schema.sql` (tabelas principais)
- [ ] Executei `EXECUTAR-ESTE-ARQUIVO.sql` (sistema de mídia)
- [ ] Verifiquei que não há erros
- [ ] Sistema está funcionando

---

## 🔍 Verificar Instalação

Execute este SQL para verificar se tudo foi criado:

```sql
-- Verificar tabelas principais
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

-- Verificar buckets de storage
select id, name, file_size_limit
from storage.buckets;

-- Verificar políticas RLS
select count(*) as total_policies, tablename
from pg_policies
where schemaname = 'public'
group by tablename
order by tablename;
```

---

## ❌ Erros Comuns

### Erro: "relation public.turmas does not exist"
**Solução:** Você pulou o passo 1. Execute `schema.sql` primeiro!

### Erro: "type user_role already exists"
**Solução:** Normal, é seguro ignorar (o script já prevê isso)

### Erro: "duplicate key value violates unique constraint"
**Solução:** Você já executou este script antes. É seguro ignorar.
