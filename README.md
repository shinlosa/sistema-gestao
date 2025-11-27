<div align="center">

# 🏥 Sistema de Reservas de Sala

### NAMI - Núcleo de Atenção Médica Integrada | UNIFOR

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>

---

## 📋 Sobre

Sistema web para gerenciamento de reservas das salas do NAMI/UNIFOR. Permite visualizar disponibilidade, reservar horários e acompanhar logs de atividade.

## 🛠️ Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18 • TypeScript • Vite • Tailwind CSS • ShadCN/UI |
| **Backend** | Node.js 20 • Express • TypeScript • Zod |
| **Database** | MySQL 8.0+ |
| **Auth** | JWT • bcrypt |

## 📁 Estrutura

\`\`\`
sistema-gestao/
├── 📂 frontend/            # React + Vite
│   └── src/
│       ├── components/     # UI Components (ShadCN)
│       ├── features/       # Módulos por feature
│       ├── lib/            # API client & utils
│       └── types/          # TypeScript types
│
├── 📂 backend/             # Express API
│   └── src/
│       ├── controllers/    # HTTP handlers
│       ├── services/       # Business logic
│       ├── repositories/   # Data access (MySQL/Memory)
│       └── middleware/     # Auth, error handling
│
└── 📂 database/            # SQL schemas
\`\`\`

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- npm 10+
- MySQL 8.0+ *(opcional)*

### Instalação

\`\`\`bash
# Clone
git clone https://github.com/shinlosa/sistema-gestao.git
cd sistema-gestao

# Instalar dependências
npm install
cd frontend && npm install
cd ../backend && npm install
\`\`\`

### Configuração

\`\`\`bash
# Backend
cp backend/.env.example backend/.env
\`\`\`

\`\`\`env
PORT=3333
JWT_SECRET=seu_segredo_aqui
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=nami_gestao
\`\`\`

\`\`\`bash
# Frontend
cp frontend/.env.example frontend/.env
\`\`\`

\`\`\`env
VITE_API_BASE_URL=http://localhost:3333/api
\`\`\`

### Executar

\`\`\`bash
# Desenvolvimento (frontend + backend)
npm run dev

# Ou separadamente
cd frontend && npm run dev  # http://localhost:3000
cd backend && npm start     # http://localhost:3333
\`\`\`

## 🔐 Acesso

| Perfil | Usuário | Senha |
|--------|---------|-------|
| 👑 Admin | \`admin.nami\` | \`NAMI@2025!\` |

### Permissões

| Ação | Admin | Editor | Usuário | Leitor |
|:-----|:-----:|:------:|:-------:|:------:|
| Ver salas | ✅ | ✅ | ✅ | ✅ |
| Criar reserva | ✅ | ✅ | ✅ | ❌ |
| Editar/Cancelar | ✅ | ✅ | ❌ | ❌ |
| Ver logs | ✅ | ✅ | ❌ | ❌ |
| Gerenciar usuários | ✅ | ❌ | ❌ | ❌ |

## 🕐 Grade Horária

| Bloco | Período | Horário |
|:-----:|:-------:|:-------:|
| MAB | 🌅 Manhã | 07:30 - 09:10 |
| MCD | �� Manhã | 09:30 - 11:10 |
| MEF | ☀️ Meio-dia | 11:20 - 13:00 |
| TAB | 🌤️ Tarde | 13:30 - 15:10 |
| TCD | 🌤️ Tarde | 15:30 - 17:10 |

## 📡 API

\`\`\`http
POST   /api/auth/login         # Login
GET    /api/auth/me            # Sessão atual

GET    /api/nami/rooms         # Listar salas
GET    /api/nami/bookings      # Listar reservas
POST   /api/nami/bookings      # Criar reserva
PUT    /api/nami/bookings/:id  # Editar reserva
DELETE /api/nami/bookings/:id  # Cancelar reserva

GET    /api/users              # Listar usuários (admin)
\`\`\`

📖 Documentação completa: [\`backend/API.md\`](backend/API.md)

## 📜 Scripts

| Comando | Descrição |
|---------|-----------|
| \`npm run dev\` | Frontend + Backend |
| \`npm run dev:frontend\` | Apenas frontend |
| \`npm run dev:backend\` | Apenas backend |
| \`npm run build\` | Build produção |

---

<div align="center">

**NAMI** • Universidade de Fortaleza • 2025

</div>
