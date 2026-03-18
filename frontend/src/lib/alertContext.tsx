import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface AlertMessage {
  id: string;
  message: string;
  type: "error" | "success" | "warning" | "info";
}

interface AlertContextValue {
  alerts: AlertMessage[];
  addAlert: (message: string, type?: AlertMessage["type"]) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const addAlert = useCallback((message: string, type: AlertMessage["type"] = "error") => {
    const id = crypto.randomUUID();
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 6000);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within <AlertProvider>");
  return ctx;
}
