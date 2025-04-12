// components/AddFundsDialog.tsx

import React, { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

export function AddFundsDialog({ goalId, onAddFunds }: { goalId: string; onAddFunds: (id: string, amount: number) => void }) {
  const [amount, setAmount] = useState("")

  const handleSubmit = () => {
    const parsed = parseFloat(amount)
    if (!isNaN(parsed) && parsed > 0) {
      onAddFunds(goalId, parsed)
      setAmount("")
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Add Funds</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Funds to Goal</DialogTitle>
          <DialogDescription>
            Enter the amount you'd like to add to this savings goal.
          </DialogDescription>
        </DialogHeader>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">Cancel</button>
          </DialogClose>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
