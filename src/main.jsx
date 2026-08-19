import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import store from './store.js';
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import './components/home.css';

// Remove stale redux-persist keys left from previous implementation
// This does NOT clear auth tokens or user data — just removes old cache artifacts
try {
  localStorage.removeItem('persist:root');
} catch (e) {
  // storage not available, no-op
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);