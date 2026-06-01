import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app";
import './styles/styles.css';

const root = document.querySelector("#root");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);