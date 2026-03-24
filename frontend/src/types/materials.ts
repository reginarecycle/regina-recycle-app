export type Material = {
  id: number;
  name: string;
  desc: string;
  basePrice: number;
  bulkRate: number;
  active: boolean;
  icon: string;
};

export const DEFAULT_MATERIALS: Material[] = [
  { id: 1, name: "Glass Bottles",  desc: "Clear & Coloured",           basePrice: 0.10, bulkRate: 0.12, active: true,  icon: "🍾" },
  { id: 2, name: "PET Plastic",    desc: "Water & Soft drink bottles", basePrice: 0.05, bulkRate: 0.07, active: true,  icon: "🥤" },
  { id: 3, name: "Aluminium Cans", desc: "Beverages only",             basePrice: 0.10, bulkRate: 0.15, active: true,  icon: "🥫" },
  { id: 4, name: "Cardboard",      desc: "Beverages only",             basePrice: 0.00, bulkRate: 0.00, active: false, icon: "📦" },
];
