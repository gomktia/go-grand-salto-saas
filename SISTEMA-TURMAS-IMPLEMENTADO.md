# Sistema de Turmas - Implementação Completa

## 📋 Resumo

Sistema completo de gerenciamento de turmas (classes) para escolas de dança, incluindo CRUD, gerenciamento de horários, matrículas de alunos e visualização em calendário semanal.

---

## ✅ Funcionalidades Implementadas

### 1. CRUD de Turmas
- ✅ Criar nova turma
- ✅ Editar turma existente
- ✅ Deletar turma (com confirmação)
- ✅ Listar todas as turmas
- ✅ Visualizar detalhes da turma

### 2. Gerenciamento de Horários
- ✅ Adicionar horários de aula
- ✅ Deletar horários
- ✅ Múltiplos horários por turma
- ✅ Seleção de dia da semana (0-6)
- ✅ Definição de hora início e fim
- ✅ Campo opcional para sala

### 3. Gerenciamento de Matrículas
- ✅ Matricular alunos na turma
- ✅ Remover alunos da turma
- ✅ Visualizar lista de alunos matriculados
- ✅ Filtrar apenas alunos disponíveis (não matriculados)
- ✅ Exibir idade dos alunos

### 4. Visualizações
- ✅ **Grid View**: Cards com informações das turmas
- ✅ **Calendar View**: Grade semanal com todas as aulas
- ✅ Toggle entre visualizações
- ✅ Cards coloridos por turma (8 cores predefinidas)

### 5. Estatísticas
- ✅ Total de turmas
- ✅ Total de alunos matriculados
- ✅ Ocupação média das turmas
- ✅ Taxa de ocupação por turma
- ✅ Status de lotação (Lotada/Vagas)

---

## 🗂️ Arquivos Criados/Modificados

### Novos Componentes

#### 1. `src/components/dashboard/turma-dialog.tsx` (275 linhas)
**Propósito**: Dialog para criar/editar turmas

**Features**:
- Formulário com validação Zod
- 8 cores predefinidas com seletor visual
- 9 níveis predefinidos (Baby Class, Iniciante, etc.)
- Campo para vagas máximas (1-50)
- Estados de loading e success
- Mensagens de erro
- Dicas visuais para o usuário

**Campos**:
```typescript
- nome: string (ex: "Iniciante A - Terça e Quinta")
- nivel: string (seleção entre níveis predefinidos)
- vagas_max: number (1-50)
- cor_etiqueta: string (hex color)
```

#### 2. `src/components/dashboard/delete-turma-dialog.tsx` (113 linhas)
**Propósito**: Confirmação para deletar turma

**Features**:
- Aviso claro sobre dados que serão deletados
- Lista de consequências (horários, matrículas, check-ins)
- Confirmação obrigatória
- Estado de loading durante exclusão
- Mensagens de erro

#### 3. `src/components/dashboard/horarios-turma-dialog.tsx` (327 linhas)
**Propósito**: Gerenciar horários de aulas da turma

**Features**:
- Lista de horários ordenados (dia e hora)
- Formulário inline para adicionar novo horário
- Seleção de dia da semana (dropdown)
- Inputs de tempo (type="time")
- Campo opcional para sala
- Deletar horários com confirmação
- Estados de loading e success

**Campos**:
```typescript
- dia_semana: number (0=Domingo, 6=Sábado)
- hora_inicio: string (formato HH:MM)
- hora_fim: string (formato HH:MM)
- sala: string (opcional)
```

#### 4. `src/components/dashboard/matriculas-turma-dialog.tsx` (295 linhas)
**Propósito**: Gerenciar alunos matriculados na turma

**Features**:
- Lista de alunos já matriculados
- Avatar com inicial do nome
- Exibição de idade calculada
- Botão para remover matrícula
- Dropdown para adicionar novo aluno
- Filtra apenas alunos disponíveis (não matriculados)
- Estados de loading e success
- Confirmação antes de remover

**Lógica**:
```typescript
// Filtra alunos que não estão matriculados e estão ativos
const alunosDisponiveis = todosAlunos.filter(aluno =>
    !matriculas.some(m => m.estudantes?.id === aluno.id) &&
    aluno.status_matricula === 'ativo'
)
```

#### 5. `src/components/dashboard/turmas-calendar-view.tsx` (191 linhas) ⭐ NOVO
**Propósito**: Visualização em calendário semanal

