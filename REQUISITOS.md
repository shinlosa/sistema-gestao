# Requisitos do Sistema - NAMI UNIFOR
## Sistema de Gestão de Reservas de Salas

**Instituição:** Universidade de Fortaleza (UNIFOR)  
**Setor:** NAMI - Núcleo de Atenção Médica Integrada  
**Curso:** Nutrição  
**Plataforma:** Web Desktop  
**Data:** Outubro de 2025  
**Versão:** 2.0

---

## 📋 Sumário Executivo

### Stack Tecnológica Atual
- **Frontend:** React 18.3.1 + TypeScript + Vite
- **UI Library:** Radix UI + Tailwind CSS + ShadCN/UI
- **Backend:** Node.js + Express + TypeScript
- **Estado:** Gerenciamento local (useState/useEffect)
- **Notificações:** Sonner (Toast)
- **Validação:** Zod

### Objetivo
Sistema web desktop para automatizar o processo de reserva de salas do curso de Nutrição, substituindo o controle manual via planilhas Excel, eliminando conflitos de agenda e garantindo rastreabilidade completa. **Plataforma exclusivamente web, otimizada para uso em desktops e notebooks.**

---

## 1. Análise do Projeto Atual

### 1.1 Estrutura de Dados

#### Salas (NAMIRoom)
- 18 salas organizadas em 3 monitoramentos principais
- Salas independentes (não vinculadas a monitoramentos) – agora três unidades (Salas 12, 13 e 18)
- Atributos: ID, número, nome, capacidade, descrição, responsável padrão, disponibilidade
- **Plataforma:** Web Desktop

#### Monitoramentos (Monitoring)
- Agrupamento lógico de salas por tipo de atendimento
- Responsáveis específicos por monitoramento
- Períodos permitidos para reserva (matutino/vespertino)

#### Reservas (NAMIBooking)
- Sistema de períodos fracionados (M.A até T.D - 10 períodos diários)
- Status: confirmada, pendente, cancelada
- Informações: sala, data, horários, responsável, tipo de serviço, observações
- Rastreabilidade: quem criou e quando

#### Usuários (User)
- Roles: admin, editor, viewer, coordinator, professor, staff
- Status: active, pending, inactive, suspended
- Autenticação via username/password com token JWT

### 1.2 Funcionalidades Implementadas

#### Autenticação
- Login com credenciais (username/password)
- Autenticação via API REST com token JWT
- Logout seguro com limpeza de sessão
- Persistência de token no localStorage

#### Gestão de Salas
- Visualização por monitoramento ou salas independentes
- Cards informativos com status em tempo real
- Busca/filtro por nome de sala
- Indicação visual de disponibilidade (verde/vermelho)
- Exibição de horários ocupados no dia atual

#### Gestão de Reservas
- Modal de criação/edição com layout de duas colunas
- Calendário integrado (React Day Picker)
- Seleção múltipla de períodos com validação de conflitos
- Pré-preenchimento inteligente de formulários
- Cancelamento com confirmação
- Listagem separada: próximas reservas vs histórico
- Filtros e busca

#### Gestão de Usuários (Admin)
- Organização por tabs: Pendentes, Ativos, Suspensos
- Dashboard com estatísticas
- Aprovação/rejeição de solicitações
- Suspensão/reativação de usuários
- Proteção contra auto-exclusão
- Busca por nome, email ou departamento

#### Log de Atividades
- Registro automático de todas as ações
- Timestamps com tempo relativo
- Ícones e badges coloridos por tipo de ação
- Filtros e busca
- Rastreabilidade completa

### 1.3 Arquitetura

#### Frontend
- **Componentes:** Modularização por features (auth, bookings, rooms, users, activity, layout, shared)
- **Tipos:** TypeScript com interfaces bem definidas
- **UI:** ShadCN/UI (componentes Radix UI estilizados)
- **Estado:** Local state com useState, sem gerenciador global
- **API:** Cliente HTTP customizado com tratamento de erros

#### Backend
- **Estrutura:** MVC (Controllers, Services, Routes, Data)
- **Segurança:** Helmet, CORS configurável
- **Validação:** Zod schemas
- **Dados:** Mock data (estrutura pronta para integração com BD)

---

## 2. Grade de Horários

### Períodos Matutinos
| ID | Período | Horário |
|----|---------|---------|
| M.A | Matutino A | 07:30 - 08:20 |
| M.B | Matutino B | 08:20 - 09:10 |
| M.C | Matutino C | 09:30 - 10:20 |
| M.D | Matutino D | 10:20 - 11:10 |
| M.E | Matutino E | 11:20 - 12:10 |
| M.F | Matutino F | 12:10 - 13:00 |

### Períodos Vespertinos
| ID | Período | Horário |
|----|---------|---------|
| T.A | Tarde A | 13:30 - 14:20 |
| T.B | Tarde B | 14:20 - 15:10 |
| T.C | Tarde C | 15:30 - 16:20 |
| T.D | Tarde D | 16:20 - 17:10 |

**Total:** 10 períodos diários de 50 minutos cada

---

## 3. Requisitos Funcionais (RF)

### 3.1 Autenticação e Autorização

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RF001** | Login de Usuários | Sistema deve permitir login de usuários autenticados via API REST | - Validação de credenciais (username e password)<br>- Retorno de token JWT<br>- Sessão persistente no localStorage<br>- Feedback visual para erros<br>- Redirecionamento automático após sucesso | Essencial | ✅ Implementado |
| **RF002** | Conta Administradora | Deve existir conta admin com acesso total | - Login: admin.nami<br>- Senha: NAMI@2025!<br>- Acesso total ao sistema<br>- Gestão de todos os usuários | Essencial | ✅ Implementado |
| **RF003** | Logout de Usuários | Usuários devem poder sair do sistema de forma segura | - Encerramento da sessão<br>- Limpeza do localStorage<br>- Redirecionamento para login<br>- Registro no log de atividades | Essencial | ✅ Implementado |
| **RF004** | Controle de Permissões | Diferentes níveis de acesso baseados no perfil | - Admin: acesso total<br>- Editor: criar/editar/cancelar reservas<br>- Viewer: apenas visualização<br>- Validação em cada ação | Essencial | ✅ Implementado |
| **RF005** | Autenticação via Token | Sistema deve usar JWT para autenticação | - Token gerado no login<br>- Armazenamento seguro<br>- Validação em requisições<br>- Expiração automática | Essencial | ✅ Implementado |

