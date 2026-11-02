#!/usr/bin/env bash
# Render build step: build React, copy it into Django, install Python deps, collect static files.
set -o errexit

echo "==> Building frontend"
(cd frontend && npm install --no-audit --no-fund && npm run build)
rm -rf backend/frontend_dist
cp -r frontend/dist backend/frontend_dist

echo "==> Installing backend"
cd backend
python3 -m pip install --upgrade pip
pip install -r requirements.txt
python3 manage.py collectstatic --noinput