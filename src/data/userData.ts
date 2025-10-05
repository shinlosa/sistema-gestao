import { User } from "../types/nami";

// Dados mockados de usuários
export const users: User[] = [
  {
    id: 'admin1',
    username: 'admin.nami',
    password: 'NAMI@2025!',
    name: 'Administrador NAMI',
    email: 'admin.nami@unifor.br',
    role: 'admin',
    department: 'Tecnologia da Informação',
    status: 'active',
    createdAt: new Date('2024-12-01'),
    lastLogin: new Date('2025-01-05T08:30:00'),
  },
  {
    id: 'coord1',
    username: 'coord.nutricao',
    password: 'Nutri@123',
    name: 'Coordenadora Nutrição',
    email: 'coord.nutricao@unifor.br',
    role: 'coordinator',
    department: 'Nutrição',
    status: 'active',
    createdAt: new Date('2024-12-05'),
    lastLogin: new Date('2025-01-05T07:15:00'),
  },
  {
    id: 'prof1',
    username: 'lorrainy.silva',
    password: 'Prof@456',
    name: 'Profa. Lorrainy',
    email: 'lorrainy.silva@unifor.br',
    role: 'professor',
    department: 'Nutrição',
    status: 'active',
    createdAt: new Date('2024-12-10'),
    lastLogin: new Date('2025-01-04T14:30:00'),
  },
  {
    id: 'prof2',
    username: 'virginia.esc',
    password: 'Prof@789',
    name: 'Profa. Virginia (ESC)',
    email: 'virginia.esc@unifor.br',
    role: 'professor',
    department: 'Enfermagem',
    status: 'active',
    createdAt: new Date('2024-12-12'),
    lastLogin: new Date('2025-01-03T16:45:00'),
  },
  {
    id: 'prof3',
    username: 'ana.claudia',
    password: 'Nutri@321',
    name: 'Nutricionista Ana Claudia',
    email: 'ana.claudia@unifor.br',
    role: 'professor',
    department: 'Nutrição',
    status: 'active',
    createdAt: new Date('2024-12-15'),
  },
  {
    id: 'prof4',
    username: 'carol.farmacia',
    password: 'Farm@654',
    name: 'Profa. Carol',
    email: 'carol.farmacia@unifor.br',
    role: 'professor',
    department: 'Farmácia',
    status: 'active',
    createdAt: new Date('2024-12-18'),
  },
  // Usuários pendentes de aprovação
  {
    id: 'pending1',
    username: 'joao.silva',
    password: 'Temp@123',
    name: 'João Silva',
    email: 'joao.silva@unifor.br',
    role: 'staff',
    department: 'Nutrição',
    status: 'pending',
    createdAt: new Date('2025-01-03'),
    requestedBy: 'Solicitação própria',
  },
  {
    id: 'pending2',
    username: 'maria.santos',
    password: 'Temp@456',
    name: 'Maria Santos',
    email: 'maria.santos@unifor.br',
    role: 'professor',
    department: 'Psicologia',
    status: 'pending',
    createdAt: new Date('2025-01-04'),
    requestedBy: 'Coordenação Psicologia',
  },
];

// Função para validar login
export const validateLogin = (username: string, password: string): User | null => {
  const user = users.find(u => u.username === username && u.password === password && u.status === 'active');
  return user || null;
};

// Função para buscar usuário por ID
export const getUserById = (id: string): User | null => {
  return users.find(u => u.id === id) || null;
};