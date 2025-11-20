// CRITICAL: Import safe date handler FIRST to override Date.prototype globally
import "./lib/safeDateHandler";

import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./styles/farmer-animations.css";
// Import i18n configuration to initialize translations before app starts
import "./lib/i18n";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
