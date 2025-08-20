import { Request, response, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { UnauthorizedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { UserResponse } from "./users.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { config } from "../config.js";

interface UserResponseWithToken extends UserResponse {
  token: string;
}

export async function handlerLogin(req: Request, res: Response) {
  type parameter = {
    password: string;
    email: string;
    expiresInSeconds: number
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

  let loginDuration = params.expiresInSeconds;
  if (!loginDuration || loginDuration > 3600) {
    loginDuration = 3600;
  }
  const token = makeJWT(user.id, loginDuration, config.api.secret);

  const userResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  } satisfies UserResponse;

  const loginResp: UserResponseWithToken = {
    ...userResponse,
    token: token,
  };

  respondWithJSON(res, 200, loginResp);
}
