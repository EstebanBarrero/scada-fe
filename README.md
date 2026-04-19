# SCADA Alarm System — Frontend

Web dashboard for visualizing and querying industrial SCADA alarm data.
Consumes the backend REST API and allows triggering the ETL pipeline from the UI.

## Stack

| Tool | Version | Role |
|------|---------|------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Dev server + bundler |
| Tailwind CSS | 3.4 | Utility-first styling + dark mode |
| @tremor/react | 3 | Donut chart (CriticalityPie) |
| Recharts | 2 | Bar, area, and line charts (Timeline, TopTags) |
| TanStack React Query | 5 | Server state + caching |
| Axios | 1.7 | HTTP client |
| React Router | 6 | Client-side routing |
| date-fns | 3 | Timestamp formatting |
| lucide-react | 0.400 | Icon set |
| clsx + tailwind-merge | — | Conditional class merging (`cn()` utility) |

## UI Design System

The frontend uses a **dark glassmorphism** design language:

- **Glass cards** — `backdrop-blur-xl`, `bg-white/[0.03]`, `border-white/[0.07]`
- **Ambient background glows** — fixed radial blurs behind content layers
- **Component primitives** in `src/components/ui/`:
  - `GlassCard` — base card with optional glow variant
  - `Badge` — criticality/status badges with glow border
- **`cn()` utility** in `src/lib/utils.ts` — merges Tailwind classes safely via `clsx` + `tailwind-merge`
- **Tremor** used only for the DonutChart component; all layout/card/button/table components are custom glass primitives
- **`@layer components`** in `index.css` defines `.badge-*`, `.btn-page`, `.glass-input`

## Pages

### Dashboard (`/`)
- **ETL Trigger** — run the pipeline and see live stats (raw / loaded / dupes / rejected)
- **Top Tags chart** — recharts horizontal BarChart, top 10 tags colored by alarm rank (rose → orange → blue → slate)
- **Criticality Pie** — Tremor DonutChart breakdown by CRITICAL / HIGH / MEDIUM / LOW / UNKNOWN
- **Alarm Timeline** — two panels:
  - *Total volume*: BarChart per day/hour, brighter bars = periods with critical alarms
  - *Severity trend*: AreaChart for Critical + High on their own scale

### Alarm Log (`/alarms`)
- **Filter panel** — date range pickers, tag text search, criticality toggle chips
- **Paginated table** — timestamp, tag, criticality badge, value+unit, status, source
- **Pagination controls** — first / prev / numbered pills / next / last; `<select>` for page size (25–200)

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

### Glass UI primitives over component libraries
Layout components (cards, buttons, table, filters) are custom-built with Tailwind
glass classes instead of relying on Tremor for everything. This avoids Tremor's
dark-mode limitations and gives full control over visual style. Tremor is kept
only for the DonutChart where its built-in legend/animation are valuable.

### Recharts for timeline and top-tags charts
Tremor's `LineChart` passes internal props like `showDots` to DOM elements,
causing React warnings. Recharts gives direct control over axes, gradients,
custom tooltips, and per-cell colors — used for the color-scaled TopTags bars
and the dual-panel Timeline.

### Axios `paramsSerializer` for array filters
FastAPI expects repeated query params (`criticality=CRITICAL&criticality=HIGH`).
Axios 1.x serializes arrays as `criticality[]=CRITICAL` by default. A custom
`paramsSerializer` in `src/api/client.ts` corrects this so multi-select
criticality filtering works correctly.

### React Query over plain useEffect
Query caching avoids redundant API calls when navigating between pages.
`placeholderData: keepPreviousData` on the alarms query prevents flicker during
pagination. `onSuccess` cache invalidation in `useEtl` ensures all charts
refresh automatically after a pipeline run.

### Axios interceptor for error normalization
The backend returns `{ error: { message } }` for application errors and
`{ detail }` for FastAPI validation errors. The interceptor collapses both
into a single `Error` so every component handles one error shape.

### Vite dev proxy
`/api` is proxied to `http://localhost:8000` in development, so the frontend
runs on port 5173 without CORS issues. In production the nginx config does
the same proxy inside the Docker network.
