import { generateId } from "../utils/generate";

export const categories = [
  {
    id: generateId("cat"),
    name: "Food & Dining",
    color: "#ff0000ff",
  },
  {
    id: generateId("cat"),
    name: "Transportation",
    color: "#006effff",
  },
  {
    id: generateId("cat"),
    name: "Education",
    color: "#30ff67ff",
  },
  {
    id: generateId("cat"),
    name: "Shopping",
    color: "#ffc130ff",
  },
  {
    id: generateId("cat"),
    name: "Entertainment",
    color: "#7530ffff",
  },
  {
    id: generateId("cat"),
    name: "Other",
    color: "#767676ff",
  },
];

export function getCategoryByName(name) {
  return categories.find((category) =>
    category.name.toLowerCase().includes(name.toLowerCase())
  );
}
