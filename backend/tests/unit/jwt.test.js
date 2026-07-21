import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import crypto from "node:crypto";
const jwtMock = { sign: jest.fn(), verify: jest.fn() };
jest.unstable_mockModule("jsonwebtoken", () => ({ default: jwtMock }));
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, hashToken } = await import("../../utils/jwt.js");

describe("jwt utilities", () => {
  beforeEach(() => { jest.resetAllMocks(); process.env.JWT_SECRET = "access-secret"; process.env.JWT_REFRESH_SECRET = "refresh-secret"; process.env.JWT_EXPIRES_IN = "10m"; process.env.JWT_REFRESH_EXPIRES_IN = "7d"; });

  test("generates an access token with the expected claims and options", () => {
    // Arrange
    jwtMock.sign.mockReturnValue("access-token");
    // Act
    const token = generateAccessToken({ user_id: 1 });
    // Assert
    expect(token).toBe("access-token"); expect(jwtMock.sign).toHaveBeenCalledWith({ user_id: 1, token_type: "access" }, "access-secret", expect.objectContaining({ issuer: "car-rental-api", audience: "car-rental-client", expiresIn: "10m" }));
  });

  test("generates refresh token metadata and verifies refresh tokens with common options", () => {
    // Arrange
    jwtMock.sign.mockReturnValue("refresh-token"); jwtMock.verify.mockReturnValue({ user_id: 1 });
    // Actc
    const result = generateRefreshToken({ user_id: 1 }, "family-1"); const decoded = verifyRefreshToken("refresh-token");
    // Assert
    expect(result).toEqual(expect.objectContaining({ token: "refresh-token", familyId: "family-1", jti: expect.any(String) })); expect(jwtMock.sign).toHaveBeenCalledWith(expect.objectContaining({ user_id: 1, family_id: "family-1", token_type: "refresh", jti: result.jti }), "refresh-secret", expect.objectContaining({ expiresIn: "7d" })); expect(jwtMock.verify).toHaveBeenCalledWith("refresh-token", "refresh-secret", { issuer: "car-rental-api", audience: "car-rental-client" }); expect(decoded).toEqual({ user_id: 1 });
  });

  test("hashToken creates the expected deterministic SHA-256 digest", () => {
    // Arrange
    const token = "refresh-token";
    const expected = crypto.createHash("sha256").update(token).digest("hex");
    // Act
    const result = hashToken(token);
    // Assert
    expect(result).toBe(expected);
  });
});
