# Nimbus — Enterprise PMS Frontend

React 19 / Vite / MUI frontend for the Enterprise Project Management System. Built to talk to the
`pms-backend` API delivered earlier in this conversation.

## Verified

Unlike the backend (built in a sandbox without Maven Central access), **this project was actually
installed and built in this environment** — `npm install && npm run build` completed with no errors.
You're getting a project that's confirmed to compile, not just reviewed by eye.

## What's implemented

- **Auth** — login, register, forgot/reset password, JWT access+refresh token handling with automatic
  silent refresh on 401 (see `src/services/api.js`), protected routes, role-gated routes (`RoleRoute`).
- **Dashboard** — stat cards, weekly progress bar chart, status-breakdown doughnut chart (Chart.js),
  recent projects grid.
- **Projects** — list, create/edit/archive/delete, search-ready service layer, per-project workspace
  with Board / Sprints / Members tabs.
- **Kanban board** — 5 status columns (Backlog → To Do → In Progress → Testing → Done), drag-and-drop
  via `@dnd-kit` with optimistic local updates that reconcile against the backend, live updates over
  WebSocket (STOMP) so a second browser tab moving a card updates this one too.
- **Tasks** — create/edit, status/assignee changes from a detail drawer, live comment thread over
  WebSocket.
- **Sprints** — create, start, complete, list per project.
- **Notifications** — list, unread count badge in the topbar, live push over WebSocket, mark-as-read.
- **Admin panel** — user list with activate/deactivate, system-wide stat cards (role-gated to `ADMIN`).
- **Dark/light mode** — toggle in the topbar and Settings page, persisted to `localStorage`.
- **Design system** — a real token file (`src/theme/tokens.js`) and MUI theme builder
  (`src/theme/getTheme.js`) rather than inline colors everywhere; monospace task-key badges
  (`WEB-42`) as the recurring signature element tying the UI to the product's own data model.

## Known gaps / next steps

- **Profile editing** is UI-only — there's no `PATCH /users/me` on the backend yet to save changes.
- **Notification preferences** on the Settings page are a UI placeholder for the same reason.
- **Admin activate/deactivate** reads correctly, but the backend's `UserResponse` DTO doesn't currently
  return an `enabled` field, so the button always assumes "active" as the starting state. Add
  `private boolean enabled;` to `UserResponse` and set it in `UserMapper.toResponse()` on the backend
  to fix this properly.
- **Project member role picker** (`MembersPanel`) assumes the six roles seed in with ids 1–6 in order
  (which `DataInitializer` does on a fresh database) — if you ever reorder or add roles, fetch
  `GET /users` isn't the right source; you'd want a small `GET /roles` endpoint on the backend instead
  of the hardcoded list in `MembersPanel.jsx`.
- **Calendar** is a due-date list, not a month grid — intentionally simple rather than pulling in a
  heavy calendar library; swap in something like `react-big-calendar` if you want a visual grid.
- **Chat** (real-time messaging) has no UI yet — the backend has the entities and repositories but no
  STOMP controllers for it either (see backend README). Frontend-wise you'd add a `ChatPanel` component
  reusing the existing `useWebSocket` hook.
- Task attachments have a working backend endpoint but no UI panel yet in `TaskDetailDrawer`.

## Running locally

```bash
cp .env.example .env      # point at your running backend if not localhost:8080
npm install
npm run dev                # http://localhost:5173
```

The Vite dev server proxies `/api` and `/ws` to `http://localhost:8080` (see `vite.config.js`), so if
your backend runs elsewhere, either edit that proxy target or set `VITE_API_BASE_URL` / `VITE_WS_URL`
in `.env` and remove the proxy.

### Production build
```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Default login (matches backend seed data)
```
email:    admin@pms.com
password: Admin@12345
```

## Project structure
```
src/
  components/   kanban/, tasks/, projects/, dashboard/, layout/, common/
  hooks/        useAuth, useWebSocket
  layouts/      MainLayout (sidebar+topbar shell), AuthLayout (split-screen)
  pages/        one file per route
  redux/        store + one slice per domain (auth, projects, tasks, sprints, notifications, users, ui)
  services/     one file per backend resource + api.js (axios+interceptors) + socketService.js (STOMP)
  theme/        tokens.js (design tokens) + getTheme.js (MUI theme builder)
  utils/        constants.js (shared enums/formatters)
```
