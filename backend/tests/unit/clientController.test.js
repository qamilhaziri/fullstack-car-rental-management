import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const clientModelMock = { registerClient: jest.fn(), getAllClients: jest.fn(), getClientById: jest.fn(), updateClient: jest.fn(), removeClient: jest.fn() };
const redisMock = { isOpen: false, get: jest.fn(), setEx: jest.fn(), del: jest.fn() };
jest.unstable_mockModule("../../models/clientModel.js", () => ({ default: clientModelMock }));
jest.unstable_mockModule("../../config/redisConfig.js", () => ({ default: redisMock }));
const { registerClient, getAllClients, getClientById, updateClient, removeClient } = await import("../../controllers/clientController.js");

describe("clientController", () => {
  beforeEach(() => { jest.resetAllMocks(); redisMock.isOpen = false; });

  test("registers a client and invalidates the collection cache", async () => {
    // Arrange
    const data = { client_name: "Ana" }; const req = createRequest({ body: data }); const res = createResponse();
    redisMock.isOpen = true; clientModelMock.registerClient.mockResolvedValue(undefined); redisMock.del.mockResolvedValue(1);
    // Act
    await registerClient(req, res);
    // Assert
    expect(clientModelMock.registerClient).toHaveBeenCalledWith(data);
    expect(redisMock.del).toHaveBeenCalledWith(["clients:all"]);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "client inserted successfully" });
  });

  test("returns all cached clients without querying the model", async () => {
    // Arrange
    const clients = [{ client_id: 1 }]; const req = createRequest(); const res = createResponse();
    redisMock.isOpen = true; redisMock.get.mockResolvedValue(JSON.stringify(clients));
    // Act
    await getAllClients(req, res);
    // Assert
    expect(redisMock.get).toHaveBeenCalledWith("clients:all");
    expect(clientModelMock.getAllClients).not.toHaveBeenCalled();
    expect(res.set).toHaveBeenCalledWith("X-Cache", "HIT"); expect(res.json).toHaveBeenCalledWith(clients);
  });

  test("queries and caches all clients after a cache miss", async () => {
    // Arrange
    const clients = [{ client_id: 1 }]; const req = createRequest(); const res = createResponse();
    redisMock.isOpen = true; redisMock.get.mockResolvedValue(null); clientModelMock.getAllClients.mockResolvedValue(clients); redisMock.setEx.mockResolvedValue("OK");
    // Act
    await getAllClients(req, res);
    // Assert
    expect(clientModelMock.getAllClients).toHaveBeenCalledTimes(1);
    expect(redisMock.setEx).toHaveBeenCalledWith("clients:all", 300, JSON.stringify(clients));
    expect(res.set).toHaveBeenCalledWith("X-Cache", "MISS"); expect(res.json).toHaveBeenCalledWith(clients);
  });

  test("returns a client cache hit by id", async () => {
    // Arrange
    const client = { client_id: 4 }; const req = createRequest({ params: { id: "4" } }); const res = createResponse();
    redisMock.isOpen = true; redisMock.get.mockResolvedValue(JSON.stringify(client));
    // Act
    await getClientById(req, res);
    // Assert
    expect(redisMock.get).toHaveBeenCalledWith("clients:4"); expect(clientModelMock.getClientById).not.toHaveBeenCalled();
    expect(res.set).toHaveBeenCalledWith("X-Cache", "HIT"); expect(res.json).toHaveBeenCalledWith(client);
  });

  test("returns 404 when the requested client does not exist", async () => {
    // Arrange
    const req = createRequest({ params: { id: "4" } }); const res = createResponse(); clientModelMock.getClientById.mockResolvedValue(null);
    // Act
    await getClientById(req, res);
    // Assert
    expect(clientModelMock.getClientById).toHaveBeenCalledWith("4"); expect(res.status).toHaveBeenCalledWith(404); expect(res.json).toHaveBeenCalledWith({ message: "Client not found" });
  });

  test("updates a client and invalidates its list and item caches", async () => {
    // Arrange
    const data = { city: "Prishtina" }; const client = { client_id: 4, ...data }; const req = createRequest({ params: { id: "4" }, body: data }); const res = createResponse();
    redisMock.isOpen = true; clientModelMock.updateClient.mockResolvedValue(client); redisMock.del.mockResolvedValue(2);
    // Act
    await updateClient(req, res);
    // Assert
    expect(clientModelMock.updateClient).toHaveBeenCalledWith("4", data); expect(redisMock.del).toHaveBeenCalledWith(["clients:all", "clients:4"]); expect(res.json).toHaveBeenCalledWith(client);
  });

  test("removes a client and invalidates its caches", async () => {
    // Arrange
    const client = { client_id: 4 }; const req = createRequest({ params: { id: "4" } }); const res = createResponse();
    redisMock.isOpen = true; clientModelMock.removeClient.mockResolvedValue(client); redisMock.del.mockResolvedValue(2);
    // Act
    await removeClient(req, res);
    // Assert
    expect(clientModelMock.removeClient).toHaveBeenCalledWith("4"); expect(redisMock.del).toHaveBeenCalledWith(["clients:all", "clients:4"]); expect(res.status).toHaveBeenCalledWith(204); expect(res.json).toHaveBeenCalledWith(client);
  });

  test("returns 500 when a client dependency rejects", async () => {
    // Arrange
    const req = createRequest(); const res = createResponse(); clientModelMock.getAllClients.mockRejectedValue(new Error("Client query failed"));
    // Act
    await getAllClients(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(500); expect(res.json).toHaveBeenCalledWith({ error: "Client query failed" });
  });
});
