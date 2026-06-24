# Docker setup

Run the full stack:

```sh
docker compose up --build
```

Open the frontend at:

```text
http://localhost:8080
```

Default login:

```text
email: admin@example.com
password: admin123
```

The backend is available at `http://localhost:5005/api`.

If the Postgres volume was created before this init file existed, reset it once:

```sh
docker compose down -v
docker compose up --build
```

For Docker, the backend must use `DB_HOST=db`. `localhost` from inside the backend container points to the backend container itself, not Postgres.
