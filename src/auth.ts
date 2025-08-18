import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export async function checkPasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function makeJWT(userID: string, expiresIn: number, secret: string) {
  const load: payload = {
    iss: "chirpy",
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  return jwt.sign(load, secret, { expiresIn });
}

export function validateJWT(tokenString: string, secret: string) {
  const { load } = jwt.verify(tokenString, secret) as { load: payload };
  if (!load.exp || load.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("token invalid or expired");
  }
  return load.sub;
}
