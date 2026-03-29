import { useState } from "react";
import { Calendar, MapPin, Phone, Mail } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatsCards, type StatItem } from "@/components/requests/stats-cards";
import {
  DataTableHeaderControls,
  DEFAULT_TABLE_FILTERS,
  type TableFilterState,
  type StatusOption,
} from "@/components/ui/data-table-header-controls";
import {
  useCollectorUsers,
  useCollectorUsersStats,
  useCollectorCustomerDetail,
  useCollectorPricingSettings,
} from "@/api-hooks/useCollectors.ts";
import type { CollectorUser } from "@/api-hooks/useCollectors.ts";
import { useCurrentUser } from "@/api-hooks/useAuth.ts";
import { formatCurrency } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserStatus = "ACTIVE" | "INACTIVE" | "NEW";

const STATUS_OPTIONS: StatusOption<string>[] = [
  { key: "ACTIVE",   label: "Active"   },
  { key: "INACTIVE", label: "Inactive" },
  { key: "NEW",      label: "New"      },
];

const statusClasses: Record<UserStatus, string> = {
  ACTIVE:   "bg-[#DCFCE7] text-[#16A34A]",
  INACTIVE: "bg-[#E2E8F0] text-[#64748B]",
  NEW:      "bg-[#DBEAFE] text-[#2563EB]",
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5E7D68] text-[11px] font-semibold text-white shrink-0">
      {initials}
    </div>
  );
};

// ─── Customer Detail Modal ────────────────────────────────────────────────────

