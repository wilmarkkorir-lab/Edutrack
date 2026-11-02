# EduTrack – Student Management System

Full-stack student records app.

- **Backend:** Django 5 + Django REST Framework, token auth, SQLite
- **Frontend:** React 18 (Vite) + Tailwind CSS
- **Deploy:** one Render web service – Django serves the API and the built React app

**Features:** sign in/out · add, view, edit, delete students · auto-generated student IDs (`STU-2026-0001`)
· search, status/course filters, sorting, pagination · dashboard totals & average GPA
· validation (unique email, GPA 0–4, year 1–8) · Django admin at `/admin/` · automated API tests

## Project layout

```
edutrack/
├── backend/            Django project (config/) + app (students/)
├── frontend/           React + Tailwind (src/components/…)
├── build.sh            Render build: builds React, copies it into Django, collectstatic
├── start.sh            Render start: migrate, create admin, (seed), gunicorn
└── render.yaml         Render Blueprint
```

## Run locally

Backend (terminal 1):
```bash
cd backend
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser                      # this is your login
python manage.py seed_students                        # optional demo data
python manage.py runserver                            # http://127.0.0.1:8000
```

Frontend (terminal 2):
```bash
cd frontend
npm install
npm run dev                                           # http://localhost:5173 (proxies /api to Django)
```

Run the tests: `cd backend && python manage.py test`

## Deploy to Render

1. Push this folder to a GitHub repo (the repo root should contain `render.yaml`).
2. In Render: **New → Blueprint** → pick the repo → **Apply**.
3. When the deploy is live, open **Environment** and copy `ADMIN_PASSWORD` (generated for you).
   Sign in at your `.onrender.com` URL with `admin` + that password.

No Blueprint? Create a **Web Service** manually: Runtime Python, Build `./build.sh`, Start `./start.sh`,
and add the env vars below.

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Django secret (Render can generate it) |
| `DEBUG` | `False` in production |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin account created on start if missing |
| `SEED_DEMO_DATA` | `true` loads 12 sample students when the table is empty |
| `SQLITE_PATH` | Optional; e.g. `/var/data/db.sqlite3` when using a persistent disk |
| `NODE_VERSION` / `PYTHON_VERSION` | Pin runtimes for the build |

> **SQLite on Render:** the free plan has an ephemeral filesystem, so the database resets on every deploy
> and restart (fine for demos/assignments). To keep data permanently, use a paid instance with a
> Persistent Disk mounted at `/var/data` and set `SQLITE_PATH=/var/data/db.sqlite3`.

## REST API

All endpoints except login need the header `Authorization: Token <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login/` | `{username, password}` → `{token}` |
| POST | `/api/auth/logout/` | Invalidate token |
| GET | `/api/students/` | List. Params: `search`, `status`, `course`, `year`, `ordering`, `page` |
| POST | `/api/students/` | Create |
| GET | `/api/students/{id}/` | Retrieve |
| PUT/PATCH | `/api/students/{id}/` | Update |
| DELETE | `/api/students/{id}/` | Delete |
| GET | `/api/students/stats/` | Totals, per-status counts, average GPA, per-course counts |
