import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}

export async function reset() {
  await db.delete(chirps);
}

export async function getChirps() {
  return db.select().from(chirps).orderBy(asc(chirps.createdAt));
}

export async function getChirp(id: string) {
  return db.select().from(chirps).where(eq(chirps.id, id));
}
