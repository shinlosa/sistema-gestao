
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
    lastLogin: new Date('2025-01-05T08:30:00'),
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