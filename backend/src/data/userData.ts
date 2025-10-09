import { User } from "../types/nami.js";

export const users: User[] = [
  {
    id: "admin1",
    username: "admin.nami",
    password: "NAMI@2025!",
    name: "Administrador NAMI",
    email: "admin.nami@unifor.br",
    role: "admin",
    department: "Tecnologia da Informação",
    status: "active",
    createdAt: new Date("2024-12-01").toISOString(),
  },
  {
    id: "coord1",
    username: "coord.nutricao",
    password: "Nutri@123",
    name: "Coordenadora Nutrição",
    email: "coord.nutricao@unifor.br",
    role: "editor",
    department: "Nutrição",
    status: "active",
    createdAt: new Date("2024-12-05").toISOString(),
  },
  {
    id: "prof1",
    username: "flavia.prof",
    password: "Prof@456",
    name: "Profa. Flávia",
    email: "flavia.prof@unifor.br",
    role: "viewer",
    department: "Nutrição",
    status: "active",
    createdAt: new Date("2024-12-10").toISOString(),
  },
];
