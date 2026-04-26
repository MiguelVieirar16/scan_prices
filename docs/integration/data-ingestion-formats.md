# Formatos de carga de productos y precios (adaptable a cualquier comercio)

## Objetivo
Estandarizar la entrada de datos para que cualquier comercio se conecte por el canal que ya usa hoy:
- Excel/CSV
- API
- Base de datos read-only

## Patrón operativo en retail (resumen)
Muchas plataformas comerciales soportan carga masiva por CSV/Excel y también APIs:
- Shopify: import/export de productos e inventario por CSV.
  - https://help.shopify.com/en/manual/products/import-export/using-csv
  - https://help.shopify.com/en/manual/products/inventory/setup/inventory-csv
- Odoo: importación de productos y uso de códigos de barras.
  - https://www.odoo.com/documentation/18.0/applications/sales/sales/products_prices/products/import.html
  - https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/barcode/setup/software.html
- SAP Business One: importación de artículos y listas de precio por Excel/DTW.
  - https://help.sap.com/docs/SAP_BUSINESS_ONE/25bde9551224405e84e69c760e272e89/4c942f55d673bc06e10000000a441470.html

## Contrato canónico interno (tu plataforma)
Todos los conectores deben terminar en este contrato:
- `barcode`
- `sku`
- `productName`
- `storeCode`
- `currency` (`USD` o `VES`)
- `amount`
- `observedAt`

## Formato 1: CSV/Excel

### Plantilla recomendada
```csv
barcode,sku,productName,storeCode,currency,amount,observedAt
7591234567890,HAR-001,Harina de Maiz 1Kg,ccs-001,USD,1.60,2026-04-25T10:00:00-04:00
7590987654321,LEC-001,Leche Entera 1L,ccs-001,USD,2.15,2026-04-25T10:00:00-04:00
```

### Reglas
- `barcode` siempre como texto (no número) para no perder ceros a la izquierda.
- Separar catálogo y precio por sucursal si el negocio lo requiere.
- Si usan Excel, exportar a UTF-8 CSV antes de enviar.

## Formato 2: API

### Endpoint esperado del comercio (ejemplo)
`GET /catalog/prices?updated_since=...`

### Respuesta JSON ejemplo
```json
[
  {
    "barcode": "7591234567890",
    "sku": "HAR-001",
    "productName": "Harina de Maiz 1Kg",
    "storeCode": "ccs-001",
    "currency": "USD",
    "amount": 1.6,
    "observedAt": "2026-04-25T10:00:00-04:00"
  }
]
```

## Formato 3: DB read-only
- Crear vista SQL de exportación y otorgar usuario de sólo lectura.
- Contrato sugerido: ver `docs/integration/sql-view-contract.sql`.

## Mapeo por tipo de comercio
- Tiendas pequeñas: Excel/CSV (onboarding en días).
- Cadenas medianas: SFTP + CSV incremental.
- Cadenas grandes: API o réplica DB read-only.

## KPI de onboarding
- Tiempo de integración por comercio.
- % de filas válidas en primera carga.
- Frecuencia real de actualización de precios.
- Tiempo entre cambio de precio en origen y disponibilidad en app.

