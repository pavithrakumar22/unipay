"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();


  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: passcode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign in failed");
      }
      else{
        localStorage.setItem("username", username);
      }

      console.log("Sign in successful!", data);
     
      router.push("/Dashboard/UserDashboard");
    } catch (error: any) {
      console.error("Sign in failed:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Roll No"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Password"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleSignIn} className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <div className="mt-4 text-center">
          <p className="text-center text-sm text-gray-600 mt-4">
          New User?{" "}
            <Link href="/auth/UserSignup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
