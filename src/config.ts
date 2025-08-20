import { MigrationConfig } from "drizzle-orm/migrator";
import path from "path";

const migrationConfig: MigrationConfig = {
  migrationsFolder: path.join(process.cwd(), "src", "db", "migrations"),
};

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
  platform: string;
  secret: string;
};

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Env ${key} is not set`);
  }
  return value;
}

export const config: Config = {
  api: {
    fileserverHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
    secret: envOrThrow("SECRET"),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};
