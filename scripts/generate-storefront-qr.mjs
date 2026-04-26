import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import QRCode from "qrcode";

function readArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function ensureStorefrontCode(value) {
  if (!value) {
    throw new Error("Debes enviar --storefront=<storefrontCode>");
  }
  return value;
}

async function main() {
  const baseUrl = readArg("base-url", "https://app.tudominio.com");
  const storefrontCode = ensureStorefrontCode(readArg("storefront"));
  const outDir = resolve(readArg("out-dir", "./tmp/qr"));

  const qrUrl = `${baseUrl.replace(/\/$/, "")}/?storefront=${encodeURIComponent(storefrontCode)}`;
  const pngPath = resolve(outDir, `${storefrontCode}.png`);
  const svgPath = resolve(outDir, `${storefrontCode}.svg`);
  const txtPath = resolve(outDir, `${storefrontCode}.txt`);

  await mkdir(outDir, { recursive: true });

  await QRCode.toFile(pngPath, qrUrl, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 1024,
    color: {
      dark: "#111111",
      light: "#FFFFFF"
    }
  });

  const svg = await QRCode.toString(qrUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 1024,
    color: {
      dark: "#111111",
      light: "#FFFFFF"
    }
  });

  await writeFile(svgPath, svg, "utf-8");
  await writeFile(txtPath, `${qrUrl}\n`, "utf-8");

  console.log(`QR URL: ${qrUrl}`);
  console.log(`PNG: ${pngPath}`);
  console.log(`SVG: ${svgPath}`);
  console.log(`TXT: ${txtPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
