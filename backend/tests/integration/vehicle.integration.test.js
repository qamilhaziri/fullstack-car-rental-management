import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import path from "node:path";

let container;
let db;
let app;
let accessToken;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine").start();
  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = String(container.getPort());
  process.env.DB_NAME = container.getDatabase();
  process.env.DB_USER = container.getUsername();
  process.env.DB_PASSWORD = container.getPassword();
  process.env.JWT_SECRET = "vehicle-integration-secret";
  process.env.CLIENT_URL = "http://localhost:5173";

  ({ default: db } = await import("../../config/dbConfig.js"));
  await db.migrate.latest({ directory: path.resolve(process.cwd(), "migrations") });

  const [brand] = await db("brand").insert({ brand: "Toyota" }).returning("brand_id");
  const [cost] = await db("vehicle_cost")
    .insert({ cost_per_hour: 10, cost_per_day: 80 })
    .returning("vcost_id");

  accessToken = jwt.sign(
    { user_id: 1, fullName: "Integration Admin", token_type: "access" },
    process.env.JWT_SECRET,
    { issuer: "car-rental-api", audience: "car-rental-client", expiresIn: "10m" },
  );

  app = (await import("../../app.js")).default;
  app.locals.vehicleFixture = { brandId: brand.brand_id, costId: cost.vcost_id };
}, 120_000);

afterAll(async () => {
  await db?.destroy();
  await container?.stop();
});

describe("vehicle integration", () => {
  test("creates a vehicle and returns it from the list with brand and cost data", async () => {
    // Arrange
    const payload = {
      brand_id: app.locals.vehicleFixture.brandId,
      cost_id: app.locals.vehicleFixture.costId,
      model: "Corolla",
      vehicle_type: "Sedan",
      transmission: "Automatic",
      color: "White",
      doors: 4,
      production_year: "2024-01-01",
      fuel_type: "Hybrid",
    };

    // Act
    const createResponse = await request(app)
      .post("/api/vehicles")
      .set("Cookie", [`access_token=${accessToken}`])
      .send(payload);
    const listResponse = await request(app)
      .get("/api/vehicles")
      .set("Cookie", [`access_token=${accessToken}`]);

    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toEqual({ message: "Vehicle inserted successfully" });
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          model: "Corolla",
          brand: "Toyota",
          cost_per_hour: "10.00",
          cost_per_day: "80.00",
        }),
      ]),
    );
  });
});
