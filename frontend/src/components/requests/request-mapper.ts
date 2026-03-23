import type { RequestRow } from "./types";

export const mapPickupToRequestRow = (
  pickup: any,
  activeTab: "incoming" | "accepted" | "completed",
  pricingMap: Record<string, number>,
): RequestRow => {
  const itemMaterialIds =
    pickup.items?.map(
      (item: any) => item.material?.materialId ?? item.materialId,
    ) ?? [];

  // const isCompatible =
  //   itemMaterialIds.length > 0 &&
  //   itemMaterialIds.every((id: string) => pricingMap[id] !== undefined);

  const matchedCount = itemMaterialIds.filter(
  (id: string) => pricingMap[id] !== undefined,
).length;

const compatibility =
  itemMaterialIds.length > 0
    ? Math.round((matchedCount / itemMaterialIds.length) * 100)
    : 0;

  const items =
    pickup.items?.map((item: any) => {
      const materialId = item.material?.materialId ?? item.materialId;
      const quantity = Number(item.quantity ?? 0);
      const unitPrice = pricingMap[materialId] ?? 0;

      return {
        materialId,
        material: item.material?.name ?? "Unknown Material",
        estimatedUnits: quantity,
        unitPrice,
        actualUnits: quantity,
        price: unitPrice * quantity,
      };
    }) ?? [];

  const estUnits = items.reduce((sum, item) => sum + item.estimatedUnits, 0);

  return {
    pickupId: pickup.pickupId,
    Username: pickup.requester?.name ?? "Unknown User",
    Location: pickup.address?.line1 ?? "No Address",
    material1: pickup.items?.[0]?.material?.name ?? "",
    material2: pickup.items?.[1]?.material?.name ?? "",
    material3: pickup.items?.[2]?.material?.name ?? "",
    Date: new Date(pickup.scheduledAt).toLocaleDateString(),
    startTime: new Date(pickup.scheduledAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    endTime: new Date(pickup.scheduledAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    Compatibility: compatibility,
    status: activeTab,
    estimatedEarning: Number(pickup.estimatedEarning ?? 0),
    actualEarning: Number(pickup.actualEarning ?? 0),
    items,
    estUnits,
    note: pickup.note ?? "",
    pickupCount: 0,
  };
};
