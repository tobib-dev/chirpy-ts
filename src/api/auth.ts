import { Request, response, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { UserResponse } from "./users.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { config } from "../config.js";

type LoginResponse = UserResponse & {
  token: string;
}

export async function handlerLogin(req: Request, res: Response) {
  type parameter = {
    password: string;
    email: string;
    expiresIn?: number
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
  if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
    duration = params.expiresIn;
  }
  const accessToken = makeJWT(user.id, duration, config.jwt.secret);

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: accessToken
  } satisfies LoginResponse);
}
