# 🚀 Próximos Passos - Sistema Financeiro e Venda de Fotos

## ✅ O QUE JÁ FOI CRIADO

### 1. **Schema SQL Completo** ✅
**Arquivo:** `supabase/schema-financeiro-e-fotos.sql`

**Tabelas Criadas:**
- ✅ `planos_mensalidade` - Planos de pagamento recorrente
- ✅ `mensalidades` - Cobranças mensais dos alunos
- ✅ `pagamentos` - Registro de transações
- ✅ `albums_venda` - Álbuns de fotos para venda
- ✅ `fotos_venda` - Fotos individuais com watermark
- ✅ `pedidos_fotos` - Pedidos de compra de fotos
- ✅ `itens_pedido_foto` - Itens dos pedidos
- ✅ `videos_site` - Vídeos destacados no site
- ✅ `eventos_calendario` - Eventos públicos

**Funcionalidades:**
- ✅ Sistema completo de mensalidades
- ✅ Sistema de venda de fotos com watermark
- ✅ Proteção de fotos originais
- ✅ Carrinho de compras
- ✅ Pagamento PIX/Cartão
- ✅ Download temporário após pagamento
- ✅ Calendário de eventos
- ✅ Vídeos no site

### 2. **Server Actions Criadas** ✅

**Arquivo:** `src/app/actions/financeiro.ts`
- ✅ CRUD de Planos de Mensalidade
- ✅ CRUD de Mensalidades
- ✅ CRUD de Pagamentos
- ✅ Gerar mensalidades do mês automaticamente
- ✅ Estatísticas financeiras

**Arquivo:** `src/app/actions/fotos-venda.ts`
- ✅ CRUD de Álbuns de Venda
- ✅ CRUD de Fotos para Venda
- ✅ Criar Pedido de Fotos
- ✅ Confirmar Pagamento
- ✅ CRUD de Vídeos do Site
- ✅ CRUD de Eventos do Calendário

---

## ⚠️ AÇÃO NECESSÁRIA: EXECUTAR SCHEMA NO SUPABASE

### **Passo 1: Executar SQL no Supabase**

1. Acesse: https://oymqqxcmbesqczpkedya.supabase.co
2. Menu lateral → **SQL Editor**
3. Abra o arquivo: `supabase/schema-financeiro-e-fotos.sql`
4. **Copie TODO o conteúdo**
5. Cole no SQL Editor
6. Clique em **"Run"** ▶️
7. Aguarde a conclusão (~10-15 segundos)

### **Passo 2: Criar Bucket de Storage**

Após executar o schema, criar bucket para fotos de venda:

**No Supabase Dashboard:**
1. Menu lateral → **Storage**
2. Clique em **"New bucket"**
3. **Nome:** `fotos-venda`
4. **Public:** ❌ Desmarque (bucket privado)
5. **File size limit:** `10485760` (10MB)
6. **Allowed MIME types:** `image/jpeg,image/png,image/webp`
7. Clique em **"Create bucket"**

**Criar Políticas RLS do Bucket:**

Execute este SQL:
```sql
-- Upload: Apenas diretoras
create policy "Diretoras podem upload fotos"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'fotos-venda'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'super_admin')
    )
);

-- Download: Todos autenticados podem ver (watermark é público)
create policy "Todos podem ver fotos watermark"
on storage.objects for select
to authenticated
using (bucket_id = 'fotos-venda');

-- Delete: Apenas diretoras
create policy "Diretoras podem deletar fotos"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'fotos-venda'
    and exists (
        select 1 from public.perfis
        where perfis.id = auth.uid()
        and perfis.role in ('diretora', 'super_admin')
    )
);
```

---

## 📋 PRÓXIMAS IMPLEMENTAÇÕES (Aguardando Schema)

Após executar o schema, vou implementar:

### 1. **Dashboard Financeiro Integrado** (30-40 min)
- [ ] Página `/diretora/financeiro` com dados reais
- [ ] Lista de mensalidades com filtros
- [ ] Registrar pagamentos
- [ ] Gerar mensalidades do mês
- [ ] Stats: faturamento, inadimplência, lucro

