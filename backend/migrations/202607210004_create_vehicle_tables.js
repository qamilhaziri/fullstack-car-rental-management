export async function up(knex) {
  if (!(await knex.schema.hasTable("brand"))) {
    await knex.schema.createTable("brand", (table) => {
      table.increments("brand_id").primary();
      table.string("brand").notNullable().unique();
    });
  }

  if (!(await knex.schema.hasTable("vehicle_cost"))) {
    await knex.schema.createTable("vehicle_cost", (table) => {
      table.increments("vcost_id").primary();
      table.decimal("cost_per_hour", 10, 2).notNullable();
      table.decimal("cost_per_day", 10, 2).notNullable();
    });
  }

  if (!(await knex.schema.hasTable("vehicle"))) {
    await knex.schema.createTable("vehicle", (table) => {
      table.increments("vehicle_id").primary();
      table.integer("brand_id").notNullable().references("brand_id").inTable("brand");
      table.integer("cost_id").notNullable().references("vcost_id").inTable("vehicle_cost");
      table.string("model").notNullable();
      table.string("vehicle_type").notNullable();
      table.string("transmission").notNullable();
      table.string("color").notNullable();
      table.integer("doors").notNullable();
      table.date("production_year").notNullable();
      table.string("fuel_type").notNullable();
      table.string("file_name").nullable();
    });
  }

  await knex.raw(`
    CREATE OR REPLACE PROCEDURE register_vehicle(
      p_brand_id integer, p_model text, p_vehicle_type text,
      p_transmission text, p_color text, p_cost_id integer,
      p_doors integer, p_production_year date, p_fuel_type text,
      p_file_name text
    ) LANGUAGE plpgsql AS $$
    BEGIN
      INSERT INTO vehicle (
        brand_id, model, vehicle_type, transmission, color, cost_id,
        doors, production_year, fuel_type, file_name
      ) VALUES (
        p_brand_id, p_model, p_vehicle_type, p_transmission, p_color, p_cost_id,
        p_doors, p_production_year, p_fuel_type, p_file_name
      );
    END;
    $$;
  `);
}

export async function down(knex) {
  await knex.raw("DROP PROCEDURE IF EXISTS register_vehicle(integer, text, text, text, text, integer, integer, date, text, text)");
  await knex.schema.dropTableIfExists("vehicle");
  await knex.schema.dropTableIfExists("vehicle_cost");
  await knex.schema.dropTableIfExists("brand");
}
