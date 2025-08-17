import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { createChirp, getChirps, getChirp } from "../db/queries/chirps.js";

function validateChirps(body: string) {
  const maxChirpLength = 140;
  const badWords: string[] = ["kerfuffle", "sharbert", "fornax"];
  if (body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`,
    );
  }

  const words = body.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (badWords.includes(words[i].toLowerCase())) {
      words[i] = "****";
    }
  }

  const newBody = words.join(" ");
  return newBody;
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

  const validatedChirps = validateChirps(params.body);

  const chirp = await createChirp({
    body: validatedChirps,
    userId: params.userId,
  });

  if (!chirp) {
    throw new Error("Could not create chirp");
  }

  respondWithJSON(res, 201, chirp);
}

export async function handlerGetAllChirps(_: Request, res: Response) {
  const chirps = await getChirps();
  return respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
  const { chirpId } = req.params;

  const chirp = await getChirp(chirpId);
  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
  }
  return respondWithJSON(res, 200, chirp);
}
