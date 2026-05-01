import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

console.log("[MAIN] VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("[MAIN] VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("[MAIN] Full env:", import.meta.env);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
