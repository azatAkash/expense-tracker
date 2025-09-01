import { generateId } from "../utils/generate";
import { isValidDate } from "../utils/validation";

export const expenses = [
  {
    id: generateId("exp"),
    date: "20250827",
    time: "1745",
    timezone: "5",
    amountUSDCents: 1875,
    category: "Food & Dining",
    note: "bought water 1l and milk 1l and loaf of bread, 200 grams of butterbought water 1l and milk 1l and loaf of bread, 200 grams of butterbought water 1l and milk 1l and loaf of bread, 200 grams of butter",
    coordinates: {
      lat: 51.081474,
      lng: 71.396904,
    },
  },
  {
    id: generateId("exp"),
    date: "20250827",
    time: "1200",
    timezone: "5",
    amountUSDCents: 134235,
    category: "Transportation",
    note: "bought water 1l and milk 1l",
    coordinates: {
      lat: 51.091474,
      lng: 71.396904,
    },
  },
  {
    id: generateId("exp"),
    date: "20250827",
    time: "0001",
    timezone: "5",
    amountUSDCents: 11875,
    category: "Other",
    note: "bought water 1l and milk 1l",
    coordinates: {
      lat: 51.091474,
      lng: 71.396904,
    },
  },
  {
    id: generateId("exp"),
    date: "20250831",
    time: "0001",
    timezone: "5",
    amountUSDCents: 1875,
    category: "Entertainment",
    note: "bought water 1l and milk 1l",
    coordinates: {
      lat: 51.091474,
      lng: 71.396904,
    },
  },
  {
    id: generateId("exp"),
    date: "20250831",
    time: "0001",
    timezone: "5",
    amountUSDCents: 1875,
    category: "Entertainment",
    note: "bought water 1l and milk 1l",
    coordinates: {
      lat: 51.091075,
      lng: 71.400226,
    },
  },
];

export function getExpencesByDate(date) {
  if (!isValidDate(date)) {
    throw new Error(`Invalid date key: ${date}`);
  }

  return expenses
    .filter((exp) => exp.date === date)
    .sort((a, b) => Number(a.time) - Number(b.time));
}

export function addExpense(expense) {
  // destructure with defaults
  const {
    date,
    time,
    timezone = "0",
    amountUSDCents,
    category,
    note = "",
    coordinates,
  } = expense;

  // basic validation
  if (!isValidDate(date)) {
    throw new Error(`Invalid date: ${date}`);
  }
  if (!time || isNaN(Number(time))) {
    throw new Error(`Invalid time: ${time}`);
  }
  if (!Number.isFinite(amountUSDCents) || amountUSDCents < 0) {
    throw new Error(`Invalid amount: ${amountUSDCents}`);
  }
  if (!coordinates?.lat || !coordinates?.lng) {
    throw new Error("Missing coordinates");
  }

  const newExpense = {
    id: generateId("exp"),
    date,
    time,
    timezone,
    amountUSDCents,
    category,
    note,
    coordinates,
  };

  expenses.push(newExpense);
  return newExpense;
}
