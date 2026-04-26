# Estrategia de tasa BCV (USD -> VES)

Este documento es el resumen técnico. Para la guía operativa completa ver:
`docs/integration/bcv-rate-playbook.md`

## Fuente
- Consumir la tasa oficial en un proceso centralizado (worker o servicio de rates).
- Persistir cada actualizacion en `exchange_rates`.

## Regla de negocio
- Si el precio base llega en USD: `price_ves = price_usd * tasa_bcv`.
- Si el precio base llega en VES: `price_usd = price_ves / tasa_bcv`.
- Guardar ambos valores y la tasa usada para trazabilidad.

## Disponibilidad
- Mantener cache de la ultima tasa valida.
- Si el proveedor falla, continuar con ultima tasa registrada y marcar alerta.

## Reglas adicionales recomendadas
- Soportar override manual con auditoría para contingencias operativas.
- Registrar `source_type` (`automatic` o `manual`) en cada actualización.
- Definir expiración de la tasa manual (ej. 24h).
