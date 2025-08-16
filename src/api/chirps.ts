import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp } from "../db/queries/chirps.js";
import { createDeflate } from "node:zlib";

export async function handlerValidateChirps(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;
  const maxChirpLength = 140;
  const badWords: string[] = ["kerfuffle", "sharbert", "fornax"];
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`,
    );
  }

  const words = params.body.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (badWords.includes(words[i].toLowerCase())) {
      words[i] = "****";
    }
  }

  const newBody = words.join(" ");

  respondWithJSON(res, 200, {
    cleanedBody: newBody,
  });
}

export async function handlerCreateChirp(req: Request, res: Response) {
  type Parameters = {
    body: string;
    userId: string;
  };

  const params: Parameters = req.body;

  if (!params.body) {
    throw new BadRequestError("Missing required fields: body");
  }
  if (!params.userId) {
    throw new BadRequestError("Missing required fields: userId");
  }

  const chirp = await createChirp({ body: params.body, userId: params.userId });

  if (!chirp) {
    throw new Error("Could not create chirp");
  }

  respondWithJSON(res, 201, {
    id: chirp.id,
    body: chirp.body,
    userId: chirp.userId,
    createdAt: chirp.createdAt,
    updatedAt: chirp.updatedAt,
  });
}
