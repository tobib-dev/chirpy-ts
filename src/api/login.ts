import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPassword } from "./auth.js";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerLogin(req: Request, res: Response) {
  type parameter = {
    password: string;
    email: string;
  };

  const params: parameter = req.body;
  const user = await getUserByEmail(params.email);
  if (!user) {
    respondWithError(res, 401, "Incorrect email or password");
    return;
  }

  const isPasswordValid = await checkPassword(
    params.password,
    user.hashedPassword,
  );
  if (!isPasswordValid) {
    respondWithError(res, 401, "Incorrect email or password");
    return;
  }

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  });
}
