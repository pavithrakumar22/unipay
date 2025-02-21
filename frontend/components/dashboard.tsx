"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { DollarSign, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for the chart
const data = [
  { name: "Mon", total: 400 },
  { name: "Tue", total: 300 },
  { name: "Wed", total: 500 },
  { name: "Thu", total: 350 },
  { name: "Fri", total: 450 },
  { name: "Sat", total: 600 },
  { name: "Sun", total: 400 },
];

// Mock data for transactions
const transactions = [
  { id: 1, Username: "23BD1A0501", Points: 50, Items: "Book" },
  { id: 2, Username: "23BD1A67A2", Points: 20, Items: "Pen" },
  { id: 3, Username: "23BD1A1223", Points: 5, Items: "Chocolate" },
  { id: 4, Username: "23BD1A66K3", Points: 10, Items: "Chart" },
];

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false); // Ensure client-only rendering
  const [points, setPoints] = useState(1000);
  const [convertAmount, setConvertAmount] = useState<string | number>("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle Points Conversion
  const handleConvert = () => {
    const amount = Number.parseInt(convertAmount.toString(), 10);
    if (!amount || amount <= 0) {
      alert("Please enter a valid number of points.");
      return;
    }
    if (amount > points) {
      alert("Insufficient points!");
      return;
    }

    setPoints(points - amount);
    alert(`Successfully converted ${amount} points to money.`);
    setConvertAmount("");
  };

  if (!isClient) return null; // Prevents hydration mismatch

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <h2 className="text-lg font-semibold">Business Dashboard</h2>
          <div className="ml-auto flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" alt="@username" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Earnings Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3462 Points</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">218 Points</div>
              <p className="text-xs text-muted-foreground">+8% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Create Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Edit Event</div>
              {/* <p className="text-xs text-muted-foreground">+8% from yesterday</p> */}
            </CardContent>
          </Card>
        </div>

        {/* Daily Earnings Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Daily Earnings</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#222222" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#222222" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Bar dataKey="total" fill="#9AC0C6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transactions & Conversion */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Transaction History */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.Username}</TableCell>
                      <TableCell>{transaction.Points}</TableCell>
                      <TableCell>{transaction.Items}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Points Conversion */}
          <Card>
            <CardHeader>
              <CardTitle>Convert Points</CardTitle>
              <CardDescription>Convert your points to money</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">Available Points: {points}</p>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Enter points"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                />
                <Button onClick={handleConvert}>Convert</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
