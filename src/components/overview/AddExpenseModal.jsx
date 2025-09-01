// src/components/AddExpenseModal.jsx
import React, { useState } from "react";
import { addExpense } from "../../models/expenses";
import { generateId } from "../../utils/generate";
import { categories } from "../../models/categories";
import { formatToYYYYMMDD, formatTime } from "../../utils/format";

export default function AddExpenseModal({ date, onClose }) {
  const [form, setForm] = useState({
    date: formatToYYYYMMDD(date),
    timezone: "5",
    amountUSDCents: "",
    category: categories[0].name,
    note: "",
    lat: "",
    lng: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newExpense = {
      id: generateId("exp"),
      date: form.date,
      time: formatTime(), // 👈 always system time at save
      timezone: form.timezone,
      amountUSDCents: Number(form.amountUSDCents),
      category: form.category,
      note: form.note,
      coordinates: {
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
      },
    };

    try {
      addExpense(newExpense);
      onClose(); // close modal after save
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <input
            type="number"
            name="amountUSDCents"
            placeholder="Amount in cents"
            value={form.amountUSDCents}
            onChange={handleChange}
            required
          />

          {/* 👇 category dropdown */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <textarea
            name="note"
            placeholder="Note"
            value={form.note}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lat"
            placeholder="Latitude"
            value={form.lat}
            onChange={handleChange}
            required
          />

          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
