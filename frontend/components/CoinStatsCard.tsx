"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

const stats = {
  day: { converted: 500, spent: 300 },
  week: { converted: 3000, spent: 1800 },
  month: { converted: 12000, spent: 8000 },
}

export default function CoinStatsCard() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coin Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Button variant={period === "day" ? "default" : "outline"} onClick={() => setPeriod("day")}>
            Day
          </Button>
          <Button variant={period === "week" ? "default" : "outline"} onClick={() => setPeriod("week")}>
            Week
          </Button>
          <Button variant={period === "month" ? "default" : "outline"} onClick={() => setPeriod("month")}>
            Month
          </Button>
        </div>
        <div className="space-y-2">
          <p>Converted: {stats[period].converted} UniCoins</p>
          <p>Spent: {stats[period].spent} UniCoins</p>
        </div>
      </CardContent>
    </Card>
  )
}

