import { useEffect, useMemo, useState } from "react";
import { PriceLookupResponse, StorefrontConfig } from "@scan/shared-types";
import { BarcodeScannerPanel } from "./components/BarcodeScannerPanel";
import { getPriceByBarcode } from "./services/priceApi";
import { getStorefrontByCode } from "./services/storefrontApi";

const DEFAULT_TENANT = "demo-market";
const DEFAULT_STORE = "ccs-001";
const DEFAULT_THEME = {
  accent: "#0f8b8d",
  accentStrong: "#0b5f68",
  background: "radial-gradient(circle at 20% 20%, #f8f5ef 0%, #ece6db 55%, #e3dcca 100%)",
  fontFamily: "Avenir Next, Nunito Sans, Segoe UI, sans-serif"
};

interface UrlContext {
  storefrontCode: string | null;
  tenantCode: string | null;
  storeCode: string | null;
  unlock: boolean;
}

function readUrlContext(): UrlContext {
  const params = new URLSearchParams(window.location.search);

  return {
    storefrontCode: params.get("storefront"),
    tenantCode: params.get("tenant"),
    storeCode: params.get("store"),
    unlock: params.get("unlock") === "1"
  };
}

export default function App() {
  console.log("[APP] Starting App...");
  const initialUrlContext = useMemo(readUrlContext, []);
  console.log("[APP] Initial URL context:", initialUrlContext);

  const [tenantCode, setTenantCode] = useState(
    initialUrlContext.storefrontCode ? "" : (initialUrlContext.tenantCode ?? DEFAULT_TENANT)
  );
  const [storeCode, setStoreCode] = useState(
    initialUrlContext.storefrontCode ? "" : (initialUrlContext.storeCode ?? DEFAULT_STORE)
  );
  const [result, setResult] = useState<PriceLookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [storefront, setStorefront] = useState<StorefrontConfig | null>(null);
  const [storefrontError, setStorefrontError] = useState<string | null>(null);
  const [loadingStorefront, setLoadingStorefront] = useState(Boolean(initialUrlContext.storefrontCode));

  const hasDirectTenantContext = Boolean(initialUrlContext.tenantCode && initialUrlContext.storeCode);
  const isContextLocked = !initialUrlContext.unlock && (Boolean(initialUrlContext.storefrontCode) || hasDirectTenantContext);
  const requiresStorefrontResolution = Boolean(initialUrlContext.storefrontCode);
  const hasResolvedStorefront = Boolean(storefront);

  useEffect(() => {
    async function loadStorefront(): Promise<void> {
      if (!initialUrlContext.storefrontCode) {
        setLoadingStorefront(false);
        return;
      }

      setLoadingStorefront(true);
      setStorefrontError(null);

      try {
        const data = await getStorefrontByCode(initialUrlContext.storefrontCode);
        setStorefront(data);
        setTenantCode(data.tenantCode);
        setStoreCode(data.storeCode);
      } catch (err) {
        setStorefrontError(err instanceof Error ? err.message : "No se pudo cargar la tienda del QR.");
      } finally {
        setLoadingStorefront(false);
      }
    }

    void loadStorefront();
  }, [initialUrlContext.storefrontCode]);

  useEffect(() => {
    const root = document.documentElement;

    const accent = storefront?.primaryColor ?? DEFAULT_THEME.accent;
    const accentStrong = storefront?.secondaryColor ?? DEFAULT_THEME.accentStrong;
    const background = storefront?.backgroundStyle ?? DEFAULT_THEME.background;
    const fontFamily = storefront?.fontFamily ?? DEFAULT_THEME.fontFamily;

    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-strong", accentStrong);
    root.style.setProperty("--bg", background);
    root.style.setProperty("--font-family", fontFamily);
  }, [storefront]);

  async function handleSubmitCode(barcode: string): Promise<void> {
    if (requiresStorefrontResolution && !hasResolvedStorefront) {
      setError("No se pudo validar la tienda del QR. Intenta escanear nuevamente el QR oficial.");
      return;
    }

    const normalized = barcode.trim();
    if (!normalized) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getPriceByBarcode({ tenantCode, storeCode, barcode: normalized });
      setResult(response);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "No se pudo obtener el precio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header>
        <h1>Scan Prices</h1>
        <p>Escanea y consulta precios en USD y Bs en la tienda actual.</p>
      </header>

      {loadingStorefront && (
        <section className="tenant-card">
          <p>Cargando tienda del QR...</p>
        </section>
      )}

      {storefrontError && (
        <section className="tenant-card">
          <p className="error">{storefrontError}</p>
        </section>
      )}

      {storefront && (
        <section className="tenant-card">
          <div className="storefront-hero">
            {storefront.logoUrl && (
              <img src={storefront.logoUrl} alt={storefront.commerceName} className="storefront-logo" />
            )}
            <div>
              <h2>{storefront.commerceName}</h2>
              {storefront.mallName && <p>Ubicacion: {storefront.mallName}</p>}
              {storefront.welcomeMessage && <p>{storefront.welcomeMessage}</p>}
              <p className="context-subline">Codigo QR: {storefront.storefrontCode}</p>
            </div>
          </div>
        </section>
      )}

      <section className="tenant-card">
        <h2>Contexto de comercio</h2>

        {isContextLocked ? (
          <div className="locked-context">
            <p>Esta tienda fue definida por QR.</p>
            <p><strong>Tenant:</strong> {tenantCode}</p>
            <p><strong>Sucursal:</strong> {storeCode}</p>
          </div>
        ) : (
          <div className="tenant-grid">
            <label>
              Tenant
              <input value={tenantCode} onChange={(event) => setTenantCode(event.target.value)} />
            </label>
            <label>
              Sucursal
              <input value={storeCode} onChange={(event) => setStoreCode(event.target.value)} />
            </label>
          </div>
        )}
      </section>

      <BarcodeScannerPanel onSubmitCode={handleSubmitCode} loading={loading || loadingStorefront} />

      <section className="result-card">
        <h2>Resultado</h2>
        {loading && <p>Consultando precio...</p>}
        {error && <p className="error">{error}</p>}
        {result && (
          <article>
            <p><strong>Producto:</strong> {result.productName}</p>
            <p><strong>Codigo:</strong> {result.barcode}</p>
            <p><strong>Precio USD:</strong> ${result.priceUsd.toFixed(2)}</p>
            <p><strong>Precio Bs:</strong> Bs {result.priceVes.toFixed(2)}</p>
            <p><strong>Tasa:</strong> {result.exchangeRate} ({result.exchangeRateProvider})</p>
            <p><strong>Actualizado:</strong> {new Date(result.updatedAt).toLocaleString()}</p>
          </article>
        )}
      </section>
    </main>
  );
}
