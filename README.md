# SCADA Alarm System — Frontend

Web dashboard for visualizing and querying industrial SCADA alarm data.
Consumes the backend REST API and allows triggering the ETL pipeline from the UI.

## Stack

| Tool | Version | Role |
|------|---------|------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Dev server + bundler |
| Tailwind CSS | 3.4 | Utility-first styling |
| Recharts | 2 | Bar, line, and pie charts |
| TanStack React Query | 5 | Server state + caching |
| Axios | 1.7 | HTTP client |
| React Router | v6 | Client-side routing |
| date-fns | 3 | Timestamp formatting |

## Pages

### Dashboard (`/`)
- **ETL Trigger** — run the pipeline and see live stats (raw / loaded / dupes / rejected)
- **Top Tags chart** — horizontal bar chart, top 10 tags by alarm count
- **Criticality Pie** — breakdown by CRITICAL / HIGH / MEDIUM / LOW / UNKNOWN
- **Timeline Chart** — total + critical + high counts over time; day/hour toggle

### Alarm Log (`/alarms`)
- **Filter panel** — date range, tag partial match, multi-select criticality toggles
- **Paginated table** — timestamp, tag, criticality badge, value+unit, status, source
- **Pagination controls** — first / prev / next / last; configurable page size (25–200)

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (proxies /api → http://localhost:8000)
npm run dev
```

Open http://localhost:5173. The backend must be running on port 8000.

To point to a different backend host, create a `.env` file:

```
VITE_API_BASE_URL=http://your-backend-host:8000
```

## Production build

```bash
npm run build   # outputs to dist/
npm run preview # serve the build locally
```

## Docker

```bash
# Build image
docker build -t scada-frontend .

# Run container (backend reachable as "backend:8000" inside Docker network)
docker run -p 80:80 scada-frontend
```

### Full stack with docker-compose

Run both services together from the backend repo (`scada-be`):

```bash
docker-compose up --build
```

The compose file in `scada-be` starts the backend on port 8000 and exposes it
as the `backend` service — which is what the nginx `/api` proxy target resolves to.

## Design decisions

### React Query over plain useEffect
Query caching avoids redundant API calls when navigating between pages.
`keepPreviousData` on the alarms query prevents flicker during pagination.
`onSuccess` cache invalidation in `useEtl` ensures all charts refresh
automatically after a pipeline run.

### Axios interceptor for error normalization
The backend returns `{ error: { message } }` for application errors and
`{ detail }` for FastAPI validation errors. The interceptor collapses both
into a single `Error` so every component handles one error shape.

### Vite dev proxy
`/api` is proxied to `http://localhost:8000` in development, so the frontend
runs on port 5173 without CORS issues. In production the nginx config does
the same proxy inside the Docker network.

### Tailwind custom component classes
`.badge-*`, `.card`, `.btn-primary`, `.btn-secondary`, `.input`, `.select`
are defined once in `index.css` via `@layer components`. This keeps JSX
readable while staying within Tailwind's purge boundary.
