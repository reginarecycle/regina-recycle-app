import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProviders } from "./provider/AppProviders.tsx";
import { ScheduleProvider } from "./components/scheduleView/ScheduleContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <ScheduleProvider>
        <App />
      </ScheduleProvider>
    </AppProviders>
  </StrictMode>
);
