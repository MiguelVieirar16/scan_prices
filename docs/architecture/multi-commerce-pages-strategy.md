# Estrategia de páginas web por comercio (sin duplicar apps)

## Respuesta corta
Sí puedes crear una carpeta para "páginas por comercio", pero para escalar no conviene tener un proyecto web distinto por tienda.

## Recomendación principal (escalable)
- Una sola app web multi-tenant.
- Cada comercio se personaliza por datos (DB), no por código duplicado.
- Cada QR apunta a una URL con `storefrontCode` o subdominio.

Ejemplos:
- `https://app.tudominio.com/?storefront=st_zapatos_sambil_01`
- `https://zapatos-sambil.tudominio.com`

## Cuándo NO conviene una carpeta por comercio
No conviene crear:
- `apps/web-tiendab`
- `apps/web-tiendac`
- `apps/web-tiendad`

Problemas:
- costos de mantenimiento por cada tienda
- más riesgo de errores
- despliegues lentos
- cambios repetidos en N proyectos

## Qué sí puedes tener en carpetas
Puedes tener assets o plantillas reutilizables:
- `apps/web/src/themes/`
- `apps/web/src/templates/`
- `apps/web/src/branding/`
- `apps/web/src/storefront/`

Pero la personalización final debe venir desde DB:
- `logo_url`
- `primary_color`
- `secondary_color`
- `font_family`
- `welcome_message`
- `terms_url`

## Modelo de datos recomendado para páginas personalizadas

Tabla `storefronts`
- `id`
- `storefront_code` (único)
- `tenant_id`
- `store_id`
- `slug`
- `custom_domain` (opcional)
- `is_active`

Tabla `storefront_branding`
- `storefront_id`
- `commerce_public_name`
- `mall_name`
- `logo_url`
- `primary_color`
- `secondary_color`
- `font_family`
- `hero_text`

Con esto puedes tener miles de "páginas" sin miles de repos.

## Flujo final
1. Usuario escanea QR de tienda.
2. Entra a URL pública con `storefrontCode`.
3. Frontend consulta configuración del storefront.
4. Renderiza diseño personalizado de esa tienda.
5. Escanea códigos de barras y consulta precios.