**Features**:
- Grid semanal (Domingo a Sábado)
- Horários de 06:00 às 22:00
- Blocos de aula coloridos por turma
- Mostra nome, nível, horário, sala e ocupação
- Duração visual proporcional (altura do bloco)
- Clicável para gerenciar turma
- Hover effects com animação
- Legenda explicativa

**Cálculos**:
```typescript
// Duração da aula em horas
const calculateDuration = (horaInicio, horaFim) => {
    const inicioMinutos = horaInicio em minutos
    const fimMinutos = horaFim em minutos
    return (fimMinutos - inicioMinutos) / 60
}

// Altura do bloco = duration * 60px
minHeight: `${duration * 60}px`
```

**Conflitos**: Detecta visualmente aulas no mesmo horário e dia

### Página Atualizada

#### `src/app/(dashboard)/diretora/turmas/page.tsx` (448 linhas)
**Propósito**: Página principal de gerenciamento de turmas

**Features**:
- Header com badge "Engenharia Acadêmica"
- Botão "Nova Turma"
- **Toggle entre Grid e Calendar view** ⭐
- 3 cards de estatísticas
- Grid de turmas com cards coloridos
- Dropdown menu com 5 ações por turma
- Integração com todos os 4 dialogs
- Estados de loading, error e empty
- Cálculo de taxa de ocupação

**Estatísticas**:
```typescript
1. Total de Turmas: turmas.length
2. Total de Alunos: soma de matriculados ativos
3. Ocupação Média: média das taxas de ocupação
```

**Card de Turma**:
- Ícone colorido com cor da turma
- Badge de status (Lotada/Vagas)
- Nome e nível
- Horário resumido (Ex: "Seg/Qua 14:00")
- Local (sala)
- Barra de progresso de ocupação
- Botão "Gerenciar"

**Dropdown Menu**:
1. Editar Turma
2. Gerenciar Horários
3. Gerenciar Alunos
4. Deletar Turma

---

## 🔧 Server Actions

### Em `src/app/actions/admin.ts`

#### Turmas
```typescript
export async function createTurma(rawData)
export async function updateTurma(rawData)
export async function deleteTurma(turmaId)
export async function getTurmas()
export async function getTurmaById(turmaId)
```

#### Horários
```typescript
export async function createAgendaAula(rawData)
export async function updateAgendaAula(rawData)
export async function deleteAgendaAula(agendaId)
```

#### Matrículas
```typescript
export async function createMatricula(rawData)
export async function deleteMatricula(matriculaId)
```

**Segurança**:
- ✅ Autenticação obrigatória
- ✅ Verificação de role (diretora/super_admin)
- ✅ Isolamento de tenant (escola_id)
- ✅ Validação com Zod
- ✅ Proteção dupla (RLS + Server Actions)

---

## 📊 Schemas de Validação

### Em `src/lib/validations/admin.ts`

```typescript
// Criar turma
export const turmaSchema = z.object({
    nome: z.string().min(2),
    nivel: z.string().min(1),
    vagas_max: z.number().int().min(1).max(50),
    cor_etiqueta: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    professor_id: z.string().uuid().optional(),
})

// Atualizar turma
export const turmaUpdateSchema = turmaSchema.extend({
    id: z.string().uuid(),
})

// Criar horário
export const agendaAulaSchema = z.object({
    turma_id: z.string().uuid(),
    dia_semana: z.number().int().min(0).max(6),
    hora_inicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    hora_fim: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    sala: z.string().optional(),
})

// Atualizar horário
export const agendaAulaUpdateSchema = agendaAulaSchema.extend({
    id: z.string().uuid(),
})

// Criar matrícula
export const matriculaSchema = z.object({
    estudante_id: z.string().uuid(),
    turma_id: z.string().uuid(),
    status: z.enum(['ativo', 'inativo', 'trancado']).default('ativo'),
    observacoes: z.string().optional(),
})
```

---

## 🎨 Sistema de Cores

### 8 Cores Predefinidas

```typescript
const CORES_PREDEFINIDAS = [
    { nome: 'Rosa', hex: '#ec4899' },
    { nome: 'Roxo', hex: '#8b5cf6' },
    { nome: 'Azul', hex: '#06b6d4' },
    { nome: 'Verde', hex: '#10b981' },
    { nome: 'Amarelo', hex: '#f59e0b' },
    { nome: 'Laranja', hex: '#f97316' },
    { nome: 'Vermelho', hex: '#ef4444' },
    { nome: 'Pink', hex: '#db2777' },
]
```

