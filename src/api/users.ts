import { Request, Response } from "express";
import { createUser, updateUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
  type Parameters = {
    email: string;
    password: string;
  };

  const params: Parameters = req.body;
  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const user = await createUser({
    email: params.email,
    hashedPassword: hashedPassword,
  } satisfies NewUser);

  if (!user) {
    throw new Error("Couldn't create user");
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse);
}

export async function handlerUpdateUser(req: Request, res: Response) {
  type parameter = {
    email: string;
    password: string;
  }

  const params: parameter = req.body;

  const hashedPassword = await hashPassword(params.password);
  const accessToken = getBearerToken(req);

  const userId = validateJWT(accessToken, config.jwt.secret);
  if (!userId) {
    throw new UnauthorizedError("Invalid token");
  }

  const user = await updateUser(userId, params.email, hashedPassword);
  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse);
}