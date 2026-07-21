import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const vehicleCostModelMock = { registerVehicleCost: jest.fn(), getVehicleCostById: jest.fn(), updateVehicleCost: jest.fn(), removeVehicleCost: jest.fn() };
const redisMock = { isOpen: false, get: jest.fn(), setEx: jest.fn(), del: jest.fn() };
jest.unstable_mockModule("../../models/vehicleCostModel.js", () => ({ default: vehicleCostModelMock }));
jest.unstable_mockModule("../../config/redisConfig.js", () => ({ default: redisMock }));
const { registerVehicleCost, getVehicleCostById, updateVehicleCost, removeVehicleCost } = await import("../../controllers/vehicleCostController.js");

describe("vehicleCostController", () => {
  beforeEach(() => { jest.resetAllMocks(); redisMock.isOpen = false; });

  test("registers a vehicle cost and returns it with 201", async () => {
    // Arrange
    const cost = { cost_per_hour: 5, cost_per_day: 50 }; const req = createRequest({ body: cost }); const res = createResponse();
    vehicleCostModelMock.registerVehicleCost.mockResolvedValue(cost);
    // Act
    await registerVehicleCost(req, res);
    // Assert
    expect(vehicleCostModelMock.registerVehicleCost).toHaveBeenCalledWith(cost); expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Vehicle cost inserted successfully", cost });
  });

  test("returns cached cost on cache HIT", async () => {
    // Arrange
    const cost = { cost_id: 5 }; const req = createRequest({ params: { id: "5" } }); const res = createResponse();
    redisMock.isOpen = true; redisMock.get.mockResolvedValue(JSON.stringify(cost));
    // Act
    await getVehicleCostById(req, res);
    // Assert
    expect(redisMock.get).toHaveBeenCalledWith("vehicle-costs:5"); expect(vehicleCostModelMock.getVehicleCostById).not.toHaveBeenCalled();
    expect(res.set).toHaveBeenCalledWith("X-Cache", "HIT"); expect(res.json).toHaveBeenCalledWith(cost);
  });

  test("queries and caches vehicle cost after cache MISS", async () => {
    // Arrange
    const cost = { cost_id: 5 }; const req = createRequest({ params: { id: "5" } }); const res = createResponse();
    redisMock.isOpen = true; redisMock.get.mockResolvedValue(null); redisMock.setEx.mockResolvedValue("OK"); vehicleCostModelMock.getVehicleCostById.mockResolvedValue(cost);
    // Act
    await getVehicleCostById(req, res);
    // Assert
    expect(vehicleCostModelMock.getVehicleCostById).toHaveBeenCalledWith("5"); expect(redisMock.setEx).toHaveBeenCalledWith("vehicle-costs:5", 600, JSON.stringify(cost));
    expect(res.set).toHaveBeenCalledWith("X-Cache", "MISS"); expect(res.json).toHaveBeenCalledWith(cost);
  });

  test("updates a cost and invalidates its vehicle and list caches", async () => {
    // Arrange
    const data = { cost_per_day: 60 }; const cost = { cost_id: 5, ...data }; const req = createRequest({ params: { id: "5" }, body: data }); const res = createResponse();
    redisMock.isOpen = true; redisMock.del.mockResolvedValue(2); vehicleCostModelMock.updateVehicleCost.mockResolvedValue(cost);
    // Act
    await updateVehicleCost(req, res);
    // Assert
    expect(vehicleCostModelMock.updateVehicleCost).toHaveBeenCalledWith("5", data); expect(redisMock.del).toHaveBeenCalledWith(["vehicle-costs:5", "vehicles:all"]); expect(res.json).toHaveBeenCalledWith(cost);
  });

  test("removes a cost, invalidates cache, and returns controller's 204 response", async () => {
    // Arrange
    const cost = { cost_id: 5 }; const req = createRequest({ params: { id: "5" } }); const res = createResponse();
    redisMock.isOpen = true; redisMock.del.mockResolvedValue(2); vehicleCostModelMock.removeVehicleCost.mockResolvedValue(cost);
    // Act
    await removeVehicleCost(req, res);
    // Assert
    expect(vehicleCostModelMock.removeVehicleCost).toHaveBeenCalledWith("5"); expect(redisMock.del).toHaveBeenCalledWith(["vehicle-costs:5", "vehicles:all"]); expect(res.status).toHaveBeenCalledWith(204); expect(res.json).toHaveBeenCalledWith(cost);
  });

  test("returns 500 when a dependency rejects", async () => {
    // Arrange
    const req = createRequest({ params: { id: "5" } }); const res = createResponse(); vehicleCostModelMock.getVehicleCostById.mockRejectedValue(new Error("Cost query failed"));
    // Act
    await getVehicleCostById(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(500); expect(res.json).toHaveBeenCalledWith({ error: "Cost query failed" });
  });
});
