import { User, UserStatus } from "../types/nami.js";

export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  list(): Promise<User[]>;
  listByStatus(status: UserStatus): Promise<User[]>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  updateLastLogin(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
