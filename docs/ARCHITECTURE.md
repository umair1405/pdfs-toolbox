# PDF Toolbox — Architecture (Section 1)

## 1. System Overview

```
                         ┌──────────────────────────┐
                         │        Browser            │
                         │  Next.js 15 (Vercel CDN)   │
                         └─────────────┬─────────────┘
                                        │ HTTPS (Axios + React Query)
                                        ▼
                         ┌──────────────────────────┐
                         │      Nginx (reverse proxy)│
                         │      TLS termination       │
                         └─────────────┬─────────────┘
                                        ▼
                         ┌──────────────────────────┐
                         │   FastAPI (backend/app)   │
                         │  /api/v1/auth             │
                         │  /api/v1/upload           │
                         │  /api/v1/convert          │
                         │  /api/v1/files            │
                         └───┬─────────────┬─────────┘
                              │             │
                  sync reads/writes    enqueue job
                              ▼             ▼
                   ┌──────────────┐  ┌──────────────┐
                   │ PostgreSQL   │  │ Redis (broker)│
                   │ users, jobs, │  └──────┬───────┘
                   │ files        │         ▼
                   └──────────────┘  ┌──────────────┐
                                      │ Celery worker │
                                      │ (workers/)    │
                                      │ converters/*  │
                                      └──────┬───────┘
                                             ▼
                                   ┌──────────────────┐
                                   │ Storage volume /  │
                                   │ S3-compatible      │
                                   │ (uploads, outputs) │
                                   └──────────────────┘
```

## 2. Why this shape

The frontend never touches conversion logic — it only ever talks to FastAPI over a typed REST contract. This keeps Vercel deploys trivial (static + edge-rendered marketing pages, client-rendered dashboard) with zero server secrets on that side.

The backend separates the *request path* from the *work path*. Uploading a file and asking "convert this" returns immediately with a `job_id`; the actual conversion (which can take seconds to minutes for OCR or large merges) runs in a Celery worker process, never inside the FastAPI request/response cycle. This is what keeps the API responsive under load and avoids request timeouts on large files.

PostgreSQL is the source of truth for users, files, and conversion job status. Redis is purely a broker/cache (Celery queue + optionally job-status pub/sub for live progress). Conversion engines (LibreOffice headless, pypdf, PyMuPDF, pdf2docx, Pillow, Tesseract OCR) are isolated inside `backend/app/converters/`, each one a single-purpose function with a single-purpose Celery task wrapping it — so adding a new format later means adding one file, not touching existing ones.

## 3. Conversion job lifecycle

1. Client uploads file → `POST /api/v1/upload` → file streamed to storage, row created in `files` table, returns `file_id`.
2. Client requests conversion → `POST /api/v1/convert` with `file_id` + target format → row created in `conversion_jobs` table with status `queued`, Celery task enqueued, returns `job_id` immediately.
3. Client polls (or subscribes via React Query) `GET /api/v1/convert/{job_id}` → status moves `queued → processing → done | failed`.
4. On `done`, response includes a signed download URL for the output file.

## 4. Auth

JWT access + refresh tokens. `POST /api/v1/auth/register`, `/login`, `/refresh`. Access token short-lived (15 min), refresh token long-lived (7 days), stored httpOnly on the client side via the auth service. Protected routes use a FastAPI dependency (`get_current_user`) injected per-route.

## 5. Exact project structure

```
pdf-toolbox/
├── frontend/
│   ├── app/
│   │   ├── (marketing)/              → landing page route group
│   │   ├── (dashboard)/dashboard/    → authenticated app route group
│   │   ├── api/                      → Next.js route handlers (proxy only, no secrets)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       → shadcn primitives (Button, Input, Dialog...)
│   │   ├── layout/                   → Navbar.tsx, Footer.tsx
│   │   ├── sections/                 → Hero.tsx, Features.tsx, Tools.tsx, UploadSection.tsx,
│   │   │                                DashboardPreview.tsx, Pricing.tsx, FAQ.tsx
│   │   ├── cursor/                   → CustomCursor.tsx
│   │   ├── background/               → GradientMesh.tsx, ParticleField.tsx
│   │   ├── upload/                   → Dropzone.tsx, ProgressBar.tsx
│   │   └── dashboard/                → StatsCard.tsx, ConversionChart.tsx
│   ├── hooks/                        → useLenis.ts, useMagneticButton.ts, useCursorTrail.ts, useFileUpload.ts
│   ├── services/                     → api.ts, auth.service.ts, conversion.service.ts
│   ├── animations/                   → variants.ts, transitions.ts, gsapTimelines.ts
│   ├── config/                       → site.ts, tools.ts
│   ├── types/                        → conversion.ts, user.ts
│   ├── utils/                        → cn.ts, formatBytes.ts
│   ├── store/                        → useUploadStore.ts, useAuthStore.ts (Zustand)
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py                   → FastAPI app entrypoint
│   │   ├── core/                     → config.py, security.py, celery_app.py
│   │   ├── api/v1/                   → auth.py, upload.py, convert.py, files.py, router.py
│   │   ├── models/                   → user.py, file.py, conversion_job.py (SQLAlchemy)
│   │   ├── schemas/                  → user.py, conversion.py (Pydantic)
│   │   ├── db/                       → session.py, base.py, init_db.py
│   │   ├── services/                 → storage.py, auth_service.py
│   │   ├── converters/               → pdf_to_word.py, word_to_pdf.py, merge_pdf.py,
│   │   │                                split_pdf.py, compress_pdf.py, ocr_pdf.py, pdf_to_image.py
│   │   ├── workers/                  → tasks.py (Celery task definitions)
│   │   └── migrations/versions/      → Alembic migrations
│   ├── requirements.txt
│   └── alembic.ini
│
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nginx/nginx.conf
│
├── docs/
│   └── ARCHITECTURE.md               → this file
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 6. Build order (the sections you'll get next, in this order)

1. **Architecture** — this document, full folder scaffold (done now).
2. **Backend core** — `main.py`, config, DB models, Alembic setup, Docker Compose for Postgres/Redis, so the API boots and the DB exists.
3. **Backend API + Celery** — auth, upload, convert endpoints, worker wiring.
4. **Conversion engine** — the six converter modules, fully implemented.
5. **Frontend foundation** — Next.js app shell, Tailwind theme tokens, fonts, providers (React Query, Zustand), Lenis smooth scroll, custom cursor.
6. **Frontend sections** — Navbar, Hero, Features, Tools, Upload, Dashboard, Pricing, FAQ, Footer — fully responsive, fully animated.
7. **Docker + Nginx** — both Dockerfiles, compose for full stack, nginx reverse proxy config.
8. **Deployment** — Vercel for frontend, VPS + Docker for backend, domain + env vars.

Each section from here on ships as real files written to disk, which you can download immediately and run.
