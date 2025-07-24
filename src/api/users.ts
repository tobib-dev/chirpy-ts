import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type Parameters = {
    email: string;
  };

  type Response = {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };

  try {
    const params: Parameters = req.body;

    const userData: NewUser = {
      email: params.email,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = await createUser(userData);
    const userResponse: Response = {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
    };

    respondWithJSON(res, 201, userResponse);
  } catch (error) {
    console.error("Error creating user: ", error);
    respondWithError(res, 500, "Failed to create user");
  }
}
