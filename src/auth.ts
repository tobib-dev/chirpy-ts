import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "./api/errors.js";

const TOKEN_ISSUER = "chirpy";
type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export async function checkPasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function makeJWT(userID: string, expiresIn: number, secret: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresIn;
  const token = jwt.sign(
    {
      iss: TOKEN_ISSUER,
      sub: userID,
      iat: issuedAt,
      exp: expiresAt,
    } satisfies payload,
    secret,
    { algorithm: "HS256" },
  );
  return token;
}

export function validateJWT(tokenString: string, secret: string) {
  let decoded: payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new BadRequestError("Malformed request");
  }

  const bearer = authHeader.split(" ");
  if (bearer.length < 2 || bearer[0] !== "Bearer") {
    throw new BadRequestError("Must contain bearer and token: <Bearer TOKEN_STRING>");
  }
  return bearer[1];
}

export function makeRefreshToken() {
  const rBytes = randomBytes(32);
  return rBytes.toString("hex");
}