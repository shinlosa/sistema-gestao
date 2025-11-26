
# Sistema de Reservas de Sala

Aplicação web para gerenciamento das salas do NAMI/UNIFOR. O sistema permite visualizar a disponibilidade, reservar horários e acompanhar logs de atividade, com um backend em Node.js que espelha os dados utilizados pelo frontend.

## Stack
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + ShadCN/UI
- Backend: Node.js 20 + Express + TypeScript + Zod
- Autenticação: JWT com armazenamento local
- Dados: Estruturas em memória (mock) com plano de migração para MySQL

## Estrutura
- `src/`: aplicação frontend (componentes por feature, hooks, dados mock)
- `backend/`: API Express com serviços, controllers e rotas
- `build/`: artefatos gerados pelo Vite (produção)

## Pré-requisitos
- Node.js 20+
- npm 10+

## Executando o frontend
```bash
npm install
npm run dev
# acessa em http://localhost:5173
```

## Executando o backend
```bash
cd backend
npm install
npm run dev
# API em http://localhost:3333
```

Configure `backend/.env` (copie de `.env.example` se necessário) para ajustar porta e origens de CORS. O frontend lê a URL da API do arquivo `.env` na raiz via `VITE_API_BASE_URL`.

## Dados de exemplo
- 3 monitoramentos com 18 salas vinculadas (15 salas numéricas + 3 escritórios)
- Sala 1-5: Monitoramento 1 (capacidade 8 pessoas)
- Sala 6-10: Monitoramento 2 (capacidade 10 pessoas)
- Sala 11-15: Monitoramento 3 (capacidade 12 pessoas)
- Sala 101-103: Escritórios de monitoramento (capacidade 2 pessoas)
- Grade horária com 5 blocos combinados de 100 minutos cada (MAB, MCD, MEF, TAB, TCD)

As reservas e usuários são mantidos em memória durante a execução. Reiniciar o servidor limpa os dados.

## Credenciais de Teste

O sistema possui 4 níveis de acesso com cores distintivas:

| Role | Cor | Usuário | Senha | Permissões |
|------|-----|---------|-------|------------|
| 🟣 Administrador | Roxo | `admin.nami` | `NAMI@2025!` | Acesso total: criar/editar/cancelar reservas, gerenciar usuários, visualizar logs |
| 🔵 Editor | Azul | `coord.nutricao` | `Nutri@123` | Criar/editar/cancelar reservas, visualizar logs |
| 🟢 Usuário | Verde | `flavia.prof` | `Prof@456` | Apenas criar novas reservas |
| ⚪ Leitor | Cinza | `leitor.nami` | `Leitor@789` | Apenas visualizar disponibilidade (sem criar reservas) |

### Matriz de Permissões

| Ação | Admin | Editor | Usuário | Leitor |
|------|-------|--------|---------|--------|
| Visualizar salas e disponibilidade | ✓ | ✓ | ✓ | ✓ |
| Criar reserva | ✓ | ✓ | ✓ | ✗ |
| Editar reserva | ✓ | ✓ | ✗ | ✗ |
| Cancelar reserva | ✓ | ✓ | ✗ | ✗ |
| Visualizar logs de atividade | ✓ | ✓ | ✗ | ✗ |
| Gerenciar usuários | ✓ | ✗ | ✗ | ✗ |

Documentação Completa: [Projeto NAMI (1).pdf](https://github.com/user-attachments/files/23780508/Projeto.NAMI.1.pdf)