const CustomerModal = ({
  customerId,
  status,
  onClose,
}: {
  customerId: string;
  status: string;
  onClose: () => void;
}) => {
  const { data: currentUser } = useCurrentUser();
  const collectorId = (currentUser as any)?.data?.userId ?? "";
  const { data: result, isLoading } = useCollectorCustomerDetail(collectorId, customerId);
  const { data: pricingResult } = useCollectorPricingSettings();
  const detail = result?.data;

  const fallbackFee     = Number(pricingResult?.data?.settings?.serviceFee ?? 0);
  const fallbackFeeType = pricingResult?.data?.settings?.feeType ?? "PERCENTAGE";

  const completedPickups = detail?.pickups.filter((p) => p.status === "COMPLETED") ?? [];
  const totalRevenue = completedPickups.reduce((sum: number, p) => {
    const gross = Number(p.actualEarning) ?? 0;
    const fee     = Number(p.serviceFeeSnapshot ?? fallbackFee);
    const feeType = p.feeTypeSnapshot ?? fallbackFeeType;
    const feeAmount = feeType === "FLAT" ? fee : gross * (fee / 100);
    return sum + Math.max(0, gross - feeAmount);
  }, 0);
  const avgOrder = completedPickups.length > 0 ? totalRevenue / completedPickups.length : 0;

  const materials = [
    ...new Set(
      detail?.pickups.flatMap((p) => p.items?.map((i) => i.material?.name ?? "") ?? []) ?? [],
    ),
  ].filter(Boolean);

  const nextPickup = detail?.pickups
    .filter((p) => ["PENDING", "ACCEPTED"].includes(p.status) && new Date(p.scheduledAt) >= new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  const primaryAddress = detail?.customer.addresses?.[0];
  const initials = detail
    ? detail.customer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "..";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-[467px] overflow-hidden rounded-[8px] bg-white shadow-[0px_14px_30px_rgba(0,0,0,0.18)]">

        {/* Header */}
        <div className="flex items-center justify-between bg-[linear-gradient(180deg,#64836D_0%,#4F6D59_100%)] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-[12px] font-medium">
              {initials}
            </div>
            <div className="flex flex-col">
              <p className="text-[16px] font-semibold leading-[24px]">
                {isLoading ? "Loading..." : detail?.customer.name}
              </p>
              <span className={`mt-1 inline-flex w-fit rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase leading-none ${
                status === "NEW"      ? "bg-[#DBEAFE] text-[#2563EB]" :
                status === "INACTIVE" ? "bg-[#E2E8F0] text-[#64748B]" :
                                        "bg-[#DDFCE7] text-[#16A34A]"
              }`}>
                {status}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[18px] leading-none text-white/90 hover:text-white">×</button>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="p-5 flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-5 rounded bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-5">

            {/* Contact */}
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Contact Details</p>
              <div className="flex flex-col gap-2 text-[13px] text-[#0C111D]">
                {detail?.customer.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-[#7C7C7C]" />
                    <span>{detail.customer.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#7C7C7C]" />
                  <span>{detail?.customer.email}</span>
                </div>
                {primaryAddress && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#7C7C7C]" />
                    <span>{primaryAddress.line1}, {primaryAddress.city}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Stats</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[10px] border border-[#E5E7EB] p-[13px] text-center">
                  <p className="text-[10px] uppercase text-[#9CA3AF]">Collections</p>
                  <p className="mt-1 text-[20px] font-medium leading-none text-[#0C111D]">{completedPickups.length}</p>
                </div>
                <div className="rounded-[10px] border border-[#E5E7EB] p-[13px] text-center">
                  <p className="text-[10px] uppercase text-[#9CA3AF]">Revenue</p>
                  <p className="mt-1 text-[20px] font-medium leading-none text-[#22C55E]">{formatCurrency(totalRevenue, "CAD", false)}</p>
                </div>
                <div className="rounded-[10px] border border-[#E5E7EB] p-[13px] text-center">
                  <p className="text-[10px] uppercase text-[#9CA3AF]">Avg/Order</p>
                  <p className="mt-1 text-[20px] font-medium leading-none text-[#F59E0B]">{formatCurrency(avgOrder, "CAD", false)}</p>
                </div>
              </div>
            </div>

            {/* Collected Items */}
            {materials.length > 0 && (
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Collected Items</p>
                <div className="flex flex-wrap gap-2">
                  {materials.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#EAF8EE] px-3 py-[4px] text-[11px] font-medium text-[#2E9B4B]">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Next Collection */}
            {nextPickup && (
              <div className="rounded-[10px] border border-[#F59E0B] bg-[#FFFBEB] p-[13px]">
                <div className="flex items-center gap-2 text-[#0C111D]">
                  <Calendar size={16} className="text-[#F59E0B]" />
                  <p className="text-[13px] text-[#0C111D]">Next Collection</p>
                </div>
                <p className="mt-1 text-[14px] text-[#F59E0B]">
                  {new Date(nextPickup.scheduledAt).toLocaleDateString("en-CA", {
                    weekday: "short", month: "short", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CollectorUsersPage() {
  const [filters,     setFilters]     = useState<TableFilterState<string>>(DEFAULT_TABLE_FILTERS);
  const [search,      setSearch]      = useState("");
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;

  const { data: currentUser } = useCurrentUser();
  const collectorId = currentUser?.data?.userId ?? "";

  const { data: usersResult, isLoading } = useCollectorUsers(collectorId, {
    keyword: search || undefined,
    page:    currentPage,
    limit:   PAGE_SIZE,
  });

  const { data: statsResult } = useCollectorUsersStats(collectorId);

  const customers  = usersResult?.data?.data       ?? [];
  const totalPages = usersResult?.data?.totalPages ?? 1;
  const totalItems = usersResult?.data?.total      ?? 0;

  const totalUsers       = statsResult?.data?.totalUsers        ?? 0;
  const avgRevenue       = statsResult?.data?.avgRevenuePerUser ?? 0;
  const totalCollections = statsResult?.data?.totalCollection   ?? 0;

  // Client-side status filter
  const activeStatus = filters.statuses[0] as UserStatus | undefined;
  const filtered = activeStatus
    ? customers.filter((c) => c.status === activeStatus)
    : customers;

  const columns: ColumnDef<CollectorUser>[] = [
    {
      key: "name",
      header: "Customer",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <Avatar name={c.name} />
          <div>
            <p className="text-[13px] font-semibold text-[#111827]">{c.name}</p>
            <p className="mt-[2px] text-[12px] text-[#999CA0] truncate max-w-[180px]">
              {c.neighborhood || c.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Contact",
      cell: (c) => (
        <div className="space-y-[2px]">
          <p className="text-[13px] text-[#111827]">{c.phone ?? "—"}</p>
          <p className="text-[12px] text-[#999CA0] truncate max-w-[180px]">{c.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => {
        const s = (c.status as UserStatus) in statusClasses ? (c.status as UserStatus) : "ACTIVE";
        return (
          <span className={`inline-flex h-[22px] w-[80px] items-center justify-center rounded-full px-2 text-[11px] font-bold uppercase ${statusClasses[s]}`}>
            {s}
          </span>
        );
      },
    },
    {
      key: "collections",
      header: "Collections",
      cell: (c) => (
        <span className="text-[13px] font-semibold text-[#111827]">{c.collections}</span>
      ),
    },
    {
      key: "revenue",
      header: "Revenue",
      cell: (c) => (
        <span className="text-[13px] font-semibold text-[#16A34A]">
          {formatCurrency(c.revenue, "CAD")}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (c) => (
        <button
          type="button"
          onClick={() => setSelectedId(c.customerId)}
          className="text-[13px] font-semibold text-[#344E41] hover:text-primary transition-colors"
        >
          View More
        </button>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-auto">

      {/* Stats */}
      <div className="pt-6 px-6 pb-4 shrink-0">
        <StatsCards items={[
          { title: "TOTAL USERS",        data: totalUsers,       color: "green",  unit: "Users"     },
          { title: "AVG REVENUE / USER", data: avgRevenue,       color: "blue",   currency: "$"     },
          { title: "TOTAL COLLECTIONS",  data: totalCollections, color: "yellow", unit: "Completed" },
        ] satisfies StatItem[]} />
      </div>

      {/* Table */}
      <div className="px-6 pb-6">
        <DataTable
          data={filtered}
          columns={columns}
          rowKey={(item) => item.customerId}
          title="Customers"
          isLoading={isLoading}
          emptyText="No customers found"
          page={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={(p) => { setCurrentPage(p); }}
          headerRight={
            <DataTableHeaderControls
              search={search}
              onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}
              searchPlaceholder="Search customer name..."
              filters={filters}
              onFiltersChange={(f) => { setFilters(f); setCurrentPage(1); }}
              statusOptions={STATUS_OPTIONS}
              showDateRange={false}
              stretch
            />
          }
        />
      </div>

      {/* Detail Modal */}
      {selectedId && (
        <CustomerModal
          customerId={selectedId}
          status={customers.find((c) => c.customerId === selectedId)?.status ?? "ACTIVE"}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