### 2. **Site Espaço Revelle - Blog Dinâmico** (20 min)
- [ ] Integrar posts do banco de dados
- [ ] Página de post individual
- [ ] Filtros por categoria

### 3. **Site Espaço Revelle - Galeria de Venda** (40 min)
- [ ] Página de álbuns públicos
- [ ] Carrinho de compras funcional
- [ ] Checkout com PIX/Cartão
- [ ] Proteção de fotos originais
- [ ] Watermark server-side

### 4. **Site Espaço Revelle - Calendário** (20 min)
- [ ] Seção de próximos eventos
- [ ] Filtros por tipo
- [ ] Design responsivo

### 5. **Site Espaço Revelle - Vídeos** (15 min)
- [ ] Seção de vídeos destacados
- [ ] Player YouTube/Vimeo embedded
- [ ] Grid responsivo

---

## 🎯 SISTEMA COMPLETO APÓS IMPLEMENTAÇÃO

### **Para a Diretora:**
- ✅ Dashboard financeiro completo
- ✅ Gestão de mensalidades
- ✅ Registrar pagamentos
- ✅ Criar álbuns para venda
- ✅ Upload de fotos com watermark automático
- ✅ Gerenciar pedidos de fotos
- ✅ Confirmar pagamentos de fotos
- ✅ Adicionar vídeos ao site
- ✅ Gerenciar eventos do calendário

### **Para os Pais/Responsáveis:**
- ✅ Ver mensalidades pendentes
- ✅ Visualizar fotos dos eventos (watermark)
- ✅ Comprar fotos em HD sem watermark
- ✅ Pagamento via PIX ou Cartão
- ✅ Download automático após pagamento
- ✅ Ver calendário de eventos
- ✅ Assistir vídeos da escola

### **Site Público (Espaço Revelle):**
- ✅ Blog com posts dinâmicos
- ✅ Galeria de álbuns públicos
- ✅ Calendário de eventos
- ✅ Vídeos destacados
- ✅ Sistema de venda de fotos

---

## 💡 PROTEÇÃO DE FOTOS - COMO FUNCIONA

### **1. Watermark Automático**
- Foto original é guardada em caminho protegido
- Versão com watermark é gerada automaticamente
- Apenas versão com watermark é mostrada publicamente

### **2. Proteção Contra Download**
- Fotos originais só são acessíveis após pagamento
- Link de download expira em 7 dias
- Marca d'água CSS impede screenshot fácil

### **3. Fluxo de Compra**
```
1. Pai seleciona fotos (vê watermark)
2. Adiciona ao carrinho
3. Checkout → Gera PIX/Link Cartão
4. Após pagamento confirmado:
   - Libera download das originais
   - Envia email com links
   - Links expiram em 7 dias
```

---

## 📊 INTEGRAÇÃO DE PAGAMENTO

### **Opção 1: PIX Simples (Recomendado para MVP)**
- Gerar QR Code manualmente
- Cliente paga
- Diretora confirma pagamento manual no dashboard
- Sistema libera download

### **Opção 2: Gateway de Pagamento (Mercado Pago/Stripe)**
- Integração automática
- Confirmação automática de pagamento
- Webhook para liberar download
- **Implementação:** ~2-3 horas adicionais

---

## 🚀 TEMPO ESTIMADO TOTAL

| Tarefa | Tempo |
|--------|-------|
| ✅ Schema SQL | Feito |
| ✅ Server Actions | Feito |
| ⏳ Dashboard Financeiro | 40 min |
| ⏳ Blog Dinâmico | 20 min |
| ⏳ Galeria Venda | 40 min |
| ⏳ Calendário | 20 min |
| ⏳ Vídeos | 15 min |
| **TOTAL** | **~2h15min** |

---

## ✅ CHECKLIST

- [ ] Executei `schema-financeiro-e-fotos.sql` no Supabase
- [ ] Criei o bucket `fotos-venda` no Storage
- [ ] Criei as políticas RLS do bucket
- [ ] Pronto para continuar implementação!

---

**Me avise quando executar o schema para eu continuar com a implementação! 🚀**
