import { useMemo, useState } from "react";
import {
  Search, ListFilter, Box, TrendingUp, Calendar, MapPin, Phone, Mail,
} from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | "NEW";
  collections: string;
  initials: string;
  address: string;
  totalCollections: number;
  avgRevenue: string;
  reward: string;
  tags: string[];
  nextCollection: string;
};

const users: User[] = [
  { id: 1, name: "Dylan White", email: "dylan.white@email.com", phone: "+1 (306) 555-0125", status: "ACTIVE", collections: "CAD 1,558", initials: "DW", address: "Downtown", totalCollections: 32, avgRevenue: "$6400", reward: "$200", tags: ["Frequent", "Metal Scraps", "Plastic"], nextCollection: "Sat, Oct 28, 2023" },
  { id: 2, name: "Sarah Keen", email: "sarah.keen@email.com", phone: "+1 (306) 555-0125", status: "INACTIVE", collections: "CAD 1,558", initials: "SK", address: "Wascana View", totalCollections: 21, avgRevenue: "$340", reward: "$120", tags: ["Paper", "Plastic"], nextCollection: "Fri, Oct 25 2025" },
  { id: 3, name: "Emma Wilson", email: "emma.wilson@email.com", phone: "+1 (306) 555-0125", status: "NEW", collections: "CAD 1,558", initials: "EW", address: "Lakeview", totalCollections: 8, avgRevenue: "$140", reward: "$50", tags: ["New", "Glass"], nextCollection: "Mon, Oct 28 2025" },
  { id: 4, name: "Nolan Roberts", email: "nolan.roberts@email.com", phone: "+1 (306) 555-0125", status: "ACTIVE", collections: "CAD 1,558", initials: "NR", address: "Cathedral", totalCollections: 28, avgRevenue: "$510", reward: "$180", tags: ["Metal", "Plastic"], nextCollection: "Wed, Oct 30 2025" },
  { id: 5, name: "Marcus Chen", email: "marcus.chen@email.com", phone: "+1 (306) 555-0125", status: "ACTIVE", collections: "CAD 1,558", initials: "MC", address: "Heritage", totalCollections: 26, avgRevenue: "$500", reward: "$160", tags: ["Paper", "Glass"], nextCollection: "Thu, Nov 1 2025" },
  { id: 6, name: "Nelson Oyi", email: "nelson.oyi@email.com", phone: "+1 (306) 555-0125", status: "ACTIVE", collections: "CAD 1,558", initials: "NO", address: "Heritage", totalCollections: 18, avgRevenue: "$300", reward: "$110", tags: ["Plastic"], nextCollection: "Sat, Nov 3 2025" },
  { id: 7, name: "Marjan", email: "marjan@email.com", phone: "+1 (306) 555-0125", status: "ACTIVE", collections: "CAD 1,558", initials: "MJ", address: "Heritage", totalCollections: 17, avgRevenue: "$290", reward: "$100", tags: ["Metal"], nextCollection: "Mon, Nov 5 2025" },
  { id: 8, name: "Sumayya", email: "sumayya@email.com", phone: "+1 (306) 555-0125", status: "NEW", collections: "CAD 1,558", initials: "SA", address: "Heritage", totalCollections: 7, avgRevenue: "$120", reward: "$40", tags: ["Plastic"], nextCollection: "Wed, Nov 7 2025" },
];

const statusClasses: Record<User["status"], string> = {
  ACTIVE: "bg-[#DCFCE7] text-[#16A34A]",
  INACTIVE: "bg-[#E2E8F0] text-[#64748B]",
  NEW: "bg-[#DBEAFE] text-[#2563EB]",
};

