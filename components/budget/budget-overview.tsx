"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { TransactionForm } from "./transaction-form"
import { TransactionList } from "./transaction-list"

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: Date
  category: string
}

export function BudgetOverview() {
  const [date, setDate] = useState<Date>(new Date())
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("transactions")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    }
    setTransactions((prev) => [...prev, newTransaction])
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const filteredTransactions = transactions.filter(
    (t) => format(new Date(t.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  )

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <div className="space-y-6">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md border"
          />
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Daily Summary</p>
            <p className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)} <span className="text-sm">Income</span>
            </p>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)} <span className="text-sm">Expenses</span>
            </p>
            <div className="border-t pt-2">
              <p className="text-2xl font-bold">
                ${balance.toFixed(2)} <span className="text-sm">Balance</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="p-4">
          <TransactionForm onSubmit={addTransaction} />
        </Card>
        <Card className="p-4">
          <TransactionList
            transactions={filteredTransactions}
            onDelete={deleteTransaction}
          />
        </Card>
      </div>
    </div>
  )
}