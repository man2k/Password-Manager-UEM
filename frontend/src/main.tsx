import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { app, events, init } from "@neutralinojs/lib";
import { AuthProvider } from "./context/AuthContext.tsx";

import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

init();

function onWindowClose() {
  app.exit();
}
events.on("windowClose", onWindowClose);
