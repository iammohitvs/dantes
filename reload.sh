#!/bin/bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${BOLD}${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║            dantes reload              ║${NC}"
echo -e "${BOLD}${BLUE}╚═══════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Syncing source...${NC}"
git fetch origin
git reset --hard origin/main

echo -e "${YELLOW}Building images (current deployment stays up)...${NC}"
if [[ "${1:-}" == "--clean" ]]; then
    docker compose build --no-cache
else
    docker compose build
fi

echo -e "${YELLOW}Swapping over...${NC}"
docker compose up -d --remove-orphans

docker compose ps

echo ""
echo -e "${BOLD}${GREEN}✓ Reload complete!${NC}"
echo ""
echo -e "${YELLOW}Server logs (Ctrl+C to exit):${NC}"
docker logs dantes-server --follow
