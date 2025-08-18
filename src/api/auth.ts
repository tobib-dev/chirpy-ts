import bcrypt from "bcrypt";

export function hashPassword(password: string): string {
  const hash = bcrypt.hashSync(password, 10);
  return hash;
}

export function checkPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
