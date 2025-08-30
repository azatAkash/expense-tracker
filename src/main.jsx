import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.jsx";
const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App mapId={MAP_ID} />
  </StrictMode>
);
