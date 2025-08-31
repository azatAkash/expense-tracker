import { generateId } from "../utils/generate";
import { getCategoryByName } from "./categories";

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
    amountUSDCents: 1875,
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
    amountUSDCents: 1875,
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
];

export function getExpencesByDate(date) {
  return expenses
    .filter((exp) => exp.date === date)
    .sort((a, b) => Number(a.time) - Number(b.time));
}
