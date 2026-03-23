export type RequestItemRow = {
  materialId: string;
  material: string;
  estimatedUnits: number;
  unitPrice: number;
  actualUnits: number;
  price: number;
};

export type RequestRow = {
  pickupId: string;
  Username: string;
  Location: string;
  material1: string;
  material2?: string;
  material3?: string;
  Date: string;
  startTime: string;
  endTime: string;
  Compatibility: number;
  status: "incoming" | "accepted" | "completed";
  estimatedEarning: number;
  actualEarning: number;
  items: RequestItemRow[];
  estUnits: number;
  note?: string;
  pickupCount?: number;
};