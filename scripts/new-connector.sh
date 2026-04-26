#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Uso: scripts/new-connector.sh <tenant-code>"
  exit 1
fi

TENANT_CODE="$1"
SAFE_NAME="$(echo "$TENANT_CODE" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-')"
TARGET_FILE="apps/worker/src/connectors/${SAFE_NAME}.connector.ts"

if [ -f "$TARGET_FILE" ]; then
  echo "Ya existe: $TARGET_FILE"
  exit 1
fi

cat > "$TARGET_FILE" <<TS
import { TenantSyncConnector } from "./types.js";

export const ${SAFE_NAME//-/_}Connector: TenantSyncConnector = {
  tenantCode: "${TENANT_CODE}",
  async fetchLatestPrices() {
    // TODO: Reemplaza esta data de ejemplo por integración real (API/CSV/DB).
    return [
      {
        barcode: "7590000000000",
        sku: "SKU-001",
        productName: "Producto Demo",
        storeCode: "store-001",
        currency: "USD",
        amount: 1.0,
        observedAt: new Date().toISOString()
      }
    ];
  }
};
TS

echo "Conector creado: $TARGET_FILE"
echo "Siguiente paso: registralo en apps/worker/src/connectors/registry.ts"
