# Sistema de Gestão de Salas NAMI - Guia de Instalação e Utilização

## 📋 Sobre o Projeto

O Sistema de Gestão de Salas NAMI é uma aplicação web desenvolvida para o Núcleo de Atenção Médica Integrada (NAMI) da UNIFOR, especificamente para o setor de cursos de saúde. O sistema substitui o controle manual em Excel para reservas de 17 salas divididas em 3 monitoramentos, com períodos fracionados de M.A (07:30-08:20) até T.D (16:20-17:10).

### 🎯 Objetivos
- Digitalizar o processo de reserva de salas
- Controlar acesso através de diferentes níveis de usuário
- Manter log de auditoria de todas as operações
- Facilitar o gerenciamento de reservas em tempo real
- Seguir a identidade visual da UNIFOR

### 🛠️ Stack Tecnológica
- **Frontend**: React + JavaScript
- **Estilização**: Tailwind CSS v4
- **Componentes**: ShadCN/UI
- **Notificações**: Sonner Toast
- **Ícones**: Lucide React

## 🚀 Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Git

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd sistema-gestão
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configurar o ambiente**
```bash
# Criar arquivo de configuração (se necessário)
cp .env.example .env.local
```

4. **Executar o projeto**
```bash
npm run dev
# ou
yarn dev
```

5. **Acessar a aplicação**
Abra seu navegador e acesse `http://localhost:3000`

## 👥 Credenciais de Teste

### Coordenadora (Administradora Principal)
- **Email**: coord.nutricao@unifor.br
- **Senha**: coord123
- **Permissões**: Acesso total ao sistema

### Professores
- **Email**: prof.lorrainy@unifor.br
- **Senha**: prof123
- **Permissões**: Criar/editar próprias reservas

- **Email**: prof.ana@unifor.br
- **Senha**: prof123
- **Permissões**: Criar/editar próprias reservas

### Monitores
- **Email**: monitor.joao@unifor.br
- **Senha**: monitor123
- **Permissões**: Visualizar e criar reservas básicas

- **Email**: monitor.maria@unifor.br
- **Senha**: monitor123
- **Permissões**: Visualizar e criar reservas básicas

## 📱 Como Usar o Sistema

### 1. Login no Sistema
1. Acesse a aplicação
2. Digite suas credenciais (email e senha)
3. Clique em "Entrar"
4. Você será redirecionado para o painel principal

### 2. Navegação Principal
O sistema possui 4 abas principais:

#### 🏢 **Salas de Reserva**
- **Por Monitoramento**: Visualize salas organizadas por monitoramentos (1, 2 e 3)
- **Salas Independentes**: Acesse salas não vinculadas a monitoramentos específicos
- Cada sala mostra:
  - Status atual (disponível/ocupada)
  - Horários livres e ocupados
  - Botão para nova reserva

#### 📅 **Gerenciar Reservas**
- Lista todas as reservas do sistema
- Filtros por data, sala, status
- Ações disponíveis:
  - Editar reserva
  - Cancelar reserva
  - Visualizar detalhes

#### 📊 **Log de Atividades**
- Histórico completo de ações no sistema
- Informações registradas:
  - Usuário que realizou a ação
  - Tipo de ação (login, criar reserva, editar, etc.)
  - Data e hora
  - Detalhes da operação
  - Recurso afetado

#### 👤 **Gestão de Usuários** (Apenas Coordenadora)
- Adicionar novos usuários
- Editar informações de usuários
- Alterar permissões
- Desativar/ativar usuários

### 3. Fazendo uma Reserva

1. **Selecione a sala desejada**
   - Navegue até "Salas de Reserva"
   - Escolha entre "Por Monitoramento" ou "Salas Independentes"
   - Clique em "Reservar" na sala desejada

2. **Preencha os dados da reserva**
   - **Data**: Selecione a data desejada
   - **Horários**: Escolha os períodos (M.A até T.D)
   - **Tipo de Serviço**: Selecione o tipo de atendimento
   - **Professor Responsável**: Informe o professor
   - **Observações**: Adicione informações extras (opcional)

3. **Confirme a reserva**
   - Revise os dados
   - Clique em "Confirmar Reserva"
   - Aguarde a confirmação

### 4. Editando uma Reserva

