# Playbook de tasa BCV para entornos multi-comercio

Fecha de revisión de fuentes: 25 de abril de 2026.

## Resumen ejecutivo
- En las fuentes oficiales revisadas, la referencia BCV se publica como tipo de cambio oficial diario.
- No se encontró una documentación pública, estable y formal de API oficial del BCV con contrato versionado para integradores.
- Por escalabilidad, la plataforma debe operar con estrategia hibrida: automatica + override manual auditado.

## Lo que sí está claro en normativa/operativa bancaria
- La banca local usa la referencia publicada por BCV para operaciones de cambio.
- El tipo de cambio de referencia BCV se describe como promedio ponderado de operaciones de mesas de cambio.

Referencias:
- Mercantil (documento de tasa de mesa con mención explícita al promedio ponderado BCV y referencia a bcv.org.ve):
  - https://www.mercantilbanco.com/mercprod/campaigns/specials/divisas/tasa_mesa.pdf
- Banco de Venezuela (condiciones de operaciones en divisas; usa tipo de cambio oficial del día para menudeo y tasa BCV para intervención):
  - https://www.bancodevenezuela.com/files/ofertaspublicas/CONDICIONES%20GENERALES%20PARA%20LAS%20OPERACIONES%20EN%20MONEDA%20EXTRANJERA.pdf

## Arquitectura recomendada para tasa (escalable)

### 1) Modelo de prioridad de fuentes
1. `tenant_rate_feed`: tasa enviada por el propio comercio (API/archivo), si existe y está vigente.
2. `central_auto_provider`: proveedor automático central (servicio externo o scraping controlado).
3. `manual_backoffice_override`: tasa manual operativa con auditoría, vencimiento y doble aprobación.
4. `last_known_good`: última tasa válida si todo lo demás falla.

### 2) Contrato de tasa interno
Campos mínimos que debes persistir por cada actualización:
- `provider`
- `value`
- `effective_at`
- `fetched_at`
- `source_type` (`automatic` | `manual`)
- `note`
- `created_by` (usuario/sistema)

### 3) Reglas de seguridad y gobierno
- Toda tasa manual debe registrar usuario, motivo y timestamp.
- La tasa manual debe tener expiración automática (ej. 24h) para evitar tasas viejas.
- Alertar si la variación diaria supera umbral (ej. 5%-10%) hasta revisión humana.

## Flujo recomendado en producción
1. Job central consulta proveedor automático en ventanas horarias configuradas.
2. Si la lectura pasa validaciones, se guarda en `exchange_rates`.
3. Si falla, queda activa `last_known_good` y se dispara alerta.
4. Backoffice puede aplicar override manual temporal.
5. API de precios siempre devuelve la tasa usada y su fuente.

## Implementación actual en este repositorio
- Endpoint de lectura: `GET /api/v1/rates/latest`
- Histórico operativo en memoria: `GET /api/v1/rates/history`
- Override manual: `POST /api/v1/rates/manual`
- Seguridad del override: header `x-admin-key` (ver `.env` -> `FX_ADMIN_KEY`)

Nota: actualmente el histórico está en memoria para ambiente de desarrollo. En producción debe persistirse en DB (`exchange_rates`) y auditarse por usuario.

## Recomendación comercial
Para maximizar clientes (cualquier comercio):
- No obligues a una sola fuente BCV.
- Ofrece onboarding por niveles:
  - Nivel A: comercio carga tasa manual diaria.
  - Nivel B: comercio entrega feed de tasa desde su ERP.
  - Nivel C: automatización total con proveedor externo + fallback manual.