### 3.2 Gestão de Usuários

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RF006** | Cadastro de Usuários | Admin pode cadastrar novos usuários | - Formulário com dados obrigatórios<br>- Validação de username único<br>- Definição de role e permissões<br>- Email institucional | Essencial | 🔄 Backend |
| **RF007** | Edição de Usuários | Admin pode editar dados de usuários | - Modificação de dados pessoais<br>- Alteração de role<br>- Mudança de status<br>- Histórico de modificações | Essencial | 🔄 Backend |
| **RF008** | Exclusão de Usuários | Admin pode remover usuários | - Confirmação antes da exclusão<br>- Impossibilidade de auto-exclusão<br>- Manutenção do histórico de ações | Essencial | 🔄 Backend |
| **RF009** | Listagem de Usuários | Visualização de todos os usuários | - Lista com informações básicas<br>- Status visível<br>- Ações por usuário<br>- Busca e filtros | Importante | ✅ Implementado |
| **RF010** | Aprovação de Solicitações | Admin aprova/rejeita solicitações de acesso | - Lista de pendentes<br>- Badge visual de quantidade<br>- Botões de ação rápida<br>- Informação do solicitante | Essencial | ✅ Implementado |
| **RF011** | Suspensão de Usuários | Admin pode suspender usuários temporariamente | - Mudança de status para suspended<br>- Impossibilidade de suspender a si mesmo<br>- Registro no log<br>- Feedback visual | Essencial | ✅ Implementado |
| **RF012** | Reativação de Usuários | Admin pode reativar usuários suspensos | - Mudança de status para active<br>- Restauração de acesso<br>- Registro no log<br>- Notificação de sucesso | Essencial | ✅ Implementado |
| **RF013** | Organização por Status | Interface com tabs por status de usuário | - Tab "Pendentes"<br>- Tab "Ativos"<br>- Tab "Suspensos"<br>- Contador em cada tab<br>- Navegação fluida | Importante | ✅ Implementado |
| **RF014** | Dashboard de Usuários | Visão geral com métricas | - Card: total de usuários<br>- Card: usuários ativos<br>- Card: usuários pendentes<br>- Card: usuários suspensos<br>- Ícones representativos | Importante | ✅ Implementado |
| **RF015** | Informações Detalhadas | Visualização completa de dados do usuário | - Nome completo e username<br>- Email institucional<br>- Role/função<br>- Departamento<br>- Data de criação<br>- Último acesso<br>- Status atual | Importante | ✅ Implementado |
| **RF016** | Menu de Ações Contextual | Dropdown com ações por usuário | - Ícone três pontos (⋮)<br>- Ações conforme status<br>- Cores diferenciadas<br>- Proteção contra auto-ação | Importante | ✅ Implementado |
| **RF017** | Badges de Perfil | Identificação visual do role | - Admin: roxo<br>- Coordenador: azul<br>- Professor: verde<br>- Funcionário: cinza<br>- Editor: laranja<br>- Viewer: cinza claro | Desejável | ✅ Implementado |
| **RF018** | Busca de Usuários | Sistema de busca por nome, email ou departamento | - Campo de busca<br>- Filtro em tempo real<br>- Busca case-insensitive<br>- Manutenção de organização por tabs | Importante | ✅ Implementado |

### 3.3 Gestão de Salas

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RF019** | Visualização por Monitoramento | Exibir 18 salas organizadas por 3 monitoramentos | - Agrupamento visual por monitoramento<br>- Informações básicas<br>- Status de disponibilidade<br>- Capacidade | Essencial | ✅ Implementado |
| **RF020** | Salas Independentes | Exibir salas não vinculadas a monitoramentos | - Seção separada<br>- Badge "Sala Independente"<br>- Status em tempo real<br>- Informações específicas | Essencial | ✅ Implementado |
| **RF021** | Detalhes da Sala | Visualizar informações completas | - Número da sala<br>- Tipo de monitoramento<br>- Capacidade<br>- Recursos disponíveis<br>- Responsável padrão<br>- Reservas atuais e futuras | Importante | ✅ Implementado |
| **RF022** | Status Visual das Salas | Indicadores visuais de disponibilidade | - Verde: disponível<br>- Vermelho: ocupada<br>- Informações de ocupação atual<br>- Próximas reservas<br>- Atualização em tempo real | Importante | ✅ Implementado |
| **RF023** | Horários Ocupados | Mostrar períodos ocupados no dia atual | - Seção no card da sala<br>- Badges com períodos (M.A, M.B, etc)<br>- Apenas horários do dia atual<br>- Cálculo dinâmico | Importante | ✅ Implementado |
| **RF024** | Busca de Salas | Filtro por nome de sala | - Campo de busca<br>- Filtro em tempo real<br>- Busca por monitoramento<br>- Busca por salas independentes | Importante | ✅ Implementado |
| **RF025** | Cards de Sala | Cards informativos com design consistente | - Número da sala (badge circular)<br>- Nome e descrição<br>- Capacidade com ícone<br>- Status visual<br>- Responsável padrão<br>- Borda lateral azul<br>- Hover com elevação | Essencial | ✅ Implementado |
| **RF026** | Botão de Ação Contextual | Botão com texto adaptativo | - "Reservar" se livre<br>- "Ver Disponibilidade" se parcial<br>- Desabilitado se indisponível<br>- Ícone de calendário | Importante | ✅ Implementado |
| **RF027** | Navegação por Tabs | Sub-navegação entre tipos de sala | - Tab "Por Monitoramento"<br>- Tab "Salas Independentes"<br>- Design consistente<br>- Grid responsivo | Essencial | ✅ Implementado |
| **RF028** | Seções de Monitoramento | Cards de cabeçalho por monitoramento | - Nome do monitoramento<br>- Responsável principal<br>- Tipo de atendimento<br>- Períodos permitidos<br>- Grid de salas abaixo | Essencial | ✅ Implementado |

