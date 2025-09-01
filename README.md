# Expense Tracker (Take-home)

The stack used:

- **Frontend:** React (functional components + hooks), Vite, plain CSS
- **Maps:** Google Maps JavaScript API (Maps, **Places**, **Advanced Marker** libraries)
- **State:** Local component state + `useMemo/useCallback`
- **Storage (persistence):** `localStorage` (expenses + saved places)
- **Utilities:** Small custom helpers (formatting, validation, geolocation wrapper)
- **Build/Dev:** Node + npm scripts (`vite` dev/build/preview)

_No backend or UI framework required for this take-home; everything runs client-side._

## What’s inside

- **Add Expense**
  - USD amount, category, optional note
  - **Geolocation** captured on save (with “Use my location”)
  - Optional place name (stored for the coordinates)
  - Inline validation, keyboard friendly (Esc to close)

- **Expenses Viewer**
  - Date slider to pick a day (grouped lists)
  - Totals and transaction count for the day
  - **Google Map** with custom colored markers (category colors)
  - Clicking a **card** centers the map and opens a styled info window
  - Clicking a **marker** selects/highlights the corresponding card

- **Persistence**
  - All data (expenses + saved places) is stored in `localStorage`, so it survives refreshes.

- **A few nice touches**
  - Smooth map panning without changing tilt/heading
  - Color-coded categories and markers
  - Lightweight state with memoization to avoid unnecessary re-renders

## Quick start

**Install**

```bash
npm install
```

**Run**

```bash
npm run dev
```

Open the printed URL.
To build: `npm run build` and preview with `npm run preview`.

## How data is stored

- **Expenses**: `localStorage["expenses"]` – array of `{ id, date(YYYYMMDD), time(HHmm), amountUSDCents, category, note, coordinates:{lat,lng}, placeName? }`
- **Saved places (per coordinates)**: `localStorage["coordinates"]`

_No server is required for the demo. Swapping `localStorage` for any backend later is straightforward (single storage module)._

## Notes / trade-offs

- This is a client-side demo; no auth or server persistence.
- Places & Maps require an API key with billing enabled.
- I kept the stack minimal (React + Vite + Google Maps JS). No UI library to keep the code transparent.

If you want me to deploy a live demo or extend the time-range viewer beyond daily grouping (e.g., week/month picker), I can add that quickly. Thanks for reviewing!
