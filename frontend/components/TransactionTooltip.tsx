interface Transaction {
  id: string
  amount: number
  created_at: number
  status: string
  currency: string
}

interface TransactionTooltipProps {
  transaction: Transaction
}

export default function TransactionTooltip({ transaction }: TransactionTooltipProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="bg-white border rounded shadow-lg p-4">
      <p><strong>Order ID:</strong> {transaction.id}</p>
      <p><strong>Amount:</strong> {transaction.amount} {transaction.currency}</p>
      <p><strong>Date:</strong> {formatDate(transaction.created_at)}</p>
      <p><strong>Status:</strong> Success</p>
    </div>
  )
}