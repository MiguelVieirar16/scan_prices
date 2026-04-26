import { StorefrontConfig } from "@scan/shared-types";

const storefronts: StorefrontConfig[] = [
  {
    storefrontCode: "st_demo_ccs_001",
    tenantCode: "demo-market",
    storeCode: "ccs-001",
    commerceName: "Demo Market Chacao",
    mallName: "Centro Comercial Demo",
    welcomeMessage: "Escanea cualquier producto y consulta precio en USD/Bs.",
    logoUrl: null,
    primaryColor: "#0f8b8d",
    secondaryColor: "#0b5f68",
    backgroundStyle: "radial-gradient(circle at 20% 20%, #f8f5ef 0%, #ece6db 55%, #e3dcca 100%)",
    fontFamily: "Avenir Next, Nunito Sans, Segoe UI, sans-serif",
    isActive: true
  }
];

export async function findStorefrontByCode(storefrontCode: string): Promise<StorefrontConfig | null> {
  const dbResult = await findStorefrontByCodeInDb(storefrontCode);
  if (dbResult) {
    return dbResult;
  }

  const item = storefronts.find((row) => row.storefrontCode === storefrontCode && row.isActive);
  return item ?? null;
}

async function findStorefrontByCodeInDb(storefrontCode: string): Promise<StorefrontConfig | null> {
  const { getDbPool } = await import("../../core/db.js");
  const pool = getDbPool();

  if (!pool) {
    return null;
  }

  const query = `
    SELECT
      sf.storefront_code,
      t.code AS tenant_code,
      s.code AS store_code,
      COALESCE(sb.commerce_public_name, s.name) AS commerce_name,
      sb.mall_name,
      sb.welcome_message,
      sb.logo_url,
      sb.primary_color,
      sb.secondary_color,
      sb.background_style,
      sb.font_family,
      sf.is_active
    FROM storefronts sf
    JOIN tenants t ON t.id = sf.tenant_id
    JOIN stores s ON s.id = sf.store_id
    LEFT JOIN storefront_branding sb ON sb.storefront_id = sf.id
    WHERE sf.storefront_code = $1
      AND sf.is_active = TRUE
      AND t.is_active = TRUE
      AND s.is_active = TRUE
    LIMIT 1
  `;

  try {
    const result = await pool.query<{
      storefront_code: string;
      tenant_code: string;
      store_code: string;
      commerce_name: string;
      mall_name: string | null;
      welcome_message: string | null;
      logo_url: string | null;
      primary_color: string | null;
      secondary_color: string | null;
      background_style: string | null;
      font_family: string | null;
      is_active: boolean;
    }>(query, [storefrontCode]);

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      storefrontCode: row.storefront_code,
      tenantCode: row.tenant_code,
      storeCode: row.store_code,
      commerceName: row.commerce_name,
      mallName: row.mall_name,
      welcomeMessage: row.welcome_message,
      logoUrl: row.logo_url,
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      backgroundStyle: row.background_style,
      fontFamily: row.font_family,
      isActive: row.is_active
    };
  } catch {
    return null;
  }
}
