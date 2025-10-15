import { User } from "../types/nami.js";

export const users: User[] = [
  {
    id: "admin1",
    username: "admin.nami",
    passwordHash: "$2a$10$0YC36FpzAsWWqGdOPEL8KOUz4qSOMIQzHKxV5te23K01j.5GIxLcK",
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
    passwordHash: "$2a$10$GVo66iQOp5ZJBcLndqF2aekw8TowoNKM3SfQ.6iqy3VTSA7IDRTNW",
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
    passwordHash: "$2a$10$bJBNoqNejI4Ne/TtjADljebtcvS4G4Ufzl3m5HcDPzjDbgdfZR56K",
    name: "Profa. Flávia",
    email: "flavia.prof@unifor.br",
    role: "viewer",
    department: "Nutrição",
    status: "active",
    createdAt: new Date("2024-12-10").toISOString(),
  },
];
