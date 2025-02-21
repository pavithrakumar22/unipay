import CarouselDemo from "@/components/Carousel";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
    return (
        <>
            <Navbar selectedMenuItem="Home" />
            <div className="h-[200vh] bg-white">
                <div className="flex flex-row justify-center">
                    <CarouselDemo />
                </div>
                <div className="flex justify-center m-10">
                    <Card />
                </div>
            </div>
        </>
    );
}




// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import Carousel from "@/components/ui/carousel";
// import { CarouselItem } from "@/components/ui/carousel";
// import { cn } from "@/lib/utils";

// const features = [
//   "Secure & Fast Transactions",
//   "Easy Student Payments",
//   "Business-Friendly Solutions",
//   "Low Transaction Fees",
//   "24/7 Support",
// ];

// export default function UnipayLanding() {
//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
//         <h1 className="text-xl font-bold">Unipay</h1>
//         <div>
//           <Button variant="ghost" className="mr-4">Sign In</Button>
//           <Button>Sign Up</Button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="flex justify-center mt-12">
//         <Card className="w-full max-w-md text-center p-6 shadow-lg">
//           <CardContent>
//             <h2 className="text-2xl font-semibold">Unipay</h2>
//             <p className="text-gray-600 mt-2">Seamless payments for students & businesses</p>
//             <div className="mt-6 space-y-4">
//               <Button className="w-full">Sign Up as Business</Button>
//               <Button variant="outline" className="w-full">Sign Up as Student</Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Features Carousel */}
//       <div className="mt-16 px-6">
//         <Carousel className="w-full max-w-2xl mx-auto">
//           {features.map((feature, index) => (
//             <CarouselItem key={index} className="p-4 bg-white shadow-md rounded-lg text-center">
//               {feature}
//             </CarouselItem>
//           ))}
//         </Carousel>
//       </div>
//     </div>
//   );
// }
