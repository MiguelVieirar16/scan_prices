-- Plantilla SQL para onboarding de un comercio nuevo (ajusta UUID/códigos).

-- 1) Tenant
INSERT INTO tenants (id, code, display_name, legal_name, tax_id)
VALUES (
  gen_random_uuid(),
  '{{tenant_code}}',
  '{{display_name}}',
  '{{legal_name}}',
  '{{tax_id}}'
)
RETURNING id;

-- 2) Store (sucursal)
INSERT INTO stores (id, tenant_id, code, name, city, address)
VALUES (
  gen_random_uuid(),
  '{{tenant_id}}',
  '{{store_code}}',
  '{{store_name}}',
  '{{city}}',
  '{{address}}'
)
RETURNING id;

-- 3) Storefront (QR)
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
  gen_random_uuid(),
  '{{tenant_id}}',
  '{{store_id}}',
  '{{storefront_code}}',
  '{{slug}}',
  '{{custom_domain_or_null}}',
  TRUE
)
RETURNING id;

-- 4) Branding por storefront
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
  '{{storefront_id}}',
  '{{commerce_public_name}}',
  '{{mall_name}}',
  '{{welcome_message}}',
  '{{logo_url}}',
  '{{primary_color}}',
  '{{secondary_color}}',
  '{{background_style}}',
  '{{font_family}}'
);
