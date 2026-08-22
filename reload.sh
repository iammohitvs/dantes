#!/bin/bash
set -euo pipefail

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
