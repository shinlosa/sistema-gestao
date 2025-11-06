# Sistema de Gestão de Salas - NAMI UNIFOR

## 📋 Informações do Projeto

**Instituição:** Universidade de Fortaleza (UNIFOR)  
**Setor:** NAMI - Núcleo de Atenção Médica Integrada  
**Curso:** Nutrição  
**Tipo:** Projeto de Extensão - Desenvolvimento Web  

**Stack Tecnológica (Atualizada em Outubro/2025):**
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + ShadCN/UI
- **Backend:** Node.js (Express + Zod, TypeScript)
- **Banco de Dados:** Em memória (mock); integração com MySQL

---

## 🎯 Objetivo do Projeto

Desenvolver uma solução web para automatizar o processo de reserva de salas do curso de Nutrição, substituindo o controle manual feito atualmente via planilhas Excel, eliminando possíveis erros de agendamento e conflitos de horários.

---

## 📊 Situação Atual (Problemática)

### Problemas Identificados:
- ✗ Controle manual via Excel
- ✗ Acesso restrito a funcionários específicos
- ✗ Processo cansativo e suscetível a erros
- ✗ Possibilidade de conflitos de agenda
- ✗ Risco de superalotação (reservar mais salas que disponíveis)
- ✗ Falta de rastreabilidade das alterações

---

## 🏗️ Estrutura Física das Salas

### Distribuição por Monitoramento:

#### **MONITORAMENTO 1**
- **Escritório:** Sala 101 (Escritório Monitoramento 1) - Capacidade: 2
- **Salas de Atendimento:** Salas 1, 2, 3, 4, 5 - Capacidade: 8 cada
- **Total:** 6 salas (1 escritório + 5 atendimento)

#### **MONITORAMENTO 2**
- **Escritório:** Sala 102 (Escritório Monitoramento 2) - Capacidade: 2
- **Salas de Atendimento:** Salas 6, 7, 8, 9, 10 - Capacidade: 10 cada
- **Total:** 6 salas (1 escritório + 5 atendimento)

#### **MONITORAMENTO 3**
- **Escritório:** Sala 103 (Escritório Monitoramento 3) - Capacidade: 2
- **Salas de Atendimento:** Salas 11, 12, 13, 14, 15 - Capacidade: 12 cada
- **Total:** 6 salas (1 escritório + 5 atendimento)

**TOTAL GERAL:** 18 salas (3 escritórios independentes + 15 salas de atendimento)

### Características das Salas:

- **Escritórios (101-103):** Marcados como `isIndependent: true`, disponíveis para reservas administrativas
- **Salas de Atendimento (1-15):** Vinculadas a monitoramentos específicos, disponíveis para atendimentos
- **Todos os Blocos Disponíveis:** Todas as salas podem ser reservadas em qualquer dos 5 blocos horários (MAB, MCD, MEF, TAB, TCD)

---

## ⏰ Grade de Horários

**IMPORTANTE:** O sistema foi otimizado para usar **blocos combinados** ao invés de períodos individuais.

### **Blocos de Horários:**
- **MAB (Manhã AB):** 07:30 - 09:10 (100 minutos)
- **MCD (Manhã CD):** 09:30 - 11:10 (100 minutos)
- **MEF (Manhã EF):** 11:20 - 13:00 (100 minutos)
- **TAB (Tarde AB):** 13:30 - 15:10 (100 minutos)
- **TCD (Tarde CD):** 15:30 - 17:10 (100 minutos)

### **Vantagens dos Blocos Combinados:**
- ✅ Simplifica a interface de reserva (5 checkboxes ao invés de 10)
- ✅ Reduz conflitos de agendamento
- ✅ Alinha-se melhor com a duração típica das atividades do NAMI
- ✅ Melhora a performance do sistema (menos combinações a validar)

### **Flexibilidade de Reserva:**
- Usuários podem selecionar múltiplos blocos não-sequenciais
- Exemplo: MAB + MEF (manhã completa com intervalo) ou TAB + TCD (tarde completa)
- Sistema calcula automaticamente a faixa horária total (início do primeiro bloco até fim do último)

