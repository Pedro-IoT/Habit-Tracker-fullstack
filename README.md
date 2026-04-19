# Habit Tracker Fullstack

A modern fullstack habit tracker focused on **secure authentication**, **passwordless WebAuthn (passkeys)**, and **OAuth2 login**.

Built with:

- **Backend:** Spring Boot 4, Spring Security, JPA, PostgreSQL
- **Frontend:** React 19, TypeScript, Vite, TanStack Router/Query
- **Infra:** Docker Compose

---

## Why this project stands out

- Secure auth flows with **JWT in HttpOnly cookie**
- **WebAuthn passkeys** for passwordless sign-in and credential management
- **OAuth2 (Google)** social login flow
- Habit tracking with streak logic, calendar view, and scheduled days
- Optional AI habit suggestions (feature-flagged)

---

## Security first

This project was implemented with multiple security layers:

- **JWT + HttpOnly cookie** (`token`) generated server-side
- **RSA key pair signing** for JWT (public/private key configuration)
- **CSRF protection** with `CookieCsrfTokenRepository` and `X-XSRF-TOKEN`
- **Credentialed CORS** with explicit allowed-origins configuration
- **Password hashing** via Spring Security `PasswordEncoder`
- **Cookie hardening controls** (`secure`, `same-site`, optional `domain`)
- Route-level protection for `/api/**` with authenticated access

---

## WebAuthn (Passkeys)

The app supports passkeys end-to-end:

- Browser-side WebAuthn with `@simplewebauthn/browser`
- Spring Security WebAuthn integration (`spring-security-webauthn`)
- Persistent credential storage (`tb_user_passkey`)
- Passwordless login flow (`/webauthn/authenticate/*`)
- Credential lifecycle management:
  - Register passkey
  - List passkeys
  - Rename passkeys
  - Delete passkeys

Configurable flags:

- `app.security.webauthn.enabled`
- `app.security.webauthn.rp-name`
- `app.security.webauthn.rp-id`

---

## OAuth2

OAuth2 login is implemented using Spring Security OAuth2 Client:

- Google OAuth2 registration in Spring config
- `/oauth2/authorization/google` entry point in UI
- Custom success/failure handlers
- On success, backend issues auth cookie and redirects to dashboard
- New OAuth users are auto-provisioned in the user table

---

## Core product features

- Register, login, logout, and current-user session check
- Create habits with custom color and scheduled weekdays
- Mark/unmark completion per day
- Automatic streak calculation and midnight streak reset job
- Calendar-based history (`/api/habits/dates`, `/api/habits/by-date`)
- Responsive dashboard with “To Do” and “Completed” sections
- Optional AI suggestions endpoint (`/api/AIsuggestion`) when enabled

---

## Architecture overview

```text
React + Vite SPA
   └── calls /api + /oauth2 + /webauthn
        └── Spring Boot backend
             ├── Spring Security (JWT cookie, CSRF, OAuth2, WebAuthn)
             ├── JPA/Hibernate services
             └── PostgreSQL
```

Frontend build is bundled into backend static resources during Maven packaging, enabling a single deployable artifact.

---

## Running with Docker (recommended)

From repository root:

```bash
docker compose up --build
```

App and services:

- Backend app: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

> The compose setup expects RSA key files in `./secrets/app.pub` and `./secrets/app.key`.

---

## Local development

### 1) Start database

```bash
docker compose up -d db
```

### 2) Run backend

```bash
cd demo
./mvnw -pl Backend spring-boot:run
```

### 3) Run frontend

```bash
cd demo/FrontEnd
npm ci
npm run dev
```

Frontend dev server proxies `/api` to `http://localhost:8080`.

---

## Important environment variables

| Variable                                      | Purpose                               |
| --------------------------------------------- | ------------------------------------- |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`        | PostgreSQL connection                 |
| `JWT_PUBLIC_KEY_PATH`, `JWT_PRIVATE_KEY_PATH` | RSA keys used for JWT                 |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`    | OAuth2 Google login                   |
| `APP_CORS_ALLOWED_ORIGINS`                    | Allowed origins for credentialed CORS |
| `APP_COOKIE_DOMAIN`                           | Optional cookie domain                |
| `APP_WEBAUTHN_ENABLED`                        | Enables/disables passkeys             |
| `APP_WEBAUTHN_RP_NAME`, `APP_WEBAUTHN_RP_ID`  | WebAuthn relying party config         |
| `APP_AI_ENABLED`, `GEMINI_API_KEY`            | Optional AI suggestion feature        |

---

## Tech stack

- Java 25, Spring Boot 4
- Spring Security (OAuth2, Resource Server, WebAuthn, CSRF)
- Spring Data JPA + PostgreSQL
- React 19 + TypeScript + Vite
- TanStack Router + TanStack Query
- Docker / Docker Compose

---

## Repository structure

```text
.
├── compose.yaml                 # Root-level compose (db + backend container)
├── demo/
│   ├── Backend/                 # Spring Boot API + security + persistence
│   ├── FrontEnd/                # React SPA
│   ├── Dockerfile               # Multi-stage build (frontend + backend)
│   └── compose.yaml             # Demo-local compose variant
└── README.md
```
