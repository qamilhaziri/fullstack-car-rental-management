export async function up(knex) {
  const administratorExists = await knex.schema.hasTable("administrator");

  if (!administratorExists) {
    await knex.schema.createTable("administrator", (table) => {
      table.increments("admin_id").primary();
      table.string("full_name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
    });
  }

  const sessionExists = await knex.schema.hasTable("refresh_session");

  if (!sessionExists) {
    await knex.schema.createTable("refresh_session", (table) => {
      table.increments("refresh_session_id").primary();
      table.integer("user_id")
        .notNullable()
        .references("admin_id")
        .inTable("administrator")
        .onDelete("CASCADE");
      table.string("family_id").notNullable();
      table.string("token_hash").notNullable().unique();
      table.timestamp("expires_at").notNullable();
      table.timestamp("revoked_at").nullable();
      table.string("replaced_by_jti").nullable();
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("refresh_session");
  await knex.schema.dropTableIfExists("administrator");
}
