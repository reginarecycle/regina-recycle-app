import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import { useMaterials } from "@/components/hooks/useMaterials";
import type { Material } from "@/types/materials";
import { useState } from "react";

export function CollectorPricingTab() {
  const {
    materials,
    serviceFee, setServiceFee,
    bulkThreshold, setBulkThreshold,
    applyBulkToAll, setApplyBulkToAll,
    handleToggleMaterial,
    handlePriceChange,
  } = useMaterials();

  const [currentPage, setCurrentPage] = useState(1);

  const columns: Column<Material>[] = [
    {
      key: "name",
      header: "Material Category",
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">{m.icon}</div>
          <div>
            <div className="font-medium text-sm">{m.name}</div>
            <div className="text-xs text-muted-foreground">{m.desc}</div>
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
          <Input value={m.basePrice.toFixed(2)} onChange={(e) => handlePriceChange(m.id, "basePrice", e.target.value)} className="pl-8 h-10 bg-[#F9FAFB] border-gray-200" />
        </div>
      ),
    },
    {
      key: "bulkRate",
      header: "Bulk rate (100+ Units)",
      render: (m) => (
        <div className="relative w-36">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
          <Input value={m.bulkRate.toFixed(2)} onChange={(e) => handlePriceChange(m.id, "bulkRate", e.target.value)} className="pl-8 h-10 bg-[#F9FAFB] border-gray-200" />
        </div>
      ),
    },
    {
      key: "active",
      header: "Action",
      render: (m) => <Switch checked={m.active} onCheckedChange={() => handleToggleMaterial(m.id)} />,
    },
    {
      key: "status",
      header: "Status",
      render: (m) => (
        <Badge className={`uppercase text-xs font-semibold border-0 ${m.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
          {m.active ? "ACTIVE" : "INACTIVE"}
        </Badge>
      ),
    },
  ];

  const renderMobile = (m: Material) => (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl shrink-0">{m.icon}</div>
          <div>
            <div className="font-semibold">{m.name}</div>
            <div className="text-sm text-muted-foreground">{m.desc}</div>
          </div>
        </div>
        <Switch checked={m.active} onCheckedChange={() => handleToggleMaterial(m.id)} />
      </div>
      <div className="space-y-2 pl-15">
        {(["basePrice", "bulkRate"] as const).map((field) => (
          <div key={field} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{field === "basePrice" ? "Base price:" : "Bulk rate:"}</span>
            <div className="relative w-28">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">$</span>
              <Input value={m[field].toFixed(2)} onChange={(e) => handlePriceChange(m.id, field, e.target.value)} className="pl-6 h-8 text-sm bg-[#F9FAFB]" />
            </div>
          </div>
        ))}
        <Badge className={`${m.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} text-xs`}>
          {m.active ? "ACTIVE" : "INACTIVE"}
        </Badge>
      </div>
    </>
  );

  return (
    <div className="p-8 space-y-8">
      <DataTable
        data={materials}
        columns={columns}
        keyExtractor={(m) => m.id}
        header={{ title: "Pricing & Materials", subtitle: "Manage your collection & accepted recycling materials" }}
        pagination={{ currentPage, totalPages: 5, onPageChange: setCurrentPage, showText: "Showing 4 to 12 materials available for ReginaRecycle Collectors." }}
        mobileRender={renderMobile}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Fees */}
        <Card className="p-6 shadow-none border bg-white">
          <h3 className="font-semibold text-base mb-6">💳 Service Fees</h3>
          <div className="space-y-6">
            <div>
              <label className="text-base font-semibold mb-2 block">Base Service Fee (%)</label>
              <p className="text-sm text-muted-foreground mb-4">
                This is a percentage-based fee applied to every pickup request to cover transport and operational cost.
              </p>
              <div className="relative">
                <Input value={serviceFee} onChange={(e) => setServiceFee(e.target.value)} placeholder="Input" className="h-11 pr-12 bg-white border-gray-300" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-medium">%</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg">
              <AlertTriangle className="h-5 w-5 text-[#F59E0B] shrink-0" />
              <p className="text-sm text-[#78350F]">These fees will be clearly displayed to the customers during the scheduling process.</p>
            </div>
          </div>
        </Card>

        {/* Bulk Incentive */}
        <Card className="p-6 shadow-none border bg-white">
          <h3 className="font-semibold text-base mb-2">📈 Bulk Incentive Strategy</h3>
          <p className="text-sm text-muted-foreground mb-2">Automatically apply bulk rates when a single request exceeds the quantity threshold.</p>
          <div className="space-y-6">
            <div>
              <label className="text-base font-semibold mb-2 block">Standard Bulk Threshold</label>
              <div className="relative">
                <Input value={bulkThreshold} onChange={(e) => setBulkThreshold(e.target.value)} className="h-11 pr-16 bg-white border-gray-300" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Units</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Apply Bulk to All Materials</span>
              <Switch checked={applyBulkToAll} onCheckedChange={setApplyBulkToAll} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
