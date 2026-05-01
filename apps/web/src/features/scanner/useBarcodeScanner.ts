import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type ScanStatus = "idle" | "requesting_permission" | "streaming" | "unsupported" | "error";

interface ScannerState {
  status: ScanStatus;
  error: string | null;
  lastCode: string | null;
}

export function useBarcodeScanner(onDetected: (value: string) => void) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const isSupported = true;

  const [state, setState] = useState<ScannerState>({
    status: "idle",
    error: null,
    lastCode: null
  });

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start(): Promise<void> {
    try {
      setState((prev) => ({ ...prev, status: "requesting_permission", error: null }));

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("scanner-container");
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39
          ]
        },
        (decodedText) => {
          setState((prev) => ({ ...prev, lastCode: decodedText }));
          onDetected(decodedText);
          stop();
        },
        () => {}
      );

      setState((prev) => ({ ...prev, status: "streaming" }));
    } catch (error) {
      setState({
        status: "error",
        error: error instanceof Error ? error.message : "No se pudo iniciar la camara.",
        lastCode: null
      });
    }
  }

  async function stop(): Promise<void> {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
    }
    setState((prev) => ({ ...prev, status: "idle" }));
  }

  return {
    videoRef: { current: null },
    state,
    start,
    stop,
    isSupported
  };
}
