import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "@govbr-ds/core/dist/core.min.css";
import "@govbr-ds/core/dist/core.min.js";
import '@govbr-ds/core/dist/core-tokens.min.css';
import "flatpickr/dist/flatpickr.min.css";
/*import "../LoanList.css"*/

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </StrictMode>
);