import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import store from './store.js';
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import './pages/home.css';

// Clear legacy localStorage/sessionStorage data on startup to ensure no cache remains
try {
  localStorage.clear();
  sessionStorage.clear();
} catch (e) {
  console.warn("Could not clear legacy storage:", e);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);