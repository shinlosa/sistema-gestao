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
    const user = userRepository.findByUsername(username);

    if (!user || user.status !== "active") {
      return null;
    }

  const isPasswordValid = await passwordUtils.verify(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    const token = tokenUtils.sign({
      sub: user.id,
      role: user.role,
      name: user.name,
    });

    return {
      user: omitPassword(user),
      token,
    };
  },
  listUsers: (): Array<Omit<User, "passwordHash">> => userRepository.list().map((user) => omitPassword(user)),
};
