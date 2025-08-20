import { Request, response, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { UserResponse } from "./users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { config } from "../config.js";
import { createRefreshToken } from "src/db/queries/refresh_tokens.js";

type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
}

export async function handlerLogin(req: Request, res: Response) {
  type parameter = {
    password: string;
    email: string;
  };

  const params: parameter = req.body;
  const user = await getUserByEmail(params.email);
  if (!user) {
    throw new UnauthorizedError("invalid username or password");
  }

  const isPasswordValid = await checkPasswordHash(
    params.password,
    user.hashedPassword,
  );
  if (!isPasswordValid) {
    throw new UnauthorizedError("invalid username or password");
  }

  let duration = config.jwt.defaultDuration;
  const accessToken = makeJWT(user.id, duration, config.jwt.secret);
  const refreshToken = makeRefreshToken(accessToken);

  const dbToken = await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + (duration * 1000)),
  })

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: accessToken,
    refreshToken: refreshToken
  } satisfies LoginResponse);
}
