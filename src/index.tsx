import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contextApi/AuthContext";

const rootElement = document.getElementById("root") as HTMLElement;

const root = ReactDOM.createRoot(rootElement);

root.render(
    //Added Context Api
    <AuthProvider> 
      <App />
    </AuthProvider>
);

