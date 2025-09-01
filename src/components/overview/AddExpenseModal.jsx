// src/components/AddExpenseModal.jsx
import React from "react";
import { categories } from "../../models/categories";
import { useAddExpenseForm } from "../../hooks/useAddExpenseForm";
import LocationField from "./LocationField";

export default function AddExpenseModal({ date, onClose, onSaved }) {
  const {
    form,
    setForm,
    errors,
    isValid,
    submitting,
    amountRef,
    handleChange,
    handleSubmit,
    disableCurrentLocation,
  } = useAddExpenseForm({ date, onClose, onSaved });

  const locationInvalid = Boolean(errors.lat || errors.lng);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <h2>Add Expense</h2>

        <form onSubmit={handleSubmit} className="expense-form">
          <LocationField
            name={form.placeName}
            lat={
              Number.isFinite(Number(form.lat)) ? Number(form.lat) : undefined
            }
            lng={
              Number.isFinite(Number(form.lng)) ? Number(form.lng) : undefined
            }
            required
            onNameChange={(v) => setForm((p) => ({ ...p, placeName: v }))}
            onSelectPlace={(sel) => {
              const to6 = (v) =>
                Number.isFinite(v) ? String(Number(v).toFixed(6)) : undefined;
              setForm((p) => ({
                ...p,
                placeName: sel.name || p.placeName,
                lat: to6(sel.lat) ?? p.lat,
                lng: to6(sel.lng) ?? p.lng,
              }));
              disableCurrentLocation(); // turn toggle OFF when user picks a place
            }}
          />

          <label className="lbl">
            Amount (USD)
            <input
              ref={amountRef}
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              name="amountUSD"
              placeholder="e.g. 18.75"
              value={form.amountUSD}
              onChange={handleChange}
              className={errors.amountUSD ? "invalid" : ""}
              required
            />
            {errors.amountUSD && (
              <span className="err">{errors.amountUSD}</span>
            )}
          </label>

          {/* Category */}
          <label className="lbl">
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={errors.category ? "invalid" : ""}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          {/* Note */}
          <label className="lbl">
            Note
            <textarea
              name="note"
              placeholder="Optional note"
              value={form.note}
              onChange={handleChange}
              rows={3}
            />
          </label>

          {locationInvalid && (
            <div className="err" style={{ marginTop: 6 }}>
              Pick a place or turn on “Use my location”.
            </div>
          )}

          <div className="row">
            <div className="spacer" />
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={!isValid || submitting}
            >
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
