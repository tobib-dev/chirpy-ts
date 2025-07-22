import { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./db/migrations",
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
};

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Env ${key} is not set`);
  }
  return value;
}

export const dbCfg: DBConfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig: migrationConfig,
};

export const config: APIConfig = {
  fileserverHits: 0,
  db: dbCfg,
};
