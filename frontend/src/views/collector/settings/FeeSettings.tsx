import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PillTabs } from "@/components/ui/pill-tabs";
import { AlertTriangle } from "lucide-react";

interface FeeSettingsProps {
  serviceFee: string;
  onServiceFeeChange: (value: string) => void;
  bulkThreshold: string;
  onBulkThresholdChange: (value: string) => void;
  applyBulkToAll: boolean;
  onApplyBulkToAllChange: (value: boolean) => void;
}

export function FeeSettings({
  serviceFee,
  onServiceFeeChange,
  bulkThreshold,
  onBulkThresholdChange,
  applyBulkToAll,
  onApplyBulkToAllChange,
}: FeeSettingsProps) {
  const [feeType, setFeeType] = useState<"PERCENTAGE_FEE" | "FLAT_FEE">("PERCENTAGE_FEE");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Service Fees */}
      <Card className="p-6 shadow-none border bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-base">💳 Service Fees</h3>
          <PillTabs
            options={[
              { key: "PERCENTAGE_FEE", label: "Percentage", icon: "%" },
              { key: "FLAT_FEE",       label: "Flat Rate",  icon: "$" },
            ]}
            value={feeType}
            onChange={setFeeType}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold mb-1">
                {feeType === "PERCENTAGE_FEE" ? "Base Service Fee (%)" : "Base Service Fee (CAD)"}
              </p>
              <p className="text-sm text-muted-foreground">
                {feeType === "PERCENTAGE_FEE"
                  ? "This is a percentage-based fee applied to every pickup request to cover transport and operational cost"
                  : "A fixed flat fee applied to every pickup request regardless of quantity or value"}
              </p>
            </div>
            <div className="relative shrink-0 w-32">
              <Input
                value={serviceFee}
                onChange={(e) => onServiceFeeChange(e.target.value)}
                placeholder="Input"
                className="h-11 pr-8 bg-white border-gray-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {feeType === "PERCENTAGE_FEE" ? "%" : "$"}
              </span>
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-3 p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg">
            <AlertTriangle className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="text-xs text-[#78350F]">These fees will be clearly displayed to the customers during the scheduling process.</p>
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
              <Input
                value={bulkThreshold}
                onChange={(e) => onBulkThresholdChange(e.target.value)}
                className="h-11 pr-16 bg-white border-gray-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Units</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Apply Bulk to All Materials</span>
            <Switch checked={applyBulkToAll} onCheckedChange={onApplyBulkToAllChange} />
          </div>
        </div>
      </Card>
    </div>
  );
}