### 3.4 Gestão de Reservas

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RF029** | Criar Reserva | Usuários autorizados podem criar reservas | - Seleção de sala<br>- Escolha de data<br>- Seleção múltipla de períodos<br>- Tipo de serviço<br>- Responsável<br>- Observações opcionais | Essencial | ✅ Implementado |
| **RF030** | Editar Reserva | Permitir modificação de reservas existentes | - Alteração de data e horário<br>- Modificação de serviço<br>- Atualização de responsável<br>- Validação de conflitos<br>- Manutenção do histórico | Essencial | ✅ Implementado |
| **RF031** | Cancelar Reserva | Permitir cancelamento de reservas | - Confirmação prévia<br>- Liberação imediata<br>- Registro no log<br>- Notificação visual<br>- Apenas usuários autorizados | Essencial | ✅ Implementado |
| **RF032** | Validação de Conflitos | Prevenir reservas conflitantes | - Verificação em tempo real<br>- Bloqueio de horários ocupados<br>- Checkboxes desabilitados<br>- Mensagens claras | Essencial | ✅ Implementado |
| **RF033** | Períodos Fracionados | Sistema suporta 10 períodos específicos | - M.A até M.F (manhã)<br>- T.A até T.D (tarde)<br>- Seleção múltipla<br>- Validação de sequência<br>- Interface intuitiva | Essencial | ✅ Implementado |
| **RF034** | Calendário Integrado | Interface de calendário para seleção de data | - Visualização mensal<br>- Locale pt-BR<br>- Navegação entre meses<br>- Destaque da data selecionada<br>- Desabilitar datas passadas (opcional) | Essencial | ✅ Implementado |
| **RF035** | Listagem de Reservas | Visualização de todas as reservas | - Próximas reservas<br>- Histórico<br>- Filtros por data, sala, status<br>- Ordenação<br>- Ações rápidas (editar, cancelar) | Importante | ✅ Implementado |
| **RF036** | Modal de Reserva em Duas Colunas | Interface otimizada para criação/edição | - Coluna esquerda: formulário<br>- Coluna direita: calendário e horários<br>- Layout fixo de duas colunas<br>- Largura máxima 7xl<br>- Scroll interno | Essencial | ✅ Implementado |
| **RF037** | Pré-preenchimento Inteligente | Formulário pré-preenchido com dados | - Nova: dados padrão da sala<br>- Edição: dados da reserva<br>- Responsável padrão<br>- Tipo de atendimento<br>- Data atual ou da reserva | Essencial | ✅ Implementado |
| **RF038** | Seleção Múltipla com Validação | Checkboxes para períodos com validação | - Checkboxes para 10 períodos<br>- Desabilitar ocupados<br>- Indicação visual clara<br>- Seleção não-sequencial<br>- Labels com horário completo | Essencial | ✅ Implementado |
| **RF039** | Exclusão da Própria Reserva | Ao editar, não considerar como conflito | - Filtrar reserva sendo editada<br>- Permitir alterar horários<br>- Validar apenas outras reservas<br>- Feedback correto | Essencial | ✅ Implementado |
| **RF040** | Indicador de Modo Edição | Alert visual no topo do modal | - Fundo azul claro<br>- Texto explicativo<br>- Apenas se editingBooking !== null | Desejável | ✅ Implementado |
| **RF041** | Resumo de Horários | Seção mostrando períodos selecionados | - Formatação em texto (M.A, M.B, T.A)<br>- Atualização em tempo real<br>- Horário inicial e final | Importante | ✅ Implementado |
| **RF042** | Validação de Capacidade | Input numérico com validação de limite | - Min: 1 participante<br>- Max: capacidade da sala<br>- Validação no cliente<br>- Mensagem de erro se exceder | Importante | ✅ Implementado |
| **RF043** | Campo de Observações | Textarea opcional para informações | - Placeholder apropriado<br>- Campo opcional<br>- 3 linhas de altura<br>- Armazenado com reserva | Desejável | ✅ Implementado |
| **RF044** | Registro de Criador | Sistema registra quem criou a reserva | - Campo createdBy automático<br>- Usar nome do usuário logado<br>- Exibir na listagem<br>- Não editável | Importante | ✅ Implementado |
| **RF045** | Separação Temporal | Reservas divididas em próximas e histórico | - Próximas: data >= hoje e status != cancelada<br>- Histórico: data < hoje ou cancelada<br>- Títulos claros<br>- Opacidade reduzida em histórico | Essencial | ✅ Implementado |
| **RF046** | Card de Reserva Detalhado | Informações completas em cada card | - Número e nome da sala<br>- Data formatada<br>- Horário inicial e final<br>- Participantes<br>- Status (badge)<br>- Responsável<br>- Tipo de atendimento<br>- Criador<br>- Períodos (badges)<br>- Observações | Essencial | ✅ Implementado |
| **RF047** | Menu de Ações em Reservas | Dropdown com ações contextuais | - Ver Detalhes (opcional)<br>- Editar (se confirmada)<br>- Cancelar (sempre)<br>- Cores diferenciadas<br>- Apenas para usuários autorizados | Essencial | ✅ Implementado |
| **RF048** | Formatação de Data | Data em formato extenso e legível | - Formato: "dia da semana, dia de mês de ano"<br>- Exemplo: "segunda-feira, 15 de janeiro de 2025"<br>- Locale pt-BR | Desejável | ✅ Implementado |
| **RF049** | Cálculo de Faixa Horária | Sistema calcula horário inicial e final | - Ordenar períodos<br>- Pegar start do primeiro<br>- Pegar end do último<br>- Formato: "HH:MM - HH:MM" | Importante | ✅ Implementado |
| **RF050** | Estado Vazio | Mensagem quando não há reservas | - Ícone grande de calendário<br>- Título descritivo<br>- Texto explicativo<br>- Centralizado | Desejável | ✅ Implementado |
| **RF051** | Impressão de Relatório | Exportar reservas para impressão | - Função window.print()<br>- Layout otimizado para impressão<br>- Registro no log | Importante | ✅ Implementado |

