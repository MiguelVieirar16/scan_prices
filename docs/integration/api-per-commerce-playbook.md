# API por comercio: cómo hacerlo bien

## Pregunta 1: ¿debo crear una API separada por comercio?
Respuesta recomendada: **no**.

Lo ideal es una sola API multi-comercio y distinguir por:
- `tenantCode`
- `storeCode`
- `storefrontCode`

Así evitas mantener 50 APIs distintas cuando tengas 50 clientes.

## Pregunta 2: ¿cada API debe ser igual?
Sí, el contrato de salida hacia tu app debe ser igual para todos.

### Regla de oro
- **Entrada por comercio** puede variar (API propia, Excel, DB).
- **Salida de tu API** debe ser estándar.

Ejemplo de respuesta estándar de precio:
- `productName`
- `barcode`
- `priceUsd`
- `priceVes`
- `exchangeRate`
- `exchangeRateProvider`

## Pregunta 3: ¿cómo represento “API por comercio” sin duplicar backend?
Tienes 2 formas seguras:

1. Contexto por query/path (actual)
- `GET /api/v1/prices/:barcode?tenantCode=...&storeCode=...`

2. Contexto por storefront (QR)
- QR -> `?storefront=...`
- Frontend resuelve tienda con:
  - `GET /api/v1/storefronts/:storefrontCode`

## Endpoint nuevo agregado para este modelo
- `GET /api/v1/tenants/:tenantCode/api-profile`

Sirve para consultar capacidades del comercio dentro de una API única.

Ejemplo:
```bash
curl "http://localhost:4000/api/v1/tenants/demo-market/api-profile"
```

## Cuándo sí separar APIs físicamente
Solo en casos enterprise extremos (compliance/aislamiento legal), por ejemplo:
- banca/finanzas con requisitos regulatorios específicos
- clientes que exijan infraestructura dedicada por contrato

En casi todos los casos comerciales, una API multi-tenant bien diseñada es suficiente.

