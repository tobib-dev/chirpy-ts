import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.on("finish", () => {
    if (res.statusCode !== 200) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`,
      );
    }
  });
  next();
}

export function middlewareMetricsInc(
  _: Request,
  __: Response,
  next: NextFunction,
): void {
  config.fileserverHits++;
  next();
}

export function middlewareErrorHandler(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  console.error(err);
  res.status(500).json({
    error: "Something went wrong on our end",
  });
}
