# Llamados y consultas para un comercio nuevo

## 1) Verificar API arriba
```bash
curl "https://api.tudominio.com/health"
```

## 2) Verificar perfil del comercio en API
```bash
curl "https://api.tudominio.com/api/v1/tenants/<tenantCode>/api-profile"
```

## 3) Verificar storefront (QR -> contexto)
```bash
curl "https://api.tudominio.com/api/v1/storefronts/<storefrontCode>"
```

Respuesta esperada:
- `tenantCode`
- `storeCode`
- `commerceName`
- branding (`logoUrl`, `primaryColor`, etc.)

## 4) Consultar precio por barcode
```bash
curl "https://api.tudominio.com/api/v1/prices/<barcode>?tenantCode=<tenantCode>&storeCode=<storeCode>"
```

## 5) Consultar tasa vigente
```bash
curl "https://api.tudominio.com/api/v1/rates/latest"
```

## 6) Ajuste manual de tasa (solo contingencia)
```bash
curl -X POST "https://api.tudominio.com/api/v1/rates/manual" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: <FX_ADMIN_KEY>" \
  -d '{"rate":110.15,"provider":"manual_backoffice","note":"contingencia operativa"}'
```

## 7) Ver histórico de tasa
```bash
curl "https://api.tudominio.com/api/v1/rates/history?limit=20"
```

## 8) URL final para QR de tienda
```text
https://app.tudominio.com/?storefront=<storefrontCode>
```

## 9) Generación de QR local
```bash
npm run qr:generate -- --base-url=https://app.tudominio.com --storefront=<storefrontCode> --out-dir=./tmp/qr
```

