# Paso a paso de implementacion (con rutas exactas)

## Fase 1 - Base del proyecto
1. Crear monorepo en raiz:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps`
- `/Users/miguelvieira/Desktop/scan_prices_web/packages`
- `/Users/miguelvieira/Desktop/scan_prices_web/infra`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs`

2. Configurar raiz del workspace:
- `/Users/miguelvieira/Desktop/scan_prices_web/package.json`
- `/Users/miguelvieira/Desktop/scan_prices_web/tsconfig.base.json`
- `/Users/miguelvieira/Desktop/scan_prices_web/.env.example`
- `/Users/miguelvieira/Desktop/scan_prices_web/docker-compose.yml`

## Fase 2 - Paquetes compartidos
3. Definir contratos de datos compartidos:
- `/Users/miguelvieira/Desktop/scan_prices_web/packages/shared-types/src/index.ts`

4. Crear config centralizada:
- `/Users/miguelvieira/Desktop/scan_prices_web/packages/config/src/index.ts`

5. Crear logger compartido:
- `/Users/miguelvieira/Desktop/scan_prices_web/packages/logger/src/index.ts`

## Fase 3 - API multi-comercio
6. Levantar servidor HTTP:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/api/src/index.ts`

7. Crear rutas:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/api/src/modules/health/health.route.ts`
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/api/src/modules/prices/price.route.ts`
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/api/src/modules/integrations/integration.route.ts`
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/api/src/modules/rates/rate.route.ts`
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/api/src/modules/storefronts/storefront.route.ts`

8. Crear servicios de negocio:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/api/src/modules/prices/price.service.ts`
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/api/src/modules/rates/rate.service.ts`

9. Manejo de errores HTTP:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/api/src/utils/http-error-handler.ts`

## Fase 4 - Web de escaneo
10. Crear app web:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/web/src/App.tsx`
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/web/src/main.tsx`

11. Crear modulo de escaneo:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/web/src/features/scanner/useBarcodeScanner.ts`
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/web/src/components/BarcodeScannerPanel.tsx`

12. Crear cliente API para consulta:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/web/src/services/priceApi.ts`

## Fase 5 - Worker de sincronizacion
13. Definir contrato de conectores:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/worker/src/connectors/types.ts`

14. Crear conectores por empresa:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/worker/src/connectors/templates/api-connector.template.ts`
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/worker/src/connectors/templates/csv-connector.template.ts`
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/worker/src/connectors/templates/db-connector.template.ts`

15. Registrar conectores activos:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/worker/src/connectors/registry.ts`

16. Ejecutar job de sincronizacion:
- `/Users/miguelvieira/Desktop/scan_prices_web/apps/worker/src/jobs/run-full-sync.job.ts`

## Fase 6 - Base de datos
17. Crear esquema multi-tenant:
- `/Users/miguelvieira/Desktop/scan_prices_web/infra/migrations/001_init.sql`
- `/Users/miguelvieira/Desktop/scan_prices_web/infra/migrations/003_storefronts_branding.sql`
- `/Users/miguelvieira/Desktop/scan_prices_web/infra/migrations/005_exchange_rates_audit_columns.sql`

18. Crear datos demo:
- `/Users/miguelvieira/Desktop/scan_prices_web/infra/migrations/002_seed_demo.sql`
- `/Users/miguelvieira/Desktop/scan_prices_web/infra/migrations/004_seed_storefront_demo.sql`

## Fase 7 - Documentacion de negocio y operacion
19. Arquitectura y runbook:
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/architecture/overview.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/architecture/qr-storefront-model.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/architecture/multi-commerce-pages-strategy.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/operations/runbook.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/operations/hosting-and-db-recommendation.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/deployment/product-launch-plan.md`

20. Integracion de empresas y tasa BCV:
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/integration/enterprise-onboarding.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/integration/api-per-commerce-playbook.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/integration/bcv-rate-strategy.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/integration/bcv-rate-playbook.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/integration/data-ingestion-formats.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/integration/no-portal-architecture.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/integration/commercial-discovery-script.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/testing/testing-playbook.md`

21. Desarrollo de módulos backend:
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/development/how-to-create-api-endpoint.md`

22. Onboarding de comercios en producción:
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/onboarding/new-commerce-zero-to-live.md`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/onboarding/new-commerce-sql-template.sql`
- `/Users/miguelvieira/Desktop/scan_prices_web/docs/onboarding/new-commerce-api-call-examples.md`
