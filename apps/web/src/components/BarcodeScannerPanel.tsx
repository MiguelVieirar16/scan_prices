import { useState } from "react";
import { useBarcodeScanner } from "../features/scanner/useBarcodeScanner";

interface BarcodeScannerPanelProps {
  onSubmitCode: (barcode: string) => Promise<void>;
  loading: boolean;
}

export function BarcodeScannerPanel({ onSubmitCode, loading }: BarcodeScannerPanelProps) {
  const [manualCode, setManualCode] = useState("");

  const scanner = useBarcodeScanner((value: string) => {
    setManualCode(value);
    void onSubmitCode(value);
  });

  return (
    <section className="scanner-card">
      <h2>Escaneo</h2>
      <p>Escanea con camara o ingresa manualmente el codigo de barras.</p>

      {scanner.isSupported && (
        <div className="scanner-controls">
          <button onClick={() => void scanner.start()} disabled={loading}>
            {scanner.state.status === "streaming" ? "Escanear otro" : "Escanear producto"}
          </button>
        </div>
      )}

      {scanner.state.status === "streaming" && (
        <video ref={scanner.videoRef} className="scanner-video" muted playsInline />
      )}

      <div className="manual-entry">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Ej: 7591234567890"
          value={manualCode}
          onChange={(event) => setManualCode(event.target.value)}
        />
        <button onClick={() => void onSubmitCode(manualCode)} disabled={loading || !manualCode}>
          Consultar
        </button>
      </div>

      {scanner.state.status !== "idle" && (
        <small>
          {scanner.state.status === "unsupported" && "Escaneo no disponible en este navegador"}
          {scanner.state.status === "requesting_permission" && "Solicitando permiso de camara..."}
          {scanner.state.status === "streaming" && "Escaneando..."}
          {scanner.state.status === "error" && `Error: ${scanner.state.error}`}
        </small>
      )}
    </section>
  );
}
