# Runbook operativo

## Levantar ambiente local

1. `cp .env.example .env`
2. `docker compose up -d`
3. Aplicar migraciones de `infra/migrations`.
4. Ejecutar API, Web y Worker en terminales separadas.

## Checklist de produccion

- Migraciones aplicadas.
- Redis y DB con backup habilitado.
- Secrets cargados por tenant.
- Monitoreo y alertas activas.

## Alertas sugeridas

- Sync sin ejecucion > 10 minutos por tenant.
- Error rate API > 2% en 5 minutos.
- Tasa BCV sin actualizacion > 24 horas.

## Operación de tasa manual (contingencia)

- Endpoint: `POST /api/v1/rates/manual`
- Header: `x-admin-key` (configurado en `FX_ADMIN_KEY`)
- Uso: solo para contingencias; siempre dejar `note` con motivo.
- Comportamiento local: si `FX_ADMIN_KEY` está vacío y `NODE_ENV != production`, se permite override sin llave para facilitar pruebas.

## Pruebas

- Playbook E2E: `docs/testing/testing-playbook.md`
- Plan de despliegue: `docs/deployment/product-launch-plan.md`
- Onboarding 0->Live: `docs/onboarding/new-commerce-zero-to-live.md`
- Llamados API onboarding: `docs/onboarding/new-commerce-api-call-examples.md`

## Operación de QR por tienda

- Cada sucursal debe tener un `storefrontCode` único.
- El QR apunta a `https://tu-dominio.com/?storefront=<storefrontCode>`.
- Si una tienda sale de servicio, se desactiva su `storefrontCode`.
- Para generar archivos QR usa: `npm run qr:generate -- --base-url=https://app.tudominio.com --storefront=<storefrontCode>`.
