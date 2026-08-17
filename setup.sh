#!/bin/bash
set -e

bcrypt_hash() {
  local password="$1"
  local cost="${2:-12}"

  if [ -z "$password" ]; then
    echo "Error: No password provided" >&2
    return 1
  fi

  export NODE_PATH="$(npm root -g):$NODE_PATH"
  node -e "
const bcrypt = require('bcrypt');
console.log(bcrypt.hashSync(process.argv[1], parseInt(process.argv[2])));
" "$password" "$cost"
}


RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${BOLD}${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║         dantes setup wizard           ║${NC}"
echo -e "${BOLD}${BLUE}╚═══════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Checking dependencies...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed.${NC}"
    echo "  Please install Docker from https://docs.docker.com/get-docker/ and try again."
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo -e "${RED}✗ Docker Compose is not available.${NC}"
    echo "  Please make sure you have Docker Desktop or docker-compose-plugin installed."
    exit 1
fi

echo -e "${GREEN}✓ Docker is ready${NC}"

echo -e "${YELLOW}Checking Node.js and bcrypt...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing...${NC}"
    if command -v brew &> /dev/null; then
        brew install node
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y nodejs npm
    elif command -v yum &> /dev/null; then
        sudo yum install -y nodejs npm
    else
        echo -e "${RED}✗ Cannot install Node.js automatically.${NC}"
        echo "  Please install Node.js manually and try again."
        exit 1
    fi
fi

echo -e "${GREEN}✓ Node.js is ready${NC}"

export NODE_PATH="$(npm root -g):$NODE_PATH"
if ! node -e "require('bcrypt')" 2>/dev/null; then
    echo -e "${YELLOW}bcrypt library not found. Installing globally...${NC}"
    if ! npm install -g bcrypt >/dev/null 2>&1; then
        echo -e "${RED}✗ Failed to install bcrypt globally. Trying with sudo...${NC}"
        if ! sudo npm install -g bcrypt >/dev/null 2>&1; then
            echo -e "${RED}✗ Failed to install bcrypt.${NC}"
            echo "  Try running: sudo npm install -g bcrypt"
            exit 1
        fi
    fi
fi

echo -e "${GREEN}✓ bcrypt is ready${NC}"
echo ""

if [ -f "./apps/dantes/.env" ] || [ -f "./apps/dashboard/.env" ] || [ -f "./packages/auth/.env" ] || [ -f "./packages/db/.env" ]; then
    echo -e "${YELLOW}⚠ .env files already exist.${NC}"
    read -p "  Overwrite them and reconfigure? (y/N): " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        echo "  Keeping existing .env files. Starting dantes..."
        docker compose up -d
        echo ""
        echo -e "${GREEN}✓ dantes is running at http://localhost/dashboard${NC}"
        exit 0
    fi
    echo ""
fi

echo -e "${BOLD}Let's configure your dantes instance.${NC}"
echo ""

read -p "Dashboard username (email): " USERNAME
while [[ -z "$USERNAME" ]]; do
    echo -e "${RED}  Username cannot be empty.${NC}"
    read -p "Dashboard username (email): " USERNAME
done

while true; do
    read -s -p "Dashboard password: " PASSWORD
    echo ""
    read -s -p "Confirm password: " PASSWORD_CONFIRM
    echo ""
    if [[ "$PASSWORD" == "$PASSWORD_CONFIRM" ]]; then
        break
    fi
    echo -e "${RED}  Passwords do not match. Try again.${NC}"
done

while [[ -z "$PASSWORD" ]]; do
    echo -e "${RED}  Password cannot be empty.${NC}"
    read -s -p "Dashboard password: " PASSWORD
    echo ""
done

echo ""
echo -e "${YELLOW}What is the public URL or IP where you will access this dashboard?${NC}"
echo -e "${YELLOW}For local testing, you can leave this blank.${NC}"
read -p "Public URL (default: http://localhost): " PUBLIC_URL
PUBLIC_URL=${PUBLIC_URL:-http://localhost}
PUBLIC_URL=${PUBLIC_URL%/}
echo ""
echo -e "${YELLOW}Base callback URL is the publicly accessible URL of your worker app.${NC}"
echo -e "${YELLOW}Leave blank if you'll configure this later.${NC}"
read -p "Base callback URL (optional, e.g. https://myapp.com): " BASE_CALLBACK_URL
echo ""

if command -v openssl &> /dev/null; then
    JWT_SECRET=$(openssl rand -base64 48)
elif command -v node &> /dev/null; then
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(36).toString('base64'))")
else
    JWT_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
fi

echo -e "${GREEN}✓ JWT secret generated automatically${NC}"

echo -e "${YELLOW}Hashing password with Node.js bcrypt...${NC}"
HASHED_PASSWORD=$(bcrypt_hash "$PASSWORD" "12")
if [[ ${#HASHED_PASSWORD} -ne 60 || ! "$HASHED_PASSWORD" =~ ^\$2[aby]\$[0-9]{2}\$ ]]; then
    echo -e "${RED}✗ Generated password hash is malformed (expected 60 chars, got ${#HASHED_PASSWORD}).${NC}"
    echo "  Refusing to write .env with a bad credential."
    exit 1
fi
echo -e "${GREEN}✓ Password hashed successfully${NC}"

cat > ./apps/dantes/.env << EOF
# Generated by dantes setup script on $(date)
# Do not share this file — it contains secrets

# dantes specific paths
DANTES_PORT="6969"
FRONTEND_URL="${PUBLIC_URL}/dashboard"
BASE_CALLBACK_URL="${BASE_CALLBACK_URL}"

WAIT_TIME_MS="1000"
DEFAULT_WAIT_TIME_MS="500"
MAX_JOB_CONCURRENCY="5"
DEFAULT_REPLY_WAIT_TIME="600000"

# db package paths
DB_FILE_PATH="/app/data/dantes.db"

# auth package paths
JWT_SECRET="${JWT_SECRET}"
HASH_ROUNDS="12"

USERNAME=${USERNAME}
PASSWORD=${HASHED_PASSWORD}
EOF

cat > ./packages/auth/.env << EOF
# Generated by dantes setup script on $(date)
# Do not share this file — it contains secrets

JWT_SECRET="${JWT_SECRET}"
HASH_ROUNDS="12"

USERNAME=${USERNAME}
PASSWORD=${HASHED_PASSWORD}
EOF

cat > ./packages/db/.env << EOF
# Generated by dantes setup script on $(date)
# Do not share this file — it contains secrets

DB_FILE_PATH="../../dantes.db"
EOF

cat > ./apps/dashboard/.env << EOF
# Generated by dantes setup script on $(date)

VITE_ENV="production"
EOF

echo -e "${GREEN}✓ .env files written:${NC}"
echo "  - ./apps/dantes/.env"
echo "  - ./apps/dashboard/.env"
echo "  - ./packages/auth/.env"
echo "  - ./packages/db/.env"
echo ""

echo -e "${YELLOW}Building and starting dantes (this may take a few minutes on first run)...${NC}"
echo ""

docker compose up -d --build

echo ""
echo -e "${BOLD}${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║   ✓ dantes is up and running!             ║${NC}"
echo -e "${BOLD}${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Dashboard: ${BLUE}${PUBLIC_URL}/dashboard${NC}"
echo -e "  API:       ${BLUE}${PUBLIC_URL}/api${NC}"
echo ""
echo -e "  Login with the credentials you just set up."
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  Stop dantes:    ${BOLD}docker compose down${NC}"
echo -e "  View logs:      ${BOLD}docker compose logs -f${NC}"
echo -e "  Restart:        ${BOLD}docker compose restart${NC}"
echo ""