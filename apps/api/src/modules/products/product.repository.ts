interface ProductCatalogRow {
  tenantCode: string;
  storeCode: string;
  barcode: string;
  productName: string;
  priceUsd: number;
  updatedAt: string;
}

const catalog: ProductCatalogRow[] = [
  {
    tenantCode: "demo-market",
    storeCode: "ccs-001",
    barcode: "7591234567890",
    productName: "Harina de Maiz 1Kg",
    priceUsd: 1.6,
    updatedAt: new Date().toISOString()
  },
  {
    tenantCode: "demo-market",
    storeCode: "ccs-001",
    barcode: "7590987654321",
    productName: "Leche Entera 1L",
    priceUsd: 2.15,
    updatedAt: new Date().toISOString()
  }
];

export async function findProductPriceByBarcode(params: {
  tenantCode: string;
  storeCode: string;
  barcode: string;
}): Promise<ProductCatalogRow | null> {
  const dbRow = await findProductPriceByBarcodeInDb(params);
  if (dbRow) {
    return dbRow;
  }

  const match = catalog.find((item) => {
    return (
      item.tenantCode === params.tenantCode &&
      item.storeCode === params.storeCode &&
      item.barcode === params.barcode
    );
  });

  return match ?? null;
}

async function findProductPriceByBarcodeInDb(params: {
  tenantCode: string;
  storeCode: string;
  barcode: string;
}): Promise<ProductCatalogRow | null> {
  const { getDbPool } = await import("../../core/db.js");
  const pool = getDbPool();

  if (!pool) {
    return null;
  }

  const query = `
    SELECT
      t.code AS tenant_code,
      s.code AS store_code,
      p.barcode AS barcode,
      p.name AS product_name,
      latest_price.price_usd::float8 AS price_usd,
      latest_price.observed_at AS updated_at
    FROM tenants t
    JOIN stores s
      ON s.tenant_id = t.id
     AND s.code = $2
    JOIN products p
      ON p.tenant_id = t.id
     AND p.barcode = $3
    JOIN LATERAL (
      SELECT pr.price_usd, pr.observed_at
      FROM prices pr
      WHERE pr.tenant_id = t.id
        AND pr.store_id = s.id
        AND pr.product_id = p.id
      ORDER BY pr.observed_at DESC
      LIMIT 1
    ) AS latest_price ON TRUE
    WHERE t.code = $1
      AND t.is_active = TRUE
      AND s.is_active = TRUE
      AND p.is_active = TRUE
    LIMIT 1
  `;

  try {
    const result = await pool.query<{
      tenant_code: string;
      store_code: string;
      barcode: string;
      product_name: string;
      price_usd: number;
      updated_at: string;
    }>(query, [params.tenantCode, params.storeCode, params.barcode]);

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      tenantCode: row.tenant_code,
      storeCode: row.store_code,
      barcode: row.barcode,
      productName: row.product_name,
      priceUsd: Number(row.price_usd),
      updatedAt: new Date(row.updated_at).toISOString()
    };
  } catch {
    return null;
  }
}
