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

export async function getUserFromRefreshToken(token: string) {
  const [rows] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token));
  return rows;
}

export async function saveRefreshToken(userId: string, newToken: string) {
  const [result] = await db.update(refresh_tokens)
  .set({ token: newToken, updatedAt: new Date() })
  .where(eq(refresh_tokens.userId, userId));
}

export async function revokeToken(token: string) {
  const [rows] = await db.update(refresh_tokens)
  .set({ updatedAt: new Date(), revoked_at: new Date()})
  .where(eq(refresh_tokens.token, token));
}