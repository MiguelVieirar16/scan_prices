# Arquitectura escalable del proyecto

## Objetivo
Permitir que multiples comercios publiquen precios por codigo de barras en una plataforma unificada, con conversion USD/Bs usando tasa BCV.

## Principios de escalabilidad
- Multi-tenant desde el dia 1: cada comercio es un `tenant`.
- Adaptadores por conector: cada empresa se integra mediante un conector aislado.
- API estateless: se replica horizontalmente.
- Sincronizacion asincrona: worker y colas para no bloquear consultas.
- Observabilidad: jobs, logs y metricas por tenant.

## Capas del sistema
- `apps/web`: interfaz de escaneo y consulta.
- `apps/api`: consulta de precios, lectura de tasa y autenticacion.
- `apps/worker`: sincronizacion de catalogo/precios por empresa.
- `packages/*`: contratos compartidos.
- `infra/*`: DB, Redis, despliegue y monitoreo.

## Flujo base
1. Usuario escanea codigo de barras en la web.
2. Web consulta `GET /api/v1/prices/:barcode` enviando `tenantCode` y `storeCode`.
3. API busca precio vigente y tasa BCV.
4. API devuelve precio USD/Bs.
5. Worker actualiza periodicamente precios desde sistemas externos.

## Flujo QR por tienda
1. Cliente escanea QR de una tienda/sucursal.
2. QR abre web con `storefrontCode`.
3. Web resuelve `storefrontCode` en API.
4. Web fija contexto de tienda y habilita escaneo de productos.

## Endpoints base actuales
- `GET /health`
- `GET /api/v1/tenants/:tenantCode/api-profile`
- `GET /api/v1/storefronts/:storefrontCode`
- `GET /api/v1/prices/:barcode`
- `GET /api/v1/rates/latest`
- `GET /api/v1/rates/history`
- `POST /api/v1/rates/manual`
