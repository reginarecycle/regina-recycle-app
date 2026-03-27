import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable, { type Column } from "@/components/ui/data-table";
import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { FeeSettings } from "@/views/collector/settings/FeeSettings";
import { useGetCollectorPricing, useGetPricingSettings, useUpdateMaterialPricing, type CollectorPricing } from "@/api-hooks/useCollector";
import { toast } from "sonner";

type LocalEdits = Record<string, { basePrice?: string; bulkPrice?: string; status?: "ACTIVE" | "INACTIVE" }>;

export function CollectorPricingTab() {
  const [currentPage, setCurrentPage]   = useState(1);
  const [inputValue, setInputValue]     = useState("");
  const [localEdits, setLocalEdits]     = useState<LocalEdits>({});
  const [isSaving, setIsSaving]         = useState(false);

  const debouncedSearch = useDebounce(inputValue, 400);

  useEffect(() => {
    setCurrentPage(1);
    setLocalEdits({});
  }, [debouncedSearch]);

  const { data: pricingData, isLoading, isFetching } = useGetCollectorPricing({ page: currentPage, limit: 5, search: debouncedSearch });
  const { data: settingsData }           = useGetPricingSettings();
  const { mutateAsync: updatePricing }   = useUpdateMaterialPricing();

  const materials = pricingData?.data?.data ?? [];
  const meta      = pricingData?.data?.meta;
  const settings  = settingsData?.data?.settings;

  const isDirty = Object.keys(localEdits).length > 0;

  const setEdit = (materialId: string, field: keyof LocalEdits[string], value: string) => {
    setLocalEdits((prev) => ({
      ...prev,
      [materialId]: { ...prev[materialId], [field]: value },
    }));
  };

  const handleSaveTable = async () => {
    setIsSaving(true);
    try {
      await Promise.all(
        Object.entries(localEdits).map(([materialId, edits]) => {
          const payload: { materialId: string; basePrice?: number; bulkPrice?: number; status?: string } = { materialId };
          if (edits.basePrice !== undefined) payload.basePrice = parseFloat(edits.basePrice);
          if (edits.bulkPrice !== undefined) payload.bulkPrice = parseFloat(edits.bulkPrice);
          if (edits.status    !== undefined) payload.status    = edits.status;
          return updatePricing(payload);
        })
      );
      setLocalEdits({});
      toast.success("Pricing saved");
    } catch {
      toast.error("Failed to save pricing");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatus = (m: CollectorPricing) =>
    (localEdits[m.materialId]?.status ?? m.status) as "ACTIVE" | "INACTIVE";

  const getBasePrice = (m: CollectorPricing) =>
    localEdits[m.materialId]?.basePrice ?? Number(m.basePrice).toFixed(2);

  const getBulkPrice = (m: CollectorPricing) =>
    localEdits[m.materialId]?.bulkPrice ?? (m.bulkPrice ? Number(m.bulkPrice).toFixed(2) : "0.00");

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
            <div className="text-xs text-muted-foreground">{m.material.description}</div>
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
            value={getBasePrice(m)}
            onChange={(e) => setEdit(m.materialId, "basePrice", e.target.value)}
            className="pl-8 h-10 bg-[#F9FAFB] border-gray-200"
          />
        </div>
      ),
    },
    {
      key: "bulkPrice",
      header: `Bulk rate (${settings?.bulkThreshold ?? 100}+ Units)`,
      render: (m) => (
        <div className="relative w-36">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
          <Input
            value={getBulkPrice(m)}
            onChange={(e) => setEdit(m.materialId, "bulkPrice", e.target.value)}
            className="pl-8 h-10 bg-[#F9FAFB] border-gray-200"
          />
        </div>
      ),
    },
    {
      key: "toggle",
      header: "Action",
      render: (m) => (
        <Switch
          checked={getStatus(m) === "ACTIVE"}
          onCheckedChange={() =>
            setEdit(m.materialId, "status", getStatus(m) === "ACTIVE" ? "INACTIVE" : "ACTIVE")
          }
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (m) => {
        const status = getStatus(m);
        return (
          <Badge className={`uppercase text-xs font-semibold border-0 ${status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
            {status}
          </Badge>
        );
      },
    },
  ];

  const renderMobile = (m: CollectorPricing) => {
    const status = getStatus(m);
    return (
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
          <Switch
            checked={status === "ACTIVE"}
            onCheckedChange={() =>
              setEdit(m.materialId, "status", status === "ACTIVE" ? "INACTIVE" : "ACTIVE")
            }
          />
        </div>
        <div className="space-y-2 pl-15">
          {(["basePrice", "bulkPrice"] as const).map((field) => (
            <div key={field} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{field === "basePrice" ? "Base price:" : "Bulk rate:"}</span>
              <div className="relative w-28">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">$</span>
                <Input
                  value={field === "basePrice" ? getBasePrice(m) : getBulkPrice(m)}
                  onChange={(e) => setEdit(m.materialId, field, e.target.value)}
                  className="pl-6 h-8 text-sm bg-[#F9FAFB]"
                />
              </div>
            </div>
          ))}
          <Badge className={`${status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} text-xs`}>
            {status}
          </Badge>
        </div>
      </>
    );
  };

  const tableAction = (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        {isFetching && !isLoading
          ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          : <Search   className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        }
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search materials..."
          className="pl-9 h-9 w-48 bg-white border-gray-300"
        />
      </div>
      {isDirty && (
        <>
          <Button
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={() => setLocalEdits({})}
            className="h-9 border-gray-300 text-gray-600"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={isSaving}
            onClick={handleSaveTable}
            className="h-9 bg-primary hover:bg-primary/90"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </>
      )}
    </div>
  );

  const pricingSkeletonRows = Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="flex items-center gap-4 px-4 py-4 border-b last:border-0">
      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-10 w-36 rounded-md" />
      <Skeleton className="h-10 w-36 rounded-md" />
      <Skeleton className="h-6 w-10 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  ));

  return (
    <div className="p-8 space-y-8">
      {isLoading ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold mb-1">Pricing & Materials</h2>
              <p className="text-sm text-muted-foreground">Manage your collection & accepted recycling materials</p>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden bg-white">
            {pricingSkeletonRows}
          </div>
        </div>
      ) : (
        <DataTable
          data={materials}
          columns={columns}
          keyExtractor={(m) => m.materialId}
          header={{ title: "Pricing & Materials", subtitle: "Manage your collection & accepted recycling materials", action: tableAction }}
          pagination={{
            currentPage,
            totalPages:   meta?.totalPages ?? 1,
            onPageChange: setCurrentPage,
            showText:     `Showing ${materials.length} of ${meta?.total ?? materials.length} materials`,
          }}
          mobileRender={renderMobile}
        />
      )}
      <hr/>
      {settings ? (
        <FeeSettings
          serviceFee={String(settings.serviceFee)}
          feeType={settings.feeType === "PERCENTAGE" ? "PERCENTAGE_FEE" : "FLAT_FEE"}
          bulkThreshold={String(settings.bulkThreshold)}
          bulkIncentiveEnabled={settings.bulkIncentiveEnabled}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-2xl bg-white space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="p-6 border rounded-2xl bg-white space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
