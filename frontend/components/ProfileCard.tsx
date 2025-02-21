"use client"; // Ensure this is a client component

interface ProfileProps {
  name: string;
  enrollNumber: string;
  leaderboardRank: string;
  profileImage: string;
  qrValue: string;
}

export default function ProfileCard({ name, enrollNumber, leaderboardRank, profileImage, qrValue }: ProfileProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <img src={profileImage} alt="Profile" className="w-24 h-24 mx-auto rounded-full" />
      <h2 className="text-xl font-bold mt-4">{name}</h2>
      <p className="text-gray-500">Enrollment: {enrollNumber}</p>
      <p className="text-green-500 font-semibold">{leaderboardRank}</p>
      <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${qrValue}`} alt="QR Code" className="mx-auto mt-4 w-24 h-24" />
    </div>
  );
}
