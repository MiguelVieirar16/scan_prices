-- Contrato recomendado para comercios que exponen DB read-only.
-- Esta vista puede vivir en la base del comercio y ser consultada por el worker.

CREATE OR REPLACE VIEW public.scan_prices_export_vw AS
SELECT
  p.barcode AS barcode,
  p.sku AS sku,
  p.name AS product_name,
  s.code AS store_code,
  pr.currency AS currency,
  pr.amount AS amount,
  pr.updated_at AS observed_at
FROM pos_products p
JOIN pos_prices pr ON pr.product_id = p.id
JOIN pos_stores s ON s.id = pr.store_id
WHERE p.is_active = TRUE
  AND pr.is_active = TRUE;

-- Query de lectura sugerida
-- SELECT barcode, sku, product_name, store_code, currency, amount, observed_at
-- FROM public.scan_prices_export_vw
-- WHERE observed_at >= NOW() - INTERVAL '1 day';
