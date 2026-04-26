# Modelo QR por tienda (sin login de comercios)

## Qué pasa cuando el cliente escanea un QR
1. El cliente entra a la tienda física.
2. Escanea el QR impreso de esa tienda.
3. El QR abre una URL pública de tu plataforma:
   - `https://tu-dominio.com/?storefront=st_demo_ccs_001`
4. Tu web pide al API la configuración de ese `storefront`.
5. La web queda bloqueada al contexto de esa tienda y permite escanear códigos de barras.

## Un QR por comercio/sucursal
- Cada tienda o sucursal tiene su propio `storefrontCode`.
- Cada `storefrontCode` tiene su QR único.
- Así puedes tener cientos o miles de QR sin cambiar la app.

## Endpoint clave
- `GET /api/v1/storefronts/:storefrontCode`

## Ventaja de `storefrontCode`
- No expones internamente cómo mapeas tenant/sucursal.
- Puedes desactivar un QR puntual sin tocar toda la cuenta del comercio.
- Puedes mover una tienda a otra configuración manteniendo el mismo flujo de usuario.

## Estado actual en el proyecto
- Frontend soporta `?storefront=...` y fija automáticamente tienda.
- API resuelve `storefrontCode` a `tenantCode + storeCode`.

