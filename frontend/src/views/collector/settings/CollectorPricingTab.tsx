import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import DataTable, { type Column } from "@/components/ui/data-table";
import { useState } from "react";
import { FeeSettings } from "@/views/collector/settings/FeeSettings";
import { useGetCollectorPricing, useGetPricingSettings, useUpdateMaterialPricing, type CollectorPricing } from "@/api-hooks/useCollector";
import { toast } from "sonner";

export function CollectorPricingTab() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: pricingData, isLoading } = useGetCollectorPricing({ page: currentPage, limit: 10 });
  const { data: settingsData }           = useGetPricingSettings();
  const { mutate: updatePricing }        = useUpdateMaterialPricing();

  const materials = pricingData?.data?.data ?? [];
  const meta      = pricingData?.data?.meta;
  const settings  = settingsData?.data?.settings;

  const handlePriceChange = (materialId: string, field: "basePrice" | "bulkPrice", value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    updatePricing(
      { materialId, [field]: num },
      { onError: () => toast.error("Failed to update price") }
    );
  };

  const handleToggleMaterial = (materialId: string, currentStatus: string) => {
    updatePricing(
      { materialId, status: currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
      {
        onSuccess: () => toast.success("Material updated"),
        onError:   () => toast.error("Failed to update material"),
      }
    );
  };

  const columns: Column<CollectorPricing>[] = [
    {
      key: "material",
      header: "Material Category",
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
            {m.material.photoUrl ? <img src={m.material.photoUrl} className="w-8 h-8 object-contain" /> : "♻️"}
          </div>
          <div>
            <div className="font-medium text-sm">{m.material.name}</div>
            <div className="text-xs text-muted-foreground">{m.material.description ?? m.material.type}</div>
          </div>
        </div>
      ),
    },
    {
      key: "basePrice",
      header: "Base price",
      render: (m) => (
        <div className="relative w-36">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
          <Input
            defaultValue={Number(m.basePrice).toFixed(2)}
            onBlur={(e) => handlePriceChange(m.materialId, "basePrice", e.target.value)}
            className="pl-8 h-10 bg-[#F9FAFB] border-gray-200"
          />
        </div>
      ),
    },
    {
      key: "bulkPrice",
      header: "Bulk rate (100+ Units)",
      render: (m) => (
        <div className="relative w-36">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
          <Input
            defaultValue={m.bulkPrice ? Number(m.bulkPrice).toFixed(2) : "0.00"}
            onBlur={(e) => handlePriceChange(m.materialId, "bulkPrice", e.target.value)}
            className="pl-8 h-10 bg-[#F9FAFB] border-gray-200"
          />
        </div>
      ),
    },
    {
      key: "status",
      header: "Action",
      render: (m) => (
        <Switch
          checked={m.status === "ACTIVE"}
          onCheckedChange={() => handleToggleMaterial(m.materialId, m.status)}
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (m) => (
        <Badge className={`uppercase text-xs font-semibold border-0 ${m.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
          {m.status}
        </Badge>
      ),
    },
  ];

  const renderMobile = (m: CollectorPricing) => (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl shrink-0">
            {m.material.photoUrl ? <img src={m.material.photoUrl} className="w-8 h-8 object-contain" /> : "♻️"}
          </div>
          <div>
            <div className="font-semibold">{m.material.name}</div>
            <div className="text-sm text-muted-foreground">{m.material.description ?? m.material.type}</div>
          </div>
        </div>
        <Switch checked={m.status === "ACTIVE"} onCheckedChange={() => handleToggleMaterial(m.materialId, m.status)} />
      </div>
      <div className="space-y-2 pl-15">
        {(["basePrice", "bulkPrice"] as const).map((field) => (
          <div key={field} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{field === "basePrice" ? "Base price:" : "Bulk rate:"}</span>
            <div className="relative w-28">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">$</span>
              <Input
                defaultValue={m[field] ? Number(m[field]).toFixed(2) : "0.00"}
                onBlur={(e) => handlePriceChange(m.materialId, field, e.target.value)}
                className="pl-6 h-8 text-sm bg-[#F9FAFB]"
              />
            </div>
          </div>
        ))}
        <Badge className={`${m.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} text-xs`}>
          {m.status}
        </Badge>
      </div>
    </>
  );

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading pricing...</div>;

  return (
    <div className="p-8 space-y-8">
      <DataTable
        data={materials}
        columns={columns}
        keyExtractor={(m) => m.materialId}
        header={{ title: "Pricing & Materials", subtitle: "Manage your collection & accepted recycling materials" }}
        pagination={{
          currentPage,
          totalPages:   meta?.totalPages ?? 1,
          onPageChange: setCurrentPage,
          showText:     `Showing ${materials.length} of ${meta?.total ?? materials.length} materials`,
        }}
        mobileRender={renderMobile}
      />

      {settings && (
        <FeeSettings
          serviceFee={String(settings.serviceFee)}
          feeType={settings.feeType === "PERCENTAGE" ? "PERCENTAGE_FEE" : "FLAT_FEE"}
          bulkThreshold={String(settings.bulkThreshold)}
          bulkIncentiveEnabled={settings.bulkIncentiveEnabled}
        />
      )}
    </div>
  );
}