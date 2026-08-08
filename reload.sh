#!/bin/bash
set -e

echo "Stopping containers..."
docker compose down

echo "Pulling latest changes..."
git pull

echo "Removing cached images..."
docker rmi dantes-dantes-server dantes-dantes-dashboard 2>/dev/null || true

echo "Rebuilding and starting..."
echo "N" | ./setup.sh

echo ""
echo "Server logs (Ctrl+C to exit):"
docker logs dantes-server --follow
