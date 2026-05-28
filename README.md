# Todos with Categories

Full-stack task manager: tasks belong to categories, each category caps at 5, and completing or deleting a task fires a transient snackbar with **Undo**.

- **Frontend**: Next.js 16 (App Router) + TypeScript + TailwindCSS + React Hook Form + zod + axios + TanStack Query + react-toastify
- **Backend**: NestJS + Prisma 7 + PostgreSQL

```
test-task/
├── backend/      # Nest API
├── frontend/     # Next.js app
└── docker-compose.yml
```

## Running locally (no Docker)

Prereqs: Node 20+, npm, and a running PostgreSQL 16 (e.g. `docker compose up -d db`).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env             # adjust DATABASE_URL if needed
npx prisma migrate deploy        # apply schema
npm run db:seed                  # seeds 5 default categories
npm run start:dev                # listens on PORT (default 5050)
```

> Port note: defaults to **5050** to avoid the macOS AirPlay Receiver on 5000. Override with `PORT=…` in `backend/.env`.

### 2. Frontend

```bash
cd frontend
npm install
echo 'NEXT_PUBLIC_API_URL=http://localhost:5050' > .env.local
npm run dev                      # http://localhost:3000
```

## Running with Docker

```bash
docker compose up --build
```

- Backend on `http://localhost:5050` (PostgreSQL stored in the `pgdata` named volume so it survives restarts; migrations + seed run on first boot).
- Frontend on `http://localhost:3000`.

If you deploy the backend somewhere else, rebuild the frontend with `NEXT_PUBLIC_API_URL` baked in:

```bash
docker compose build --build-arg NEXT_PUBLIC_API_URL=https://your-api.example.com frontend
```

## API

| Method | Path             | Body                                | Notes                                            |
|--------|------------------|-------------------------------------|--------------------------------------------------|
| GET    | `/categories`    | —                                   | List categories (seeded)                         |
| GET    | `/todos`         | —                                   | Optional `?category=<id>` filter                 |
| POST   | `/todos`         | `{ text, categoryId }`              | 400 if the category already has 5 tasks          |
| PATCH  | `/todos/:id`     | `{ completed?: boolean }`           |                                                  |
| DELETE | `/todos/:id`     | —                                   |                                                  |

The 400 from `POST /todos` is rendered to the user as a toast.

## Features

- Tasks list with text, category, and done/not-done state
- Create form (RHF + zod validation; backend errors surface in a toast)
- Filter by category ("All categories" sentinel)
- Per-item complete and delete with **5-second Undo** snackbar
- **Bulk action**: select multiple non-completed tasks → "Mark done" in the sticky toolbar → one combined Undo
- Loading spinner, error block, and empty state
- "Select all" within the current filter
- TanStack Query for fetching + cache invalidation on mutations

## Tests

```bash
cd frontend
npm test
```

Covers:
- Form validation (zod errors block submit; valid submit calls the API and preserves the category)
- `useTodos` undo flow (delete + complete-many) — uses fake timers to assert the API is **not** called when Undo cancels


