# Plan de despliegue para lanzar el producto al aire

## Objetivo
Publicar la plataforma en producción con:
- SSL activo
- frontend público para QR por tienda
- API escalable
- worker de sincronización
- base de datos administrada
- monitoreo y rollback

## Arquitectura recomendada (producción)
- Frontend: Vercel
- API + Worker + Cron: Render
- Base de datos: Supabase Postgres
- DNS + WAF opcional: Cloudflare

Dominios sugeridos:
- `app.tudominio.com` -> web
- `api.tudominio.com` -> API
- worker sin acceso público

## Fase 0: Pre-lanzamiento (D-7 a D-3)
1. Crear proyecto Supabase.
2. Cargar migraciones `001` a `004`.
3. Configurar API y Worker en Render.
4. Configurar frontend en Vercel.
5. Configurar DNS y SSL.
6. Cargar secretos (API keys, `FX_ADMIN_KEY`, `DATABASE_URL`).

## Fase 1: Smoke test técnico (D-2)
1. `GET /health`
2. `GET /api/v1/storefronts/:storefrontCode`
3. `GET /api/v1/prices/:barcode?tenantCode=...&storeCode=...`
4. `GET /api/v1/rates/latest`
5. `POST /api/v1/rates/manual` (solo admin)
6. Ejecutar worker manual y validar logs.

## Fase 2: Piloto controlado (D-1)
1. Activar 1 comercio y 1 sucursal.
2. Imprimir y colocar QR físico.
3. Monitorear 24 horas:
- latencia API
- errores 4xx/5xx
- jobs de sincronización
- tasa activa

## Fase 3: Go-live (Día 0)
1. Activar dominios definitivos.
2. Activar alertas de errores y uptime.
3. Validar consultas reales en tienda.
4. Congelar cambios de código durante ventana crítica.

## Variables de entorno mínimas

### API / Worker
- `NODE_ENV=production`
- `DATABASE_URL=...`
- `REDIS_URL=...` (si usas colas)
- `API_PORT=4000`
- `FX_PROVIDER=bcv`
- `FX_FALLBACK_RATE=...`
- `FX_ADMIN_KEY=...`

### Frontend
- `VITE_API_BASE_URL=https://api.tudominio.com`

## Seguridad mínima obligatoria
1. HTTPS en frontend y API.
2. WAF/rate limit en API.
3. Secretos en platform secrets, nunca en git.
4. usuarios read-only para DB externas.
5. logs de auditoría de tasa manual y sincronizaciones.

## Rollback plan
1. Mantener deploy anterior listo para rollback 1-click.
2. Mantener migraciones reversibles si cambias esquema crítico.
3. Mantener última tasa válida en cache.
4. Si falla worker, API sigue respondiendo con última data válida.

## Checklist final de lanzamiento
- [ ] SSL válido en todos los dominios
- [ ] Migraciones aplicadas
- [ ] Seed inicial de storefronts listo
- [ ] Endpoints smoke test OK
- [ ] QR de tiendas impresos/probados
- [ ] Alertas activas
- [ ] Backups verificados

