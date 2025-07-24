import type { Request, Response } from "express";
import { config } from "../config.js";
import { respondWithError } from "../api/json.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(_: Request, res: Response) {
  if (config.platform !== "dev") {
    respondWithError(res, 403, "Reset can only be executed in DEV");
  }

  config.fileserverHits = 0;
  res.write("Hits reset to 0");
  deleteUsers();
  res.end();
}
