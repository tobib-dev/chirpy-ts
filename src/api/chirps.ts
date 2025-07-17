import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidateChirps(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;
  const maxChirpLength = 140;
  const profaneWords: string[] = ["kerfuffle", "sharbert", "fornax"];
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }
  const splitBody = params.body.split(" ");

  for (let i = 0; i < splitBody.length; i++) {
    for (const word of profaneWords) {
      if (splitBody[i].toLowerCase() === word) {
        console.log(word);
        splitBody[i] = "****";
      }
    }
  }

  const newBody = splitBody.join(" ");

  respondWithJSON(res, 200, {
    cleanedBody: newBody,
  });
}