### 3.5 Log de Atividades

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RF052** | Registro de Ações | Todas as ações relevantes são registradas | - Login/logout<br>- Criação, edição e cancelamento de reservas<br>- Gestão de usuários<br>- Timestamp preciso<br>- Identificação do usuário | Essencial | ✅ Implementado |
| **RF053** | Visualização do Log | Interface para consulta do log | - Listagem cronológica<br>- Filtros por usuário, ação, data<br>- Detalhes da ação<br>- Busca textual | Essencial | ✅ Implementado |
| **RF054** | Rastreabilidade | Capacidade de rastrear modificações | - Histórico completo<br>- Identificação do responsável<br>- Detalhes das alterações<br>- Recursos afetados | Essencial | ✅ Implementado |
| **RF055** | Ícones Contextuais | Cada tipo de ação tem ícone próprio | - Plus (verde) para criação<br>- X (vermelho) para cancelamento<br>- Edit (azul) para edição<br>- User (azul) para login<br>- Activity (cinza) para outras | Desejável | ✅ Implementado |
| **RF056** | Badges Coloridos | Badges com cores semânticas | - Verde para Criação<br>- Vermelho para Cancelamento<br>- Azul para Edição<br>- Outline para Login<br>- Outline para Sistema | Desejável | ✅ Implementado |
| **RF057** | Timestamp Relativo | Tempo decorrido humanizado | - "Agora" se < 1 min<br>- "X min atrás" se < 60 min<br>- "Xh atrás" se < 24h<br>- "Xd atrás" se < 7d<br>- Data completa se > 7d<br>- Tooltip com timestamp completo | Importante | ✅ Implementado |
| **RF058** | Ordenação Cronológica | Logs mais recentes primeiro | - Sort por timestamp descendente<br>- Logs imutáveis<br>- Atualização automática | Essencial | ✅ Implementado |
| **RF059** | Scroll Area | Área de scroll configurável | - Altura padrão: 400px<br>- Altura configurável<br>- Scroll vertical<br>- Scrollbar customizada | Importante | ✅ Implementado |
| **RF060** | Contador de Registros | Quantidade total de logs | - Texto: "X registros"<br>- Atualização em tempo real<br>- Visível no header | Desejável | ✅ Implementado |
| **RF061** | Estado Vazio do Log | Mensagem quando não há atividades | - Ícone Activity grande<br>- Texto descritivo<br>- Centralizado<br>- Padding adequado | Desejável | ✅ Implementado |

### 3.6 Interface e Navegação

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RF062** | Header Institucional | Cabeçalho com identidade UNIFOR | - Gradiente azul (blue-600 to blue-700)<br>- Logo NAMI estilizado<br>- Nome do sistema e instituição<br>- Navegação por tabs inline<br>- Menu de usuário | Essencial | ✅ Implementado |
| **RF063** | Navegação por Tabs | Sistema de navegação principal | - Tab "Salas" (ícone Users)<br>- Tab "Reservas" (ícone CalendarDays)<br>- Tab "Log de Atividades" (ícone Activity)<br>- Tab "Usuários" (ícone Settings - apenas admin)<br>- Destaque visual da tab ativa<br>- SPA (sem reload) | Essencial | ✅ Implementado |
| **RF064** | Menu de Usuário | Dropdown com informações e ações | - Nome do usuário<br>- Email<br>- Badge com role<br>- Departamento<br>- Botão de logout<br>- Avatar/ícone<br>- ChevronDown | Importante | ✅ Implementado |
| **RF065** | Footer Institucional | Rodapé com informações | - Copyright NAMI<br>- Nome da universidade<br>- Ano atual<br>- Fundo branco com backdrop blur<br>- Alinhamento justificado | Desejável | ✅ Implementado |
| **RF066** | Notificações de Sucesso | Feedback visual para ações bem-sucedidas | - Toast notifications (Sonner)<br>- Mensagens claras<br>- Tempo adequado (3-5s)<br>- Não bloqueia interação | Importante | ✅ Implementado |
| **RF067** | Notificações de Erro | Feedback visual para erros | - Mensagens claras<br>- Orientações para correção<br>- Diferenciação visual<br>- Toast vermelho | Importante | ✅ Implementado |
| **RF068** | Busca Global | Campo de busca contextual | - SearchInputCard componentizado<br>- Busca em tempo real<br>- Case-insensitive<br>- Placeholder apropriado | Importante | ✅ Implementado |

### 3.7 Integrações e API

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RF069** | API REST - Autenticação | Endpoints de autenticação | - POST /api/auth/login<br>- GET /api/auth/users<br>- Retorno de token JWT<br>- Tratamento de erros | Essencial | ✅ Implementado |
| **RF070** | API REST - Salas | Endpoints de salas | - GET /api/nami/rooms<br>- GET /api/nami/rooms/:roomId<br>- GET /api/nami/monitorings<br>- Formato JSON | Essencial | ✅ Implementado |
| **RF071** | API REST - Reservas | Endpoints de reservas | - GET /api/nami/bookings<br>- GET /api/nami/rooms/:roomId/bookings<br>- POST /api/nami/bookings (a implementar)<br>- PUT /api/nami/bookings/:id (a implementar)<br>- DELETE /api/nami/bookings/:id (a implementar) | Essencial | 🔄 Parcial |
| **RF072** | API REST - Time Slots | Endpoint de períodos | - GET /api/nami/time-slots<br>- Retorno de todos os 10 períodos<br>- Formato padronizado | Essencial | ✅ Implementado |
| **RF073** | Tratamento de Erros API | Cliente HTTP com tratamento robusto | - Classe ApiError customizada<br>- Status HTTP apropriados<br>- Mensagens descritivas<br>- Fallback para dados locais | Essencial | ✅ Implementado |
| **RF074** | CORS Configurável | Configuração de origens permitidas | - Ambiente development: localhost<br>- Ambiente production: origem específica<br>- Credentials: true<br>- Validação de origem | Essencial | ✅ Implementado |
| **RF075** | Sincronização de Dados | Carregamento inicial de dados | - Promise.all para requisições paralelas<br>- Loading state<br>- Erro state<br>- Alert visual de sincronização | Importante | ✅ Implementado |

