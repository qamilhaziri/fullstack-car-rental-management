import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { RedisContainer } from "@testcontainers/redis";
import path from "node:path";
import {
  configurePostgresEnvironment,
  getContainerHost,
  runIntegrationSetup,
} from "../helpers/testContainerEnv.js";



let container;
let redisContainer;
let db;
let app;
let redis;
let connectRedis;
let clientId;

const clientPayload = {
  client_name: "Arta",
  client_surname: "Krasniqi",
  personal_number: "1234567890",
  gender: "Female",
  city: "Prishtina",
  email: "arta.krasniqi@example.com",
  date_of_birth: "1998-05-10",
  phone_number: "+38344111222",
  nationality: "Kosovare",
};

const createAccessToken = () =>
  jwt.sign(
    { user_id: 1, fullName: "Integration Admin", token_type: "access" },
    process.env.JWT_SECRET,
    {
      issuer: "car-rental-api",
      audience: "car-rental-client",
      expiresIn: "10m",
    },
  );

beforeAll(async () => {
  await runIntegrationSetup("Client", async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine").start();
  redisContainer = await new RedisContainer("redis:7.2").withExposedPorts(6379).start();

  // dbConfig reads these values when it is dynamically imported below.
  configurePostgresEnvironment(container);
  process.env.JWT_SECRET = "integration-test-secret";
  process.env.CLIENT_URL = "http://localhost:5173";
  process.env.REDIS_URL = `redis://${getContainerHost(redisContainer)}:${redisContainer.getMappedPort(6379)}`;

  ({ default: db } = await import("../../config/dbConfig.js"));

  await db.migrate.latest({
    directory: path.resolve(process.cwd(), "migrations"),
  });

  ({ default: app } = await import("../../app.js"));
  ({ default: redis, connectRedis } =
    await import("../../config/redisConfig.js"));

  await connectRedis();
  });
}, 120_000);

afterAll(async () => {
  await db?.destroy();
  await container?.stop();
  await redis?.quit();
  await redisContainer?.stop();
});

describe("/api/clients", () => {
  test("rejects requests without an access token", async () => {
    // Act
    const response = await request(app).get("/api/clients");

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });

  test("creates a client in PostgreSQL and returns 201", async () => {
    // Arrange
    const accessToken = createAccessToken();

    // Act
    const response = await request(app)
      .post("/api/clients")
      .set("Cookie", [`access_token=${accessToken}`])
      .send(clientPayload);

    const cachedClients = await redis.get(`clients:all`)

    // Assert: HTTP response
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "client inserted successfully",
    });
    expect(cachedClients).toBeNull();

    // Assert: real persistence in the Testcontainers PostgreSQL database.
    const savedClient = await db("client")
      .where({ email: clientPayload.email })
      .first();

    clientId = savedClient.client_id
      expect(savedClient).toEqual(
      expect.objectContaining({...clientPayload, date_of_birth: expect.any(Date),}),
    );
  });

  test("rejects an invalid client before it reaches PostgreSQL", async () => {
    // Arrange
    const accessToken = createAccessToken();
    const invalidPayload = {
      ...clientPayload,
      email: "not-an-email",
      personal_number: "9876543210",
    };

    // Act
    const response = await request(app)
      .post("/api/clients")
      .set("Cookie", [`access_token=${accessToken}`])
      .send(invalidPayload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Please check the data." });

    const savedClient = await db("client")
      .where({ personal_number: invalidPayload.personal_number })
      .first();

    expect(savedClient).toBeUndefined();
  });

  test("returns clients from database when cache is empty", async () => {
      const accessToken = createAccessToken();

      const response = await request(app)
                      .get("/api/clients/")
                      .set("Cookie",[`access_token=${accessToken}`])
      
      expect(response.status).toBe(200)
      expect(response.headers["x-cache"]).toBe("MISS")
      expect(response.body).toHaveLength(1)
  })

  test("returns clients from redis cache", async () => {
      const accessToken = createAccessToken();

      await request(app).get("/api/clients/").set("Cookie",[`access_token=${accessToken}`])

      const response = await request(app)
                      .get("/api/clients/")
                      .set("Cookie",[`access_token=${accessToken}`])
      
      expect(response.status).toBe(200)
      expect(response.headers["x-cache"]).toBe("HIT")
      expect(response.body).toHaveLength(1)
  })

    test("returns clients from database when cache is empty with id", async () => {
      const accessToken = createAccessToken();

      const response = await request(app)
                      .get(`/api/clients/${clientId}`)
                      .set("Cookie",[`access_token=${accessToken}`])
      
      expect(response.status).toBe(200)
      expect(response.headers["x-cache"]).toBe("MISS")
      expect(response.body).toBeDefined();
  })

  test("updates some client data", async () => {
    const accessToken = createAccessToken();

    const response = await request(app)
                      .patch(`/api/clients/${clientId}`)
                      .set("Cookie",[`access_token=${accessToken}`])
                      .send({city: "Updated"})
                
    const cachedClient = await redis.get(`clients:${clientId}`)

    expect(response.status).toBe(200)
    expect(response.body[0].city).toBe("Updated")
    expect(cachedClient).toBeNull()
  })

  test("deletes a client from database and invalidates its cache",async() => {
    const accessToken = createAccessToken();

    const response = await request(app)
                      .delete(`/api/clients/${clientId}`)
                      .set("Cookie",[`access_token=${accessToken}`])

    const cachedClient = await redis.get(`clients:${clientId}`)

    
    expect(response.status).toBe(200)
    expect(response.body[0]).toEqual(
      expect.objectContaining({ client_id: clientId }),
    )
    expect(cachedClient).toBeNull()

    const deletedClient = await db("client")
      .where({ client_id: clientId })
      .first()

    expect(deletedClient).toBeUndefined()
  })



});
