import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "@govbr-ds/core/dist/core.min.css";
import "@govbr-ds/core/dist/core.min.js";
import '~@govbr-ds/core/dist/core-tokens.min.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);