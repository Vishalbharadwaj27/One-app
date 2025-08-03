import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

export const ExpenseTableRow = ({
  expense,
  editMode,
  editingAmount,
  getCategoryName,
  setEditingAmount,
  handleDelete,
}) => (
  <tr key={expense.id} className="border-t hover:bg-gray-50">
    <td className="px-4 py-2">{getCategoryName(expense.categoryId)}</td>
    <td className="px-4 py-2">
      {editMode ? (
        <input
          type="number"
          className="w-24 p-1 border rounded"
          value={editingAmount[expense.id]}
          onChange={(e) =>
            setEditingAmount({
              ...editingAmount,
              [expense.id]: e.target.value,
            })
          }
        />
      ) : (
        `₹${expense.amount}`
      )}
    </td>
    <td className="px-4 py-2">
      {format(new Date(expense.date), "MMM d, yyyy")}
    </td>
    {editMode && (
      <td className="px-4 py-2 text-right">
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => handleDelete(expense.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    )}
  </tr>
);
