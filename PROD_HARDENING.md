# Production Hardening Notes

## What changed

- Backend now serves SPA routes (`/`, `/login`, `/register`, `/dashboard`) via `index.html` fallback.
- Security is configured for same-origin deployment:
  - API protected under `/api/**`
  - CSRF enabled using cookie token repository
  - Cookie-based JWT is configurable (`secure`, `same-site`, `domain`)
  - OAuth2 redirects are now relative (`/dashboard`, `/login?...`)
  - WebAuthn settings are environment-driven
- Frontend Google OAuth button now uses same-origin relative URL.
- Frontend API client now:
  - Auto-bootstraps CSRF cookie from `/api/csrf` for unsafe methods
  - Sends CSRF header (`X-XSRF-TOKEN`)
  - Keeps `/webauthn` and OAuth/login framework routes outside `/api` prefix
- Docker Compose now defines `backend` + `db` for production-like runs.

## Required environment variables in production

- `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (if OAuth enabled)
- `GEMINI_API_KEY` (if AI endpoints enabled)
- `APP_CORS_ALLOWED_ORIGINS` (same origin domain)
- `APP_COOKIE_DOMAIN` (optional, leave empty for host-only cookie)
- `APP_WEBAUTHN_ENABLED`, `APP_WEBAUTHN_RP_ID`, `APP_WEBAUTHN_RP_NAME`
- `JWT_PUBLIC_KEY_PATH`, `JWT_PRIVATE_KEY_PATH`

## Secrets files expected by compose

- `./secrets/app.pub`
- `./secrets/app.key`

## Smoke checks

- `GET /login` returns SPA HTML
- `POST /api/login` sets `token` cookie
- State-changing requests (`POST`, `PATCH`, `DELETE`) include `X-XSRF-TOKEN`
- OAuth flow returns to `/dashboard`

