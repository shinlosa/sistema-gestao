# Sistema de Reservas de Sala - NAMI UNIFOR

Aplicação web para gerenciamento das salas do NAMI/UNIFOR. O sistema permite visualizar a disponibilidade, reservar horários e acompanhar logs de atividade, com um backend em Node.js conectado a um banco de dados MySQL.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + ShadCN/UI
- **Backend:** Node.js 20 + Express + TypeScript + Zod
- **Banco de Dados:** MySQL 8.0+
- **Autenticação:** JWT com bcrypt para senhas

## Estrutura do Projeto

\`\`\`
sistema-gestao/
├── frontend/               # Aplicação React (Vite)
│   ├── src/
│   │   ├── components/    # Componentes UI (ShadCN)
│   │   ├── features/      # Módulos por funcionalidade
│   │   ├── data/          # Dados de configuração
│   │   ├── lib/           # Utilitários e API client
│   │   └── types/         # Tipos TypeScript
│   ├── build/             # Artefatos de produção
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # API Express
│   ├── src/
│   │   ├── config/        # Configurações (DB, ambiente)
│   │   ├── controllers/   # Controladores HTTP
│   │   ├── middleware/    # Middlewares Express
│   │   ├── repositories/  # Acesso a dados (MySQL/InMemory)
│   │   ├── routes/        # Definição de rotas
│   │   ├── services/      # Lógica de negócio
│   │   ├── schemas/       # Validação Zod
│   │   ├── types/         # Tipos TypeScript
│   │   └── utils/         # Utilitários
│   ├── database/          # Scripts SQL
│   │   └── nami_schema.sql
│   └── package.json
│
├── package.json            # Monorepo scripts
├── README.md
└── REQUISITOS.md
\`\`\`

## Pré-requisitos

- Node.js 20+
- npm 10+
- MySQL 8.0+ (opcional - sistema funciona com dados em memória)

## Instalação

\`\`\`bash
# Clonar o repositório
git clone https://github.com/shinlosa/sistema-gestao.git
cd sistema-gestao

# Instalar dependências da raiz (para scripts do monorepo)
npm install

# Instalar dependências do frontend e backend
npm run install:all
# ou manualmente:
cd frontend && npm install
cd ../backend && npm install
\`\`\`

## Configuração

### Frontend

Copie o arquivo de exemplo e configure:

\`\`\`bash
cp frontend/.env.example frontend/.env
\`\`\`

\`\`\`env
VITE_API_BASE_URL=http://localhost:3333/api
\`\`\`

### Backend

Copie o arquivo de exemplo e configure:

\`\`\`bash
cp backend/.env.example backend/.env
\`\`\`

\`\`\`env
PORT=3333
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
JWT_SECRET=seu_segredo_jwt_aqui

# Banco de dados (opcional)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=nami_gestao
\`\`\`

### Banco de Dados (Opcional)

Para usar MySQL ao invés de dados em memória:

\`\`\`bash
# Criar banco e tabelas
mysql -u root -p < backend/database/nami_schema.sql
\`\`\`

O sistema detecta automaticamente se o banco está disponível. Caso contrário, usa repositórios em memória.

## Executando

### Desenvolvimento (ambos simultaneamente)

\`\`\`bash
npm run dev
\`\`\`

### Frontend apenas

\`\`\`bash
npm run dev:frontend
# ou
cd frontend && npm run dev
# Acessa em http://localhost:3000
\`\`\`

### Backend apenas

\`\`\`bash
npm run dev:backend
# ou
cd backend && npm run dev
# API em http://localhost:3333
\`\`\`

### Produção

\`\`\`bash
# Build de ambos
npm run build

# Iniciar backend
npm run start:backend
\`\`\`

## Dados de Exemplo

### Salas

- **Salas 1-5:** Monitoramento 1 (capacidade 8 pessoas)
- **Salas 6-10:** Monitoramento 2 (capacidade 10 pessoas)
- **Salas 11, 14-17:** Monitoramento 3 (capacidade 6-8 pessoas)
- **Salas 12-13:** Independentes (capacidade 12 e 25 pessoas)
- **Salas 101-103:** Escritórios de monitoramento (capacidade 2 pessoas)

### Grade Horária

5 blocos combinados de 100 minutos cada:

| Bloco | Período | Horário |
|-------|---------|---------|
| MAB | Manhã | 07:30 - 09:10 |
| MCD | Manhã | 09:30 - 11:10 |
| MEF | Manhã | 11:20 - 13:00 |
| TAB | Tarde | 13:30 - 15:10 |
| TCD | Tarde | 15:30 - 17:10 |

## Credenciais de Acesso

| Role | Usuário | Senha | Permissões |
|------|---------|-------|------------|
| Admin | \`admin.nami\` | \`NAMI@2025!\` | Acesso total |

> **Nota:** Apenas o usuário admin é criado no seed. Outros usuários podem ser criados via sistema.

### Matriz de Permissões

| Ação | Admin | Editor | Usuário | Leitor |
|------|-------|--------|---------|--------|
| Visualizar salas | ✓ | ✓ | ✓ | ✓ |
| Criar reserva | ✓ | ✓ | ✓ | ✗ |
| Editar reserva | ✓ | ✓ | ✗ | ✗ |
| Cancelar reserva | ✓ | ✓ | ✗ | ✗ |
| Visualizar logs | ✓ | ✓ | ✗ | ✗ |
| Gerenciar usuários | ✓ | ✗ | ✗ | ✗ |

## API Endpoints

Consulte a documentação completa em [\`backend/API.md\`](backend/API.md).

### Principais Rotas

\`\`\`
POST   /api/auth/login          # Autenticação
POST   /api/auth/logout         # Logout
GET    /api/nami/rooms          # Listar salas
GET    /api/nami/bookings       # Listar reservas
POST   /api/nami/bookings       # Criar reserva
PUT    /api/nami/bookings/:id   # Editar reserva
DELETE /api/nami/bookings/:id   # Cancelar reserva
GET    /api/users               # Listar usuários (admin)
\`\`\`

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| \`npm run dev\` | Inicia frontend e backend simultaneamente |
| \`npm run dev:frontend\` | Inicia apenas o frontend |
| \`npm run dev:backend\` | Inicia apenas o backend |
| \`npm run build\` | Build de produção (ambos) |
| \`npm run build:frontend\` | Build apenas do frontend |
| \`npm run build:backend\` | Build apenas do backend |
| \`npm run start:backend\` | Inicia backend em produção |
| \`npm run lint\` | Executa linter no backend |

## Licença

MIT
