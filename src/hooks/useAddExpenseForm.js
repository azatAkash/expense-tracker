// src/hooks/useAddExpenseForm.js
import { useState, useRef, useEffect, useCallback } from "react";
import { categories } from "../models/categories";
import { addExpense } from "../models/expenses";
import { generateId } from "../utils/generate";
import { formatToYYYYMMDD, getCurrentTimeStr } from "../utils/format";
import { useExpenseValidation } from "./useExpenseValidation";
import { getCurrentLocation } from "../utils/geolocation";
import { rememberPlace } from "../models/coordinates";

/**
 * Manages Add Expense form state, validation, geolocation, and submit.
 * - User types USD; useExpenseValidation converts to cents at save.
 * - Toggle for using current location; auto-fills when enabled.
 * - Selecting a suggestion should call disableCurrentLocation() in the modal.
 */
export function useAddExpenseForm({ date, onClose, onSaved } = {}) {
  const [form, setForm] = useState({
    date: formatToYYYYMMDD(date ?? new Date()),
    timezone: "0",
    amountUSD: "", // user enters dollars; converted to cents on save
    category: categories[0]?.name ?? "Other",
    note: "",
    lat: "", // stored as strings in state
    lng: "",
    placeName: "", // human-friendly name
  });

  const [submitting, setSubmitting] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const amountRef = useRef(null);

  // focus amount on open
  useEffect(() => {
    amountRef.current?.focus();
  }, []);

  // keep date in sync
  useEffect(() => {
    if (date) setForm((p) => ({ ...p, date: formatToYYYYMMDD(date) }));
  }, [date]);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // generic input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // geolocation helper (numbers -> fixed(6) -> strings)
  const locateNow = useCallback(async () => {
    const { lat, lng } = await getCurrentLocation();
    return {
      lat: String(Number(lat).toFixed(6)),
      lng: String(Number(lng).toFixed(6)),
    };
  }, []);

  // auto-fill once if toggle ON and coords empty
  useEffect(() => {
    if (useCurrentLocation && (!form.lat || !form.lng)) {
      (async () => {
        try {
          const c = await locateNow();
          setForm((p) => ({ ...p, ...c }));
        } catch (e) {
          setUseCurrentLocation(false);
          console.error(e);
        }
      })();
    }
  }, [useCurrentLocation, form.lat, form.lng, locateNow]);

  // public toggle handler
  const toggleUseCurrentLocation = useCallback(
    async (checked) => {
      setUseCurrentLocation(checked);
      if (checked) {
        try {
          const c = await locateNow();
          setForm((p) => ({ ...p, ...c }));
        } catch (e) {
          setUseCurrentLocation(false);
          alert(e.message || "Failed to get location");
        }
      }
    },
    [locateNow]
  );

  // helper to turn OFF when user picks a suggested place
  const disableCurrentLocation = useCallback(() => {
    setUseCurrentLocation(false);
  }, []);

  // validation (requireName: true to ensure placeName is not empty)
  const { parsed, errors, isValid } = useExpenseValidation(form, {
    requireName: true,
  });
  // parsed = { usd, cents, lat, lng }

  // submit
  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!isValid || submitting) return;

      setSubmitting(true);
      try {
        // Upsert coordinates DTO with the human name
        const saved = rememberPlace({
          lat: Number(parsed.lat),
          lng: Number(parsed.lng),
          name: form.placeName.trim(),
        });

        // Prefer normalized coords from the DTO (consistent rounding)
        const normalized = saved?.coordinates ?? {
          lat: Number(Number(parsed.lat).toFixed(6)),
          lng: Number(Number(parsed.lng).toFixed(6)),
        };

        const newExpense = {
          id: generateId("exp"),
          date: form.date,
          time: getCurrentTimeStr(new Date()), // "HHmm"
          timezone: form.timezone,
          amountUSDCents: parsed.cents, // USD -> cents
          category: form.category,
          note: form.note?.trim() || "",
          placeName: form.placeName.trim(), // ✅ include name on expense
          coordinates: normalized, // ✅ include coords on expense
          coordinateId: saved?.id || null, // optional link to coordinates DTO
        };

        // quick sanity log
        // console.log("Submitting expense:", newExpense);

        addExpense(newExpense);
        onSaved?.(newExpense);
        onClose?.();
      } catch (err) {
        alert(err.message || String(err));
      } finally {
        setSubmitting(false);
      }
    },
    [isValid, submitting, form, parsed, onSaved, onClose]
  );

  return {
    // state
    form,
    setForm,

    // validation
    errors,
    isValid,
    parsed,

    // ux
    submitting,
    amountRef,

    // actions
    handleChange,
    handleSubmit,

    // location toggle API
    useCurrentLocation,
    toggleUseCurrentLocation,
    disableCurrentLocation,
  };
}
