#!/bin/bash
set -e

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

echo -e "${YELLOW}Stopping containers...${NC}"
git fetch origin
git reset --hard origin/main

echo -e "${YELLOW}Pulling latest changes...${NC}"
git pull origin main

echo -e "${YELLOW}Removing cached images...${NC}"
docker rmi dantes-dantes-server dantes-dantes-dashboard 2>/dev/null || true

echo -e "${YELLOW}Rebuilding and starting...${NC}"
echo "N" | ./setup.sh

echo ""
echo -e "${BOLD}${GREEN}✓ Reload complete!${NC}"
echo ""
echo -e "${YELLOW}Server logs (Ctrl+C to exit):${NC}"
docker logs dantes-server --follow
