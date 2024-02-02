#!/bin/sh

# Apply database migrations
echo "Applying database migrations..."
python transcendence/manage.py migrate

# Start server
echo "Starting server..."
python transcendence/manage.py runserver 0.0.0.0:8000
