import { User } from "../types/nami.js";

export interface UserRepository {
  findById(id: string): User | undefined;
  findByUsername(username: string): User | undefined;
  list(): User[];
  create(user: User): User;
  update(user: User): User;
  delete(id: string): void;
}
