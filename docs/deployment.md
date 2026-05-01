# Deployment

## Backend → Render (free tier)

1. Push to GitHub.
2. In Render dashboard: **New** → **Blueprint** → point at the repo. It will
   read `backend/render.yaml` and provision the service.
3. The service will build from `backend/Dockerfile` and serve on the
   Render-assigned URL. `/health` is the healthcheck endpoint.

**Cold-start caveat:** Render's free tier sleeps after 15 minutes of
inactivity. The first request after sleep takes 30–60s. The frontend shows
a "warming up…" notice after 3s of loading.

## Frontend → Vercel

1. In Vercel: **Add New** → **Project** → import the GitHub repo.
2. Set the root directory to `frontend/`.
3. Set environment variable: `VITE_API_URL=https://<your-render-app>.onrender.com`.
4. Deploy. `vercel.json` already configures the SPA fallback.

CORS on the backend permits any `*.vercel.app` origin via regex; no extra
config needed for preview deployments.

## Local with Docker

```bash
make docker-up
```

Brings up backend on `:8000` and frontend on `:5173` with hot reload on both.

## Required environment

| Name | Where | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_API_URL` | Vercel | none | Backend base URL. Falls back to Vite dev proxy locally. |
| `DEBUG` | Render | `false` | Verbose logging. |
| `PORT` | Render | `8000` | Backend listen port. |