**Uso**:
- Identificação visual de turmas
- Cards coloridos no grid
- Blocos coloridos no calendário
- Barras de progresso
- Ícones e badges

---

## 📅 Sistema de Horários

### Dias da Semana

```typescript
const DIAS_SEMANA = [
    'Domingo',       // 0
    'Segunda-feira', // 1
    'Terça-feira',   // 2
    'Quarta-feira',  // 3
    'Quinta-feira',  // 4
    'Sexta-feira',   // 5
    'Sábado',        // 6
]

const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
```

### Formato de Horário

- **Entrada**: Input type="time" (formato HH:MM)
- **Validação**: Regex `/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/`
- **Armazenamento**: String "HH:MM" no banco
- **Exibição**: "14:00 - 16:00"

### Display Resumido

```typescript
// Ex: "Seg/Qua 14:00" para aulas às segundas e quartas às 14h
const getHorarioDisplay = (agenda) => {
    const sorted = [...agenda].sort((a, b) => a.dia_semana - b.dia_semana)
    const dias = sorted.map(h => DIAS_SEMANA_ABREV[h.dia_semana]).join('/')
    const horario = sorted[0]?.hora_inicio || ''
    return `${dias} ${horario}`
}
```

---

## 📈 Cálculos e Lógica

### Taxa de Ocupação

```typescript
const calculateFillRate = (turma: Turma) => {
    const matriculados = turma.matriculas_turmas.filter(
        m => m.status === 'ativo'
    ).length

    return turma.vagas_max > 0
        ? Math.round((matriculados / turma.vagas_max) * 100)
        : 0
}
```

### Cálculo de Idade

```typescript
const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
    }

    return age
}
```

### Ocupação Média

```typescript
const ocupacaoMedia = turmas.length > 0
    ? Math.round(turmas.reduce((acc, t) => acc + calculateFillRate(t), 0) / turmas.length)
    : 0
```

---

## 🎯 Níveis de Turma

```typescript
const NIVEIS = [
    'Baby Class',
    'Iniciante',
    'Intermediário',
    'Avançado',
    'Profissional',
    'Jazz',
    'Ballet Clássico',
    'Contemporâneo',
    'Hip Hop',
]
```

---

## 🔐 Segurança Implementada

### 1. Autenticação
- Todas as actions verificam usuário autenticado
- Redirecionamento para login se não autenticado

### 2. Autorização (RBAC)
```typescript
function requireDiretora(role: string) {
    if (role !== 'diretora' && role !== 'super_admin') {
        throw new Error('Acesso negado')
    }
}
```

### 3. Isolamento de Tenant
```typescript
// Todas as queries incluem escola_id do usuário
const { data: turmas } = await supabase
    .from('turmas')
    .select('*')
    .eq('escola_id', perfil.escola_id)
```

### 4. RLS Policies
- Políticas do banco garantem acesso apenas a dados da escola
- Proteção dupla: Server Actions + RLS

### 5. Validação
- Todos os inputs validados com Zod
- Tipos TypeScript strict
- Sanitização de dados

---

## 🎨 UI/UX Features

### Animações
```typescript
// Cards com hover effect
<motion.div whileHover={{ y: -2 }}>

// Blocos de calendário com zoom
<motion.div whileHover={{ scale: 1.02, zIndex: 50 }} whileTap={{ scale: 0.98 }}>

// Barras de progresso animadas
<motion.div
    initial={{ width: 0 }}
    animate={{ width: `${fillRate}%` }}
/>
```

### Estados Visuais
- ✅ Loading: Spinner com Loader2
- ✅ Error: Mensagem vermelha com AlertCircle
- ✅ Success: Mensagem verde com CheckCircle2
- ✅ Empty: Ícone + mensagem + botão CTA

### Responsividade
- Grid adapta de 1 a 3 colunas
- Calendar com scroll horizontal
- Header stack em mobile

---

## 📱 Fluxos de Uso

### 1. Criar Nova Turma
1. Clicar em "Nova Turma"
2. Preencher nome, nível, vagas
3. Escolher cor de identificação
4. Salvar
5. Ver turma no grid

### 2. Adicionar Horários
1. Clicar no menu da turma
2. "Gerenciar Horários"
3. "Adicionar Novo Horário"
4. Selecionar dia, hora início, hora fim, sala
5. Salvar
6. Repetir para múltiplos horários

