import crypto from "node:crypto";
import { users as seedUsers } from "../../data/userData.js";
import { User } from "../../types/nami.js";
import { UserRepository } from "../userRepository.js";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = seedUsers.map((user) => ({ ...user }));

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  findByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  list(): User[] {
    return this.users.map((user) => ({ ...user }));
  }

  create(user: User): User {
    const userWithId = user.id ? user : { ...user, id: crypto.randomUUID() };
    this.users.push({ ...userWithId });
    return { ...userWithId };
  }

  update(user: User): User {
    const index = this.users.findIndex((candidate) => candidate.id === user.id);
    if (index === -1) {
      throw new Error(`User with id ${user.id} not found`);
    }
    this.users[index] = { ...user };
    return { ...this.users[index] };
  }

  delete(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
