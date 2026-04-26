interface DetectedBarcode {
  boundingBox?: DOMRectReadOnly;
  cornerPoints?: readonly { x: number; y: number }[];
  format?: string;
  rawValue?: string;
}

declare class BarcodeDetector {
  constructor(options?: { formats?: string[] });
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
  static getSupportedFormats(): Promise<string[]>;
}
