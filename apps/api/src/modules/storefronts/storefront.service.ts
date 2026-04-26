import { StorefrontConfig } from "@scan/shared-types";
import { NotFoundError } from "../../core/errors.js";
import { findStorefrontByCode } from "./storefront.repository.js";

export async function getStorefrontByCode(storefrontCode: string): Promise<StorefrontConfig> {
  const storefront = await findStorefrontByCode(storefrontCode);
  if (!storefront) {
    throw new NotFoundError("Storefront no encontrado o inactivo.");
  }

  return storefront;
}
