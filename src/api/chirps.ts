import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errors.js";
import { createChirp, getChirps, getChirp, deleteChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

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
  };

  const params: Parameters = req.body;

  if (!params.body) {
    throw new BadRequestError("Missing required fields: body");
  }

  const token = getBearerToken(req);
  if (!token) {
    throw new UnauthorizedError("Couldn't get bearer token");
  }
  const userId = validateJWT(token, config.jwt.secret)
  if (!userId) {
    throw new UnauthorizedError("Invalid token");
  }

  const validatedChirps = validateChirps(params.body);

  const chirp = await createChirp({
    body: validatedChirps,
    userId: userId,
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
  const { chirpID } = req.params;

  const chirp = await getChirp(chirpID);
  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpID} not found`);
  }
  return respondWithJSON(res, 200, chirp);
}

export async function handlerDeleteChirps(req: Request, res: Response) {
  const { chirpID } = req.params;
  const token = getBearerToken(req);

  const userId = validateJWT(token, config.jwt.secret);
  const chirp = await getChirp(chirpID);
  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpID} not found`);
  }
  if (chirp.userId !== userId) {
    throw new ForbiddenError("You can't delete this chirp");
  }

  const deleted = await deleteChirp(chirpID);
  if (!deleted) {
    throw new Error(`Failed to dlete chirp with chirpId: ${chirpID}`);
  }
  
  res.status(204).send();
}