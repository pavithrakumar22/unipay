"use client";

interface BusinessProps {
  businessName: string;
  mobileNumber: string;
  profileImage: string;
  qrValue: string;
}

export default function BusinessProfile({ businessName, mobileNumber, profileImage, qrValue }: BusinessProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <img src={profileImage} alt="Business Logo" className="w-24 h-24 mx-auto rounded-full" />
      <h2 className="text-xl font-bold mt-4">{businessName}</h2>
      <p className="text-gray-500">📞 {mobileNumber}</p>
      <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${qrValue}`} alt="QR Code" className="mx-auto mt-4 w-24 h-24" />
    </div>
  );
}
