/* eslint-disable @typescript-eslint/require-await */
import crypto from "node:crypto";
import { users as seedUsers } from "../../data/userData.js";
import { User, UserStatus } from "../../types/nami.js";
import { UserRepository } from "../userRepository.js";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = seedUsers.map((user) => ({ ...user }));

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async list(): Promise<User[]> {
    return this.users.map((user) => ({ ...user }));
  }

  async listByStatus(status: UserStatus): Promise<User[]> {
    return this.users.filter((user) => user.status === status).map((user) => ({ ...user }));
  }

  async create(user: User): Promise<User> {
    const userWithId = user.id ? user : { ...user, id: crypto.randomUUID() };
    this.users.push({ ...userWithId });
    return { ...userWithId };
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((candidate) => candidate.id === user.id);
    if (index === -1) {
      throw new Error(`User with id ${user.id} not found`);
    }
    this.users[index] = { ...user };
    return { ...this.users[index] };
  }

  async updateLastLogin(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index].lastLogin = new Date().toISOString();
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
