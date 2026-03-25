import { useState } from "react";
import {
  Search, ListFilter, Box, TrendingUp, Calendar,
  MapPin, Phone, Mail,
} from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  useCollectorUsers,
  useCollectorUsersStats,
  useCollectorCustomerDetail,
} from "@/api-hooks/useCollectors.ts";
import type { CollectorUser } from "@/api-hooks/useCollectors.ts";
import { useCurrentUser } from "@/api-hooks/useAuth.ts";
import { formatCurrency } from "@/lib/utils";

// ─── Status badge ─────────────────────────────────────────────────────────────

type UserStatus = "ACTIVE" | "INACTIVE" | "NEW";

const statusClasses: Record<UserStatus, string> = {
  ACTIVE:   "bg-[#DCFCE7] text-[#16A34A]",
  INACTIVE: "bg-[#E2E8F0] text-[#64748B]",
  NEW:      "bg-[#DBEAFE] text-[#2563EB]",
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5E7D68] text-[10px] font-semibold text-white shrink-0">
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
  const detail = result?.data;

  const completedPickups = detail?.pickups.filter((p) => p.status === "COMPLETED") ?? [];
  const totalRevenue     = completedPickups.reduce((sum: number, p) =>
    sum + (p.items?.reduce((s: number, i) => s + i.quantity, 0) ?? 0), 0);
  const avgOrder         = completedPickups.length > 0 ? totalRevenue / completedPickups.length : 0;

  const materials = [
    ...new Set(
      detail?.pickups.flatMap((p) => p.items?.map((i) => i.material?.name ?? "") ?? []) ?? []
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
  const [search,         setSearch]         = useState("");
  const [statusFilter,   setStatusFilter]   = useState<"ALL" | "ACTIVE" | "INACTIVE" | "NEW">("ALL");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedId,     setSelectedId]     = useState<string | null>(null);
  const [currentPage,    setCurrentPage]    = useState(1);

  const PAGE_SIZE = 8;

  // ── Get collector ID from auth ─────────────────────────────────────────────
  const { data: currentUser } = useCurrentUser();
  const collectorId = currentUser?.data?.userId ?? "";

  // ── API calls ──────────────────────────────────────────────────────────────
  const { data: usersResult, isLoading } = useCollectorUsers(collectorId, {
    keyword: search || undefined,
    page:    currentPage,
    limit:   PAGE_SIZE,
  });

  const { data: statsResult } = useCollectorUsersStats(collectorId);

  const customers  = usersResult?.data?.data       ?? [];
  const totalPages = usersResult?.data?.totalPages ?? 1;
  const totalItems = usersResult?.data?.total      ?? 0;

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalUsers       = statsResult?.data?.totalUsers        ?? 0;
  const avgRevenue       = statsResult?.data?.avgRevenuePerUser ?? 0;
  const totalCollections = statsResult?.data?.totalCollection   ?? 0;

  // ── Filter by status client-side ───────────────────────────────────────────
  const filtered = statusFilter === "ALL"
    ? customers
    : customers.filter((c) => c.status === statusFilter);

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns: ColumnDef<CollectorUser>[] = [
    {
      key: "name",
      header: "Customer",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <Avatar name={c.name} />
          <div>
            <p className="text-[12px] font-medium leading-[18px] text-[#111827]">{c.name}</p>
            <p className="mt-[1px] text-[11px] text-[#999CA0] truncate max-w-[160px]">
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
        <div className="space-y-[1px]">
          <p className="text-[12px] leading-[18px] text-[#111827]">{c.phone ?? "—"}</p>
          <p className="text-[10px] leading-[18px] text-[#999CA0] truncate max-w-[160px]">{c.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => {
        const s = (c.status as UserStatus) in statusClasses ? (c.status as UserStatus) : "ACTIVE";
        return (
          <span className={`inline-flex h-[18px] w-[76px] items-center justify-center rounded-[34px] px-2 text-[10px] font-bold uppercase leading-[18px] ${statusClasses[s]}`}>
            {s}
          </span>
        );
      },
    },
    {
      key: "collections",
      header: "Collections",
      cell: (c) => (
        <span className="text-[11px] font-medium text-[#16A34A]">
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
          className="text-[11px] font-semibold text-[#111827] hover:text-primary transition-colors"
        >
          View More
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#DCFCE7]">
              <Box size={16} className="text-[#22C55E]" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase text-[#9CA3AF]">Total Users</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[32px] font-semibold leading-none text-[#22C55E]">{totalUsers}</span>
                <span className="text-[10px] uppercase text-[#9CA3AF]">Users</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#FEF3C7]">
              <TrendingUp size={16} className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase text-[#9CA3AF]">Avg Revenue/User</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[32px] font-semibold leading-none text-[#F59E0B]">
                  {formatCurrency(avgRevenue, "CAD", false)}
                </span>
                <span className="text-[10px] uppercase text-[#9CA3AF]">Per Customer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F3E8FF]">
              <Calendar size={16} className="text-[#A855F7]" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase text-[#9CA3AF]">Total Collection</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[32px] font-semibold leading-none text-[#A855F7]">{totalCollections}</span>
                <span className="text-[10px] uppercase text-[#9CA3AF]">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(item) => item.customerId}
        title="Customers"
        emptyText={isLoading ? "Loading..." : "No customers found"}
        page={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        headerRight={
          <div className="flex items-center gap-2">
            <div className="relative w-[210px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search for customer name"
                className="h-8 border-[#E5E7EB] pl-9 text-[11px] placeholder:text-[11px]"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterMenu((p) => !p)}
                className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white ${statusFilter !== "ALL" ? "border-primary text-primary" : "border-[#E5E7EB]"}`}
              >
                <ListFilter size={16} />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 top-9 z-20 w-[140px] rounded-[8px] border border-[#E5E7EB] bg-white shadow-md">
                  {(["ALL", "ACTIVE", "INACTIVE", "NEW"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setStatusFilter(s); setShowFilterMenu(false); setCurrentPage(1); }}
                      className={`w-full px-4 py-2 text-left text-[12px] hover:bg-muted ${statusFilter === s ? "font-semibold text-primary" : "text-[#111827]"}`}
                    >
                      {s === "ALL" ? "All Statuses" : s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      />

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