export default function CollectorUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<User["status"] | "ALL">("ALL");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch = !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.address.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      header: "Customer",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5E7D68] text-[10px] font-semibold text-white">
            {user.initials}
          </div>
          <div>
            <p className="text-[12px] font-medium leading-[18px] text-[#111827]">{user.name}</p>
            <div className="mt-[1px] flex items-center gap-1 text-[12px] font-normal leading-[18px] text-[#999CA0]">
              <MapPin size={12} className="shrink-0 text-[#999CA0]" />
              <span>{user.address}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Contact",
      cell: (user) => (
        <div className="space-y-[1px]">
          <p className="text-[12px] leading-[18px] text-[#111827]">{user.phone}</p>
          <p className="text-[10px] leading-[18px] text-[#999CA0]">{user.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (user) => (
        <span className={`inline-flex h-[18px] w-[76px] items-center justify-center rounded-[34px] px-2 text-[10px] font-bold uppercase leading-[18px] ${statusClasses[user.status]}`}>
          {user.status}
        </span>
      ),
    },
    {
      key: "collections",
      header: "Collections",
      cell: (user) => (
        <span className={`text-[11px] font-medium ${user.name === "Sarah Keen" || user.name === "Nolan Roberts" ? "text-[#EF4444]" : "text-[#16A34A]"}`}>
          {user.collections}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (user) => (
        <button
          type="button"
          onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
          className="text-[11px] font-semibold text-[#111827]"
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
                <span className="text-[32px] font-semibold leading-none text-[#22C55E]">5</span>
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
                <span className="text-[32px] font-semibold leading-none text-[#F59E0B]">$2,235</span>
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
                <span className="text-[32px] font-semibold leading-none text-[#A855F7]">91</span>
                <span className="text-[10px] uppercase text-[#9CA3AF]">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        rowKey={(item) => String(item.id)}
        title="Customers"
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
        page={currentPage}
        totalPages={Math.ceil(filteredUsers.length / 8)}
        totalItems={filteredUsers.length}
        pageSize={8}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-[467px] overflow-hidden rounded-[8px] bg-white shadow-[0px_14px_30px_rgba(0,0,0,0.18)]">

            <div className="flex items-center justify-between bg-[linear-gradient(180deg,#64836D_0%,#4F6D59_100%)] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-[12px] font-medium">
                  {selectedUser.initials}
                </div>
                <div className="flex flex-col">
                  <p className="text-[16px] font-semibold leading-[24px]">{selectedUser.name}</p>
                  <span className="mt-1 inline-flex w-fit rounded-full bg-[#DDFCE7] px-2 py-[2px] text-[10px] font-semibold uppercase leading-none text-[#16A34A]">
                    {selectedUser.status}
                  </span>
                </div>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-[18px] leading-none text-white/90 hover:text-white">×</button>
            </div>

            <div className="flex flex-col gap-4 p-5">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Contact Details</p>
                <div className="flex flex-col gap-2 text-[13px] text-[#0C111D]">
                  <div className="flex items-center gap-2"><Phone size={16} className="text-[#7C7C7C]" /><span>{selectedUser.phone}</span></div>
                  <div className="flex items-center gap-2"><Mail size={16} className="text-[#7C7C7C]" /><span>{selectedUser.email}</span></div>
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-[#7C7C7C]" /><span>824 Albert Street, {selectedUser.address}</span></div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Stats</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-[10px] border border-[#E5E7EB] p-[13px] text-center">
                    <p className="text-[10px] uppercase text-[#9CA3AF]">Collections</p>
                    <p className="mt-1 text-[20px] font-medium leading-none text-[#0C111D]">{selectedUser.totalCollections}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#E5E7EB] p-[13px] text-center">
                    <p className="text-[10px] uppercase text-[#9CA3AF]">Revenue</p>
                    <p className="mt-1 text-[20px] font-medium leading-none text-[#22C55E]">{selectedUser.avgRevenue}</p>
                  </div>
                  <div className="rounded-[10px] border border-[#E5E7EB] p-[13px] text-center">
                    <p className="text-[10px] uppercase text-[#9CA3AF]">Avg Order</p>
                    <p className="mt-1 text-[20px] font-medium leading-none text-[#F59E0B]">{selectedUser.reward}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Collected Items</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#EAF8EE] px-3 py-[4px] text-[11px] font-medium text-[#2E9B4B]">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-[10px] border border-[#F59E0B] bg-[#FFFBEB] p-[13px]">
                <div className="flex items-center gap-2 text-[#0C111D]">
                  <Calendar size={16} className="text-[#F59E0B]" />
                  <p className="text-[13px] text-[#0C111D]">Next Collection</p>
                </div>
                <p className="mt-1 text-[14px] text-[#F59E0B]">{selectedUser.nextCollection}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}