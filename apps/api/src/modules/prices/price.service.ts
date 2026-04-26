import { PriceLookupResponse } from "@scan/shared-types";
import { NotFoundError } from "../../core/errors.js";
import { findProductPriceByBarcode } from "../products/product.repository.js";
import { getUsdToVesRate } from "../rates/rate.service.js";

export async function getPriceByBarcode(params: {
  tenantCode: string;
  storeCode: string;
  barcode: string;
}): Promise<PriceLookupResponse> {
  const product = await findProductPriceByBarcode(params);
  if (!product) {
    throw new NotFoundError("Producto no encontrado para ese código de barras.");
  }

  const fx = await getUsdToVesRate();
  const priceVes = Number((product.priceUsd * fx.rate).toFixed(2));

  return {
    tenantCode: params.tenantCode,
    storeCode: params.storeCode,
    barcode: params.barcode,
    productName: product.productName,
    priceUsd: product.priceUsd,
    priceVes,
    exchangeRate: fx.rate,
    exchangeRateProvider: fx.provider,
    updatedAt: product.updatedAt
  };
}
