"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Coins } from "lucide-react";
import axios from "axios";

export default function WalletOverview() {
  const [coins, setCoins] = useState(0);
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) return;

    axios.get(`http://localhost:5001/coins/${username}`)
      .then((response) => {
        setCoins(response.data.coins);
      })
      .catch((error) => {
        console.error("Error fetching coins:", error);
      });
  }, [username]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{coins.toLocaleString()}</span>
          </div>
          <span className="text-sm text-muted-foreground">UniCoins</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">This Month</span>
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+2500 UniCoins</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">This Week</span>
            <div className="flex items-center text-red-600">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              <span>-500 UniCoins</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
