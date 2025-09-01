// src/components/overview/AddExpenses.jsx
import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";

export default function AddExpenses({ date, onSaved }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="add-expenses-container" onClick={() => setOpen(true)}>
        <div className="add-expenses">Add today's expenses</div>
      </div>
      {open && (
        <AddExpenseModal
          date={date}
          onClose={() => setOpen(false)}
          onSaved={onSaved}
        />
      )}
    </>
  );
}
