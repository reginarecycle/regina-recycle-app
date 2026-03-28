export interface PickupItem {
  materialId:   string;
  materialName: string;
  quantity:     number;
  unitPrice:    number;
}

export type RequestRow = {
  id:        string;
  pickupId:  string;
  Username:  string;
  Location:  string;
  material1?: string;
  material2?: string;
  material3?: string;
  Date:      string;
  startTime: string;
  endTime:   string;
  Compatibility:    number;
  status:           "incoming" | "accepted" | "completed";
  /** Customer's expected payout — always present on PENDING requests */
  estimatedCost:    number;
  /** Collector's net earning after fees — set on acceptance */
  estimatedEarning: number;
  actualEarning:       number;
  serviceFeeSnapshot:  number;
  feeTypeSnapshot:     string;
  estUnits:            number;
  requestNumber?:   string;
  scheduledAt:      string;
  items:            PickupItem[];
  /** Live items at current pricing — only set when snapshot prices differ */
  currentItems?:    PickupItem[];
  note?:            string;
};

