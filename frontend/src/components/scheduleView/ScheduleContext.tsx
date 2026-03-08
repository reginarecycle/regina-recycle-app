import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";


type ScheduleData = {
 categories: string[];
 itemPicked: Record<string, number>;
 totalSelected: number;
 pickupDate: string | null;
 slotId: string | null;
 slotLabel: string | null;
 address: string;
 estCost: number;
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
};


const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);


export function ScheduleProvider({ children }: { children: ReactNode }) {


 const [scheduleData, setScheduleData] = useState<ScheduleData>(() => {
   const saved = localStorage.getItem("scheduleData");
   return saved ? JSON.parse(saved) : defaultScheduleData;
 });


 useEffect(() => {
   localStorage.setItem("scheduleData", JSON.stringify(scheduleData));
 }, [scheduleData]);


 const updateScheduleData = useCallback((updates: Partial<ScheduleData>) => {
 setScheduleData((prev) => ({
   ...prev,
   ...updates,
 }));
}, []);


 const resetScheduleData = useCallback(() => {
 setScheduleData(defaultScheduleData);
 localStorage.removeItem("scheduleData");
}, []);


 return (
   <ScheduleContext.Provider
     value={{
       scheduleData,
       updateScheduleData,
       resetScheduleData,
     }}
   >
     {children}
   </ScheduleContext.Provider>
 );
}


export function useSchedule() {
 const context = useContext(ScheduleContext);


 if (!context) {
   throw new Error("useSchedule must be used inside ScheduleProvider");
 }


 return context;
}