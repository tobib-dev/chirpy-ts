import { Request, Response } from "express";
import { config } from "../config";

export async function handlerValidateChirp(req: Request, res: Response) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const parsedBody = JSON.parse(body);
      if (parsedBody.body.length > 140) {
        res.header("Content-Type", "application/json");
        const errorResponse = {
          error: "Chirp is too long",
        };
        res.status(400).send(JSON.stringify(errorResponse));
      } else {
        const successResponse = {
          valid: true,
        };
        res.status(200).send(JSON.stringify(successResponse));
        res.end();
      }
    } catch (error) {
      res.status(400).send("Something went wrong");
    }
  });
}
