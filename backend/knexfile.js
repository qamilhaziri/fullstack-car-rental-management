// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "pg",
    connection: {
     connectionString: process.env.DATABASE_URL,
     ssl: {
      rejectUnauthorized:false
     }
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};