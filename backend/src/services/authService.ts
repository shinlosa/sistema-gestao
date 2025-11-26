import { userRepository } from "../repositories/index.js";
import { User } from "../types/nami.js";
import { passwordUtils } from "../utils/password.js";
import { tokenUtils } from "../utils/token.js";

type LoginResult = {
  user: Omit<User, "passwordHash">;
  token: string;
};

const omitPassword = (user: User): Omit<User, "passwordHash"> => {
  const { passwordHash: _password, ...rest } = user;
  return rest;
};

export const authService = {
  login: async (username: string, password: string): Promise<LoginResult | null> => {
    const user = await userRepository.findByUsername(username);

    if (!user || user.status !== "active") {
      return null;
    }

    const isPasswordValid = await passwordUtils.verify(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    const loginTimestamp = new Date().toISOString();
    const userWithLastLogin: User = {
      ...user,
      lastLogin: loginTimestamp,
    };

    await userRepository.update(userWithLastLogin);

    const token = tokenUtils.sign({
      sub: user.id,
      role: user.role,
      name: user.name,
    });

    return {
      user: omitPassword(userWithLastLogin),
      token,
    };
  },
};
