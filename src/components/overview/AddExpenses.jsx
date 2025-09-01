// src/components/AddExpenses.jsx
import React, { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";

const AddExpenses = ({ date }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="add-expenses-container"
        onClick={() => setShowModal(true)}
      >
        <div className="add-expenses">Add today's expenses</div>
      </div>

      {showModal && (
        <AddExpenseModal date={date} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default AddExpenses;
