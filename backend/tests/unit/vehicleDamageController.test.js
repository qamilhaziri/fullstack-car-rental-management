import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const model = { registerVehicleDamage: jest.fn(), getDamageByVehicleId: jest.fn(), getDamageByClientId: jest.fn(), getVehicleDamageById: jest.fn(), updateVehicleDamage: jest.fn(), removeVehicleDamage: jest.fn() };
const redis = { isOpen: false, get: jest.fn(), setEx: jest.fn(), del: jest.fn() };
jest.unstable_mockModule("../../models/vehicleDamageModel.js", () => ({ default: model }));
jest.unstable_mockModule("../../config/redisConfig.js", () => ({ default: redis }));
const { registerVehicleDamage, getDamageByVehicleId, getDamageByClientId, updateVehicleDamage, removeVehicleDamage } = await import("../../controllers/vehicleDamageController.js");

describe("vehicleDamageController", () => {
  beforeEach(() => { jest.resetAllMocks(); redis.isOpen = false; });

  test("registers damage and invalidates matching vehicle and client cache entries", async () => {
    // Arrange
    const data = { vehicle_id: 2, client_id: 7, damage: "Scratch" }; const req = createRequest({ body: data }); const res = createResponse(); redis.isOpen = true;
    model.registerVehicleDamage.mockResolvedValue(undefined); redis.del.mockResolvedValue(2);
    // Act
    await registerVehicleDamage(req, res);
    // Assert
    expect(model.registerVehicleDamage).toHaveBeenCalledWith(data); expect(redis.del).toHaveBeenCalledWith(["vehicle-damages:vehicle:2", "vehicle-damages:client:7"]); expect(res.status).toHaveBeenCalledWith(201);
  });

  test.each([
    ["vehicle", getDamageByVehicleId, "getDamageByVehicleId", "vehicle-damages:vehicle:2"],
    ["client", getDamageByClientId, "getDamageByClientId", "vehicle-damages:client:7"],
  ])("returns cached damage by %s without querying model", async (_, handler, method, key) => {
    // Arrange
    const result = [{ damage: "Scratch" }]; const id = key.endsWith(":2") ? "2" : "7"; const req = createRequest({ params: { id } }); const res = createResponse(); redis.isOpen = true; redis.get.mockResolvedValue(JSON.stringify(result));
    // Act
    await handler(req, res);
    // Assert
    expect(redis.get).toHaveBeenCalledWith(key); expect(model[method]).not.toHaveBeenCalled(); expect(res.set).toHaveBeenCalledWith("X-Cache", "HIT"); expect(res.json).toHaveBeenCalledWith(result);
  });

  test("updates damage and invalidates old and new ownership cache keys", async () => {
    // Arrange
    const req = createRequest({ params: { id: "1" }, body: { client_id: 8, vehicle_id: 3 } }); const res = createResponse(); redis.isOpen = true;
    model.getVehicleDamageById.mockResolvedValue({ client_id: 7, vehicle_id: 2 }); model.updateVehicleDamage.mockResolvedValue([{ client_id: 8, vehicle_id: 3 }]); redis.del.mockResolvedValue(2);
    // Act
    await updateVehicleDamage(req, res);
    // Assert
    expect(model.getVehicleDamageById).toHaveBeenCalledWith("1"); expect(model.updateVehicleDamage).toHaveBeenCalledWith("1", { client_id: 8, vehicle_id: 3 });
    expect(redis.del).toHaveBeenNthCalledWith(1, ["vehicle-damages:vehicle:2", "vehicle-damages:client:7"]); expect(redis.del).toHaveBeenNthCalledWith(2, ["vehicle-damages:vehicle:3", "vehicle-damages:client:8"]);
    expect(res.json).toHaveBeenCalledWith([{ client_id: 8, vehicle_id: 3 }]);
  });

  test("removes damage and invalidates its owner cache keys", async () => {
    // Arrange
    const damage = [{ client_id: 7, vehicle_id: 2 }]; const req = createRequest({ params: { id: "1" } }); const res = createResponse(); redis.isOpen = true;
    model.removeVehicleDamage.mockResolvedValue(damage); redis.del.mockResolvedValue(2);
    // Act
    await removeVehicleDamage(req, res);
    // Assert
    expect(model.removeVehicleDamage).toHaveBeenCalledWith("1"); expect(redis.del).toHaveBeenCalledWith(["vehicle-damages:vehicle:2", "vehicle-damages:client:7"]); expect(res.status).toHaveBeenCalledWith(204); expect(res.json).toHaveBeenCalledWith(damage);
  });

  test("returns 500 when fetching damage fails", async () => {
    // Arrange
    const req = createRequest({ params: { id: "2" } }); const res = createResponse(); model.getDamageByVehicleId.mockRejectedValue(new Error("Damage query failed"));
    // Act
    await getDamageByVehicleId(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(500); expect(res.json).toHaveBeenCalledWith({ error: "Damage query failed" });
  });
});