---

## 👥 Sistema de Usuários e Permissões

### **Hierarquia de Acesso:**

O sistema possui 4 níveis de acesso com cores distintivas para fácil identificação:

#### **1. 🟣 Administrador (admin)**
- **Cor de Identificação:** Roxo
- **Responsável:** Coordenadora do Curso de Nutrição
- **Permissões:**
  - ✓ Acesso total ao sistema
  - ✓ Criar, editar e cancelar qualquer reserva
  - ✓ Gerenciar usuários (criar, aprovar, **deletar permanentemente**, alterar roles)
  - ✓ Visualizar logs de atividade do sistema
  - ✓ **IMPORTANTE:** Não pode deletar a própria conta

#### **2. 🔵 Editor (editor)**
- **Cor de Identificação:** Azul
- **Exemplo:** Coordenadores, Gestores de Monitoramento
- **Permissões:**
  - ✓ Criar reservas
  - ✓ Editar qualquer reserva
  - ✓ Cancelar qualquer reserva
  - ✓ Visualizar logs de atividade
  - ✓ Visualizar disponibilidade
  - ✗ Gerenciar usuários

#### **3. 🟢 Usuário (usuario)**
- **Cor de Identificação:** Verde (Emerald)
- **Exemplo:** Professores, Funcionários
- **Permissões:**
  - ✓ Criar reservas
  - ✓ Visualizar disponibilidade
  - ✓ **Solicitar revisão de horários ocupados** 🆕
  - ✗ Editar ou cancelar reservas
  - ✗ Acessar logs de atividade
  - ✗ Gerenciar usuários

#### **4. ⚪ Leitor (leitor)**
- **Cor de Identificação:** Cinza (Slate)
- **Exemplo:** Visitantes, Consulta
- **Permissões:**
  - ✓ Visualizar disponibilidade de salas
  - ✓ Consultar reservas (somente leitura)
  - ✗ Criar, editar ou cancelar reservas
  - ✗ Acessar logs de atividade
  - ✗ Gerenciar usuários

### **⚠️ MUDANÇA IMPORTANTE: Remoção vs Suspensão**

**O sistema NÃO possui mais status "suspended".**

Anteriormente, contas problemáticas eram "suspensas" temporariamente. Agora:

- ✅ **Remoção Permanente:** Contas são deletadas completamente do sistema
- ❌ **Sem Reativação:** Não é possível reativar contas removidas
- 🔒 **Proteção:** Usuário não pode deletar a própria conta
- 📝 **Log Completo:** Todas as remoções são registradas no log de atividades

**Status de Usuário Disponíveis:**
- `active` - Ativo e com acesso
- `pending` - Aguardando aprovação
- `inactive` - Desativado (sem acesso, mas não deletado)

### **Resumo de Permissões por Ação:**

| Ação | Admin | Editor | Usuário | Leitor |
|------|-------|--------|---------|--------|
| Visualizar salas | ✓ | ✓ | ✓ | ✓ |
| Criar reserva | ✓ | ✓ | ✓ | ✗ |
| Editar reserva | ✓ | ✓ | ✗ | ✗ |
| Cancelar reserva | ✓ | ✓ | ✗ | ✗ |
| Ver logs | ✓ | ✓ | ✗ | ✗ |
| Gerenciar usuários | ✓ | ✗ | ✗ | ✗ |

---

## 🔧 Funcionalidades Principais

### **1. Gestão de Reservas**
- [x] Visualização de disponibilidade em tempo real
- [x] Reserva por blocos específicos (MAB, MCD, MEF, TAB, TCD)
- [x] Calendário interativo
- [x] Validação automática de conflitos
- [x] **Sistema de Solicitação de Revisão** (quando horário está ocupado)
- [x] Informações detalhadas por sala:
  - Número da sala
  - Tipo de atendimento
  - Professor responsável
  - Horário de ocupação
  - Status (disponível/ocupada)

