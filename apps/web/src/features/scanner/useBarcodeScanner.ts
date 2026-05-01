import { useEffect, useRef, useState } from "react";

type ScanStatus = "idle" | "requesting_permission" | "streaming" | "unsupported" | "error";

interface ScannerState {
  status: ScanStatus;
  error: string | null;
  lastCode: string | null;
}

export function useBarcodeScanner(onDetected: (value: string) => void) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetector | null>(null);
  const intervalRef = useRef<number | null>(null);

  const isSupported = typeof window !== "undefined" && "BarcodeDetector" in window;

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
    if (!isSupported) {
      setState((prev) => ({ ...prev, status: "unsupported", error: "Navegador no compatible con escaneo" }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, status: "requesting_permission", error: null }));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      detectorRef.current = new BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"]
      });

      intervalRef.current = window.setInterval(async () => {
        if (!videoRef.current || !detectorRef.current) return;

        const barcodes = await detectorRef.current.detect(videoRef.current);
        if (!barcodes.length) return;

        const rawValue = barcodes[0]?.rawValue;
        if (!rawValue) return;

        setState((prev) => ({ ...prev, lastCode: rawValue }));
        onDetected(rawValue);
        stop();
      }, 800);

      setState((prev) => ({ ...prev, status: "streaming" }));
    } catch (error) {
      setState({
        status: "error",
        error: error instanceof Error ? error.message : "No se pudo iniciar la camara.",
        lastCode: null
      });
    }
  }

  function stop(): void {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState((prev) => ({ ...prev, status: "idle" }));
  }

  return {
    videoRef,
    state,
    start,
    stop,
    isSupported
  };
}
