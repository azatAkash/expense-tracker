// src/models/expenses.js
import { generateId } from "../utils/generate";
import { isValidDate } from "../utils/validation";
import { load, save } from "../utils/persist";

const STORAGE_NAME = "expenses";

// Start empty; hydrate if present
export const expenses = [];
(() => {
  const persisted = load(STORAGE_NAME, null);
  if (Array.isArray(persisted)) expenses.push(...persisted);
})();

export function getExpencesByDate(date) {
  if (!isValidDate(date)) throw new Error(`Invalid date key: ${date}`);
  return expenses
    .filter((exp) => exp.date === date)
    .sort((a, b) => Number(a.time) - Number(b.time));
}

export function addExpense(expense) {
  const {
    date,
    time,
    timezone = "0",
    amountUSDCents,
    category,
    note = "",
    placeName,
    coordinates,
    coordinateId = null,
  } = expense;

  if (!isValidDate(date)) throw new Error(`Invalid date: ${date}`);
  if (!time || isNaN(Number(time))) throw new Error(`Invalid time: ${time}`);
  if (!Number.isFinite(amountUSDCents) || amountUSDCents < 0)
    throw new Error(`Invalid amount: ${amountUSDCents}`);
  if (!placeName || !placeName.trim())
    throw new Error("Place name is required");

  const lat = Number(coordinates?.lat);
  const lng = Number(coordinates?.lng);
  if (!Number.isFinite(lat) || Math.abs(lat) > 90)
    throw new Error("Invalid latitude");
  if (!Number.isFinite(lng) || Math.abs(lng) > 180)
    throw new Error("Invalid longitude");

  const newExpense = {
    id: generateId("exp"),
    date,
    time,
    timezone,
    amountUSDCents,
    category,
    note,
    placeName: placeName.trim(),
    coordinates: { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) },
    coordinateId,
  };

  expenses.push(newExpense);
  save(STORAGE_NAME, expenses); // persist on write
  console.log(expenses);
  return newExpense;
}

// (optional) helpers
export function removeExpense(id) {
  const i = expenses.findIndex((e) => e.id === id);
  if (i >= 0) {
    expenses.splice(i, 1);
    save(STORAGE_NAME, expenses);
    return true;
  }
  return false;
}
