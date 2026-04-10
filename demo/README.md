# Habit Tracker v2 - Production Runbook

This app runs as a single service where the backend serves the SPA from the same origin (`:8080`).

## Local production-like run with Docker Compose

Prerequisites:
- Docker + Docker Compose plugin
- RSA key files at `./secrets/app.pub` and `./secrets/app.key`

From `demo/`:

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f backend
```

Quick checks:

```bash
curl -i http://localhost:8080/actuator/health
curl -i http://localhost:8080/login
```

Stop services:

```bash
docker compose down
```

If you still do not have keys, generate them in `demo/`:

```bash
mkdir -p secrets
openssl genrsa -out secrets/app.key 2048
openssl rsa -in secrets/app.key -pubout -out secrets/app.pub
```

## Deploy on Render (Web Service) + Neon Postgres

Use one Render Web Service (Docker runtime) and one Neon database.

### 1) Neon setup

Create a Neon project and copy the connection URL.
Use a JDBC URL in Render env var `DB_URL`, for example:

```text
jdbc:postgresql://<neon-host>/<db-name>?sslmode=require
```

### 2) Render Web Service setup

- Runtime: Docker
- Root directory: repo root
- Dockerfile path: `demo/Dockerfile`
- Port: `8080`
- Health check path: `/actuator/health`

### 3) Render environment variables

Required:
- `PORT=8080`
- `SPRING_PROFILES_ACTIVE=prod`
- `DB_URL=jdbc:postgresql://<neon-host>/<db-name>?sslmode=require`
- `DB_USERNAME=<neon-user>`
- `DB_PASSWORD=<neon-password>`
- `APP_CORS_ALLOWED_ORIGINS=https://<your-render-domain>`
- `SPRING_AUTOCONFIGURE_EXCLUDE=org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiChatAutoConfiguration`
- `APP_AI_ENABLED=false`
- `APP_WEBAUTHN_ENABLED=false` (or configure RP fields if using passkeys)
- `APP_WEBAUTHN_RP_NAME=habit-tracker`
- `APP_WEBAUTHN_RP_ID=<your-render-domain-without-https>`

Optional:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GEMINI_API_KEY`
- `APP_COOKIE_DOMAIN=<your-domain>`

If you want AI enabled later, remove `SPRING_AUTOCONFIGURE_EXCLUDE` and configure all required Google GenAI settings.
If Google OAuth credentials are omitted, startup still works and Google login flow stays unusable until you provide valid credentials.

JWT keys (required):
- `JWT_PUBLIC_KEY_PATH=file:/run/secrets/app.pub`
- `JWT_PRIVATE_KEY_PATH=file:/run/secrets/app.key`

### 4) Render secret files for JWT

Create two secret files in Render and mount them into:
- `/run/secrets/app.pub`
- `/run/secrets/app.key`

Use PEM contents from your local `demo/secrets` files.

### 5) Deploy and validate

After deploy:
- Open `https://<your-render-domain>/actuator/health`
- Open `https://<your-render-domain>/login`
- Check Render logs for DB connectivity and startup completion

## Notes

- Production profile is configured with `spring.jpa.hibernate.ddl-auto=update`.
- Frontend API calls are same-origin (`/api/**`), so no separate frontend service is required.





