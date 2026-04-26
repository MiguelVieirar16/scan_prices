INSERT INTO tenants (id, code, display_name)
VALUES ('11111111-1111-1111-1111-111111111111', 'demo-market', 'Demo Market')
ON CONFLICT (code) DO NOTHING;

INSERT INTO stores (id, tenant_id, code, name, city)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'ccs-001',
  'Demo Market Chacao',
  'Caracas'
)
ON CONFLICT (tenant_id, code) DO NOTHING;

INSERT INTO products (id, tenant_id, barcode, sku, name)
VALUES
(
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  '7591234567890',
  'HAR-001',
  'Harina de Maiz 1Kg'
),
(
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  '7590987654321',
  'LEC-001',
  'Leche Entera 1L'
)
ON CONFLICT (tenant_id, barcode) DO NOTHING;

INSERT INTO exchange_rates (
  id,
  provider,
  base_currency,
  quote_currency,
  value,
  effective_at,
  fetched_at
)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'bcv',
  'USD',
  'VES',
  92.500000,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

INSERT INTO prices (
  id,
  tenant_id,
  store_id,
  product_id,
  exchange_rate_id,
  base_currency,
  base_price,
  price_usd,
  price_ves,
  source,
  observed_at
)
VALUES
(
  '66666666-6666-6666-6666-666666666666',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '55555555-5555-5555-5555-555555555555',
  'USD',
  1.6000,
  1.6000,
  148.0000,
  'external_sync',
  NOW()
),
(
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  'USD',
  2.1500,
  2.1500,
  198.8750,
  'external_sync',
  NOW()
)
ON CONFLICT DO NOTHING;
