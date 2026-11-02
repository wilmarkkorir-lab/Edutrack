#!/usr/bin/env bash
# Render start step: prepare the database, then serve with gunicorn.
set -o errexit
cd backend
python manage.py migrate --noinput
python manage.py ensure_admin
if [ "${SEED_DEMO_DATA:-false}" = "true" ]; then python manage.py seed_students; fi
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2
