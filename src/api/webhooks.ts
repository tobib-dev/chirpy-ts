import { Request, Response } from "express";
import { respondWithError } from "./json.js";
import { upgradeUser } from "../db/queries/users.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";
import { UnauthorizedError } from "./errors.js";

export async function handlerWebhook(req: Request, res: Response) {
  type parameters = {
    event: string;
    data: {
      userId: string;
    };
  };

  let apiKey = getAPIKey(req);
  if (apiKey !== config.api.polkaKey) {
    throw new UnauthorizedError("invalid api key");
  }

  const params: parameters = req.body;
  if (params.event !== "user.upgraded") {
    respondWithError(res, 204, "Event not upgraded");
    return;
  }

  await upgradeUser(params.data.userId);

  res.status(204).send();
}
