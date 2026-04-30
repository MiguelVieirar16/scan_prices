-- Pavesina Tenant
INSERT INTO tenants (id, code, display_name, legal_name, tax_id, is_active)
VALUES ('33333333-3333-3333-3333-333333333333', 'pavesina', 'Panadería Pavesina', 'Pavesina C.A.', 'J-12345678-9', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Pavesina Store
INSERT INTO stores (id, tenant_id, code, name, city, address, is_active)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'pavesina-ccs',
  'Pavesina Centro',
  'Caracas',
  'Av. Principal, Centro Comercial Local 1',
  TRUE
)
ON CONFLICT (tenant_id, code) DO NOTHING;

-- Pavesina Storefront
INSERT INTO storefronts (
  id,
  tenant_id,
  store_id,
  storefront_code,
  slug,
  custom_domain,
  is_active
)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  'st_pavesina_ccs_001',
  'pavesina-centro',
  NULL,
  TRUE
)
ON CONFLICT (storefront_code) DO NOTHING;

-- Pavesina Storefront Branding
INSERT INTO storefront_branding (
  storefront_id,
  commerce_public_name,
  mall_name,
  welcome_message,
  logo_url,
  primary_color,
  secondary_color,
  background_style,
  font_family
)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Panadería Pavesina',
  'Centro Comercial Principal',
  '¡Bienvenido a Pavesina! Frescodumbre garantizada',
  'https://via.placeholder.com/150x80.png?text=Pavesina',
  '#8B4513',
  '#F5DEB3',
  'warm',
  'Nunito'
)
ON CONFLICT (storefront_id) DO NOTHING;

-- Pavesina Products
INSERT INTO products (id, tenant_id, barcode, sku, name, brand, category, package_size, is_active)
VALUES
(
  '66666666-6666-6666-6666-666666666666',
  '33333333-3333-3333-3333-333333333333',
  '7501234567890',
  'PAN-001',
  'Pan Francés',
  'Pavesina',
  'panes',
  'und',
  TRUE
),
(
  '77777777-7777-7777-7777-777777777777',
  '33333333-3333-3333-3333-333333333333',
  '7501234567891',
  'PAN-002',
  'Pan Integral',
  'Pavesina',
  'panes',
  'und',
  TRUE
),
(
  '88888888-8888-8888-8888-888888888889',
  '33333333-3333-3333-3333-333333333333',
  '7501234567892',
  'CRO-001',
  'Croissant',
  'Pavesina',
  'pasteles',
  'und',
  TRUE
),
(
  '99999999-9999-9999-9999-999999999999',
  '33333333-3333-3333-3333-333333333333',
  '7501234567893',
  'DON-001',
  'Donas Glaseadas',
  'Pavesina',
  'pasteles',
  'und',
  TRUE
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '33333333-3333-3333-3333-333333333333',
  '7501234567894',
  'GAL-001',
  'Biscuits',
  'Pavesina',
  'galletas',
  'und',
  TRUE
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '33333333-3333-3333-3333-333333333333',
  '7501234567895',
  'CUP-001',
  'Cupcakes',
  'Pavesina',
  'pasteles',
  'und',
  TRUE
)
ON CONFLICT (tenant_id, barcode) DO NOTHING;

-- Pavesina Prices (using existing exchange rate or creating one)
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
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc',
  'bcv',
  'USD',
  'VES',
  92.500000,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Ensure there's at least one exchange rate for USD to VES
INSERT INTO exchange_rates (
  id,
  provider,
  base_currency,
  quote_currency,
  value,
  effective_at,
  fetched_at
)
SELECT 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bcv', 'USD', 'VES', 92.5, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM exchange_rates WHERE base_currency = 'USD' AND quote_currency = 'VES')
ON CONFLICT DO NOTHING;

-- Insert prices for Pavesina products
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
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '66666666-6666-6666-6666-666666666666',
  (SELECT id FROM exchange_rates WHERE base_currency = 'USD' AND quote_currency = 'VES' ORDER BY effective_at DESC LIMIT 1),
  'USD',
  0.50,
  0.50,
  45.00,
  'manual',
  NOW()
),
(
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '77777777-7777-7777-7777-777777777777',
  (SELECT id FROM exchange_rates WHERE base_currency = 'USD' AND quote_currency = 'VES' ORDER BY effective_at DESC LIMIT 1),
  'USD',
  0.60,
  0.60,
  55.00,
  'manual',
  NOW()
),
(
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '88888888-8888-8888-8888-888888888889',
  (SELECT id FROM exchange_rates WHERE base_currency = 'USD' AND quote_currency = 'VES' ORDER BY effective_at DESC LIMIT 1),
  'USD',
  1.50,
  1.50,
  138.00,
  'manual',
  NOW()
),
(
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '99999999-9999-9999-9999-999999999999',
  (SELECT id FROM exchange_rates WHERE base_currency = 'USD' AND quote_currency = 'VES' ORDER BY effective_at DESC LIMIT 1),
  'USD',
  1.00,
  1.00,
  92.00,
  'manual',
  NOW()
),
(
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  (SELECT id FROM exchange_rates WHERE base_currency = 'USD' AND quote_currency = 'VES' ORDER BY effective_at DESC LIMIT 1),
  'USD',
  0.75,
  0.75,
  69.00,
  'manual',
  NOW()
),
(
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  (SELECT id FROM exchange_rates WHERE base_currency = 'USD' AND quote_currency = 'VES' ORDER BY effective_at DESC LIMIT 1),
  'USD',
  2.00,
  2.00,
  184.00,
  'manual',
  NOW()
);