---

## 4. Requisitos Não-Funcionais (RNF)

### 4.1 Usabilidade

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF001** | Interface Intuitiva | Interface fácil de usar e aprender | - Navegação clara e consistente<br>- Feedbacks visuais apropriados<br>- Tempo de aprendizado reduzido<br>- Satisfação do usuário ≥ 4/5 | Essencial | ✅ Implementado |
| **RNF002** | Responsividade | Funciona em diferentes resoluções de desktop | - Desktop Full HD: layout completo<br>- Desktop HD: adaptado<br>- Widescreen: otimizado<br>- Funcionalidades preservadas | Essencial | ✅ Implementado |
| **RNF003** | Acessibilidade | Acessível para usuários com necessidades especiais | - Contraste adequado<br>- Navegação por teclado<br>- Labels e ARIA<br>- Compatibilidade com leitores de tela | Importante | 🔄 Parcial |
| **RNF004** | Feedback Imediato | Resposta visual instantânea | - Toast para todas as ações<br>- Duração 3-5s<br>- Posicionamento consistente<br>- Cores semânticas<br>- Não bloqueia UI | Essencial | ✅ Implementado |
| **RNF005** | Loading States | Indicadores durante processamento | - Spinners ou skeletons<br>- Botões desabilitados<br>- Texto de loading<br>- Prevenir duplo-clique | Essencial | ✅ Implementado |
| **RNF006** | Hover States | Efeitos visuais em interações | - Hover em cards (scale + shadow)<br>- Transições suaves<br>- Cursor pointer<br>- Cores de hover em botões | Importante | ✅ Implementado |
| **RNF007** | Estados Vazios | Mensagens significativas sem dados | - Ícone representativo<br>- Título descritivo<br>- Texto explicativo<br>- Consistência visual | Importante | ✅ Implementado |
| **RNF008** | Confirmações Destrutivas | Prevenir ações acidentais | - Dialog para exclusões<br>- Texto claro sobre consequências<br>- Botões com cores de alerta<br>- Opção de cancelar | Essencial | ✅ Implementado |
| **RNF009** | Breadcrumbs e Contexto | Usuário sabe onde está | - Tabs com destaque<br>- Títulos descritivos<br>- Subtítulos explicativos | Importante | ✅ Implementado |

### 4.2 Performance

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF010** | Tempo de Resposta | Sistema responde rapidamente | - Carregamento inicial ≤ 3s<br>- Ações simples ≤ 1s<br>- Busca e filtros ≤ 2s | Essencial | ✅ Implementado |
| **RNF011** | Otimização de Recursos | Uso eficiente de recursos | - Uso mínimo de memória<br>- Lazy loading quando necessário<br>- Otimização de assets | Importante | ✅ Implementado |
| **RNF012** | Code Splitting | Carregamento otimizado | - Vite automático chunking<br>- Bundle size otimizado<br>- Tree shaking ativo | Importante | ✅ Implementado |
| **RNF013** | Otimização de Re-renders | Minimizar re-renderizações | - useMemo para cálculos pesados<br>- useCallback para funções<br>- React.memo quando apropriado<br>- Keys em listas | Importante | ✅ Implementado |
| **RNF014** | Assets Otimizados | Recursos estáticos otimizados | - SVGs para ícones (Lucide)<br>- Fonts otimizados<br>- Lazy loading de imagens | Essencial | ✅ Implementado |

### 4.3 Confiabilidade

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF015** | Disponibilidade | Sistema disponível durante horário de funcionamento | - Uptime ≥ 99% horário comercial<br>- Recuperação rápida de falhas<br>- Backup automático | Essencial | 🔄 Infraestrutura |
| **RNF016** | Integridade de Dados | Dados mantidos íntegros | - Validação rigorosa<br>- Transações atômicas<br>- Backup regular<br>- Verificação de consistência | Essencial | 🔄 Backend |
| **RNF017** | Tratamento de Erros | Erros tratados graciosamente | - Try-catch em operações críticas<br>- Mensagens amigáveis<br>- Fallback para dados locais<br>- Log de erros | Essencial | ✅ Implementado |
| **RNF018** | Validação de Dados | Validação em múltiplas camadas | - Frontend: Zod/validação HTML5<br>- Backend: Zod schemas<br>- Mensagens claras<br>- Prevenção de dados inválidos | Essencial | ✅ Implementado |

### 4.4 Segurança

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF019** | Autenticação Segura | Garantir autenticação segura | - Senhas não armazenadas no frontend<br>- Token JWT<br>- Sessões seguras<br>- Timeout automático (futuro) | Importante | ✅ Implementado |
| **RNF020** | Autorização | Controle rigoroso de acesso | - Validação de permissões<br>- Princípio do menor privilégio<br>- Bloqueio visual de ações restritas | Essencial | ✅ Implementado |
| **RNF021** | Proteção de Dados | Dados sensíveis protegidos | - HTTPS obrigatório (produção)<br>- Token em localStorage (considerar httpOnly cookies)<br>- Conformidade LGPD<br>- Auditoria de acesso | Essencial | 🔄 Parcial |
| **RNF022** | Segurança HTTP | Headers de segurança | - Helmet.js no backend<br>- CORS configurado<br>- Content Security Policy (futuro)<br>- Rate limiting (futuro) | Importante | ✅ Implementado |
| **RNF023** | Proteção contra Ataques | Prevenção de vulnerabilidades comuns | - XSS: sanitização de inputs<br>- CSRF: tokens (futuro)<br>- SQL Injection: N/A (sem SQL ainda)<br>- Força bruta: rate limiting (futuro) | Importante | 🔄 Parcial |

