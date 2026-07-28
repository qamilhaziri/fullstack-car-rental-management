import dotenv from "dotenv"
import knex from "knex";

dotenv.config()

const isProduction = process.env.NODE_ENV === "production";

const db = new knex({
    client:"pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      // Render PostgreSQL requires SSL. The temporary Testcontainers database
      // deliberately runs without SSL during integration tests.
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    },
});



export default db;
