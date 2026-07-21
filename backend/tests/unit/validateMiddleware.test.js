import { describe, expect, jest, test } from "@jest/globals";
import { validate } from "../../middleware/validate.js";
import { createRequest, createResponse } from "../helpers/http.js";

describe("validate middleware", () => {
  test("replaces req.body with parsed data and calls next for valid input", () => {
    // Arrange
    const parsedData = { amount: 10 };
    const schema = { safeParse: jest.fn().mockReturnValue({ success: true, data: parsedData }) };
    const req = createRequest({ body: { amount: "10" } }); const res = createResponse(); const next = jest.fn();
    // Act
    validate(schema)(req, res, next);
    // Assert
    expect(schema.safeParse).toHaveBeenCalledWith({ amount: "10" }); expect(req.body).toEqual(parsedData); expect(next).toHaveBeenCalledTimes(1); expect(res.status).not.toHaveBeenCalled();
  });

  test("returns 400 and does not call next for invalid input", () => {
    // Arrange
    const schema = { safeParse: jest.fn().mockReturnValue({ success: false, error: { issues: [{ path: ["email"], message: "Invalid email" }] } }) };
    const log = { warn: jest.fn() }; const req = createRequest({ body: { email: "bad" }, log }); const res = createResponse(); const next = jest.fn();
    // Act
    validate(schema)(req, res, next);
    // Assert
    expect(log.warn).toHaveBeenCalledTimes(1); expect(next).not.toHaveBeenCalled(); expect(res.status).toHaveBeenCalledWith(400); expect(res.json).toHaveBeenCalledWith({ message: "Please check the data." });
  });
});
