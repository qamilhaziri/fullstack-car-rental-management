import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const model = { registerVehicleMaintenance: jest.fn(), getAllMaintenanceByVehicleId: jest.fn(), getVehicleMaintenanceById: jest.fn(), updateVehicleMaintenance: jest.fn(), removeVehicleMaintenance: jest.fn() };
const redis = { isOpen: false, get: jest.fn(), setEx: jest.fn(), del: jest.fn() };
jest.unstable_mockModule("../../models/vehicleMaintenanceModel.js", () => ({ default: model }));
jest.unstable_mockModule("../../config/redisConfig.js", () => ({ default: redis }));
const { registerVehicleMaintenance, getAllMaintenanceByVehicleId, updateVehicleMaintenance, removeVehicleMaintenance } = await import("../../controllers/vehicleMaintenanceController.js");

describe("vehicleMaintenanceController", () => {
  beforeEach(() => { jest.resetAllMocks(); redis.isOpen = false; });

  test("registers maintenance for route vehicle id and invalidates its cache", async () => {
    // Arrange
    const data = { service_type: "Oil" }; const req = createRequest({ params: { id: "8" }, body: data }); const res = createResponse();
    redis.isOpen = true; model.registerVehicleMaintenance.mockResolvedValue([]); redis.del.mockResolvedValue(1);
    // Act
    await registerVehicleMaintenance(req, res);
    // Assert
    expect(model.registerVehicleMaintenance).toHaveBeenCalledWith("8", data); expect(redis.del).toHaveBeenCalledWith("vehicle-maintenances:vehicle:8"); expect(res.status).toHaveBeenCalledWith(201);
  });

  test("returns cached maintenance without querying model", async () => {
    // Arrange
    const list = [{ vmaintenance_id: 2 }]; const req = createRequest({ params: { id: "8" } }); const res = createResponse(); redis.isOpen = true; redis.get.mockResolvedValue(JSON.stringify(list));
    // Act
    await getAllMaintenanceByVehicleId(req, res);
    // Assert
    expect(redis.get).toHaveBeenCalledWith("vehicle-maintenances:vehicle:8"); expect(model.getAllMaintenanceByVehicleId).not.toHaveBeenCalled(); expect(res.set).toHaveBeenCalledWith("X-Cache", "HIT"); expect(res.json).toHaveBeenCalledWith(list);
  });

  test("updates maintenance and invalidates both old and new vehicle cache keys", async () => {
    // Arrange
    const req = createRequest({ params: { id: "2" }, body: { service_cost: 40 } }); const res = createResponse(); redis.isOpen = true;
    model.getVehicleMaintenanceById.mockResolvedValue({ vehicle_id: 8 }); model.updateVehicleMaintenance.mockResolvedValue([{ vehicle_id: 9 }]); redis.del.mockResolvedValue(1);
    // Act
    await updateVehicleMaintenance(req, res);
    // Assert
    expect(model.updateVehicleMaintenance).toHaveBeenCalledWith("2", { service_cost: 40 }); expect(redis.del).toHaveBeenNthCalledWith(1, "vehicle-maintenances:vehicle:8"); expect(redis.del).toHaveBeenNthCalledWith(2, "vehicle-maintenances:vehicle:9"); expect(res.json).toHaveBeenCalledWith([{ vehicle_id: 9 }]);
  });

  test("returns 500 when a maintenance dependency rejects", async () => {
    // Arrange
    const req = createRequest({ params: { id: "8" } }); const res = createResponse(); model.getAllMaintenanceByVehicleId.mockRejectedValue(new Error("Maintenance query failed"));
    // Act
    await getAllMaintenanceByVehicleId(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(500); expect(res.json).toHaveBeenCalledWith({ error: "Maintenance query failed" });
  });

  test("removes maintenance and invalidates its vehicle cache", async () => {
    // Arrange
    const maintenances = [{ vehicle_id: 8 }]; const req = createRequest({ params: { id: "2" } }); const res = createResponse(); redis.isOpen = true;
    model.removeVehicleMaintenance.mockResolvedValue(maintenances); redis.del.mockResolvedValue(1);
    // Act
    await removeVehicleMaintenance(req, res);
    // Assert
    expect(model.removeVehicleMaintenance).toHaveBeenCalledWith("2"); expect(redis.del).toHaveBeenCalledWith("vehicle-maintenances:vehicle:8"); expect(res.status).toHaveBeenCalledWith(204); expect(res.json).toHaveBeenCalledWith(maintenances);
  });
});