### **2. Sistema de Solicitação de Revisão** 🆕
- [x] **Usuários comuns** podem solicitar revisão de horários ocupados
- [x] Modal com justificativa obrigatória
- [x] Admin/Editor visualizam todas as solicitações
- [x] Sistema de aprovação/rejeição
- [x] Criação automática de reserva ao aprovar
- [x] Dashboard com contador de revisões abertas
- [x] Registro completo no log de atividades

**Fluxo de Uso:**
1. Usuário tenta reservar horário ocupado
2. Sistema detecta conflito e oferece opção "Solicitar Revisão"
3. Usuário preenche justificativa detalhada
4. Solicitação vai para fila de revisão (status: "open")
5. Admin vê contador de solicitações pendentes
6. Admin aprova → cria reserva automaticamente
7. Admin rejeita → solicitação fica como "rejected"

### **3. Sistema de Autenticação**
- [x] Login seguro
- [x] Controle de permissões por nível
- [x] Solicitação de acesso para novos usuários
- [x] Aprovação/negação de solicitações pela coordenadora

### **3. Auditoria e Rastreabilidade**
- [x] Log completo de todas as ações
- [x] Registro de quem fez cada alteração
- [x] Histórico de reservas
- [x] Visibilidade pública dos logs (transparência)

### **4. Interface de Usuário**
- [x] Dashboard intuitivo
- [x] Calendário visual
- [x] Filtros por monitoramento
- [x] Busca por sala específica
- [x] Responsividade (mobile/desktop)

---

## 📋 Regras de Negócio

### **Reservas:**
1. Uma sala não pode ter sobreposição de blocos horários
2. Reservas podem ser feitas para datas futuras e presentes
3. Cancelamento deve ser registrado no log
4. Editores e admins podem modificar reservas
5. Administrador pode modificar qualquer reserva
6. **Validação de conflitos em tempo real:** Sistema usa `useMemo` para otimizar verificação de blocos ocupados
7. **Timezone handling:** Datas armazenadas em UTC noon (12:00:00.000Z) para evitar problemas de fuso horário

### **Usuários:**
6. Apenas administradores podem gerenciar usuários (criar, aprovar, **deletar permanentemente**, alterar roles)
7. Editores e administradores têm acesso aos logs de atividade
8. Usuários com role "leitor" podem apenas consultar (sem criar reservas)
9. Usuários com role "usuario" podem criar reservas, mas não editar/cancelar
10. Tentativas de acesso não autorizado devem ser registradas
11. **IMPORTANTE:** Usuários não podem deletar a si mesmos
12. **MUDANÇA:** Status "suspended" foi removido - contas são deletadas permanentemente
13. **Endpoint /suspend:** Agora realiza deleção permanente internamente
14. **Endpoint /reactivate:** Retorna erro 400 (operação não suportada)

### **Salas:**
9. Escritórios (101-103) têm capacidade especial (2 lugares) e são marcados como independentes
10. Salas 1-5 (Monitoramento 1): capacidade 8 pessoas
11. Salas 6-10 (Monitoramento 2): capacidade 10 pessoas
12. Salas 11-15 (Monitoramento 3): capacidade 12 pessoas
13. Todos os monitoramentos permitem todos os blocos horários (MAB, MCD, MEF, TAB, TCD)
14. Sistema calcula automaticamente disponibilidade em tempo real

---

## 🗄️ Modelagem do Banco de Dados

### **Entidades Principais:**

#### **usuarios**
```sql
id (PK, AUTO_INCREMENT)
username (VARCHAR(100), UNIQUE)
password_hash (VARCHAR(255))
name (VARCHAR(100))
email (VARCHAR(150), UNIQUE)
role (ENUM: 'admin', 'editor', 'usuario', 'leitor')
department (VARCHAR(100))
status (ENUM: 'active', 'pending', 'inactive')
-- NOTA: 'suspended' foi REMOVIDO
created_at (TIMESTAMP)
last_login (TIMESTAMP)
requested_by (FK -> usuarios.id)
approved_by (FK -> usuarios.id)
approved_at (TIMESTAMP)
```

