import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { QuizProvider } from "./context/QuizConext.tsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <QuizProvider>
          <App />
        </QuizProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
