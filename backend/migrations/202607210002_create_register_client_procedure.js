export async function up(knex) {
  await knex.raw(`
    CREATE OR REPLACE PROCEDURE register_client(
      p_client_name text,
      p_client_surname text,
      p_personal_number text,
      p_gender text,
      p_city text,
      p_email text,
      p_date_of_birth date,
      p_phone_number text,
      p_nationality text
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO client (
        client_name, client_surname, personal_number, gender, city,
        email, date_of_birth, phone_number, nationality
      ) VALUES (
        p_client_name, p_client_surname, p_personal_number, p_gender, p_city,
        p_email, p_date_of_birth, p_phone_number, p_nationality
      );
    END;
    $$;
  `);
}

export async function down(knex) {
  await knex.raw("DROP PROCEDURE IF EXISTS register_client(text, text, text, text, text, text, date, text, text)");
}
