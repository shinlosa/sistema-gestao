
# Sistema de Gestão de Reservas de Salas - NAMI UNIFOR

> Sistema web para gerenciamento automatizado das salas do Núcleo de Atenção Médica Integrada (NAMI) do curso de Nutrição da Universidade de Fortaleza.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)](https://expressjs.com/)

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Stack Tecnológica](#-stack-tecnológica)
- [Características](#-características)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Grade de Horários](#-grade-de-horários)
- [Organização das Salas](#-organização-das-salas)
- [API REST](#-api-rest)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)

## 🎯 Sobre o Projeto

O Sistema de Gestão de Reservas de Salas foi desenvolvido para automatizar e otimizar o processo de reserva das salas do curso de Nutrição no NAMI/UNIFOR, substituindo o controle manual via planilhas Excel. O sistema elimina conflitos de agendamento, garante rastreabilidade completa e oferece uma interface intuitiva para gestão de recursos.

### Principais Objetivos
- ✅ Eliminar conflitos de reservas
- ✅ Automatizar agendamento de salas
- ✅ Rastrear todas as ações no sistema
- ✅ Controlar acesso com diferentes níveis de permissão
- ✅ Otimizar utilização dos espaços físicos

## 🛠️ Stack Tecnológica

### Frontendt 18.3.1** - Biblioteca UI com hooks modernos
- **TypeScript 5.6** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first
- **ShadCN/UI** - Biblioteca de componentes baseada em Radix UI
- **React Hook Form** - Gerenciamento de formulários
- **Sonner** - Toast notifications
- **React Day Picker** - Seletor de datas

### Backend
- **Node.js 20+** - Runtime JavaScript
- **Express 4.21** - Framework web minimalista
- **TypeScript 5.6** - Tipagem em todo o backend
- **Zod 3.23** - Validação de schemas
- **JWT** - Autenticação com tokens
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## ✨ Características

### 🔐 Controle de Acesso
- 4 níveis de permissão (admin, editor, usuario, leitor)
- Autenticação JWT com token persistido
- Cores distintivas por role
- Proteção de rotas e ações

### 📅 Gestão de Reservas
- Sistema de blocos combinados (5 blocos de 100min)
- Seleção múltipla de períodos
- Validação automática de conflitos
- Modal intuitivo com calendário integrado
- Edição e cancelamento com rastreabilidade

### 🏢 Organização de Salas
- 18 salas em 3 monitoramentos
- Status em tempo real
- Busca e filtros
- Visualização por monitoramento ou salas independentes

### 👥 Gerenciamento de Usuários
- Dashboard com métricas
- Aprovação de solicitações
- Alteração de roles
- Log completo de atividades

### 📊 Log de Atividades
- Registro automático de ações
- Timestamps humanizados
- Filtros avançados
- Rastreabilidade completa

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) versão 20 ou superior
- [npm](https://www.npmjs.com/) versão 10 ou superior

Verifique as versões:
```bash
node --version  # v20.x.x ou superior
npm --version   # 10.x.x ou superior
```

## 🚀 Instalação e Execução

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/shinlosa/sistema-gestao.git
cd sistema-gestao
```

### 2️⃣ Configure Variáveis de Ambiente

**Frontend (.env na raiz):**
```bash
cp .env.example .env
```
```env
VITE_API_BASE_URL=http://localhost:3333/api
```

**Backend (backend/.env):**
```bash
cd backend
cp .env.example .env
```
```env
PORT=3333
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=3600
```

⚠️ **Importante:** Em produção, altere `JWT_SECRET`.

### 3️⃣ Instale Dependências

```bash
# Frontend (na raiz)
npm install

# Backend
cd backend
npm install
```

### 4️⃣ Execute o Projeto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend em http://localhost:3333
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend em http://localhost:5173
```

### 5️⃣ Acesse
```
http://localhost:5173
```

## 🔑 Credenciais de Teste

| Role | Cor | Usuário | Senha | Permissões |
|:----:|:---:|:-------:|:-----:|:-----------|
| 🟣 **Administrador** | Roxo | `admin.nami` | `NAMI@2025!` | Acesso total ao sistema |
| 🔵 **Editor** | Azul | `coord.nutricao` | `Nutri@123` | Criar/editar/cancelar reservas, ver logs |
| 🟢 **Usuário** | Verde | `flavia.prof` | `Prof@456` | Criar reservas, solicitar revisões |
| ⚪ **Leitor** | Cinza | `leitor.nami` | `Leitor@789` | Apenas visualizar |

### Matriz de Permissões

| Ação | Admin | Editor | Usuário | Leitor |
|:-----|:-----:|:------:|:-------:|:------:|
| Visualizar salas | ✅ | ✅ | ✅ | ✅ |
| Criar reserva | ✅ | ✅ | ✅ | ❌ |
| Editar reserva | ✅ | ✅ | ❌ | ❌ |
| Cancelar reserva | ✅ | ✅ | ❌ | ❌ |
| Solicitar revisão | ✅ | ✅ | ✅ | ❌ |
| Ver logs | ✅ | ✅ | ❌ | ❌ |
| Gerenciar usuários | ✅ | ❌ | ❌ | ❌ |

## ⏰ Grade de Horários

Sistema de **blocos combinados** - cada bloco combina 2 períodos de 50min (total: 100min):

| ID | Bloco | Horário | Período | Duração |
|:--:|:-----:|:-------:|:-------:|:-------:|
| **MAB** | Manhã A+B | 07:30 - 09:10 | Matutino | 100min |
| **MCD** | Manhã C+D | 09:30 - 11:10 | Matutino | 100min |
| **MEF** | Manhã E+F | 11:20 - 13:00 | Matutino | 100min |
| **TAB** | Tarde A+B | 13:30 - 15:10 | Vespertino | 100min |
| **TCD** | Tarde C+D | 15:30 - 17:10 | Vespertino | 100min |

✅ Seleção múltipla e não-sequencial  
✅ Validação automática de conflitos  
✅ Cálculo automático da faixa horária

## 🏢 Organização das Salas

### 18 Salas Total

**Monitoramento 1** (Dra. Maria Silva)
- Salas 1-5 (8 pessoas cada)
- Sala 101 - Escritório (2 pessoas)

**Monitoramento 2** (Dr. João Santos)
- Salas 6-10 (10 pessoas cada)
- Sala 102 - Escritório (2 pessoas)

**Monitoramento 3** (Dra. Ana Costa)
- Salas 11-15 (12 pessoas cada)
- Sala 103 - Escritório (2 pessoas)

## 🔌 API REST

### Base URL
```
http://localhost:3333/api
```

### Principais Endpoints

**Autenticação:**
```http
POST   /auth/login
GET    /auth/users
```

**Salas:**
```http
GET    /nami/rooms
GET    /nami/monitorings
```

**Reservas:**
```http
GET    /nami/bookings
POST   /nami/bookings
PUT    /nami/bookings/:id
DELETE /nami/bookings/:id
```

**Usuários:**
```http
PATCH  /users/:id/role
POST   /users/:id/approve
DELETE /users/:id
```

**Logs:**
```http
GET    /nami/activity-logs
GET    /nami/revision-requests
```

🔒 Autenticação: `Authorization: Bearer <token>`

📖 **Documentação completa:** [`backend/API.md`](backend/API.md)

## 📁 Estrutura do Projeto

```
sistema-gestao/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/    # Controllers REST
│   │   ├── services/       # Lógica de negócio
│   │   ├── repositories/   # Camada de dados
│   │   ├── routes/         # Definição de rotas
│   │   ├── middleware/     # Middlewares
│   │   ├── schemas/        # Validação Zod
│   │   └── types/          # Tipos TypeScript
│   └── API.md
│
├── src/                     # Frontend React
│   ├── features/           # Organização por features
│   │   ├── auth/          # Autenticação
│   │   ├── bookings/      # Reservas
│   │   ├── rooms/         # Salas
│   │   ├── users/         # Usuários
│   │   └── activity/      # Logs
│   ├── components/ui/     # Componentes ShadCN/UI
│   ├── lib/               # Utilitários (api.ts)
│   └── types/             # Tipos TypeScript
│
├── .env.example
├── package.json
├── README.md
├── REQUISITOS.md           # Requisitos detalhados
└── vite.config.ts
```

## 📚 Documentação

- 📋 **[REQUISITOS.md](REQUISITOS.md)** - Requisitos funcionais e não-funcionais
- 🔌 **[backend/API.md](backend/API.md)** - Documentação da API REST
- 📖 **[documentacao-projeto-nami.md](src/documentacao-projeto-nami.md)** - Documentação técnica
- 📄 **[Projeto NAMI.pdf](https://github.com/user-attachments/files/23780508/Projeto.NAMI.1.pdf)** - Documentação oficial

---

<div align="center">

**Sistema de Gestão de Reservas de Salas - NAMI UNIFOR**

Desenvolvido por [shinlosa](https://github.com/shinlosa)

© 2025 NAMI - Núcleo de Atenção Médica Integrada | Universidade de Fortaleza

</div>

## Dados de exemplo (Mantido para referência)
ℹ️ **Nota:** Os dados são mantidos em memória durante a execução. Reiniciar o servidor limpa os dados.
