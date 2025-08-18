import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, checkPasswordHash, makeJWT, validateJWT } from "./auth";
import { randomUUID } from "crypto";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for the wrong password", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });
});

describe("Create JWT", () => {
  const userId1 = randomUUID();
  const userId2 = randomUUID();
  let jwt1: string;
  let jwt2: string;

  beforeAll(async () => {
    jwt1 = makeJWT(userId1, 300, "supersecret");
    //jwt2 = await makeJWT(userId2, hash2);
  });

  it("should return the right user id for the correct JWT", async () => {
    const result = validateJWT(jwt1, "supersecret");
    expect(result).toBe(userId1);
  });
});
