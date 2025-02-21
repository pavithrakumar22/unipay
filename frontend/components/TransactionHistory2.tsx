"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TransactionTooltip from "./TransactionTooltip"
import axios from 'axios'

interface Transaction {
  id: string
  amount: number
  created_at: number
  status: string
  currency: string
}

interface TransactionHistoryProps {
  title: string
  type: "deposit" | "spend"
  username: string
}

export default function TransactionHistory2({ title, username }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [hoveredTransaction, setHoveredTransaction] = useState<Transaction | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/user-transactions/${username}`);
  
        console.log("Raw API Response:", response.data.transactions);
  
        if (response.data && Array.isArray(response.data.transactions)) {
          setTransactions(response.data.transactions);
        } else {
          console.error("Invalid API response format:", response.data);
          setTransactions([]); 
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
  
    fetchTransactions();
  }, [username]);
  
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Deposited/Credited</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  onMouseEnter={(e) => {
                    setHoveredTransaction(transaction)
                    setTooltipPosition({
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }}
                  onMouseLeave={() => {
                    setHoveredTransaction(null)
                    setTooltipPosition(null)
                  }}
                  className="relative"
                >
                  <TableCell className="py-2">{formatDate(transaction.created_at)}</TableCell>
                  <TableCell className="py-2">
                    {transaction.amount} {transaction.currency}
                  </TableCell>
                  <TableCell className="py-2">success</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500">No transactions found.</p>
        )}
      </CardContent>

      {hoveredTransaction && tooltipPosition && (
        <div
          className="fixed z-50 bg-white shadow-md p-2 rounded"
          style={{
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
          }}
        >
          <TransactionTooltip transaction={hoveredTransaction} />
        </div>
      )}
    </Card>
  )
}
