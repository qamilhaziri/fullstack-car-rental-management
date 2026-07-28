import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import bcrypt from "bcrypt";
import request from "supertest";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import path from "node:path";
import {
  configurePostgresEnvironment,
  runIntegrationSetup,
} from "../helpers/testContainerEnv.js";

let container;
let db;
let app;

const admin = {
  full_name: "Integration Admin",
  email: "admin.integration@example.com",
  password: "StrongPassword123!",
};

beforeAll(async () => {
  await runIntegrationSetup("Authentication", async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine").start();

  configurePostgresEnvironment(container);
  process.env.JWT_SECRET = "integration-access-secret";
  process.env.JWT_REFRESH_SECRET = "integration-refresh-secret";
  process.env.JWT_EXPIRES_IN = "10m";
  process.env.JWT_REFRESH_EXPIRES_IN = "7d";
  process.env.CLIENT_URL = "http://localhost:5173";

  ({ default: db } = await import("../../config/dbConfig.js"));

  await db.migrate.latest({
    directory: path.resolve(process.cwd(), "migrations"),
  });

  await db("administrator").insert({
    full_name: admin.full_name,
    email: admin.email,
    password: await bcrypt.hash(admin.password, 10),
  });

  ({ default: app } = await import("../../app.js"));
  });
}, 120_000);

afterAll(async () => {
  await db?.destroy();
  await container?.stop();
});

describe("authentication integration", () => {
  test("logs in with valid credentials, persists a refresh session, and sets cookies", async () => {
    // Arrange
    const agent = request.agent(app);

    // Act
    const response = await agent.post("/api/auth/login").send({
      email: admin.email,
      password: admin.password,
    });

    // Assert: response and browser cookies
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Login successful",
      user: {
        user_id: expect.any(Number),
        fullName: admin.full_name,
      },
    });
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("access_token="),
        expect.stringContaining("refresh_token="),
      ]),
    );

    // Assert: real persistence and protected endpoint access
    const session = await db("refresh_session").first();
    expect(session).toEqual(
      expect.objectContaining({
        user_id: response.body.user.user_id,
        token_hash: expect.any(String),
      }),
    );

    const meResponse = await agent.post("/api/auth/me");
    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user).toEqual(
      expect.objectContaining({
        user_id: response.body.user.user_id,
        token_type: "access",
      }),
    );
  });

  test("rejects invalid credentials without creating a refresh session", async () => {
    // Arrange
    const sessionsBefore = await db("refresh_session").count("*").first();

    // Act
    const response = await request(app).post("/api/auth/login").send({
      email: admin.email,
      password: "wrong-password",
    });

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid credentials" });

    const sessionsAfter = await db("refresh_session").count("*").first();
    expect(Number(sessionsAfter.count)).toBe(Number(sessionsBefore.count));
  });

  test("rotates a valid refresh token and revokes the previous session", async () => {
    // Arrange
    const agent = request.agent(app);
    const sessionsBeforeLogin = await db("refresh_session").count("*").first();

    const loginResponse = await agent.post("/api/auth/login").send({
      email: admin.email,
      password: admin.password,
    });

    expect(loginResponse.status).toBe(200);

    // Act
    const refreshResponse = await agent.post("/api/auth/refresh");

    // Assert: response issues a new pair of cookies
    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toEqual({ message: "Token refreshed" });
    expect(refreshResponse.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("access_token="),
        expect.stringContaining("refresh_token="),
      ]),
    );

    // Assert: one old session is revoked and one replacement is persisted.
    const sessions = await db("refresh_session")
      .where({ user_id: 1 })
      .orderBy("refresh_session_id", "asc");

    expect(sessions).toHaveLength(Number(sessionsBeforeLogin.count) + 2);
    expect(sessions.filter((session) => session.revoked_at)).toHaveLength(1);
    expect(sessions.filter((session) => !session.revoked_at)).toHaveLength(
      Number(sessionsBeforeLogin.count) + 1,
    );
  });
});
