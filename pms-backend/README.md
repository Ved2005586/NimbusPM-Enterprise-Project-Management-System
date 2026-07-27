# Enterprise PMS — Backend

Spring Boot 3 / Java 21 backend for the Enterprise Project Management System (Jira/Trello/Asana-style).

## What's implemented

- **Data model** — 15 entities: `User`, `Role`, `RefreshToken`, `VerificationToken`, `Project`, `ProjectMember`,
  `Sprint`, `Task`, `TaskComment`, `TaskAttachment`, `TaskHistory`, `Notification`, `ChatRoom`, `ChatMessage`.
- **Auth** — register, login, JWT access + refresh tokens, logout, forgot/reset password, email verification,
  role-based authorization (`ADMIN`, `PROJECT_MANAGER`, `TEAM_LEAD`, `DEVELOPER`, `TESTER`, `CLIENT`).
- **Projects** — CRUD, archive, add/remove members, search.
- **Sprints** — create, start, complete, list by project.
- **Tasks** — CRUD, Kanban status/position updates (drag-and-drop backend), assignment, comments,
  file attachments (local disk storage), search. Status/comment changes broadcast over WebSocket (STOMP)
  so a connected frontend can update boards and threads live.
- **Notifications** — persisted + pushed over WebSocket on task assignment, completion, and new comments;
  task-assignment emails sent asynchronously.
- **Security** — Spring Security + JWT filter chain, BCrypt (strength 12), method-level `@PreAuthorize`,
  global CORS config, stateless sessions.
- **Cross-cutting** — global exception handler with structured JSON errors and field-level validation
  messages, Bean Validation on every request DTO, Swagger/OpenAPI docs, async email sending, JPA auditing
  (created/updated timestamps), optimistic locking (`@Version`).
- **Seed data** — on first boot, all six roles and a bootstrap admin (`admin@pms.com` / `Admin@12345`) are
  created automatically. **Change that password immediately in anything beyond local dev.**
- **Tests** — Mockito-based unit tests for `AuthService` and `TaskService` as a starting pattern; extend the
  same style to the remaining services/controllers.
- **Docker** — multi-stage `Dockerfile` + `docker-compose.yml` (MySQL, Redis, backend).
- **CI** — GitHub Actions workflow: build → test → package → Docker build.

## Not yet built (next phases)

- Chat/typing-indicator/online-presence WebSocket endpoints (entities + repositories exist; STOMP
  controllers for chat still need to be written)
- Admin analytics/audit-log endpoints, PDF/Excel report generation
- Google OAuth login
- Redis-backed caching/session usage (Redis is wired into Docker Compose but not yet used in code)
- The React frontend

## Running locally

### Option A — Docker Compose (recommended)
```bash
cp .env.example .env      # edit values as needed
docker compose up --build
```
API will be available at `http://localhost:8080/api`, Swagger UI at
`http://localhost:8080/api/swagger-ui.html`.

### Option B — Run against a local MySQL instance
```bash
mysql -u root -p -e "CREATE DATABASE pms_db;"
export DB_USERNAME=root DB_PASSWORD=yourpassword
mvn spring-boot:run
```

## Important note on this build

This code was written and reviewed in a sandboxed environment without access to Maven Central, so it
has **not** been compiled here — I couldn't run `mvn compile`/`mvn test` to confirm it builds cleanly.
The code has been carefully reviewed for correctness (entity/Lombok boolean accessor naming, JPQL, JWT
API usage, etc.), but please run:

```bash
mvn clean verify
```

as your first step after unzipping, and share any compiler errors with me if they come up — they're
usually quick to fix (a typo or missing import).

## Default admin credentials (dev only)
```
email:    admin@pms.com
password: Admin@12345
```

## API docs
Once running: `http://localhost:8080/api/swagger-ui.html`
