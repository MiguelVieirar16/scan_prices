#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Archivo .env creado desde .env.example"
fi

echo "Instalando dependencias..."
npm install

echo "Levantando servicios base (postgres + redis)..."
docker compose up -d

if command -v psql >/dev/null 2>&1; then
  echo "Aplicando migraciones..."
  psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/001_init.sql
  psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/002_seed_demo.sql
  psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/003_storefronts_branding.sql
  psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/004_seed_storefront_demo.sql
  psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/005_exchange_rates_audit_columns.sql
else
  echo "psql no esta disponible. Aplica migraciones manualmente con los archivos de infra/migrations."
fi

echo "Listo. Ejecuta ahora:"
echo "  npm run dev:api"
echo "  npm run dev:web"
echo "  npm run dev:worker"