1. Acesse "Gerenciar Reservas"
2. Localize a reserva desejada
3. Clique no ícone de edição
4. Modifique os dados necessários
5. Confirme as alterações

### 5. Cancelando uma Reserva

1. Acesse "Gerenciar Reservas"
2. Localize a reserva desejada
3. Clique no botão "Cancelar"
4. Confirme o cancelamento

## 📁 Estrutura Completa do Projeto

```
/
├── App.tsx                                      # Componente principal da aplicação
├── Attributions.md                              # Atribuições e créditos
├── CONSOLIDADO_COMPONENTS.tsx                   # Componentes principais consolidados
├── CONSOLIDADO_COMPONENTS_EXTRAS.tsx            # Componentes extras consolidados
├── CONSOLIDADO_COMPONENTS_UI.tsx                # Componentes UI consolidados
├── CREDENCIAIS_TESTE.md                         # Credenciais para teste do sistema
├── INSTALACAO_UTILIZACAO_NAMI.md               # Este documento
├── REQUISITOS_FUNCIONAIS_NAO_FUNCIONAIS.md     # Requisitos do sistema
├── documentacao-projeto-nami.md                 # Documentação geral do projeto
├── components/                                  # Componentes React
│   ├── ActivityLog.tsx                         # Log de atividades do sistema
│   ├── BookingList.tsx                         # Lista de reservas (versão antiga)
│   ├── BookingModal.tsx                        # Modal de reserva (versão antiga)
│   ├── CustomCalendar.tsx                      # Calendário customizado
│   ├── Header.tsx                              # Cabeçalho da aplicação
│   ├── LoginScreen.tsx                         # Tela de login
│   ├── MonitoringSection.tsx                   # Seção de monitoramentos
│   ├── NAMIBookingList.tsx                     # Lista de reservas NAMI (atual)
│   ├── NAMIBookingModal.tsx                    # Modal de reserva NAMI (atual)
│   ├── NAMIRoomCard.tsx                        # Card de sala NAMI
│   ├── RoomCard.tsx                            # Card de sala (versão antiga)
│   ├── UserManagement.tsx                      # Gestão de usuários
│   ├── figma/                                  # Componentes protegidos do Figma
│   │   └── ImageWithFallback.tsx              # Componente de imagem com fallback
│   └── ui/                                     # Componentes UI (ShadCN)
│       ├── accordion.tsx                       # Componente accordion
│       ├── alert-dialog.tsx                    # Dialog de alerta
│       ├── alert.tsx                           # Componente de alerta
│       ├── aspect-ratio.tsx                    # Controle de proporção
│       ├── avatar.tsx                          # Avatar de usuário
│       ├── badge.tsx                           # Badge/etiqueta
│       ├── breadcrumb.tsx                      # Navegação breadcrumb
│       ├── button.tsx                          # Componente de botão
│       ├── calendar.tsx                        # Componente de calendário
│       ├── card.tsx                            # Componente de card
│       ├── carousel.tsx                        # Componente carousel
│       ├── chart.tsx                           # Componente de gráficos
│       ├── checkbox.tsx                        # Checkbox
│       ├── collapsible.tsx                     # Componente colapsável
│       ├── command.tsx                         # Menu de comandos
│       ├── context-menu.tsx                    # Menu de contexto
│       ├── dialog.tsx                          # Dialog/modal
│       ├── drawer.tsx                          # Drawer/gaveta
│       ├── dropdown-menu.tsx                   # Menu dropdown
│       ├── form.tsx                            # Componentes de formulário
│       ├── hover-card.tsx                      # Card com hover
│       ├── input-otp.tsx                       # Input de OTP
│       ├── input.tsx                           # Input de texto
│       ├── label.tsx                           # Label de formulário
│       ├── menubar.tsx                         # Barra de menu
│       ├── navigation-menu.tsx                 # Menu de navegação
│       ├── pagination.tsx                      # Paginação
│       ├── popover.tsx                         # Componente popover
│       ├── progress.tsx                        # Barra de progresso
│       ├── radio-group.tsx                     # Grupo de radio buttons
│       ├── resizable.tsx                       # Componente redimensionável
│       ├── scroll-area.tsx                     # Área de rolagem
│       ├── select.tsx                          # Componente select
│       ├── separator.tsx                       # Separador visual
│       ├── sheet.tsx                           # Componente sheet
│       ├── sidebar.tsx                         # Barra lateral
│       ├── skeleton.tsx                        # Placeholder de carregamento
│       ├── slider.tsx                          # Componente slider
│       ├── sonner.tsx                          # Notificações toast
│       ├── switch.tsx                          # Componente switch
│       ├── table.tsx                           # Componente de tabela
│       ├── tabs.tsx                            # Componente de abas
│       ├── textarea.tsx                        # Área de texto
│       ├── toggle-group.tsx                    # Grupo de toggles
│       ├── toggle.tsx                          # Componente toggle
│       ├── tooltip.tsx                         # Tooltip
│       ├── use-mobile.ts                       # Hook para detecção mobile
│       └── utils.ts                            # Utilitários UI
├── data/                                        # Dados da aplicação
│   ├── namiData.ts                             # Dados das salas e monitoramentos
│   └── userData.ts                             # Dados dos usuários do sistema
├── guidelines/                                  # Diretrizes do projeto
│   └── Guidelines.md                           # Diretrizes de desenvolvimento
├── styles/                                      # Estilos da aplicação
│   └── globals.css                             # CSS global (Tailwind v4)
└── types/                                       # Definições TypeScript
    └── nami.ts                                 # Tipos da aplicação NAMI
```

