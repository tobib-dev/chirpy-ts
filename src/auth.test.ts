import { describe, it, expect, beforeAll } from "vitest";
import {
  hashPassword,
  checkPasswordHash,
  makeJWT,
  validateJWT,
  getBearerToken,
  extractApiKey,
} from "./auth";
import { BadRequestError, UnauthorizedError } from "./api/errors.js";

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
    const result = await checkPasswordHash("wrongPassword", hash1);
    expect(result).toBe(false);
  });

  it("should return false when password doesn't match a different hash", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  it("should return false for an empty password", async () => {
    const result = await checkPasswordHash("", hash1);
    expect(result).toBe(false);
  });

  it("should return false for an invalid hash", async () => {
    const result = await checkPasswordHash(password1, "invalidhash");
    expect(result).toBe(false);
  });
});

describe("JWT Functions", () => {
  const secret = "secret";
  const wrongSecret = "wrong_secret";
  const userID = "some-unique-user-id";
  let validToken: string;

  beforeAll(async () => {
    validToken = makeJWT(userID, 3600, secret);
  });

  it("should validate a vald token", async () => {
    const result = validateJWT(validToken, secret);
    expect(result).toBe(userID);
  });

  it("should throw an error for an invalid token string", () => {
    expect(() => validateJWT("invalid.token.string", secret)).toThrow(
      UnauthorizedError,
    );
  });

  it("should throw an error when the token is signed with a wrong secret", () => {
    expect(() => validateJWT(validToken, wrongSecret)).toThrow(
      UnauthorizedError,
    );
  });
});

describe("Bearer Token", () => {
  const token = "VALID_TOKEN_STRING";
  const mockHeader = {
    Authorization: `Bearer ${token}`,
  };
  const mockRequest = {
    get: (headerName: string) => {
      if (headerName === "Authorization") {
        return "Bearer VALID_TOKEN_STRING";
      }
      return undefined;
    },
  } as any;

  it("should return the bearer token if header is intact", async () => {
    const result = getBearerToken(mockRequest);
    expect(result).toBe(token);
  });
});

describe("extractApiKey", () => {
  it("shuld extract the API Key from a valid header", () => {
    const apiKey = "myApiKey";
    const header = `ApiKey ${apiKey}`;
    expect(extractApiKey(header)).toBe(apiKey);
  });

  it("should extract the token een if there are extra parts", () => {
    const apiKey = "myApiKey";
    const header = `ApiKey ${apiKey} extra-data`;
    expect(extractApiKey(header)).toBe(apiKey);
  });

  it("should throw a BadRequestError if the header does not contain at least two parts", () => {
    const header = "";
    expect(() => extractApiKey(header)).toThrow(BadRequestError);
  });

  it("should throw a BadRequestError if the header does not start with 'ApiKey'", () => {
    const header = "Basic mySecretApiKey";
    expect(() => extractApiKey(header)).toThrow(BadRequestError);
  });

  it("should throw a BadRequestError if the header is an empty string", () => {
    const header = "";
    expect(() => extractApiKey(header)).toThrow(BadRequestError);
  });
});
