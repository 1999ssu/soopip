import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";
import "./styles/globals.css";
import { Provider } from "react-redux";
import { store } from "./routes/store";
ReactDOM.createRoot(document.getElementById("root")).render(
  _jsx(React.StrictMode, {
    children: _jsx(Provider, { store: store, children: _jsx(AppRoutes, {}) }),
  }),
);
