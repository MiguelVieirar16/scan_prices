# Guía 0 -> Live para agregar un comercio nuevo

## Objetivo
Conectar un comercio nuevo sin que use panel de administración, solo por extracción de datos desde su sistema.

## Etapa 1: Descubrimiento comercial/técnico

### Qué preguntas hacer
1. ¿Dónde están los productos/precios hoy? (API, Excel/CSV, DB)
2. ¿Cada cuánto actualizan precios?
3. ¿Manejan precios por sucursal?
4. ¿Usan barcode EAN/UPC?
5. ¿Pueden compartir exportación incremental?

### Resultado esperado
Elegir tipo de integración:
- API
- CSV/Excel
- DB read-only

Referencia: `docs/integration/commercial-discovery-script.md`

## Etapa 2: Crear comercio en tu plataforma

### 2.1 Crear tenant, store y storefront en DB
Usa plantilla SQL:
- `docs/onboarding/new-commerce-sql-template.sql`

### 2.2 Definir branding de la página
Campos típicos:
- `commerce_public_name`
- `logo_url`
- `primary_color`
- `secondary_color`
- `font_family`
- `welcome_message`

## Etapa 3: Conectar fuente de datos del comercio

### Opción A: API del comercio
1. Crear conector:
```bash
scripts/new-connector.sh <tenant-code>
```
2. Implementar llamada HTTP real en el conector.
3. Registrar conector en `apps/worker/src/connectors/registry.ts`.

### Opción B: CSV/Excel
1. Acordar plantilla canónica de columnas.
2. Configurar recepción (SFTP o carpeta sincronizada).
3. Parsear y mapear al contrato interno.

### Opción C: DB read-only
1. Solicitar usuario de solo lectura.
2. Solicitar vista SQL de exportación.
3. Configurar query incremental por `observed_at`.

## Etapa 4: Probar ingestión y consultas

Referencia completa de llamados:
- `docs/onboarding/new-commerce-api-call-examples.md`

### 4.1 Probar storefront (QR context)
```bash
curl "https://api.tudominio.com/api/v1/storefronts/<storefrontCode>"
```

### 4.2 Probar lookup de precio
```bash
curl "https://api.tudominio.com/api/v1/prices/<barcode>?tenantCode=<tenantCode>&storeCode=<storeCode>"
```

### 4.3 Probar tasa
```bash
curl "https://api.tudominio.com/api/v1/rates/latest"
```

## Etapa 5: Generar QR del comercio

### 5.1 Generar QR PNG + SVG
```bash
npm run qr:generate -- --base-url=https://app.tudominio.com --storefront=<storefrontCode> --out-dir=./tmp/qr
```

### 5.2 Entregar artes a tienda
Entregar:
- PNG para impresión rápida
- SVG para diseño profesional
- URL TXT para validación

## Etapa 6: Validación en tienda física
1. Escanear QR desde móvil real.
2. Confirmar que abre la tienda correcta.
3. Escanear 5-10 productos reales.
4. Validar precios USD/Bs con caja.
5. Validar tiempo de respuesta en hora pico.

## Etapa 7: Activación y operación
1. Marcar storefront como activo.
2. Programar sync (cada 1-5 minutos según negocio).
3. Activar alertas.
4. Seguimiento diario primera semana.

## Cambiar diseño de la web por comercio
No creas una app nueva. Cambias branding por storefront:
- colores
- tipografía
- logo
- mensaje

El frontend aplica el estilo automáticamente al cargar el `storefrontCode`.

## Checklist de salida a producción del comercio
- [ ] Datos del comercio mapeados
- [ ] Conector funcionando
- [ ] Storefront y branding creados
- [ ] QR generado y probado
- [ ] Validación en tienda completada
- [ ] Monitoreo activo
