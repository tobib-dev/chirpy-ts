import { MigrationConfig } from "drizzle-orm/migrator";
import path from "path";

const migrationConfig: MigrationConfig = {
  migrationsFolder: path.join(process.cwd(), "src", "db", "migrations"),
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
  platform: string;
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
  platform: envOrThrow("PLATFORM"),
};
