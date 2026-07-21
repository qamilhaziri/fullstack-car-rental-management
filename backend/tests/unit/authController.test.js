import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const bcryptMock = { compare: jest.fn() };
const authServiceMock = { login: jest.fn(), saveRefreshSession: jest.fn(), revokeRefreshSession: jest.fn(), revokeFamily: jest.fn() };
const jwtMock = { generateAccessToken: jest.fn(), generateRefreshToken: jest.fn(), hashToken: jest.fn(), verifyRefreshToken: jest.fn() };
const dbMock = jest.fn(); dbMock.transaction = jest.fn(); dbMock.fn = { now: jest.fn() };

jest.unstable_mockModule("bcrypt", () => ({ default: bcryptMock }));
jest.unstable_mockModule("../../services/authService.js", () => ({ default: authServiceMock }));
jest.unstable_mockModule("../../utils/jwt.js", () => jwtMock);
jest.unstable_mockModule("../../config/dbConfig.js", () => ({ default: dbMock }));
const { login, logout, me, refresh } = await import("../../controllers/authController.js");

const createLog = () => ({ warn: jest.fn(), info: jest.fn(), debug: jest.fn() });

describe("authController", () => {
  beforeEach(() => jest.resetAllMocks());

  test("rejects login when no user exists without comparing passwords", async () => {
    // Arrange
    const log = createLog(); const req = createRequest({ body: { email: "x@example.com", password: "wrong" }, log }); const res = createResponse(); authServiceMock.login.mockResolvedValue(null);
    // Act
    await login(req, res);
    // Assert
    expect(authServiceMock.login).toHaveBeenCalledWith("x@example.com"); expect(bcryptMock.compare).not.toHaveBeenCalled(); expect(res.status).toHaveBeenCalledWith(401); expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  test("rejects login when password does not match", async () => {
    // Arrange
    const log = createLog(); const req = createRequest({ body: { email: "x@example.com", password: "wrong" }, log }); const res = createResponse(); authServiceMock.login.mockResolvedValue({ admin_id: 1, password: "hash" }); bcryptMock.compare.mockResolvedValue(false);
    // Act
    await login(req, res);
    // Assert
    expect(bcryptMock.compare).toHaveBeenCalledWith("wrong", "hash"); expect(authServiceMock.saveRefreshSession).not.toHaveBeenCalled(); expect(res.status).toHaveBeenCalledWith(401);
  });

  test("creates a refresh session, sets cookies, and returns safe user data on login", async () => {
    // Arrange
    const log = createLog(); const req = createRequest({ body: { email: "admin@example.com", password: "pass" }, log }); const res = createResponse();
    authServiceMock.login.mockResolvedValue({ admin_id: 1, full_name: "Admin User", password: "hash" }); bcryptMock.compare.mockResolvedValue(true); jwtMock.generateAccessToken.mockReturnValue("access"); jwtMock.generateRefreshToken.mockReturnValue({ token: "refresh", jti: "jti-1", familyId: "family-1" }); jwtMock.verifyRefreshToken.mockReturnValue({ exp: 2_000 }); jwtMock.hashToken.mockReturnValue("token-hash"); authServiceMock.saveRefreshSession.mockResolvedValue(undefined);
    // Act
    await login(req, res);
    // Assert
    expect(authServiceMock.saveRefreshSession).toHaveBeenCalledWith(expect.objectContaining({ user_id: 1, family_id: "family-1", token_hash: "token-hash", replaced_by_jti: null })); expect(res.cookie).toHaveBeenCalledTimes(2); expect(res.status).toHaveBeenCalledWith(200); expect(res.json).toHaveBeenCalledWith({ message: "Login successful", user: { user_id: 1, fullName: "Admin User" } });
  });

  test("revokes existing refresh session and clears both cookies on logout", async () => {
    // Arrange
    const log = createLog(); const req = createRequest({ cookies: { refresh_token: "refresh" }, user: { user_id: 1 }, log }); const res = createResponse(); jwtMock.hashToken.mockReturnValue("hashed"); authServiceMock.revokeRefreshSession.mockResolvedValue(undefined);
    // Act
    await logout(req, res);
    // Assert
    expect(authServiceMock.revokeRefreshSession).toHaveBeenCalledWith("hashed"); expect(res.clearCookie).toHaveBeenCalledTimes(2); expect(res.status).toHaveBeenCalledWith(200); expect(res.json).toHaveBeenCalledWith({ message: "Logged out" });
  });

  test("returns the authenticated user in me", async () => {
    // Arrange
    const log = createLog(); const req = createRequest({ user: { user_id: 1 }, log }); const res = createResponse();
    // Act
    await me(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(200); expect(res.json).toHaveBeenCalledWith({ user: { user_id: 1 } });
  });

  test("refresh rejects immediately when the refresh cookie is missing", async () => {
    // Arrange
    const req = createRequest({ cookies: {}, log: createLog() }); const res = createResponse();
    // Act
    await refresh(req, res);
    // Assert
    expect(jwtMock.verifyRefreshToken).not.toHaveBeenCalled(); expect(dbMock.transaction).not.toHaveBeenCalled(); expect(res.status).toHaveBeenCalledWith(401); expect(res.json).toHaveBeenCalledWith({ message: "Refresh token missing" });
  });

  test("refresh clears auth cookies when refresh token verification fails", async () => {
    // Arrange
    const req = createRequest({ cookies: { refresh_token: "expired" }, log: createLog() }); const res = createResponse(); jwtMock.verifyRefreshToken.mockImplementation(() => { throw new Error("expired"); });
    // Act
    await refresh(req, res);
    // Assert
    expect(res.clearCookie).toHaveBeenCalledTimes(2); expect(res.status).toHaveBeenCalledWith(401); expect(res.json).toHaveBeenCalledWith({ message: "Session expired. Login again." });
  });
});
