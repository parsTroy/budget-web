"use client"

import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { Transaction } from "./budget-overview"
import { Button } from "@/components/ui/button"

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions for this date
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Transactions</h3>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="space-y-1">
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.category} • {format(new Date(transaction.date), "h:mm a")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={
                  transaction.type === "income"
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(transaction.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}