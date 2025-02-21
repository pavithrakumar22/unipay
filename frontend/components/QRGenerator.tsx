"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeProps {
  value: string;
}

export default function QRCodeGenerator({ value }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, (error) => {
        if (error) console.error(error);
      });
    }
  }, [value]);

  return <canvas ref={canvasRef} className="border border-gray-300" />;
}
