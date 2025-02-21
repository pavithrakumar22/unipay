import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SavingsDisplay() {
  const totalSaved = 50 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{totalSaved} UniCoins</p>
        <p className="text-sm text-muted-foreground">Equivalent to {(totalSaved * 10).toLocaleString("en-IN")} INR</p>
      </CardContent>
    </Card>
  )
}

