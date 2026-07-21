import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const verifyMock = jest.fn();
jest.unstable_mockModule("jsonwebtoken", () => ({ default: { verify: verifyMock } }));
const { default: authMiddleware } = await import("../../middleware/authMiddleware.js");

describe("authMiddleware", () => {
  beforeEach(() => { jest.resetAllMocks(); process.env.JWT_SECRET = "test-secret"; });

  test("returns 401 when access token is missing", () => {
    // Arrange
    const log = { warn: jest.fn() }; const req = createRequest({ log }); const res = createResponse(); const next = jest.fn();
    // Act
    authMiddleware(req, res, next);
    // Assert
    expect(verifyMock).not.toHaveBeenCalled(); expect(next).not.toHaveBeenCalled(); expect(res.status).toHaveBeenCalledWith(401); expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  test("sets user and calls next for a valid access token", () => {
    // Arrange
    const decoded = { user_id: 1, token_type: "access" }; const req = createRequest({ cookies: { access_token: "access-token" } }); const res = createResponse(); const next = jest.fn(); verifyMock.mockReturnValue(decoded);
    // Act
    authMiddleware(req, res, next);
    // Assert
    expect(verifyMock).toHaveBeenCalledWith("access-token", "test-secret", { issuer: "car-rental-api", audience: "car-rental-client" }); expect(req.user).toEqual(decoded); expect(next).toHaveBeenCalledTimes(1); expect(res.status).not.toHaveBeenCalled();
  });

  test("returns 401 when token type is not access", () => {
    // Arrange
    const req = createRequest({ cookies: { access_token: "refresh-token" } }); const res = createResponse(); const next = jest.fn(); verifyMock.mockReturnValue({ token_type: "refresh" });
    // Act
    authMiddleware(req, res, next);
    // Assert
    expect(next).not.toHaveBeenCalled(); expect(res.status).toHaveBeenCalledWith(401); expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  test("returns 401 when JWT verification throws", () => {
    // Arrange
    const req = createRequest({ cookies: { access_token: "bad-token" } }); const res = createResponse(); const next = jest.fn(); verifyMock.mockImplementation(() => { throw new Error("invalid token"); });
    // Act
    authMiddleware(req, res, next);
    // Assert
    expect(next).not.toHaveBeenCalled(); expect(res.status).toHaveBeenCalledWith(401); expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });
});
