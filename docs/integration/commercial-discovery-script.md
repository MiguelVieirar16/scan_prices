# Guion real para visitar una empresa y conectarla

## Objetivo de la visita
Confirmar cómo tienen cargados productos/precios y elegir el canal de integración más fácil para ellos.

## Script breve (hablado)
"Nosotros colocamos un QR por tienda para que sus clientes consulten precios al escanear productos. No necesitan entrar a ningún sistema nuestro. Solo necesitamos leer su fuente de datos de manera automática."

## Preguntas clave (en orden)
1. ¿Dónde viven hoy sus productos y precios?
- Excel, sistema administrativo, POS, ERP o base de datos.

2. ¿Quién actualiza precios y con qué frecuencia?
- Manual, varias veces al día, o automático.

3. ¿Pueden exportar un CSV diario o incremental?
- Si sí, onboarding rápido.

4. ¿Su sistema tiene API de catálogo/precios?
- Si sí, onboarding más robusto.

5. ¿Pueden darnos acceso de solo lectura a una vista SQL?
- Para integraciones enterprise.

6. ¿Manejan precios por sucursal?
- Necesario para QR por tienda.

7. ¿Qué usan como identificador de producto?
- Barcode (EAN/UPC), SKU, ambos.

## Decisión rápida de integración
- Si solo tienen Excel: empezar por CSV.
- Si tienen sistema con endpoint: API.
- Si tienen equipo TI y DB sólida: read-only SQL.

## Lo mínimo que debes pedirles (formato único)
- `barcode`
- `sku`
- `productName`
- `storeCode`
- `currency`
- `amount`
- `observedAt`

## Ejemplo real de conversación
"Perfecto, ustedes actualizan precios en su sistema X y pueden exportar CSV cada hora. Empezamos por un piloto con 1 sucursal (Sambil Nivel Feria). Les pedimos un CSV con los campos estándar, nosotros hacemos la integración y en 72 horas les dejamos el QR funcional de esa tienda."

## Cierre comercial recomendado
- Fase 1: 1 tienda piloto, 1 semana.
- Fase 2: 5 tiendas, validación operativa.
- Fase 3: despliegue masivo por sucursal.