### 4.5 Manutenibilidade

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF024** | Código Limpo | Código legível e estruturado | - Padrões de codificação<br>- TypeScript strict<br>- Modularização<br>- Baixo acoplamento | Importante | ✅ Implementado |
| **RNF025** | Componentização | Componentes reutilizáveis | - Biblioteca ShadCN/UI<br>- Features organizadas<br>- Shared components<br>- Zero duplicação | Essencial | ✅ Implementado |
| **RNF026** | Tipagem Forte | TypeScript em todo o código | - Interfaces bem definidas<br>- Tipos exportados<br>- Zero any (exceto necessário)<br>- Tipos consistentes entre frontend/backend | Essencial | ✅ Implementado |
| **RNF027** | Versionamento | Controle de versão adequado | - Git com commits descritivos<br>- Versionamento semântico<br>- Histórico de mudanças<br>- Branches organizadas | Importante | ✅ Implementado |
| **RNF028** | Documentação Técnica | Documentação para desenvolvedores | - README completo<br>- Comentários em código complexo<br>- Tipos auto-documentados<br>- Setup simplificado | Importante | ✅ Implementado |

### 4.6 Escalabilidade

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF029** | Crescimento de Usuários | Suporta crescimento de usuários | - Suporte a ≥100 usuários simultâneos<br>- Performance mantida<br>- Arquitetura escalável | Importante | 🔄 Infraestrutura |
| **RNF030** | Crescimento de Dados | Suporta crescimento de dados | - Armazenamento eficiente<br>- Consultas otimizadas<br>- Paginação (futuro)<br>- Arquivamento de dados antigos | Importante | 🔄 Backend |
| **RNF031** | Gerenciamento de Estado | Estado organizado e escalável | - Estado local quando possível<br>- Lift state apenas necessário<br>- Evitar prop drilling<br>- Updates imutáveis | Desejável | ✅ Implementado |

### 4.7 Design e Identidade Visual

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF032** | Padrão Visual UNIFOR | Interface segue identidade UNIFOR | - Cor primária: #0066cc (blue-600)<br>- Gradientes azuis<br>- Logo e marca UNIFOR<br>- Tipografia consistente | Essencial | ✅ Implementado |
| **RNF033** | Paleta de Cores | Cores alinhadas com identidade | - Azul primário: #0066CC<br>- Gradientes: blue-600 to blue-700<br>- Verde: sucesso (green-600)<br>- Vermelho: erro/cancelamento<br>- Laranja: pendências<br>- Cinza: neutro | Essencial | ✅ Implementado |
| **RNF034** | Componentes Padronizados | Biblioteca consistente | - ShadCN/UI exclusivo<br>- Variantes definidas<br>- Tamanhos padronizados<br>- Reutilização máxima | Essencial | ✅ Implementado |
| **RNF035** | Tipografia Consistente | Hierarquia tipográfica clara | - Títulos: text-2xl font-semibold<br>- Subtítulos: text-xl font-semibold<br>- Corpo: text-sm ou text-base<br>- Labels: text-sm font-medium<br>- Muted: text-muted-foreground | Importante | ✅ Implementado |
| **RNF036** | Espaçamento Harmonioso | Uso consistente de espaçamentos | - Scale Tailwind (4, 6, 8, 12, 16, 24)<br>- Gaps: gap-4 ou gap-6<br>- Padding cards: p-4 ou p-6<br>- Margins: mb-4, mb-6, mb-8 | Importante | ✅ Implementado |
| **RNF037** | Iconografia Unificada | Biblioteca única de ícones | - Lucide React exclusivamente<br>- Tamanhos padrão (h-4 w-4, h-5 w-5)<br>- Cores semânticas<br>- Alinhamento com texto | Importante | ✅ Implementado |
| **RNF038** | Bordas e Sombras | Uso consistente de elevações | - Bordas: rounded-lg (cards)<br>- Bordas sutis: border ou border-2<br>- Sombras: shadow-md (cards)<br>- Hover: shadow-lg<br>- Destaque: border-l-4 | Desejável | ✅ Implementado |

### 4.8 Compatibilidade

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF039** | Navegadores | Funciona nos principais navegadores | - Chrome ≥ 90<br>- Firefox ≥ 85<br>- Safari ≥ 14<br>- Edge ≥ 90 | Essencial | ✅ Implementado |
| **RNF040** | Sistemas Operacionais | Funciona em diferentes SO | - Windows 10/11<br>- macOS 10.15+<br>- Linux (Ubuntu 18.04+) | Essencial | ✅ Implementado |
| **RNF041** | Grid Responsivo | Layouts adaptados para desktop | - Desktop HD: 2 colunas<br>- Desktop Full HD: 3 colunas (lg:)<br>- Widescreen: 4 colunas (xl:)<br>- Gaps adequados | Essencial | ✅ Implementado |
| **RNF042** | Modal Dimensionado | Modais otimizados para desktop | - Largura: max-w-6xl ou max-w-7xl<br>- Altura: max-h-[90vh]<br>- Scroll interno<br>- Layout de duas colunas | Essencial | ✅ Implementado |
| **RNF043** | Navegação Desktop | Header otimizado para desktop | - Tabs horizontais inline<br>- Logo completo visível<br>- Menu dropdown de usuário<br>- Hover states em navegação | Essencial | ✅ Implementado |
| **RNF044** | Tabelas Desktop | Tabelas completas | - Todas as colunas visíveis<br>- Ordenação por coluna<br>- Scroll horizontal apenas se necessário<br>- ScrollArea do ShadCN | Importante | ✅ Implementado |

