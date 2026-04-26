CREATE TABLE IF NOT EXISTS storefronts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  storefront_code VARCHAR(140) UNIQUE NOT NULL,
  slug VARCHAR(160),
  custom_domain VARCHAR(220),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storefront_branding (
  storefront_id UUID PRIMARY KEY REFERENCES storefronts(id) ON DELETE CASCADE,
  commerce_public_name VARCHAR(220) NOT NULL,
  mall_name VARCHAR(220),
  welcome_message TEXT,
  logo_url TEXT,
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  background_style TEXT,
  font_family VARCHAR(220),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_storefronts_tenant_store ON storefronts(tenant_id, store_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_storefronts_custom_domain ON storefronts(custom_domain) WHERE custom_domain IS NOT NULL;
