import { db } from "../index.js";
import { NewRefreshToken, refresh_tokens } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createRefreshToken(refresh_token: NewRefreshToken) {
  const [result] = await db
    .insert(refresh_tokens)
    .values(refresh_token)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getRefreshToken(token: string) {
  const [rows] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token));
  return rows;
}