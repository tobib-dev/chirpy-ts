import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";

export async function handlerValidateChirps(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;
  const maxChirpLength = 140;
  const badWords: string[] = ["kerfuffle", "sharbert", "fornax"];
  if (params.body.length > maxChirpLength) {
    throw new Error("Chirp is too long");
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
