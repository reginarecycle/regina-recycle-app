export type Category = "all" | "recyclable" | "hazardous" | "compost" | "garbage";

export interface RecyclingItem {
    id: number;
    image: string;
    title: string;
    item: string;
    tip: string;
    category: Category;
    label: string;
    labelColor: string;
    labelTextColor: string;
    badgeColor: string;
    badgeIcon: "check" | "bin" | "compost" | "warning";
  }