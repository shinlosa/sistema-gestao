import crypto from "node:crypto";
import { users } from "../data/userData.js";
import { User } from "../types/nami.js";

type LoginResult = {
  user: Omit<User, "password">;
  token: string;
};

const omitPassword = (user: User): Omit<User, "password"> => {
  const { password: _password, ...rest } = user;
  return rest;
};

export const authService = {
  login: (username: string, password: string): LoginResult | null => {
    const user = users.find(
      (candidate) => candidate.username === username && candidate.password === password && candidate.status === "active",
    );

    if (!user) {
      return null;
    }

    const token = crypto.randomBytes(16).toString("hex");
    return {
      user: omitPassword(user),
      token,
    };
  },
  listUsers: (): Array<Omit<User, "password">> => users.map((user) => omitPassword(user)),
};
