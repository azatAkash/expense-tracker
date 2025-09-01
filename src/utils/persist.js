// src/utils/persist.js
const canUseStorage =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const PREFIX = "xpense:v1:";

const key = (k) => PREFIX + k;

export function load(name, fallback) {
  if (!canUseStorage) return fallback;
  try {
    const raw = localStorage.getItem(key(name));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(name, value) {
  if (!canUseStorage) return;
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch {}
}

export function clearAll() {
  if (!canUseStorage) return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}
