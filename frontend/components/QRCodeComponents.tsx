import QRCode from "qrcode";

interface QRCodeProps {
  qrValue: string;
}

export default function QRCodeComponent({ qrValue }: QRCodeProps) {
  return (
    <div className="mt-4">
      <QRCode value={qrValue || "upi://pay?pa=unipay@upi"} size={120} />
      <p className="text-sm text-gray-500 mt-2">Scan to Pay</p>
    </div>
  );
}
