import { useState } from "react";
import { DEFAULT_MATERIALS, type Material } from "@/types/materials";

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>(DEFAULT_MATERIALS);
  const [serviceFee, setServiceFee] = useState("");
  const [bulkThreshold, setBulkThreshold] = useState("100");
  const [applyBulkToAll, setApplyBulkToAll] = useState(false);

  const handleToggleMaterial = (id: number) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  };

  const handlePriceChange = (
    id: number,
    field: "basePrice" | "bulkRate",
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: numValue } : m))
    );
  };

  return {
    materials,
    serviceFee,
    setServiceFee,
    bulkThreshold,
    setBulkThreshold,
    applyBulkToAll,
    setApplyBulkToAll,
    handleToggleMaterial,
    handlePriceChange,
  };
}
