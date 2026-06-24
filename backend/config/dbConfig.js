import dotenv from "dotenv"
import knex from "knex";


dotenv.config()

const db = new knex({
    client:"pg",
    connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  }
});



export default db;