#### **salas**
```sql
id (PK, VARCHAR(50))
number (INT, UNIQUE)
name (VARCHAR(100))
monitoring_id (FK -> monitoramentos.id, NULL)
capacity (INT)
description (TEXT)
is_independent (BOOLEAN)
-- Escritórios (101-103): is_independent = true
-- Salas numéricas (1-15): is_independent = false
available (BOOLEAN)
```

#### **monitoramentos**
```sql
id (PK, VARCHAR(50))
name (VARCHAR(100))
service_type (VARCHAR(200))
allowed_periods (JSON)
-- Formato: ["MAB", "MCD", "MEF", "TAB", "TCD"]
reservavel (BOOLEAN)
```

#### **reservas**
```sql
id (PK, UUID)
room_id (FK -> salas.id)
room_number (INT)
room_name (VARCHAR(100))
user_id (FK -> usuarios.id)
date (DATE)
-- Armazenado como YYYY-MM-DD em UTC
time_slots (JSON)
-- Array de IDs: ["MAB", "MCD"] etc
responsible (VARCHAR(100))
service_type (VARCHAR(200))
notes (TEXT, NULL)
created_by (VARCHAR(100))
created_at (TIMESTAMP)
status (ENUM: 'confirmed', 'pending', 'cancelled')
```

**Importante:** 
- `time_slots` armazena array de blocos (MAB, MCD, MEF, TAB, TCD)
- Frontend calcula automaticamente faixa horária (início do primeiro bloco até fim do último)
- Backend valida conflitos verificando sobreposição de blocos na mesma sala/data

#### **logs_atividade**
```sql
id (PK, UUID)
user_id (FK -> usuarios.id)
user_name (VARCHAR(100))
action (VARCHAR(100))
-- Ex: "Criar Reserva", "Gerenciar Usuário", "Cancelar Reserva"
details (TEXT)
timestamp (TIMESTAMP)
affected_resource (VARCHAR(50), NULL)
-- ID do recurso afetado (booking ID, user ID, etc)
ip_address (VARCHAR(45), NULL)
user_agent (TEXT, NULL)
```

**Melhorias Recentes:**
- Adicionados campos `ip_address` e `user_agent` para auditoria avançada
- Todos os logs incluem nome do usuário para rastreabilidade
- Suporte a paginação e filtros (userId, action, from, to)

---

## � Melhorias Técnicas Recentes

### **1. Sistema de Blocos Horários Otimizado**
**Antes:** 10 períodos individuais de 50 minutos (M.A até T.D)  
**Depois:** 5 blocos combinados de 100 minutos (MAB, MCD, MEF, TAB, TCD)

**Benefícios:**
- ✅ Interface mais simples (5 checkboxes vs 10)
- ✅ Menor probabilidade de conflitos
- ✅ Melhor performance (menos validações)
- ✅ UX mais intuitiva para reservas longas

### **2. Remoção do Status "Suspended"**
**Motivação:** Simplificar gerenciamento de usuários e evitar contas "zumbi"

**Mudanças Implementadas:**
- Enum `UserStatus`: `"active" | "pending" | "inactive"` (suspended removido)
- Backend: `userService.suspend()` agora chama `delete()` internamente
- Backend: `userService.reactivate()` lança erro 400
- Frontend: Removida tab "Suspensos" e botões de suspender/reativar
- UI: Cards de usuário mostram apenas Ativos e Pendentes

**Resultado:** Sistema mais limpo, sem estados ambíguos

### **3. Otimização de Performance - NAMIBookingModal**
**Problema:** Modal não atualizava horários ocupados após criar nova reserva para o dia atual

**Solução:** Convertido `getOccupiedSlots()` de função normal para `useMemo`

```typescript
// ANTES
const getOccupiedSlots = (date: Date) => { /* ... */ };
const occupiedSlots = selectedDate ? getOccupiedSlots(selectedDate) : [];

// DEPOIS
const occupiedSlots = useMemo(() => {
  // lógica de cálculo
  return occupied;
}, [selectedDate, room, existingBookings, editingBooking]);
```

