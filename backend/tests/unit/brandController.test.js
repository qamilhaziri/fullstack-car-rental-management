import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const brandModelMock = { getAllBrands: jest.fn(), registerBrand: jest.fn() };
const redisMock = { isOpen: false, get: jest.fn(), setEx: jest.fn(), del: jest.fn() };

jest.unstable_mockModule("../../models/brandModel.js", () => ({ default: brandModelMock }));
jest.unstable_mockModule("../../config/redisConfig.js", () => ({ default: redisMock }));

const { getAllBrands, registerBrand } = await import("../../controllers/brandController.js");

describe("brandController", () => {
  beforeEach(() => { jest.resetAllMocks(); redisMock.isOpen = false; });

  test("returns cached brands with an X-Cache HIT header", async () => {
    // Arrange
    const brands = [{ brand_id: 1, brand: "BMW" }];
    const req = createRequest(); const res = createResponse();
    redisMock.isOpen = true; redisMock.get.mockResolvedValue(JSON.stringify(brands));
    // Act
    await getAllBrands(req, res);
    // Assert
    expect(redisMock.get).toHaveBeenCalledWith("brands:all");
    expect(brandModelMock.getAllBrands).not.toHaveBeenCalled();
    expect(res.set).toHaveBeenCalledWith("X-Cache", "HIT");
    expect(res.json).toHaveBeenCalledWith(brands);
  });

  test("reads, caches, and returns brands after a cache miss", async () => {
    // Arrange
    const brands = [{ brand_id: 1, brand: "BMW" }];
    const req = createRequest(); const res = createResponse();
    redisMock.isOpen = true; redisMock.get.mockResolvedValue(null);
    brandModelMock.getAllBrands.mockResolvedValue(brands); redisMock.setEx.mockResolvedValue("OK");
    // Act
    await getAllBrands(req, res);
    // Assert
    expect(brandModelMock.getAllBrands).toHaveBeenCalledTimes(1);
    expect(redisMock.setEx).toHaveBeenCalledWith("brands:all", 3600, JSON.stringify(brands));
    expect(res.set).toHaveBeenCalledWith("X-Cache", "MISS");
    expect(res.json).toHaveBeenCalledWith(brands);
  });

  test("creates a brand and invalidates cache", async () => {
    // Arrange
    const brand = { brand_id: 1, brand: "BMW" }; const req = createRequest({ body: brand }); const res = createResponse();
    redisMock.isOpen = true; brandModelMock.registerBrand.mockResolvedValue(brand); redisMock.del.mockResolvedValue(1);
    // Act
    await registerBrand(req, res);
    // Assert
    expect(brandModelMock.registerBrand).toHaveBeenCalledWith(brand);
    expect(redisMock.del).toHaveBeenCalledWith("brands:all");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Brand inserted successfully", brand });
  });

  test("returns 500 when a dependency rejects", async () => {
    // Arrange
    const req = createRequest(); const res = createResponse();
    brandModelMock.getAllBrands.mockRejectedValue(new Error("Brand query failed"));
    // Act
    await getAllBrands(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Brand query failed" });
  });
});
