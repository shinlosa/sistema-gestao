# Sistema de Gestão de Salas - NAMI UNIFOR

## 📋 Informações do Projeto

**Instituição:** Universidade de Fortaleza (UNIFOR)  
**Setor:** NAMI - Núcleo de Atenção Médica Integrada  
**Curso:** Nutrição  
**Tipo:** Projeto de Extensão - Desenvolvimento Web  

**Stack Tecnológica:**
- **Frontend:** Angular.js + Bootstrap
- **Backend:** Node.js + Express
- **Banco de Dados:** MySQL

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

#### **MONITORAMENTO 1** - NDC Profa. Lorrainy
- **Tipo de Atendimento:** Atendimento de 1ª vez (Paciente A) (ABCD)
- **Salas:** 1, 2, 3, 4, 5
- **Total:** 5 salas

#### **MONITORAMENTO 2** - PROFA VIRGINIA (ESC)
- **Tipo de Atendimento:** (ABCDEF)
- **Salas:** 6, 7, 8, 9, 10
- **Total:** 5 salas

#### **MONITORAMENTO 3**
- **Sala 11:** NUTRICIONISTA ANA CLAUDIA
- **Sala 14:** (Sem especificação atual)
- **Sala 15:** PROFA. CAROL FARMÁCIA (ABCD)
- **Salas 16, 17:** (Sem especificação atual)
- **Total:** 5 salas

#### **SALAS INDEPENDENTES** (Não vinculadas a monitoramentos)
- **Sala 12:** Uso geral
- **Sala 13:** Capacidade especial (25 lugares)

**TOTAL GERAL:** 17 salas (15 em monitoramentos + 2 independentes)

---

## ⏰ Grade de Horários

### **Período Matutino:**
- **M.A:** 07:30 - 08:20
- **M.B:** 08:20 - 09:10
- **M.C:** 09:30 - 10:20
- **M.D:** 10:20 - 11:10
- **M.E:** 11:20 - 12:10
- **M.F:** 12:10 - 13:00

### **Período Vespertino:**
- **T.A:** 13:30 - 14:20
- **T.B:** 14:20 - 15:10
- **T.C:** 15:30 - 16:20
- **T.D:** 16:20 - 17:10

### **Flexibilidade de Reserva:**
- Períodos completos (ex: AB manhã completo: 07:30 - 09:10)
- Períodos fracionados (ex: apenas B manhã: 08:20 - 09:10)
- Reserva de blocos específicos conforme necessidade

---

## 👥 Sistema de Usuários e Permissões

### **Hierarquia de Acesso:**

#### **1. Administrador Principal**
- **Responsável:** Coordenadora do Curso de Nutrição
- **Permissões:**
  - Acesso total ao sistema
  - Gerenciar usuários (aprovar/negar solicitações)
  - Visualizar todos os logs de atividade
  - Configurar salas e horários
  - Backup e manutenção de dados

#### **2. Editores/Funcionários**
- **Acesso:** Mediante aprovação da coordenadora
- **Permissões:**
  - Criar reservas
  - Editar reservas próprias
  - Visualizar disponibilidade
  - Cancelar reservas próprias

#### **3. Visualizadores**
- **Permissões:**
  - Consultar disponibilidade
  - Visualizar logs públicos
  - Solicitar reservas (dependente de aprovação)

---

## 🔧 Funcionalidades Principais

### **1. Gestão de Reservas**
- [x] Visualização de disponibilidade em tempo real
- [x] Reserva por períodos específicos
- [x] Calendário interativo
- [x] Informações detalhadas por sala:
  - Número da sala
  - Tipo de atendimento
  - Professor responsável
  - Horário de ocupação
  - Status (disponível/ocupada)

### **2. Sistema de Autenticação**
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
1. Uma sala não pode ter sobreposição de horários
2. Reservas só podem ser feitas para datas futuras
3. Cancelamento deve ser registrado no log
4. Editores só podem modificar suas próprias reservas
5. Administrador pode modificar qualquer reserva

### **Usuários:**
6. Apenas a coordenadora pode aprovar novos usuários
7. Logs de atividade devem ser mantidos permanentemente
8. Tentativas de acesso não autorizado devem ser registradas

### **Salas:**
9. Sala 13 tem capacidade especial (25 lugares)
10. Salas 12 e 13 são independentes de monitoramento
11. Cada monitoramento tem regras específicas de uso

---

## 🗄️ Modelagem do Banco de Dados

### **Entidades Principais:**

#### **usuarios**
```sql
id (PK, AUTO_INCREMENT)
nome (VARCHAR(100))
email (VARCHAR(150), UNIQUE)
senha (VARCHAR(255))
tipo (ENUM: 'admin', 'editor', 'visualizador')
status (ENUM: 'ativo', 'pendente', 'inativo')
data_criacao (TIMESTAMP)
data_aprovacao (TIMESTAMP)
aprovado_por (FK -> usuarios.id)
```

#### **salas**
```sql
id (PK, AUTO_INCREMENT)
numero (INT, UNIQUE)
nome (VARCHAR(100))
monitoramento_id (FK -> monitoramentos.id, NULL)
capacidade (INT)
descricao (TEXT)
ativa (BOOLEAN)
```

#### **monitoramentos**
```sql
id (PK, AUTO_INCREMENT)
nome (VARCHAR(100))
responsavel (VARCHAR(100))
tipo_atendimento (VARCHAR(200))
periodos_permitidos (JSON)
```

#### **reservas**
```sql
id (PK, AUTO_INCREMENT)
sala_id (FK -> salas.id)
usuario_id (FK -> usuarios.id)
data_reserva (DATE)
periodo_inicio (TIME)
periodo_fim (TIME)
tipo_atendimento (VARCHAR(200))
professor_responsavel (VARCHAR(100))
observacoes (TEXT)
status (ENUM: 'ativa', 'cancelada')
data_criacao (TIMESTAMP)
data_cancelamento (TIMESTAMP)
```

#### **logs_atividade**
```sql
id (PK, AUTO_INCREMENT)
usuario_id (FK -> usuarios.id)
acao (VARCHAR(100))
tabela_afetada (VARCHAR(50))
registro_id (INT)
dados_anteriores (JSON)
dados_novos (JSON)
ip_address (VARCHAR(45))
user_agent (TEXT)
timestamp (TIMESTAMP)
```

---

## 🚀 Cronograma de Desenvolvimento

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