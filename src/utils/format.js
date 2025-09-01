export function formatCurrencyCents(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}

export function formatTime(timeStr, use12h = false, locale = "en-US") {
  if (!timeStr || typeof timeStr !== "string") return "";

  // Normalize: pad left so "930" → "0930"
  const normalized = timeStr.padStart(4, "0");

  const hours = parseInt(normalized.slice(0, 2), 10);
  const minutes = parseInt(normalized.slice(2, 4), 10);

  if (isNaN(hours) || isNaN(minutes)) return "";

  const d = new Date();
  d.setHours(hours, minutes, 0, 0); // clear seconds/millis

  return d.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: use12h,
  });
}

export function formatToYYYYMMDD(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function getCurrentTimeStr(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}${minutes}`; // e.g. "1203"
}

export function getFormattedDate(
  date = new Date(),
  {
    weekLen = "short", // "short" | "long" | "narrow"
    monthLen = "short", // "numeric" | "2-digit" | "long" | "short" | "narrow"
    day = "numeric", // "numeric" | "2-digit"
    year = false, // include year?
  } = {}
) {
  const dateStr = date.toLocaleDateString("en-US", {
    month: monthLen,
    day,
    ...(year ? { year: "numeric" } : {}),
  });

  const weekStr = date.toLocaleDateString("en-US", {
    weekday: weekLen,
  });

  return {
    dateStr, // e.g. "Aug 27" or "August 27, 2025" if year:true
    weekStr, // e.g. "Wed" / "Wednesday"
    yearStr: year ? String(date.getFullYear()) : "",
  };
}

export function cleanAddress(address) {
  if (!address) return "";
  // removes 4–6 digit postal codes
  return address.replace(/\s\d{4,6}(?=,|$)/, "").trim();
}

export function hexToRgba(hex, alpha = 0.3) {
  if (!hex) return `rgba(0,0,0,${alpha})`; // fallback if undefined
  const str = String(hex).trim();

  // if hex is shorthand like #abc → expand to #aabbcc
  const fullHex =
    str.length === 4
      ? "#" +
        str
          .slice(1)
          .split("")
          .map((c) => c + c)
          .join("")
      : str;

  const r = parseInt(fullHex.slice(1, 3), 16);
  const g = parseInt(fullHex.slice(3, 5), 16);
  const b = parseInt(fullHex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
