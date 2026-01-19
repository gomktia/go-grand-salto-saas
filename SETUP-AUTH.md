# 🔐 Guia de Configuração de Autenticação

Este guia explica como configurar a autenticação real no Grand Salto após as correções críticas.

## 📋 Pré-requisitos

- Conta no Supabase
- Projeto Supabase criado
- Node.js e npm instalados

## 🚀 Passo a Passo

### 1. Configurar Schema do Banco de Dados

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá para **SQL Editor**
3. Clique em **New Query**
4. Copie todo o conteúdo de `supabase/schema.sql`
5. Cole no editor e clique em **RUN**
6. Aguarde a confirmação de sucesso

### 2. Criar Usuários de Teste

#### Via Supabase Dashboard (Recomendado para Desenvolvimento)

1. Vá para **Authentication > Users**
2. Clique em **Add User > Create new user**
3. Crie os seguintes usuários:

| Email | Senha | Role | Descrição |
|-------|-------|------|-----------|
| `diretora@espacorevelle.com.br` | `revelle123` | diretora | Acesso administrativo completo |
| `professor@espacorevelle.com.br` | `revelle123` | professor | Acesso de professor |
| `aluno@espacorevelle.com.br` | `revelle123` | estudante | Acesso de aluno |
| `pai@espacorevelle.com.br` | `revelle123` | pai | Acesso de responsável |

4. **IMPORTANTE**: Após criar cada usuário, anote o UUID gerado

### 3. Criar Perfis Manualmente

Após criar os usuários no Auth, você precisa criar os perfis na tabela `perfis`:

```sql
-- Substitua os UUIDs pelos reais gerados no passo anterior
INSERT INTO public.perfis (id, escola_id, full_name, role)
VALUES
    ('UUID-DA-DIRETORA-AQUI', '00000000-0000-0000-0000-000000000001', 'Maria Silva', 'diretora'),
    ('UUID-DO-PROFESSOR-AQUI', '00000000-0000-0000-0000-000000000001', 'João Santos', 'professor'),
    ('UUID-DO-ALUNO-AQUI', '00000000-0000-0000-0000-000000000001', 'Ana Costa', 'estudante'),
    ('UUID-DO-PAI-AQUI', '00000000-0000-0000-0000-000000000001', 'Carlos Costa', 'pai');
```

### 4. Popular Banco com Dados de Teste

1. No **SQL Editor**, crie outra query
2. Copie todo o conteúdo de `supabase/seed.sql`
3. Cole e execute com **RUN**

Isso criará:
- ✅ 1 escola (Espaço Revelle)
- ✅ 5 estudantes de exemplo
- ✅ Métricas corporais para cada estudante
- ✅ 5 turmas
- ✅ Horários de aulas
- ✅ 6 figurinos no estoque
- ✅ 3 galerias de fotos
- ✅ 2 posts de blog

### 5. Verificar Variáveis de Ambiente

Confirme que seu arquivo `.env.local` contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
OPENAI_API_KEY=sua-openai-key-aqui  # Opcional, para funcionalidade de IA
```

**Onde encontrar as chaves:**
- Supabase Dashboard > Settings > API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project API keys > `anon` `public`
- `SUPABASE_SERVICE_ROLE_KEY`: Project API keys > `service_role` `secret`

### 6. Testar Autenticação

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse http://localhost:3000/login

3. Faça login com um dos usuários criados:
   - Email: `diretora@espacorevelle.com.br`
   - Senha: `revelle123`

4. Você deve ser redirecionado para `/diretora` e ver os dados reais do banco

## 🔍 Verificações Importantes

### Testar RLS (Row Level Security)

Execute no SQL Editor para verificar se as policies estão funcionando:

```sql
-- Deve retornar apenas dados da escola do usuário
SELECT * FROM public.estudantes;

-- Deve retornar apenas estudantes ativos
SELECT * FROM public.estudantes WHERE status_matricula = 'ativo';
```

### Testar Tenant Isolation

1. Faça login como diretora
2. Vá para `/diretora/alunos`
3. Você deve ver apenas os 5 alunos do Espaço Revelle
4. Nenhum dado de outras escolas deve aparecer

### Testar Proteção de Rotas

1. Abra uma aba anônima
2. Tente acessar diretamente http://localhost:3000/diretora
3. Você deve ser redirecionado para `/login`
4. Após fazer login, deve voltar para `/diretora`

## 🐛 Troubleshooting

### Erro: "Não autenticado"

**Causa**: Sessão expirada ou cookies não configurados

**Solução**:
1. Limpe cookies do navegador
2. Faça logout e login novamente
3. Verifique se `.env.local` está correto

### Erro: "Perfil não encontrado"

**Causa**: Usuário criado no Auth mas sem perfil na tabela `perfis`

**Solução**:
1. Execute o SQL do Passo 3 com os UUIDs corretos
2. Certifique-se de que `escola_id` existe na tabela `escolas`

### Não vê nenhum dado no dashboard

**Causa**: Dados de seed não foram inseridos ou RLS está bloqueando

**Solução**:
1. Execute `seed.sql` novamente
2. Verifique se o usuário logado tem `role = 'diretora'`
3. No SQL Editor, execute:
```sql
SELECT * FROM public.perfis WHERE id = auth.uid();
```

### Build falha com erro de TypeScript

**Causa**: Tipos não atualizados após mudanças

**Solução**:
```bash
# Limpe cache e rebuilde
rm -rf .next
npm run build
```

## 📚 Próximos Passos

Após configurar a autenticação, você pode:

1. **Criar mais escolas** (para testar multi-tenancy)
2. **Configurar email** (Resend para envio de emails)
3. **Adicionar mais usuários** (professores, alunos reais)
4. **Configurar OpenAI** (para geração de conteúdo)
5. **Deploy em produção** (Vercel + Supabase)

## 🔒 Segurança em Produção

⚠️ **ANTES DE FAZER DEPLOY EM PRODUÇÃO:**

1. ✅ Remova usuários de teste
2. ✅ Altere todas as senhas padrão
3. ✅ Configure Email Templates no Supabase
4. ✅ Habilite Email Confirmations
5. ✅ Configure Password Recovery
6. ✅ Adicione Rate Limiting na API
7. ✅ Configure CORS adequadamente
8. ✅ Use HTTPS em todos os domínios
9. ✅ Configure backup automático no Supabase
10. ✅ Adicione monitoramento (Sentry, LogRocket)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do navegador (F12 > Console)
2. Verifique logs do Supabase (Dashboard > Logs)
3. Revise este documento novamente
4. Consulte a [documentação do Supabase](https://supabase.com/docs)

---

**Última atualização**: 18/01/2026
