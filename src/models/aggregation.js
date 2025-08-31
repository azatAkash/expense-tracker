import { generateId } from "../utils/generate";
import { isValidDate } from "../utils/validation";

const aggregationByDay = [
  {
    id: generateId("aggday"),
    date: "20250827",
    totalSum: 0,
    transactions: 0,
    expenseIds: [],
  },
];

export function setAggregationByDate(date, expenses) {
  if (!isValidDate(date)) {
    throw new Error(`Invalid date key: ${date}`);
  }

  const totalSum = expenses.reduce((sum, e) => sum + e.amountUSDCents, 0);
  const transactions = expenses.length;
  const expenseIds = expenses.map((e) => e.id);

  const existing = aggregationByDay.find((a) => a.date === date);
  if (existing) {
    existing.totalSum = totalSum;
    existing.transactions = transactions;
    existing.expenseIds = expenseIds;
    return existing;
  }

  // if date not present, add new aggregation entry
  return createEmptyAgg(date, expenseIds, totalSum, transactions);
}

/**
 * Create a fresh aggregation entry with optional expense IDs.
 */
function createEmptyAgg(date, expenseIds = [], totalSum = 0, transactions = 0) {
  if (!isValidDate(date)) {
    throw new Error(`Could not create new aggregation on date: ${date}`);
  }

  const newAgg = {
    id: generateId("aggday"),
    date,
    totalSum,
    transactions,
    expenseIds,
  };

  aggregationByDay.push(newAgg);
  return newAgg;
}

export function getAggregationByDate(date) {
  if (!isValidDate(date)) {
    throw new Error(`Invalid date key: ${date}`);
  }
  return (
    aggregationByDay.find((aggD) => aggD.date === date) || createEmptyAgg(date)
  );
}