**Benefícios:**
- ✅ Recalcula automaticamente quando `existingBookings` muda
- ✅ Horários ocupados são desabilitados em tempo real
- ✅ Menos re-renders desnecessários
- ✅ Melhor experiência de usuário

### **4. Tratamento de Timezone**
**Problema:** Datas com comportamento inconsistente devido a fusos horários locais

**Solução:** Padronização para UTC noon (12:00:00.000Z)

```typescript
const parseBookingDate = (value: string): Date => {
  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (dateOnlyPattern.test(value)) {
    return new Date(value + 'T12:00:00.000Z'); // UTC noon
  }
  return new Date(value);
};
```

**Comparações de Data:**
```typescript
// Sempre usar formato ISO YYYY-MM-DD
const dateString = date.toISOString().split('T')[0];
```

**Resultado:** Comportamento consistente independente do timezone do cliente

### **5. Paginação em Todos os Endpoints**
**Endpoints com Paginação Implementada:**
- `GET /api/users?page=1&perPage=20`
- `GET /api/nami/rooms?page=1&perPage=20`
- `GET /api/nami/bookings?page=1&perPage=20`
- `GET /api/nami/activity-logs?page=1&perPage=20`

**Formato de Resposta:**
```json
{
  "items": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "perPage": 20,
    "totalPages": 5
  }
}
```

**Limites:** `perPage` máximo de 100, `page` mínimo de 1

### **6. Filtros Avançados em Activity Logs**
**Filtros Disponíveis:**
- `userId` - Filtrar por usuário específico
- `action` - Busca parcial case-insensitive
- `from` - Data inicial (YYYY-MM-DD)
- `to` - Data final (YYYY-MM-DD)

**Exemplo:**
```
GET /api/nami/activity-logs?action=Reserva&from=2025-11-01&to=2025-11-30
```

### **7. CRUD Completo de Reservas**
**Endpoints Implementados:**
- ✅ `POST /api/nami/bookings` - Criar reserva
- ✅ `PUT /api/nami/bookings/:id` - Editar reserva
- ✅ `DELETE /api/nami/bookings/:id` - Cancelar reserva (soft delete)
- ✅ `GET /api/nami/bookings` - Listar com paginação
- ✅ `GET /api/nami/rooms/:roomId/bookings` - Listar por sala

**Validações Backend (Zod):**
- Blocos horários devem existir (MAB, MCD, MEF, TAB, TCD)
- Sala deve existir e estar disponível
- Não pode haver conflitos de horário
- Capacidade não pode exceder limite da sala

### **8. Auditoria Aprimorada**
**Novos Campos em ActivityLog:**
- `ipAddress` - IP do cliente que fez a ação
- `userAgent` - Navegador/SO do cliente

**Registro Automático:**
- Todas as operações de usuário (create, update, delete, approve, reject)
- Todas as operações de reserva (create, update, cancel)
- Logout (com IP e user-agent)

### **9. Proteção contra Auto-exclusão**
**Regras de Negócio:**
```typescript
if (userId === actorId) {
  throw ApiError.badRequest("Não é possível excluir o próprio usuário");
}
```

**Aplicado em:**
- `userService.delete()`
- `userService.suspend()` (que chama delete internamente)

---

## 📊 Histórico de Versões

### **Versão 2.2** (Novembro 2025)
- ✅ Substituição de 10 períodos por 5 blocos combinados
- ✅ Remoção completa do status "suspended"
- ✅ Otimização de performance com useMemo
- ✅ Padronização de timezone (UTC noon)
- ✅ CRUD completo de reservas via API
- ✅ Paginação em todos os endpoints
- ✅ Filtros avançados em activity logs
- ✅ Auditoria com IP e user-agent
- ✅ 18 salas (3 escritórios + 15 atendimento)
- ✅ Ícone de engrenagem no menu de ações (substituiu 3 pontos)

### **Versão 2.1** (Outubro 2025)
- Reorganização de roles com cores distintivas
- Matriz de permissões simplificada
- Remoção de requisitos mobile (projeto exclusivamente web desktop)

### **Versão 2.0** (Outubro 2025)
- Análise completa do projeto atual
- Atualização de requisitos
- Documentação técnica expandida

