# Onboarding de empresas (supermercados y centros comerciales)

## Modelos de conexion soportados

### 1) API del comercio (recomendado)
Cuando la empresa tiene ERP/POS con API.
- Entradas: endpoint de productos/precios, credenciales, frecuencia de sync.
- Implementacion: partir de `apps/worker/src/connectors/templates/api-connector.template.ts` y crear conector en `apps/worker/src/connectors/<tenant>.connector.ts`.
- Ventaja: casi en tiempo real y menor friccion operativa.

### 2) Archivo CSV por SFTP/FTP seguro
Cuando no tienen API.
- Entradas: formato CSV acordado + carpeta SFTP + usuario tecnico.
- Implementacion: partir de `apps/worker/src/connectors/templates/csv-connector.template.ts`.
- Ventaja: facil para comercios tradicionales.

### 3) Replica de base de datos solo lectura
Cuando tienen DB propia y equipo tecnico.
- Entradas: usuario read-only, IP allowlist, vistas SQL.
- Implementacion: partir de `apps/worker/src/connectors/templates/db-connector.template.ts`.
- Contrato SQL sugerido: `docs/integration/sql-view-contract.sql`.
- Ventaja: maxima cobertura y baja dependencia de cambios en ERP.

## Documentos complementarios
- Estrategia operativa de tasa BCV: `docs/integration/bcv-rate-playbook.md`
- Formatos de carga (Excel/CSV/API/DB): `docs/integration/data-ingestion-formats.md`
- Plan de pruebas E2E: `docs/testing/testing-playbook.md`
- Arquitectura sin portal para comercios: `docs/integration/no-portal-architecture.md`
- Guion de descubrimiento con empresas: `docs/integration/commercial-discovery-script.md`

## Contrato minimo de datos por comercio
- `barcode` (EAN13/EAN8/UPC)
- `sku`
- `productName`
- `storeCode`
- `currency` (`USD` o `VES`)
- `amount`
- `observedAt`

## Paso a paso para integrar una empresa nueva
1. Crear tenant en tabla `tenants` y sucursales en `stores`.
2. Crear registro en `integration_connections` con tipo de conector.
3. Construir conector del tenant implementando `TenantSyncConnector`.
4. Registrar el conector en `apps/worker/src/connectors/registry.ts`.
5. Ejecutar sync inicial y validar calidad de datos.
6. Activar schedule (cada 1-5 minutos o segun SLA).
7. Monitorear `sync_jobs` y alertas de error.

## Recomendaciones de seguridad
- Usar credenciales por tenant, nunca compartidas.
- Guardar secretos en gestor seguro (AWS Secrets Manager, GCP Secret Manager, Vault).
- Crear usuarios de solo lectura para DB externas.
- Cifrar transito (TLS) y restringir por IP.

## Estandar para escalado
- Todo conector nuevo debe exponer exactamente el mismo contrato (`RemotePriceRow`).
- El core nunca conoce detalles del ERP de cada comercio.
- La complejidad queda encapsulada por conector.
