import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "./auth.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type Parameters = {
    email: string;
    password: string;
  };

  type User = {
    id: string;
    email: string;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
  };

  type UserResponse = Omit<User, "hashedPassword">;

  const params: Parameters = req.body;
  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = hashPassword(params.password);

  if (!hashedPassword) {
    respondWithError(res, 500, "Failed to hash password");
    return;
  }

  const user = await createUser({
    email: params.email,
    hashedPassword: hashedPassword,
  });

  if (!user) {
    throw new Error("Couldn't create user");
  }

  const userResponse: UserResponse = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  respondWithJSON(res, 201, userResponse);
}
