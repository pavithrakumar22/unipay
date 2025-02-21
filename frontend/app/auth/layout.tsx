"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserIcon, BriefcaseIcon } from "lucide-react";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  
  const isSignUp = pathname.includes("SignUp");
  const actionText = isSignUp ? "Sign Up" : "Sign In";
  
  const isStudent = pathname.includes("User");
  const isBusiness = pathname.includes("Business");
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md mt-8 mb-4">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl">{actionText} as</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-3">
              <Button 
                variant={isStudent ? "default" : "outline"}
                className="flex-1 h-16 flex flex-col items-center justify-center gap-1"
                asChild
              >
                <Link href={isSignUp ? "/auth/UserSignUp" : "/auth/UserSignin"}>
                  <UserIcon className="h-5 w-5 mb-1" />
                  <span>Student</span>
                </Link>
              </Button>
              
              <Button 
                variant={isBusiness ? "default" : "outline"}
                className="flex-1 h-16 flex flex-col items-center justify-center gap-1"
                asChild
              >
                <Link href={isSignUp ? "/auth/BusinessSignUp" : "/auth/BusinessSignin"}>
                  <BriefcaseIcon className="h-5 w-5 mb-1" />
                  <span>Business</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {children}
    </div>
  );
}