### **Versão 1.0** (Data anterior)
- Versão inicial dos requisitos
- Setup do projeto

---

## 🚀 Próximos Passos

### **Fase 1: Planejamento e Setup (Semana 1-2)**
- [ ] Finalização da documentação técnica
- [ ] Setup do ambiente de desenvolvimento
- [ ] Configuração do repositório Git
- [ ] Criação do banco de dados
- [ ] Setup inicial Angular + Node.js

### **Fase 2: Backend Core (Semana 3-5)**
- [ ] API de autenticação
- [ ] CRUD de usuários
- [ ] CRUD de salas
- [ ] CRUD de reservas
- [ ] Sistema de logs
- [ ] Middleware de autorização

### **Fase 3: Frontend Core (Semana 6-8)**
- [ ] Sistema de login
- [ ] Dashboard principal
- [ ] Calendário de reservas
- [ ] Formulários de reserva
- [ ] Gerenciamento de usuários (admin)

### **Fase 4: Integrações (Semana 9-10)**
- [ ] Integração frontend-backend
- [ ] Sistema de notificações
- [ ] Validações avançadas
- [ ] Testes de conflitos

### **Fase 5: Testes e Deploy (Semana 11-12)**
- [ ] Testes de usabilidade
- [ ] Testes de carga
- [ ] Correções e ajustes
- [ ] Deploy em produção
- [ ] Treinamento dos usuários

---

## 🔒 Aspectos de Segurança

### **Autenticação e Autorização:**
- Hash seguro de senhas (bcrypt)
- JWT para sessões
- Rate limiting para APIs
- Validação de entrada rigorosa

### **Auditoria:**
- Log de todas as ações críticas
- Rastreamento de IPs
- Monitoramento de tentativas de acesso

### **Dados:**
- Backup automático diário
- Criptografia de dados sensíveis
- Política de retenção de dados

---

## 📞 Stakeholders

### **Cliente Principal:**
- **NAMI - UNIFOR**
- **Coordenadora do Curso de Nutrição** (Administradora do Sistema)

### **Usuários Finais:**
- Professores do curso de Nutrição
- Funcionários administrativos do NAMI
- Estudantes (quando aplicável)

### **Equipe de Desenvolvimento:**
- Desenvolvedores Frontend (Angular)
- Desenvolvedores Backend (Node.js)
- Analista de Banco de Dados (MySQL)
- Designer UX/UI

---

## 📈 Métricas de Sucesso

### **Indicadores Quantitativos:**
- Redução de 90% no tempo de criação de reservas
- Zero conflitos de horários após implementação
- 100% de rastreabilidade das alterações
- Tempo de resposta < 2 segundos para consultas

### **Indicadores Qualitativos:**
- Satisfação dos usuários ≥ 8/10
- Facilidade de uso percebida ≥ 8/10
- Redução do stress administrativo
- Melhoria na organização geral

---

## 🔄 Metodologia de Desenvolvimento

### **Framework:** Scrum Adaptado
- **Sprints:** 2 semanas
- **Reuniões:** Daily standup (15min)
- **Reviews:** A cada sprint
- **Retrospectivas:** Semanais

### **Controle de Versão:**
- **Git** com GitFlow
- **Branches:** develop, feature/, hotfix/, release/
- **Code Review** obrigatório

### **Documentação:**
- Documentação técnica atualizada
- Manual do usuário
- Guias de instalação e manutenção

---

## 📋 Próximos Passos

1. **Aprovação da documentação** pelo NAMI
2. **Validação dos requisitos** com a coordenadora
3. **Setup do ambiente** de desenvolvimento
4. **Início do desenvolvimento** da primeira sprint
5. **Agendamento de reuniões** de acompanhamento semanais

---

**Documento elaborado em:** Janeiro 2025  
**Versão:** 1.0  
**Status:** Em revisão

---

*Este documento serve como base para o desenvolvimento do Sistema de Gestão de Salas do NAMI-UNIFOR e será atualizado conforme o projeto evolui.*