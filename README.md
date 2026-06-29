# PDF Toolbox

Premium, dark-themed PDF conversion SaaS. Next.js 15 frontend (Vercel) + FastAPI/Celery backend (Docker VPS).

This repo is being built in sections. See `docs/ARCHITECTURE.md` for the system design, full folder structure, and the build order. Don't run anything yet — `frontend/` and `backend/` are currently empty scaffolds; Section 2 fills in the backend core (FastAPI boot, database, Docker Compose for Postgres/Redis), Section 5 fills in the frontend foundation. Each section is runnable on its own as it lands.

## Stack

Frontend: Next.js 15, TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis, React Three Fiber, Drei, Shadcn UI, Zustand, React Query, Axios.

Backend: FastAPI, SQLAlchemy, PostgreSQL, Redis, Celery, JWT.

Conversion: LibreOffice (headless), pypdf, PyMuPDF, pdf2docx, Pillow, Tesseract OCR.

Deployment: Frontend → Vercel. Backend → Docker on a VPS, behind Nginx.
