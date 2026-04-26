# Recomendación de base de datos y hosting (producción)

## Tu pregunta
"¿Necesito base de datos y servidor aunque el comercio no entre a mi sistema?"

## Respuesta
Sí. Para operar de forma profesional y escalable necesitas infraestructura propia:
- DB central
- API
- Worker de integraciones
- Frontend público

Aunque el comercio no inicie sesión, tu plataforma necesita almacenar y servir datos consolidados.

## Stack recomendado (fácil y escalable)

### Base de datos
- **Supabase (Postgres administrado)**
- Ventajas: Postgres real, backups, conexión SSL, buena DX.

### Frontend (páginas/QR)
- **Vercel** o **Cloudflare Pages**
- Ventajas: SSL automático, CDN global, custom domains/wildcards.

### API + Worker
- **Render** o **Railway**
- Ventajas: web services + background workers + cron jobs + SSL automático.

### DNS y seguridad perimetral (opcional, recomendado)
- **Cloudflare** delante de frontend/API para WAF, rate limiting y protección adicional.

## Topología recomendada
- `app.tudominio.com` -> frontend
- `api.tudominio.com` -> API
- Worker (sin dominio público) -> sincroniza datos de comercios
- Supabase -> base de datos central

## ¿Y si quiero todo en un solo proveedor?
- Opción simple: Render (frontend/API/worker + Postgres administrado)
- Opción flexible: Supabase (DB) + Vercel (frontend) + Render (API/worker)

## Seguridad mínima obligatoria
- SSL/TLS en todos los dominios
- secretos en variables de entorno
- llaves de integración por comercio
- usuario read-only para DB externas
- logs de auditoría de sincronizaciones
- backups + prueba de restauración mensual

## Checklist de arranque real
1. Comprar dominio.
2. Configurar DNS y SSL.
3. Desplegar frontend en Vercel o Cloudflare Pages.
4. Desplegar API y worker en Render o Railway.
5. Conectar `DATABASE_URL` de Supabase a API/worker.
6. Configurar jobs de sincronización por comercio.
7. Activar monitoreo y alertas.