### 📋 Detalhamento dos Arquivos Principais

#### **Arquivo Principal**
- `App.tsx` - Componente raiz da aplicação, gerencia estado global e roteamento

#### **Componentes Ativos (Em Uso)**
- `ActivityLog.tsx` - Sistema de log de auditoria
- `Header.tsx` - Cabeçalho com navegação e logout
- `LoginScreen.tsx` - Tela de autenticação
- `MonitoringSection.tsx` - Seção dos monitoramentos 1, 2 e 3
- `NAMIBookingList.tsx` - Lista de reservas com filtros
- `NAMIBookingModal.tsx` - Modal para criar/editar reservas
- `NAMIRoomCard.tsx` - Card das salas com status
- `UserManagement.tsx` - Gestão de usuários (apenas coordenadora)

#### **Componentes Antigos (Backup)**
- `BookingList.tsx` - Versão anterior da lista de reservas
- `BookingModal.tsx` - Versão anterior do modal
- `RoomCard.tsx` - Versão anterior do card de sala
- `CustomCalendar.tsx` - Calendário customizado

#### **Dados e Configuração**
- `namiData.ts` - Configuração das 17 salas e 3 monitoramentos
- `userData.ts` - Usuários do sistema com diferentes permissões
- `nami.ts` - Interfaces TypeScript para todo o sistema
- `globals.css` - Estilo global com tema UNIFOR e Tailwind v4

#### **Documentação e Configuração**
- `CONSOLIDADO_COMPONENTS*.tsx` - Códigos consolidados para cópia
- `CREDENCIAIS_TESTE.md` - Lista de usuários para teste
- `REQUISITOS_FUNCIONAIS_NAO_FUNCIONAIS.md` - Especificações técnicas
- `Guidelines.md` - Diretrizes de desenvolvimento

#### **Componentes UI (ShadCN)**
Todos os 44 componentes ShadCN estão disponíveis para uso na aplicação, incluindo:
- Componentes básicos (button, input, card, etc.)
- Componentes de navegação (tabs, breadcrumb, navigation-menu)
- Componentes de feedback (alert, toast, progress)
- Componentes de layout (accordion, collapsible, resizable)
- Componentes de entrada (form, select, calendar, etc.)

### 🗂️ Como Organizar para Implementação

1. **Copie primeiro os arquivos base:**
   - `App.tsx`
   - `styles/globals.css`
   - `types/nami.ts`
   - `data/namiData.ts`
   - `data/userData.ts`

2. **Copie os componentes principais:**
   - Todos os arquivos em `components/` (exceto versões antigas se desejar)
   - Todos os arquivos em `components/ui/`

3. **Configure a documentação:**
   - `guidelines/Guidelines.md`
   - Arquivos de documentação conforme necessário

4. **Use os arquivos consolidados:**
   - `CONSOLIDADO_COMPONENTS.tsx` - Contém todos os componentes principais
   - `CONSOLIDADO_COMPONENTS_UI.tsx` - Contém todos os componentes UI
   - `CONSOLIDADO_COMPONENTS_EXTRAS.tsx` - Contém componentes auxiliares

