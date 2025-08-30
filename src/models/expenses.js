import { generateId } from "../utils/generate";
import { getCategoryByName } from "./categories";

const expenses = [
  {
    id: generateId("exp"),
    date: {
      year: "2025",
      month: "08",
      day: "27",
      weekday: "Wednsday",
    },
    time: {
      hours: "17",
      minutes: "45",
      timezone: "6",
    },
    amountUSDCents: 1875,
    category: getCategoryByName("Food"),
    note: "bought water 1l and milk 1l",
    coordinates: {
      lat: 51.091474,
      lng: 71.396904,
    },
  },
];

console.log(expenses);
