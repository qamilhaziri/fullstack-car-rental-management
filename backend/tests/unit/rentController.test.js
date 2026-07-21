import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const rentModelMock = {
  registerRent: jest.fn(),
  getRentById: jest.fn(),
  getRentsByClientId: jest.fn(),
  getRentsByVehicleId: jest.fn(),
  getRentsAllData: jest.fn(),
  updateRent: jest.fn(),
  removeRent: jest.fn(),
};

jest.unstable_mockModule("../../models/rentModel.js", () => ({ default: rentModelMock }));

const {
  registerRent,
  getRentById,
  getRentsByClientId,
  getRentsByVehicleId,
  getRentsAllData,
  updateRent,
  removeRent,
} = await import("../../controllers/rentController.js");

describe("rentController", () => {
  beforeEach(() => jest.resetAllMocks());

  test("registerRent persists the request body and returns 201", async () => {
    // Arrange
    const data = { vehicle_id: 2, client_id: 7 };
    const req = createRequest({ body: data });
    const res = createResponse();
    rentModelMock.registerRent.mockResolvedValue(undefined);

    // Act
    await registerRent(req, res);

    // Assert
    expect(rentModelMock.registerRent).toHaveBeenCalledWith(data);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Rent inserted successfully" });
  });

  test.each([
    ["getRentById", getRentById, "getRentById", "9", { rent_id: 9 }],
    ["getRentsByClientId", getRentsByClientId, "getRentsByClientId", "7", [{ rent_id: 9 }]],
    ["getRentsByVehicleId", getRentsByVehicleId, "getRentsByVehicleId", "2", [{ rent_id: 9 }]],
  ])("%s forwards the route id and returns model data", async (_, handler, modelMethod, id, result) => {
    // Arrange
    const req = createRequest({ params: { id } });
    const res = createResponse();
    rentModelMock[modelMethod].mockResolvedValue(result);

    // Act
    await handler(req, res);

    // Assert
    expect(rentModelMock[modelMethod]).toHaveBeenCalledTimes(1);
    expect(rentModelMock[modelMethod]).toHaveBeenCalledWith(id);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  test("getRentsAllData returns all model data", async () => {
    // Arrange
    const rents = [{ rent_id: 9 }];
    const req = createRequest();
    const res = createResponse();
    rentModelMock.getRentsAllData.mockResolvedValue(rents);

    // Act
    await getRentsAllData(req, res);

    // Assert
    expect(rentModelMock.getRentsAllData).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(rents);
  });

  test("updateRent forwards id and body and returns updated data", async () => {
    // Arrange
    const data = { is_returned: true };
    const updatedRent = { rent_id: 9, ...data };
    const req = createRequest({ params: { id: "9" }, body: data });
    const res = createResponse();
    rentModelMock.updateRent.mockResolvedValue(updatedRent);

    // Act
    await updateRent(req, res);

    // Assert
    expect(rentModelMock.updateRent).toHaveBeenCalledWith("9", data);
    expect(res.json).toHaveBeenCalledWith(updatedRent);
  });

  test("removeRent forwards id and returns the controller's 204 response", async () => {
    // Arrange
    const removedRent = { rent_id: 9 };
    const req = createRequest({ params: { id: "9" } });
    const res = createResponse();
    rentModelMock.removeRent.mockResolvedValue(removedRent);

    // Act
    await removeRent(req, res);

    // Assert
    expect(rentModelMock.removeRent).toHaveBeenCalledWith("9");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith(removedRent);
  });

  test("returns 500 when a model operation rejects", async () => {
    // Arrange
    const req = createRequest({ body: { vehicle_id: 2 } });
    const res = createResponse();
    rentModelMock.registerRent.mockRejectedValue(new Error("Rent database error"));

    // Act
    await registerRent(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Rent database error" });
  });
});
