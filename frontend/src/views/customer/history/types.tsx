export type RecycleStatus = "COMPLETED" | "PENDING" | "CANCELLED";
export type MaterialType = "Glass" | "Plastic" | "Carton" | "Metal" | "Paper";
export type HistoryTab = "ALL" | RecycleStatus;
 
export interface RecycleRecord {
  id: string;
  location: string;
  materials: MaterialType[];
  date: string;
  status: RecycleStatus;
  // detail fields
  referenceNumber: string;
  collectorName: string;
  collectorId: string;
  requestDate: string;
  scheduledPickupDate: string;
  pickupLocation: string;
}
 




