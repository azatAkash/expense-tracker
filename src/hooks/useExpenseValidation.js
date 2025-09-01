// src/hooks/useExpenseValidation.js
import { useMemo } from "react";

function parseMoneyUSD(v) {
  if (v === "" || v === null || v === undefined) return NaN;
  // allow "12.34", "12,34", "$12.34", " 12 34 "
  const cleaned = String(v)
    .replace(/[^0-9.,-]/g, "")
    .replace(",", ".");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : NaN;
}

export function useExpenseValidation(form, { requireName = false } = {}) {
  const parsed = useMemo(() => {
    const usd = parseMoneyUSD(form.amountUSD);
    const cents = Number.isFinite(usd)
      ? Math.round((usd + Number.EPSILON) * 100)
      : NaN;
    const lat = Number(form.lat);
    const lng = Number(form.lng);
    return { usd, cents, lat, lng };
  }, [form]);

  const errors = useMemo(() => {
    const e = {};
    if (!(parsed.cents >= 1)) e.amountUSD = "Enter amount ≥ $0.01";

    const locOk =
      Number.isFinite(parsed.lat) &&
      Math.abs(parsed.lat) <= 90 &&
      Number.isFinite(parsed.lng) &&
      Math.abs(parsed.lng) <= 180;

    if (!locOk) e.location = "Choose a place or turn on “Use my location”.";
    if (requireName && !form.placeName?.trim())
      e.placeName = "Enter a location name";

    if (!form.category) e.category = "Choose a category";
    return e;
  }, [parsed, form, requireName]);

  const isValid = Object.keys(errors).length === 0;
  return { parsed, errors, isValid };
}
