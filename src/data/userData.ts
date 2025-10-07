
import { User } from "../types/nami";

// Apenas a conta admin tem acesso inicial ao sistema
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
  },
  {
    id: 'coord1',
    username: 'coord.nutricao',
    password: 'Nutri@123',
    name: 'Coordenadora Nutrição',
    email: 'coord.nutricao@unifor.br',
    role: 'editor',
    department: 'Nutrição',
    status: 'active',
    createdAt: new Date('2024-12-05'),
  },
  {
    id: 'prof1',
    username: 'flavia.prof',
    password: 'Prof@456',
    name: 'Profa. Flávia',
    email: 'flavia.prof@unifor.br',
    role: 'viewer',
    department: 'Nutrição',
    status: 'active',
    createdAt: new Date('2024-12-10'),
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