### 4.9 Acessibilidade (WCAG 2.1)

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF045** | Contraste de Cores | Contraste adequado para leitura | - Razão mínima 4.5:1 texto normal<br>- Razão mínima 3:1 texto grande<br>- Cores distinguíveis<br>- Modo dark (futuro) | Essencial | ✅ Implementado |
| **RNF046** | Navegação por Teclado | Totalmente navegável via teclado | - Tab order lógico<br>- Focus visible<br>- Enter/Space para ativar<br>- ESC para fechar modais<br>- Focus trap em modais | Essencial | ✅ Implementado |
| **RNF047** | Labels e ARIA | Marcação semântica | - Labels para inputs<br>- aria-label quando necessário<br>- Roles apropriados<br>- aria-live para notificações<br>- Landmarks semânticos | Importante | ✅ Implementado |
| **RNF048** | Leitores de Tela | Compatibilidade com screen readers | - Texto alternativo para ícones<br>- Descrições em elementos interativos<br>- Anúncios de mudanças<br>- Ordem de leitura lógica | Importante | 🔄 Parcial |

### 4.10 Testabilidade

| ID | Requisito | Descrição | Critérios de Aceitação | Prioridade | Status |
|---|---|---|---|---|---|
| **RNF049** | Estrutura Testável | Código preparado para testes | - Componentes isolados<br>- Lógica separada de UI<br>- Props bem definidas<br>- Data-testid quando necessário | Importante | ✅ Implementado |
| **RNF050** | Cobertura de Testes | Testes automatizados | - Testes unitários (Vitest)<br>- Testes de componente (Testing Library)<br>- Testes E2E (Playwright/Cypress - futuro)<br>- Cobertura ≥ 70% (futuro) | Importante | ❌ A implementar |

---

## 5. Regras de Negócio

### RN001 - Controle de Acesso por Role
- **Admin:** Acesso total, gestão de usuários, todas as ações
- **Editor:** Criar, editar e cancelar reservas; visualizar tudo
- **Coordinator:** Similar a Editor, com privilégios específicos
- **Professor:** Visualizar e criar reservas próprias (futuro)
- **Staff:** Visualizar e criar reservas (futuro)
- **Viewer:** Apenas visualização, sem ações

### RN002 - Validação de Conflitos de Reserva
- Uma sala não pode ser reservada para o mesmo período em uma mesma data
- Ao editar reserva, não considerar a própria reserva como conflito
- Checkboxes de períodos já ocupados devem ser desabilitados
- Validação em tempo real ao selecionar data

### RN003 - Períodos de Reserva
- Reservas devem seguir a grade de 10 períodos pré-definidos
- Não é possível criar períodos customizados
- Seleção múltipla e não-sequencial permitida
- Períodos: M.A, M.B, M.C, M.D, M.E, M.F, T.A, T.B, T.C, T.D

### RN004 - Capacidade de Sala
- Número de participantes deve respeitar a capacidade da sala
- Mínimo: 1 participante
- Máximo: capacidade da sala
- Validação no frontend

### RN005 - Status de Reserva
- **Confirmed:** Reserva ativa e válida
- **Pending:** Aguardando confirmação (futuro)
- **Cancelled:** Reserva cancelada, mantida no histórico

### RN006 - Histórico de Reservas
- Reservas passadas (data < hoje) ou canceladas vão para histórico
- Histórico não pode ser editado
- Histórico pode ser cancelado
- Opacidade reduzida para diferenciação visual

### RN007 - Status de Usuário
- **Active:** Usuário com acesso ao sistema
- **Pending:** Aguardando aprovação do administrador
- **Suspended:** Temporariamente bloqueado, pode ser reativado
- **Inactive:** Usuário desativado (não implementado ainda)

### RN008 - Proteção de Auto-ação
- Usuário não pode suspender a si mesmo
- Usuário não pode remover a si mesmo
- Admin principal não pode ser removido

### RN009 - Auditoria
- Todas as ações críticas devem ser registradas no log
- Log deve conter: quem, o quê, quando, qual recurso
- Logs são imutáveis
- Ordenação cronológica reversa (mais recente primeiro)

### RN010 - Organização de Salas
- 18 salas no total (15 monitoradas + 3 independentes)
- 3 monitoramentos principais
- Salas independentes (não vinculadas a monitoramento)
- Cada monitoramento tem responsável e tipo de atendimento padrão

---

## 6. Melhorias Futuras

### 6.1 Funcionalidades Planejadas

#### Alta Prioridade
- [ ] Integração completa com banco de dados (MySQL)
- [ ] CRUD completo de reservas via API (POST, PUT, DELETE)
- [ ] CRUD completo de usuários via API
- [ ] Sistema de notificações por email
- [ ] Relatórios avançados e dashboards
- [ ] Exportação de dados (PDF, Excel)
- [ ] Filtros avançados em todas as listagens
- [ ] Paginação para grandes volumes de dados

#### Média Prioridade
- [ ] Reservas recorrentes (semanal, mensal)
- [ ] Calendário com visualização de múltiplas salas
- [ ] Sistema de comentários em reservas
- [ ] Aprovação de reservas (workflow)
- [ ] Gestão de recursos das salas (equipamentos)
- [ ] Modo escuro (dark mode)
- [ ] Notificações por email em tempo real

#### Baixa Prioridade
- [ ] Integração com calendário Google/Outlook
- [ ] QR Code para check-in em salas
- [ ] Estatísticas de uso de salas
- [ ] Sistema de avaliação de atendimentos
- [ ] Chat interno
- [ ] Sistema de notificações desktop

### 6.2 Melhorias Técnicas

#### Backend
- [ ] Implementação de ORM (Prisma ou TypeORM)
- [ ] Conexão real com MySQL
- [ ] Sistema de migrations
- [ ] Seeds de dados
- [ ] Rate limiting
- [ ] Refresh tokens
- [ ] Redis para cache
- [ ] WebSockets para atualizações em tempo real

#### Frontend
- [ ] Context API ou Zustand para estado global
- [ ] React Query para cache de dados
- [ ] Testes unitários (Vitest)
- [ ] Testes E2E (Playwright)
- [ ] Storybook para documentação de componentes
- [ ] Skeleton loaders avançados
- [ ] Infinite scroll
- [ ] Virtual scrolling para listas grandes

#### DevOps
- [ ] CI/CD com GitHub Actions
- [ ] Docker e Docker Compose
- [ ] Deploy automatizado
- [ ] Monitoramento e logs (Sentry, DataDog)
- [ ] Backups automáticos
- [ ] Ambiente de staging

