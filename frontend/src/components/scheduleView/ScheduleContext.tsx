import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

type ScheduleData = {
  categories: string[];
  itemPicked: Record<string, number>;
  totalSelected: number;
  pickupDate: string | null;
  slotId: string | null;
  slotLabel: string | null;
  address: string;
  estCost: number;
  photo: File | null;
  note: string;
};

type ScheduleContextType = {
  scheduleData: ScheduleData;
  updateScheduleData: (updates: Partial<ScheduleData>) => void;
  resetScheduleData: () => void;
};

const defaultScheduleData: ScheduleData = {
  categories: [],
  itemPicked: {},
  totalSelected: 0,
  pickupDate: null,
  slotId: null,
  slotLabel: null,
  address: "",
  estCost: 0,
  photo: null,
  note: "",
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [scheduleData, setScheduleData] = useState<ScheduleData>(defaultScheduleData);

  const updateScheduleData = useCallback((updates: Partial<ScheduleData>) => {
    setScheduleData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetScheduleData = useCallback(() => {
    setScheduleData(defaultScheduleData);
  }, []);

  return (
    <ScheduleContext.Provider value={{ scheduleData, updateScheduleData, resetScheduleData }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error("useSchedule must be used inside ScheduleProvider");
  return context;
}