### ⚠️ Arquivos Importantes para Manter

- **NÃO DELETE**: `components/figma/ImageWithFallback.tsx` (arquivo protegido)
- **ESSENCIAIS**: Todos os arquivos em `components/ui/` (ShadCN)
- **PRINCIPAIS**: Componentes com prefixo "NAMI" são as versões atuais

## 🎨 Identidade Visual

O sistema segue o padrão visual da UNIFOR:
- **Cor Primária**: #0066cc (Azul UNIFOR)
- **Gradientes**: Tons de azul
- **Tipografia**: Sistema padrão com pesos definidos
- **Layout**: Clean e moderno
- **Responsividade**: Adaptado para desktop e mobile

## ⚙️ Funcionalidades Principais

### ✅ Implementadas
- [x] Sistema de autenticação com diferentes níveis de acesso
- [x] Reserva de salas com validação de conflitos
- [x] Gestão completa de reservas (criar, editar, cancelar)
- [x] Log de auditoria completo
- [x] Interface responsiva
- [x] Gestão de usuários (apenas coordenadora)
- [x] Notificações em tempo real
- [x] Calendário customizado
- [x] Filtros e buscas
- [x] Validação de formulários

### 🔄 Tipos de Usuário

1. **Coordenadora** (Administradora Principal)
   - Acesso total ao sistema
   - Gestão de usuários
   - Visualização de todos os logs
   - Controle de todas as reservas

2. **Professores**
   - Criar e editar próprias reservas
   - Visualizar reservas de suas disciplinas
   - Acesso ao log de suas atividades

3. **Monitores**
   - Criar reservas básicas
   - Visualizar reservas
   - Acesso limitado ao sistema

## 🕐 Horários de Funcionamento

O sistema permite reservas nos seguintes períodos:

### Manhã
- M.A: 07:30 - 08:20
- M.B: 08:20 - 09:10
- M.C: 09:30 - 10:20
- M.D: 10:20 - 11:10
- M.E: 11:10 - 12:00

### Tarde
- T.A: 13:30 - 14:20
- T.B: 14:20 - 15:10
- T.C: 15:30 - 16:20
- T.D: 16:20 - 17:10

## 🏥 Salas Disponíveis

### Monitoramento 1
- Salas 1-6: Atendimento de primeira vez, retornos, grupos

### Monitoramento 2
- Salas 7-12: Consultas individuais, grupos educativos

### Monitoramento 3
- Salas 13-15: Atendimentos especializados

### Salas Independentes
- Salas 16-17: Uso geral, reuniões

## 🚨 Troubleshooting

### Problemas Comuns

1. **Não consigo fazer login**
   - Verifique se as credenciais estão corretas
   - Tente usar uma das contas de teste
   - Limpe o cache do navegador

2. **Erro ao criar reserva**
   - Verifique se há conflito de horários
   - Confirme se todos os campos obrigatórios estão preenchidos
   - Tente recarregar a página

3. **Interface não carrega corretamente**
   - Verifique sua conexão com a internet
   - Atualize o navegador
   - Limpe cache e cookies

4. **Não vejo a aba de Gestão de Usuários**
   - Esta funcionalidade é exclusiva da coordenadora
   - Faça login com a conta coord.nutricao@unifor.br

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **Email**: suporte.nami@unifor.br
- **Coordenação**: coord.nutricao@unifor.br
- **Telefone**: (85) 3477-3000

## 📄 Documentação Adicional

- `REQUISITOS_FUNCIONAIS_NAO_FUNCIONAIS.md` - Requisitos do sistema
- `CREDENCIAIS_TESTE.md` - Lista completa de usuários de teste
- `CONSOLIDADO_COMPONENTS.tsx` - Códigos dos componentes principais
- `guidelines/Guidelines.md` - Diretrizes de desenvolvimento

## 🔐 Segurança

- Sistema não armazena dados sensíveis
- Não coleta informações pessoais identificáveis (PII)
- Logs de auditoria para rastreabilidade
- Validação de entrada em todos os formulários
- Controle de acesso baseado em roles

---

**Desenvolvido para a UNIFOR - Universidade de Fortaleza**  
**NAMI - Núcleo de Atenção Médica Integrada**  
**Versão 1.0 - 2025**