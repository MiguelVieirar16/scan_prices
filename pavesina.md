## Plan: Onboard Test Client "Pavesina" (Bakery)

Phase 1: Create Tenant, Store & Storefront in Supabase
Step 1.1 - Go to Supabase Dashboard (https://supabase.com/dashboard) → Your Project → SQL Editor
Run this SQL to create the tenant:
-- 1) CREATE TENANT (Pavesina)
INSERT INTO tenants (id, code, display_name, legal_name, tax_id)
VALUES (
gen_random_uuid(),
'pavesina',
'Panadería Pavesina',
'Pavesina C.A.',
'J-12345678-9'
)
RETURNING id;
Copy the returned id - you'll need it for steps 1.2 and 1.3.

---

Step 1.2 - Create the store (replace TENANT_ID_HERE with the id from step 1.1):
-- 2) CREATE STORE
INSERT INTO stores (id, tenant_id, code, name, city, address)
VALUES (
gen_random_uuid(),
'TENANT_ID_HERE',
'pavesina-ccs',
'Pavesina Centro',
'Caracas',
'Av. Principal, Centro Comercial Local 1'
)
RETURNING id;
Copy the returned id.

---

Step 1.3 - Create the storefront (replace TENANT_ID_HERE and STORE_ID_HERE):
-- 3) CREATE STOREFRONT
INSERT INTO storefronts (
id, tenant_id, store_id, storefront_code, slug, is_active
)
VALUES (
gen_random_uuid(),
'TENANT_ID_HERE',
'STORE_ID_HERE',
'st_pavesina_ccs_001',
'pavesina-centro',
TRUE
)
RETURNING id;
Copy the returned storefront_id.

---

Step 1.4 - Configure branding (replace STOREFRONT_ID_HERE):
-- 4) BRANDING (bakery theme: warm browns, creams)
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
'STOREFRONT_ID_HERE',
'Panadería Pavesina',
'Centro Comercial Principal',
'¡Bienvenido a Pavesina! Frescodumbre garantizada',
'https://via.placeholder.com/150x80.png?text=Pavesina',
'#8B4513', -- Saddle Brown (bread/crust)
'#F5DEB3', -- Wheat (warm bread)
'warm',
'Nunito'
);

---

Phase 2: Insert Products (matching your CSV schema)
The products table has: id, tenant_id, barcode, sku, name, brand, category, package_size, is_active
Step 2.1 - Insert Products:
INSERT INTO products (id, tenant_id, barcode, sku, name, brand, category, package_size, is_active, created_at, updated_at)
VALUES
(gen_random_uuid(), 'TENANT_ID_HERE', '7501234567890', 'PAN-001', 'Pan Francés', 'Pavesina', 'panes', 'und', true, NOW(), NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', '7501234567891', 'PAN-002', 'Pan Integral', 'Pavesina', 'panes', 'und', true, NOW(), NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', '7501234567892', 'CRO-001', 'Croissant', 'Pavesina', 'pasteles', 'und', true, NOW(), NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', '7501234567893', 'DON-001', 'Donas Glaseadas', 'Pavesina', 'pasteles', 'und', true, NOW(), NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', '7501234567894', 'GAL-001', 'Biscuits', 'Pavesina', 'galletas', 'und', true, NOW(), NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', '7501234567895', 'CUP-001', 'Cupcakes', 'Pavesina', 'pasteles', 'und', true, NOW(), NOW())
RETURNING id;
Copy ALL 6 product IDs.

---

Step 2.2 - Insert Prices:
INSERT INTO prices (id, tenant_id, store_id, product_id, exchange_rate_id, base_currency, base_price, price_usd, price_ves, source, observed_at)
VALUES
(gen_random_uuid(), 'TENANT_ID_HERE', 'STORE_ID_HERE', 'PRODUCT_1_ID', (SELECT id FROM exchange_rates ORDER BY effective_at DESC LIMIT 1), 'USD', 0.50, 0.50, 45.00, 'manual', NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', 'STORE_ID_HERE', 'PRODUCT_2_ID', (SELECT id FROM exchange_rates ORDER BY effective_at DESC LIMIT 1), 'USD', 0.60, 0.60, 55.00, 'manual', NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', 'STORE_ID_HERE', 'PRODUCT_3_ID', (SELECT id FROM exchange_rates ORDER BY effective_at DESC LIMIT 1), 'USD', 1.50, 1.50, 138.00, 'manual', NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', 'STORE_ID_HERE', 'PRODUCT_4_ID', (SELECT id FROM exchange_rates ORDER BY effective_at DESC LIMIT 1), 'USD', 1.00, 1.00, 92.00, 'manual', NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', 'STORE_ID_HERE', 'PRODUCT_5_ID', (SELECT id FROM exchange_rates ORDER BY effective_at DESC LIMIT 1), 'USD', 0.75, 0.75, 69.00, 'manual', NOW()),
(gen_random_uuid(), 'TENANT_ID_HERE', 'STORE_ID_HERE', 'PRODUCT_6_ID', (SELECT id FROM exchange_rates ORDER BY effective_at DESC LIMIT 1), 'USD', 2.00, 2.00, 184.00, 'manual', NOW());

---

Phase 3: Test API
Step 3.1:
curl "https://scan-prices.onrender.com/api/v1/storefronts/st_pavesina_ccs_001"
Step 3.2:
curl "https://scan-prices.onrender.com/api/v1/prices/7501234567890?tenantCode=pavesina&storeCode=pavesina-ccs"

---

Phase 4: QR Test
Step 4.1:
npm run qr:generate -- --base-url=https://scan-prices-web.vercel.app --storefront=st_pavesina_ccs_001 --out-dir=./tmp/qr
Step 4.2: Open in browser:
https://scan-prices-web.vercel.app/?storefront=st_pavesina_ccs_001