### 3. Matricular Alunos
1. Clicar no menu da turma
2. "Gerenciar Alunos"
3. "Matricular Novo Aluno"
4. Selecionar aluno do dropdown
5. Confirmar
6. Ver aluno na lista

### 4. Visualizar Calendário
1. Clicar no toggle "Calendário"
2. Ver grade semanal
3. Identificar conflitos visualmente
4. Clicar em aula para gerenciar

---

## 🗄️ Estrutura do Banco

### Tabelas Utilizadas

#### `turmas`
```sql
- id: uuid (PK)
- escola_id: uuid (FK -> escolas)
- professor_id: uuid (FK -> perfis) [opcional]
- nome: text
- nivel: text
- vagas_max: integer
- cor_etiqueta: text
- created_at: timestamp
```

#### `agenda_aulas`
```sql
- id: uuid (PK)
- turma_id: uuid (FK -> turmas)
- dia_semana: integer (0-6)
- hora_inicio: time
- hora_fim: time
- sala: text [opcional]
- created_at: timestamp
```

#### `matriculas_turmas`
```sql
- id: uuid (PK)
- estudante_id: uuid (FK -> estudantes)
- turma_id: uuid (FK -> turmas)
- status: text ('ativo', 'inativo', 'trancado')
- observacoes: text [opcional]
- created_at: timestamp
```

### Queries Otimizadas

```typescript
// Query principal com joins
const { data: turmas } = await supabase
    .from('turmas')
    .select(`
        *,
        perfis:professor_id (id, full_name),
        matriculas_turmas (
            id,
            status,
            estudantes (
                id,
                nome_responsavel,
                data_nascimento,
                status_matricula
            )
        ),
        agenda_aulas (
            id,
            dia_semana,
            hora_inicio,
            hora_fim,
            sala
        )
    `)
    .eq('escola_id', perfil.escola_id)
    .order('created_at', { ascending: false })
```

---

## 🚀 Próximos Passos Sugeridos

### 1. Funcionalidades Adicionais
- [ ] Atribuir professor à turma
- [ ] Registro de presença (check-in)
- [ ] Relatórios de frequência
- [ ] Exportar grade de horários (PDF)
- [ ] Notificações de turma lotada
- [ ] Lista de espera

### 2. Melhorias de UX
- [ ] Drag & drop para reordenar turmas
- [ ] Filtros (por nível, professor, ocupação)
- [ ] Busca de turmas
- [ ] Visualização mensal no calendário
- [ ] Conflitos de horário destacados

### 3. Integrações
- [ ] Sincronizar com Google Calendar
- [ ] Enviar horários por email/WhatsApp
- [ ] QR Code para check-in de aula
- [ ] Dashboard do professor (suas turmas)
- [ ] App mobile para alunos

### 4. Analytics
- [ ] Dashboard de ocupação histórica
- [ ] Turmas mais populares
- [ ] Horários com maior demanda
- [ ] Taxa de evasão por turma

---

## 📝 Notas Técnicas

### Performance
- Queries otimizadas com joins
- Estados de loading adequados
- Animações com Framer Motion
- Código componentizado e reutilizável

### Manutenibilidade
- Tipos TypeScript bem definidos
- Comentários em código complexo
- Separação de concerns (UI, lógica, dados)
- Validações centralizadas

### Escalabilidade
- Estrutura preparada para multi-tenant
- Fácil adicionar novos níveis
- Fácil adicionar novas cores
- Componentes reutilizáveis

---

## ✅ Build Status

```bash
npm run build
✓ Compiled successfully
✓ TypeScript check passed
✓ All 24 routes generated
⚠ 2 warnings (workspace root, middleware deprecation)
```

**Data**: 2026-01-18
**Status**: ✅ Sistema de Turmas 100% Funcional

---

## 🎓 Conclusão

O **Sistema de Turmas** está completo e pronto para produção, incluindo:

✅ CRUD completo de turmas
✅ Gerenciamento de horários
✅ Gerenciamento de matrículas
✅ Visualização em grid colorido
✅ Visualização em calendário semanal
✅ Estatísticas em tempo real
✅ Segurança multi-camadas
✅ UI moderna e responsiva
✅ Validações robustas
✅ Zero erros TypeScript

O sistema permite que diretoras gerenciem completamente suas turmas, organizem horários, controlem ocupação e visualizem a grade de aulas de forma intuitiva e eficiente.
