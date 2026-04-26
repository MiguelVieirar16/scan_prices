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
  '88888888-8888-8888-8888-888888888888',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'st_demo_ccs_001',
  'demo-market-chacao',
  NULL,
  TRUE
)
ON CONFLICT (storefront_code) DO NOTHING;

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
  '88888888-8888-8888-8888-888888888888',
  'Demo Market Chacao',
  'Centro Comercial Demo',
  'Escanea cualquier producto y consulta precio en USD/Bs.',
  NULL,
  '#0f8b8d',
  '#0b5f68',
  'radial-gradient(circle at 20% 20%, #f8f5ef 0%, #ece6db 55%, #e3dcca 100%)',
  'Avenir Next, Nunito Sans, Segoe UI, sans-serif'
)
ON CONFLICT (storefront_id) DO NOTHING;
