import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type Parameters = {
    email: string;
  };
  const params: Parameters = req.body;
  if (!params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const user = await createUser({ email: params.email });

  if (!user) {
    throw new Error("Couldn't create user");
  }

  respondWithJSON(res, 201, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  });
}
