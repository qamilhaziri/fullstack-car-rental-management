export async function up(knex) {
  const exists = await knex.schema.hasTable("client");

  if (exists) return;

  await knex.schema.createTable("client", (table) => {
    table.increments("client_id").primary();
    table.string("client_name").notNullable();
    table.string("client_surname").notNullable();
    table.string("personal_number").notNullable().unique();
    table.string("gender").notNullable();
    table.string("city").notNullable();
    table.string("email").notNullable().unique();
    table.date("date_of_birth").notNullable();
    table.string("phone_number").notNullable();
    table.string("nationality").notNullable();
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("client");
}