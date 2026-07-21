import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import path from "node:path";
import { createRequest, createResponse } from "../helpers/http.js";

const vehicleModelMock = {
  registerVehicle: jest.fn(),
  getAllVehicles: jest.fn(),
  getVehicleById: jest.fn(),
  getAllVehiclesAvailable: jest.fn(),
  updateVehicle: jest.fn(),
  removeVehicle: jest.fn(),
};

const redisMock = {
  isOpen: false,
  get: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
};

// ESM mocks must be registered before importing the module under test.
jest.unstable_mockModule("../../models/vehicleModel.js", () => ({
  default: vehicleModelMock,
}));

jest.unstable_mockModule("../../config/redisConfig.js", () => ({
  default: redisMock,
}));

const {
  registerVehicle,
  getAllVehicles,
  getVehicleById,
  getAllVehiclesAvailable,
  getVehicleImage,
  updateVehicle,
  removeVehicle,
} = await import("../../controllers/vehicleController.js");

describe("vehicleController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    redisMock.isOpen = false;
  });

  describe("registerVehicle", () => {
    test("creates a vehicle, invalidates the cache, and returns 201", async () => {
      // Arrange
      const req = createRequest({
        body: { brand: "BMW", model: "X5", color: "Black" },
        file: { filename: "bmw-x5.jpg" },
      });
      const res = createResponse();
      redisMock.isOpen = true;
      redisMock.del.mockResolvedValue(1);
      vehicleModelMock.registerVehicle.mockResolvedValue(undefined);

      // Act
      await registerVehicle(req, res);

      // Assert
      expect(vehicleModelMock.registerVehicle).toHaveBeenCalledTimes(1);
      expect(vehicleModelMock.registerVehicle).toHaveBeenCalledWith({
        brand: "BMW",
        model: "X5",
        color: "Black",
        file_name: "bmw-x5.jpg",
      });
      expect(redisMock.del).toHaveBeenCalledTimes(1);
      expect(redisMock.del).toHaveBeenCalledWith("vehicles:all");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Vehicle inserted successfully",
      });
    });

    test("uses null for file_name when no image is uploaded", async () => {
      // Arrange
      const req = createRequest({ body: { brand: "Audi", model: "A4" } });
      const res = createResponse();
      vehicleModelMock.registerVehicle.mockResolvedValue(undefined);

      // Act
      await registerVehicle(req, res);

      // Assert
      expect(vehicleModelMock.registerVehicle).toHaveBeenCalledWith({
        brand: "Audi",
        model: "A4",
        file_name: null,
      });
      expect(redisMock.del).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test("returns 500 and does not invalidate cache when creation fails", async () => {
      // Arrange
      const error = new Error("Database error");
      const req = createRequest({ body: { brand: "BMW" } });
      const res = createResponse();
      vehicleModelMock.registerVehicle.mockRejectedValue(error);

      // Act
      await registerVehicle(req, res);

      // Assert
      expect(redisMock.del).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("getAllVehicles", () => {
    test("returns cached vehicles and marks the response as a cache HIT", async () => {
      // Arrange
      const vehicles = [{ id: 1, brand: "Tesla", model: "Model 3" }];
      const req = createRequest();
      const res = createResponse();
      redisMock.isOpen = true;
      redisMock.get.mockResolvedValue(JSON.stringify(vehicles));

      // Act
      await getAllVehicles(req, res);

      // Assert
      expect(redisMock.get).toHaveBeenCalledTimes(1);
      expect(redisMock.get).toHaveBeenCalledWith("vehicles:all");
      expect(vehicleModelMock.getAllVehicles).not.toHaveBeenCalled();
      expect(redisMock.setEx).not.toHaveBeenCalled();
      expect(res.set).toHaveBeenCalledWith("X-Cache", "HIT");
      expect(res.json).toHaveBeenCalledWith(vehicles);
    });

    test("returns database vehicles, caches them, and marks response as MISS", async () => {
      // Arrange
      const vehicles = [{ id: 1, brand: "Audi" }, { id: 2, brand: "Mercedes" }];
      const req = createRequest();
      const res = createResponse();
      redisMock.isOpen = true;
      redisMock.get.mockResolvedValue(null);
      redisMock.setEx.mockResolvedValue("OK");
      vehicleModelMock.getAllVehicles.mockResolvedValue(vehicles);

      // Act
      await getAllVehicles(req, res);

      // Assert
      expect(redisMock.get).toHaveBeenCalledWith("vehicles:all");
      expect(vehicleModelMock.getAllVehicles).toHaveBeenCalledTimes(1);
      expect(redisMock.setEx).toHaveBeenCalledTimes(1);
      expect(redisMock.setEx).toHaveBeenCalledWith(
        "vehicles:all",
        300,
        JSON.stringify(vehicles),
      );
      expect(res.set).toHaveBeenCalledWith("X-Cache", "MISS");
      expect(res.json).toHaveBeenCalledWith(vehicles);
    });

    test("does not use Redis when it is closed", async () => {
      // Arrange
      const vehicles = [{ id: 1, brand: "Volkswagen" }];
      const req = createRequest();
      const res = createResponse();
      vehicleModelMock.getAllVehicles.mockResolvedValue(vehicles);

      // Act
      await getAllVehicles(req, res);

      // Assert
      expect(redisMock.get).not.toHaveBeenCalled();
      expect(redisMock.setEx).not.toHaveBeenCalled();
      expect(vehicleModelMock.getAllVehicles).toHaveBeenCalledTimes(1);
      expect(res.set).toHaveBeenCalledWith("X-Cache", "MISS");
      expect(res.json).toHaveBeenCalledWith(vehicles);
    });

    test("returns 500 when fetching vehicles fails", async () => {
      // Arrange
      const req = createRequest();
      const res = createResponse();
      vehicleModelMock.getAllVehicles.mockRejectedValue(
        new Error("Database unavailable"),
      );

      // Act
      await getAllVehicles(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database unavailable" });
    });
  });

  describe("getVehicleById", () => {
    test("returns the vehicle for the requested id", async () => {
      // Arrange
      const vehicle = { id: 5, brand: "Volkswagen", model: "Golf 7" };
      const req = createRequest({ params: { id: "5" } });
      const res = createResponse();
      vehicleModelMock.getVehicleById.mockResolvedValue(vehicle);

      // Act
      await getVehicleById(req, res);

      // Assert
      expect(vehicleModelMock.getVehicleById).toHaveBeenCalledTimes(1);
      expect(vehicleModelMock.getVehicleById).toHaveBeenCalledWith("5");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(vehicle);
    });

    test("returns 500 when fetching the vehicle fails", async () => {
      // Arrange
      const req = createRequest({ params: { id: "5" } });
      const res = createResponse();
      vehicleModelMock.getVehicleById.mockRejectedValue(
        new Error("Vehicle query failed"),
      );

      // Act
      await getVehicleById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Vehicle query failed" });
    });
  });

  describe("getAllVehiclesAvailable", () => {
    test("returns all available vehicles", async () => {
      // Arrange
      const vehicles = [{ id: 8, brand: "Toyota", available: true }];
      const req = createRequest();
      const res = createResponse();
      vehicleModelMock.getAllVehiclesAvailable.mockResolvedValue(vehicles);

      // Act
      await getAllVehiclesAvailable(req, res);

      // Assert
      expect(vehicleModelMock.getAllVehiclesAvailable).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(vehicles);
    });

    test("returns 500 when fetching available vehicles fails", async () => {
      // Arrange
      const req = createRequest();
      const res = createResponse();
      vehicleModelMock.getAllVehiclesAvailable.mockRejectedValue(
        new Error("Availability query failed"),
      );

      // Act
      await getAllVehiclesAvailable(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Availability query failed",
      });
    });
  });

  describe("getVehicleImage", () => {
    test("sends the requested image file", () => {
      // Arrange
      const filename = "car-image.jpg";
      const req = createRequest({ params: { filename } });
      const res = createResponse();
      const expectedPath = path.join(process.cwd(), "public", "uploads", filename);

      // Act
      getVehicleImage(req, res);

      // Assert
      expect(res.sendFile).toHaveBeenCalledTimes(1);
      expect(res.sendFile).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe("updateVehicle", () => {
    test("updates a vehicle with a new image and invalidates cache", async () => {
      // Arrange
      const updatedVehicle = { id: 4, brand: "BMW", file_name: "new-bmw.jpg" };
      const req = createRequest({
        params: { id: "4" },
        body: { brand: "BMW" },
        file: { filename: "new-bmw.jpg" },
      });
      const res = createResponse();
      redisMock.isOpen = true;
      redisMock.del.mockResolvedValue(1);
      vehicleModelMock.updateVehicle.mockResolvedValue(updatedVehicle);

      // Act
      await updateVehicle(req, res);

      // Assert
      expect(vehicleModelMock.updateVehicle).toHaveBeenCalledTimes(1);
      expect(vehicleModelMock.updateVehicle).toHaveBeenCalledWith("4", {
        brand: "BMW",
        file_name: "new-bmw.jpg",
      });
      expect(redisMock.del).toHaveBeenCalledWith("vehicles:all");
      expect(res.json).toHaveBeenCalledWith(updatedVehicle);
    });

    test("does not add file_name when no new image is uploaded", async () => {
      // Arrange
      const req = createRequest({ params: { id: "4" }, body: { color: "Blue" } });
      const res = createResponse();
      vehicleModelMock.updateVehicle.mockResolvedValue({ id: 4, color: "Blue" });

      // Act
      await updateVehicle(req, res);

      // Assert
      expect(vehicleModelMock.updateVehicle).toHaveBeenCalledWith("4", {
        color: "Blue",
      });
      expect(redisMock.del).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ id: 4, color: "Blue" });
    });

    test("returns 500 and does not invalidate cache when update fails", async () => {
      // Arrange
      const req = createRequest({ params: { id: "4" }, body: { color: "Blue" } });
      const res = createResponse();
      vehicleModelMock.updateVehicle.mockRejectedValue(new Error("Update failed"));

      // Act
      await updateVehicle(req, res);

      // Assert
      expect(redisMock.del).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Update failed" });
    });
  });

  describe("removeVehicle", () => {
    test("removes a vehicle, invalidates cache, and returns 204", async () => {
      // Arrange
      const removedVehicle = { id: 3, brand: "Ford" };
      const req = createRequest({ params: { id: "3" } });
      const res = createResponse();
      redisMock.isOpen = true;
      redisMock.del.mockResolvedValue(1);
      vehicleModelMock.removeVehicle.mockResolvedValue(removedVehicle);

      // Act
      await removeVehicle(req, res);

      // Assert
      expect(vehicleModelMock.removeVehicle).toHaveBeenCalledTimes(1);
      expect(vehicleModelMock.removeVehicle).toHaveBeenCalledWith("3");
      expect(redisMock.del).toHaveBeenCalledWith("vehicles:all");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith(removedVehicle);
    });

    test("returns 500 and does not invalidate cache when deletion fails", async () => {
      // Arrange
      const req = createRequest({ params: { id: "3" } });
      const res = createResponse();
      vehicleModelMock.removeVehicle.mockRejectedValue(new Error("Delete failed"));

      // Act
      await removeVehicle(req, res);

      // Assert
      expect(redisMock.del).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Delete failed" });
    });
  });
});
