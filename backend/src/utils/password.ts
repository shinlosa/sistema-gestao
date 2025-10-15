import bcrypt from "bcryptjs";

const DEFAULT_SALT_ROUNDS = 10;

const hash = async (plaintext: string, saltRounds: number = DEFAULT_SALT_ROUNDS): Promise<string> => {
  return await bcrypt.hash(plaintext, saltRounds);
};

const verify = async (plaintext: string, hashValue: string): Promise<boolean> => {
  return await bcrypt.compare(plaintext, hashValue);
};

export const passwordUtils = {
  hash,
  verify,
};
