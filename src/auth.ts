import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export async function checkPasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