#### Segurança
- [ ] Senhas hasheadas (bcrypt)
- [ ] Tokens httpOnly cookies
- [ ] CSRF tokens
- [ ] Rate limiting por IP
- [ ] Auditoria avançada
- [ ] Conformidade total LGPD

---

## 7. Dependências e Tecnologias

### 7.1 Frontend

#### Core
- **React:** 18.3.1 - Biblioteca UI
- **TypeScript:** 5.6.3 - Tipagem estática
- **Vite:** Última - Build tool e dev server

#### UI Components
- **@radix-ui/react-*:** 26 componentes (accordion, dialog, dropdown, etc)
- **lucide-react:** 0.487.0 - Ícones
- **sonner:** 2.0.7 - Toast notifications
- **react-day-picker:** 8.10.1 - Calendário
- **recharts:** 2.15.2 - Gráficos (futuro)

#### Styling
- **tailwindcss:** Última - Utility-first CSS
- **tailwind-merge:** Última - Merge de classes
- **class-variance-authority:** 0.7.1 - Variantes de componentes
- **clsx:** Última - Concatenação de classes

#### Forms
- **react-hook-form:** 7.55.0 - Gerenciamento de formulários

#### Outras
- **cmdk:** 1.1.1 - Command palette (futuro)
- **embla-carousel-react:** 8.6.0 - Carrossel
- **next-themes:** 0.4.6 - Dark mode (futuro)
- **react-resizable-panels:** 2.1.7 - Painéis redimensionáveis

### 7.2 Backend

#### Core
- **express:** 4.21.2 - Framework web
- **typescript:** 5.6.3 - Tipagem estática
- **tsx:** 4.19.1 - Execução TypeScript

#### Segurança
- **helmet:** 8.0.0 - Security headers
- **cors:** 2.8.5 - CORS configuration

#### Validação
- **zod:** 3.23.8 - Schema validation

#### Environment
- **dotenv:** 16.4.7 - Variáveis de ambiente

#### Dev Tools
- **eslint:** 8.57.0 - Linting
- **prettier:** 3.3.3 - Formatação

---

## 8. Estrutura de Arquivos

```
sistema-gestao/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── config/            # Configurações (environment)
│   │   ├── controllers/       # Controllers (auth, nami)
│   │   ├── data/              # Mock data (usuarios, salas, reservas)
│   │   ├── routes/            # Rotas da API
│   │   ├── services/          # Lógica de negócio
│   │   ├── types/             # Tipos TypeScript
│   │   ├── app.ts             # Configuração Express
│   │   └── server.ts          # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── src/                       # Frontend React
│   ├── components/
│   │   └── ui/               # Componentes ShadCN/UI (35 componentes)
│   ├── features/             # Features modulares
│   │   ├── activity/         # Log de atividades
│   │   ├── auth/             # Autenticação
│   │   ├── bookings/         # Reservas
│   │   ├── layout/           # Header, Footer
│   │   ├── rooms/            # Salas
│   │   ├── shared/           # Componentes compartilhados
│   │   └── users/            # Gestão de usuários
│   ├── data/                 # Mock data frontend
│   ├── lib/                  # Utilitários (api.ts)
│   ├── types/                # Tipos TypeScript (nami.ts)
│   ├── App.tsx               # Componente principal
│   ├── main.tsx              # Entry point
│   └── index.css             # Estilos globais
│
├── build/                    # Build de produção
├── package.json              # Dependências frontend
├── vite.config.ts            # Configuração Vite
├── tsconfig.json             # Configuração TypeScript
├── tailwind.config.js        # Configuração Tailwind
└── README.md                 # Documentação
```

---

## 9. Glossário

### Termos do Sistema

- **NAMI:** Núcleo de Atenção Médica Integrada
- **UNIFOR:** Universidade de Fortaleza
- **Monitoramento:** Agrupamento lógico de salas por tipo de atendimento
- **Período:** Bloco de tempo de 50 minutos para reserva
- **Sala Independente:** Sala não vinculada a um monitoramento específico
- **Time Slot:** Período de tempo específico (sinônimo de Período)
- **Plataforma Web Desktop:** Sistema projetado exclusivamente para uso em computadores desktop e notebooks

### Termos Técnicos

- **JWT:** JSON Web Token - Padrão para autenticação
- **CORS:** Cross-Origin Resource Sharing
- **API REST:** Representational State Transfer API
- **SPA:** Single Page Application - Aplicação de página única
- **CRUD:** Create, Read, Update, Delete
- **Mock Data:** Dados fictícios para desenvolvimento
- **Toast:** Notificação temporária não-invasiva
- **Dropdown:** Menu suspenso
- **Modal:** Janela sobreposta
- **Badge:** Etiqueta visual
- **Card:** Contêiner visual de informações
- **Desktop-First:** Abordagem de design focada em experiência desktop

---

## 10. Contatos e Responsáveis

**Desenvolvedor:** shinlosa  
**Repositório:** github.com/shinlosa/sistema-gestao  
**Email:** [A definir]  
**Ambiente de Desenvolvimento:** http://localhost:3000 (frontend) / http://localhost:3333 (backend)

---

## 11. Histórico de Versões

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 1.0 | [Data anterior] | [Autor] | Versão inicial dos requisitos |
| 2.0 | Outubro 2025 | shinlosa | Análise completa do projeto atual, atualização de requisitos, documentação técnica expandida |
| 2.1 | Outubro 2025 | shinlosa | Remoção de requisitos mobile - projeto exclusivamente web desktop |

---

## 12. Aprovações

| Stakeholder | Role | Status | Data | Assinatura |
|---|---|---|---|---|
| [Nome] | Coordenador NAMI | Pendente | - | - |
| [Nome] | Coordenador Nutrição | Pendente | - | - |
| [Nome] | TI UNIFOR | Pendente | - | - |

---

**Fim do Documento**

*Este documento foi gerado através da análise completa do código-fonte do projeto Sistema de Gestão de Reservas de Salas - NAMI UNIFOR em outubro de 2025.*
