import process from "node:process";

type APIConfig = {
  fileserverHits: number;
  dbURL: string;
};

function envOrThrow(key: string | undefined) {
  if (key === undefined || key === "") {
    throw new Error(`${key} is undefined or empty`);
  }
  return key;
}

export const config: APIConfig = {
  fileserverHits: 0,
  dbURL: envOrThrow(process.env.DB_URL),
};
