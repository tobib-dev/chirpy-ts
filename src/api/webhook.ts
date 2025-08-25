import { Request, Response } from "express";
import { respondWithError } from "./json.js";
import { upgradeUser } from "../db/queries/users.js"

export async function handlerWebhook(req: Request, res: Response) {
    type parameters = {
      event: string;
      data: {
        userId: string;
      };
    };
  
    const params: parameters = req.body;
    if (params.event !== "user.upgraded") {
      respondWithError(res, 204, "Event not upgraded");
      return;
    }

    await upgradeUser(params.data.userId);
 
    res.status(204).send();
  }
  