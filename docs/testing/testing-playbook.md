# Playbook de pruebas (empresa demo + escenarios reales)

## Objetivo
Probar extremo a extremo:
1. carga de productos
2. consulta por código de barras
3. conversión USD/Bs con tasa vigente
4. manejo de tasa manual y fallback

## Ambiente local
1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install`
4. Ejecutar migraciones:
   - `psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/001_init.sql`
   - `psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/002_seed_demo.sql`
   - `psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/003_storefronts_branding.sql`
   - `psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/004_seed_storefront_demo.sql`
   - `psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/005_exchange_rates_audit_columns.sql`
5. Iniciar servicios:
   - `npm run dev:api`
   - `npm run dev:web`
   - `npm run dev:worker`

## Empresa demo incluida
- `tenantCode`: `demo-market`
- `storeCode`: `ccs-001`
- `storefrontCode` (QR): `st_demo_ccs_001`
- Barcodes de prueba:
  - `7591234567890`
  - `7590987654321`

URL web de prueba QR:
- `http://localhost:5173/?storefront=st_demo_ccs_001`

Generar QR local de prueba:
- `npm run qr:generate -- --base-url=http://localhost:5173 --storefront=st_demo_ccs_001 --out-dir=./tmp/qr`

## Pruebas API rápidas

### 1) Salud de API
```bash
curl http://localhost:4000/health
```

### 2) Precio por código
```bash
curl "http://localhost:4000/api/v1/prices/7591234567890?tenantCode=demo-market&storeCode=ccs-001"
```

### 2.1) Resolver tienda por QR (storefront)
```bash
curl "http://localhost:4000/api/v1/storefronts/st_demo_ccs_001"
```

### 3) Tasa actual
```bash
curl http://localhost:4000/api/v1/rates/latest
```

### 4) Cambiar tasa manual (simula backoffice del comercio)
```bash
curl -X POST http://localhost:4000/api/v1/rates/manual \
  -H "Content-Type: application/json" \
  -H "x-admin-key: dev-admin-key" \
  -d '{"rate":120.25,"provider":"manual_backoffice","note":"prueba operativa"}'
```

### 5) Reconsultar precio y validar conversión
```bash
curl "http://localhost:4000/api/v1/prices/7591234567890?tenantCode=demo-market&storeCode=ccs-001"
```

## Matriz mínima de QA
- Escaneo QR con `storefrontCode`: fija contexto de tienda correcto.
- Caso `barcode` existente: retorna 200 y precios en USD/Bs.
- Caso `barcode` inexistente: retorna 404.
- Cambio de tasa manual: el precio en Bs cambia y USD se mantiene.
- Error de autenticación en tasa manual: retorna 401 cuando `FX_ADMIN_KEY` está configurado.
- Flujo web móvil: escaneo + consulta + visualización.

## Pruebas de integración por formato

### CSV/Excel
- Cargar archivo con plantilla canónica.
- Verificar filas rechazadas por formato/barcode inválido.
- Verificar actualización incremental por `observedAt`.

### API
- Validar paginación y `updated_since`.
- Verificar reintentos con backoff.
- Verificar idempotencia por `(tenant, store, barcode, observedAt)`.

### DB read-only
- Validar que usuario no pueda escribir.
- Validar consulta por ventana de tiempo.
- Verificar índice en columnas de extracción.

## Recomendación de piloto
Para ganar primeros clientes rápido:
1. Arrancar con onboarding CSV/Excel (más fácil de vender).
2. Luego migrar cuentas grandes a API/DB.
3. Mantener siempre override manual de tasa como respaldo operativo.
