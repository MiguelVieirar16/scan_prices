# Scan Prices Platform

Plataforma multi-comercio para escaneo de códigos de barras y consulta de precios en Bs y USD con tasa BCV.

## Estructura

- `apps/web`: interfaz para escanear y consultar precios.
- `apps/api`: API multi-tenant (comercios/sucursales).
- `apps/worker`: sincronizador de precios desde sistemas externos.
- `packages/*`: tipos y utilidades compartidas.
- `infra/*`: base de datos, docker y observabilidad.
- `docs/*`: arquitectura, integraciones y operación.

## Inicio rápido

1. Copiar variables de entorno:
```bash
cp .env.example .env
```
2. Levantar infraestructura:
```bash
docker compose up -d
```
3. Aplicar esquema y semilla demo:
```bash
psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/001_init.sql
psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/002_seed_demo.sql
psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/003_storefronts_branding.sql
psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/004_seed_storefront_demo.sql
psql postgres://scan_user:scan_password@localhost:5432/scan_prices -f infra/migrations/005_exchange_rates_audit_columns.sql
```
4. Ejecutar API, Web y Worker (en terminales separadas):
```bash
npm run dev:api
npm run dev:web
npm run dev:worker
```

> Nota: este repositorio incluye estructura y base de código para arrancar. Debes instalar dependencias por workspace con `npm install` en la raíz.

## Endpoint de prueba

```bash
curl \"http://localhost:4000/api/v1/prices/7591234567890?tenantCode=demo-market&storeCode=ccs-001\"
```

## Flujo QR por tienda

URL de ejemplo para un QR de una sucursal:

```text
https://tu-dominio.com/?storefront=st_demo_ccs_001
```

Resolver configuración de tienda del QR:

```bash
curl \"http://localhost:4000/api/v1/storefronts/st_demo_ccs_001\"
```

Generar QR:

```bash
npm run qr:generate -- --base-url=http://localhost:5173 --storefront=st_demo_ccs_001 --out-dir=./tmp/qr
```

## Tasa (operación y pruebas)

```bash
# Consultar tasa actual
curl http://localhost:4000/api/v1/rates/latest

# Ajustar tasa manual (contingencia/backoffice)
curl -X POST http://localhost:4000/api/v1/rates/manual \\
  -H \"Content-Type: application/json\" \\
  -H \"x-admin-key: dev-admin-key\" \\
  -d '{\"rate\":120.25,\"provider\":\"manual_backoffice\",\"note\":\"ajuste de prueba\"}'
```

## Documentación clave
- Arquitectura: `docs/architecture/overview.md`
- Modelo QR por tienda: `docs/architecture/qr-storefront-model.md`
- Estrategia de páginas por comercio: `docs/architecture/multi-commerce-pages-strategy.md`
- Paso a paso de construcción: `docs/architecture/step-by-step-build.md`
- Plan de despliegue productivo: `docs/deployment/product-launch-plan.md`
- Onboarding de comercios: `docs/integration/enterprise-onboarding.md`
- API por comercio (estrategia): `docs/integration/api-per-commerce-playbook.md`
- Arquitectura sin portal de comercios: `docs/integration/no-portal-architecture.md`
- Guion comercial/técnico de visita: `docs/integration/commercial-discovery-script.md`
- Recomendación de hosting y DB: `docs/operations/hosting-and-db-recommendation.md`
- Onboarding 0->Live de comercio: `docs/onboarding/new-commerce-zero-to-live.md`
- SQL template de onboarding: `docs/onboarding/new-commerce-sql-template.sql`
- Llamados API de onboarding: `docs/onboarding/new-commerce-api-call-examples.md`
- Tasa BCV (playbook): `docs/integration/bcv-rate-playbook.md`
- Formatos de carga (Excel/CSV/API/DB): `docs/integration/data-ingestion-formats.md`
- Pruebas E2E: `docs/testing/testing-playbook.md`
- Crear endpoints en la API: `docs/development/how-to-create-api-endpoint.md`
