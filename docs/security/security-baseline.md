# Seguridad base

## Aplicacion
- JWT por tenant/rol para endpoints privados.
- Rate limiting por IP y por tenant.
- Auditoria de cambios en precios/tasas.

## Datos
- PII minima por defecto.
- Cifrado en reposo y en transito.
- Logs sin secretos ni tarjetas.

## Integraciones
- Principio de minimo privilegio.
- Rotacion de credenciales automatizada.
- Validacion de esquema antes de persistir.
