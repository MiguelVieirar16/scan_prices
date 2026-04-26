# Arquitectura sin portal para comercios (solo lectura)

## Tu requerimiento
- El comercio NO entra a tu sistema.
- El comercio NO crea usuarios ni roles.
- Tú solo consultas su fuente de datos y actualizas tu plataforma.

## Respuesta corta: sí necesitas infraestructura propia
Para operar estable y escalar, necesitas:

1. Servidor/API
- Donde corre tu web y tus endpoints.

2. Worker de integración
- Proceso que consulta APIs/Excel/DB de cada comercio y trae datos.

3. Base de datos central
- Guarda catálogo normalizado, precios, historial, storefronts QR, logs y auditoría de tasa.

## ¿Se puede hacer sin base de datos?
- Para demo inicial, sí (memoria/archivos).
- Para negocio real multi-comercio, no es recomendable.
- Sin DB pierdes trazabilidad, estabilidad, histórico y escalabilidad.

## Conexión con cada comercio (sin que entren a tu plataforma)

### Opción A: ellos tienen API
- Tu worker consulta su API cada X minutos.
- Transformas datos al formato canónico y guardas en tu DB.

### Opción B: ellos usan Excel/CSV
- Ellos te comparten archivo por SFTP/correo/carpeta sincronizada.
- Tu worker lo procesa automáticamente.

### Opción C: ellos tienen base de datos
- Te dan usuario read-only y una vista SQL.
- Tu worker consulta solo lectura.

## Modelo operativo recomendado
- Flujo unidireccional: origen del comercio -> tu worker -> tu DB -> tu API -> cliente final.
- No necesitas que el comercio “administre” nada en tu app.

