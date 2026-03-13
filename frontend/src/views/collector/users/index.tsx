import { useMemo, useState } from "react";
import {
  Search,
  ListFilter,
  Box,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
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
  {
    id: 1,
    name: "Dylan White",
    email: "dylan.white@email.com",
    phone: "+1 (306) 555-0125",
    status: "ACTIVE",
    collections: "CAD 1,558",
    initials: "DW",
    address: "Downtown",
    totalCollections: 32,
    avgRevenue: "$640",
    reward: "$200",
    tags: ["Frequent", "Metal Scraps", "Plastic"],
    nextCollection: "Tue, Oct 22 2025",
  },
  {
    id: 2,
    name: "Sarah Keen",
    email: "sarah.keen@email.com",
    phone: "+1 (306) 555-0125",
    status: "INACTIVE",
    collections: "CAD 1,558",
    initials: "SK",
    address: "Wascana View",
    totalCollections: 21,
    avgRevenue: "$340",
    reward: "$120",
    tags: ["Paper", "Plastic"],
    nextCollection: "Fri, Oct 25 2025",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 (306) 555-0125",
    status: "NEW",
    collections: "CAD 1,558",
    initials: "EW",
    address: "Lakeview",
    totalCollections: 8,
    avgRevenue: "$140",
    reward: "$50",
    tags: ["New", "Glass"],
    nextCollection: "Mon, Oct 28 2025",
  },
  {
    id: 4,
    name: "Nolan Roberts",
    email: "nolan.roberts@email.com",
    phone: "+1 (306) 555-0125",
    status: "ACTIVE",
    collections: "CAD 1,558",
    initials: "NR",
    address: "Cathedral",
    totalCollections: 28,
    avgRevenue: "$510",
    reward: "$180",
    tags: ["Metal", "Plastic"],
    nextCollection: "Wed, Oct 30 2025",
  },
  {
    id: 5,
    name: "Marcus Chen",
    email: "marcus.chen@email.com",
    phone: "+1 (306) 555-0125",
    status: "ACTIVE",
    collections: "CAD 1,558",
    initials: "MC",
    address: "Heritage",
    totalCollections: 26,
    avgRevenue: "$500",
    reward: "$160",
    tags: ["Paper", "Glass"],
    nextCollection: "Thu, Nov 1 2025",
  },
  {
    id: 6,
    name: "Nelson Oyi",
    email: "nelson.oyi@email.com",
    phone: "+1 (306) 555-0125",
    status: "ACTIVE",
    collections: "CAD 1,558",
    initials: "NO",
    address: "Heritage",
    totalCollections: 18,
    avgRevenue: "$300",
    reward: "$110",
    tags: ["Plastic"],
    nextCollection: "Sat, Nov 3 2025",
  },
  {
    id: 7,
    name: "Marjan",
    email: "marjan@email.com",
    phone: "+1 (306) 555-0125",
    status: "ACTIVE",
    collections: "CAD 1,558",
    initials: "MJ",
    address: "Heritage",
    totalCollections: 17,
    avgRevenue: "$290",
    reward: "$100",
    tags: ["Metal"],
    nextCollection: "Mon, Nov 5 2025",
  },
  {
    id: 8,
    name: "Sumayya",
    email: "sumayya@email.com",
    phone: "+1 (306) 555-0125",
    status: "NEW",
    collections: "CAD 1,558",
    initials: "SA",
    address: "Heritage",
    totalCollections: 7,
    avgRevenue: "$120",
    reward: "$40",
    tags: ["Plastic"],
    nextCollection: "Wed, Nov 7 2025",
  },
];

const statusClasses: Record<User["status"], string> = {
  ACTIVE: "bg-[#DCFCE7] text-[#16A34A]",
  INACTIVE: "bg-[#E2E8F0] text-[#64748B]",
  NEW: "bg-[#DBEAFE] text-[#2563EB]",
};

export default function CollectorUsersPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.address.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Customer",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5E7D68] text-[10px] font-semibold text-white">
            {user.initials}
          </div>

          <div>
            <p className="text-[12px] font-medium leading-[18px] text-[#111827]">
              {user.name}
            </p>

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
      render: (user) => (
        <div className="space-y-[1px]">
          <p className="text-[12px] leading-[18px] text-[#111827]">
            {user.phone}
          </p>
          <p className="text-[10px] leading-[18px] text-[#999CA0]">
            {user.email}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => (
        <span
          className={`inline-flex h-[18px] w-[76px] items-center justify-center rounded-[34px] px-2 text-[10px] font-bold uppercase leading-[18px] ${statusClasses[user.status]}`}
        >
          {user.status}
        </span>
      ),
    },
    {
      key: "collections",
      header: "Collections",
      render: (user) => (
        <span
          className={`text-[11px] font-medium ${
            user.name === "Sarah Keen" || user.name === "Nolan Roberts"
              ? "text-[#EF4444]"
              : "text-[#16A34A]"
          }`}
        >
          {user.collections}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (user) => {
        const isDylan = user.name === "Dylan White";

        return (
          <button
            type="button"
            disabled={!isDylan}
            onClick={() => {
              if (isDylan) {
                setSelectedUser(user);
                setIsModalOpen(true);
              }
            }}
            className={`text-[11px] font-semibold ${
              isDylan
                ? "text-[#111827] hover:underline"
                : "cursor-not-allowed text-[#9CA3AF]"
            }`}
          >
            View More
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[8px] border border-[#E5E7EB] bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#DCFCE7]">
              <Box size={16} className="text-[#22C55E]" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase text-[#9CA3AF]">
                Total Users
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[32px] font-semibold leading-none text-[#22C55E]">
                  5
                </span>
                <span className="text-[10px] uppercase text-[#9CA3AF]">
                  Users
                </span>
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
              <p className="text-[10px] font-medium uppercase text-[#9CA3AF]">
                Avg Revenue/User
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[32px] font-semibold leading-none text-[#F59E0B]">
                  $2,235
                </span>
                <span className="text-[10px] uppercase text-[#9CA3AF]">
                  Per Customer
                </span>
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
              <p className="text-[10px] font-medium uppercase text-[#9CA3AF]">
                Total Collection
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[32px] font-semibold leading-none text-[#A855F7]">
                  91
                </span>
                <span className="text-[10px] uppercase text-[#9CA3AF]">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[18px] font-semibold leading-[28px] text-[#0C111D]">
            Customers
          </p>

          <div className="flex items-center gap-2">
            <div className="relative w-[210px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for customer name"
                className="h-8 border-[#E5E7EB] pl-9 text-[11px] placeholder:text-[11px]"
              />
            </div>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white"
            >
              <ListFilter size={16} />
            </button>
          </div>
        </div>

        <DataTable
          data={filteredUsers}
          columns={columns}
          keyExtractor={(item) => item.id}
          pagination={{
            currentPage,
            totalPages: 10,
            onPageChange: setCurrentPage,
            showText: "Showing 1 to 8 of 1",
          }}
          className="space-y-0"
        />
      </div>

     {isModalOpen && selectedUser && (
  <div className="fixed right-6 top-[190px] z-50 hidden xl:block">
    <div className="w-[280px] overflow-hidden rounded-[10px] bg-white shadow-[0px_18px_40px_rgba(0,0,0,0.18)]">
      <div className="bg-[linear-gradient(180deg,#6E8B76_0%,#587262_100%)] px-4 py-3 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[10px] font-semibold">
              {selectedUser.initials}
            </div>

            <div>
              <p className="text-[12px] font-medium leading-[16px]">
                {selectedUser.name}
              </p>
              <span className="mt-1 inline-flex rounded-full bg-[#DDFCE7] px-2 py-[2px] text-[8px] font-semibold uppercase leading-none text-[#16A34A]">
                Active
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-[14px] leading-none text-white/85 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.04em] text-[#A1A1AA]">
            Contact Details
          </p>

          <div className="space-y-2 text-[11px] text-[#374151]">
            <div className="flex items-center gap-2">
              <Phone size={11} className="text-[#9CA3AF]" />
              <span>{selectedUser.phone}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={11} className="text-[#9CA3AF]" />
              <span>{selectedUser.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={11} className="text-[#9CA3AF]" />
              <span>824 Albert Street, Downtown</span>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.04em] text-[#A1A1AA]">
            Stats
          </p>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-[8px] bg-[#F7F7F8] px-2 py-3 text-center">
              <p className="text-[7px] uppercase tracking-[0.03em] text-[#B0B0B0]">
                Collections
              </p>
              <p className="mt-1 text-[16px] font-semibold leading-none text-[#111827]">
                32
              </p>
            </div>

            <div className="rounded-[8px] bg-[#F7F7F8] px-2 py-3 text-center">
              <p className="text-[7px] uppercase tracking-[0.03em] text-[#B0B0B0]">
                Revenue
              </p>
              <p className="mt-1 text-[16px] font-semibold leading-none text-[#22C55E]">
                $640
              </p>
            </div>

            <div className="rounded-[8px] bg-[#F7F7F8] px-2 py-3 text-center">
              <p className="text-[7px] uppercase tracking-[0.03em] text-[#B0B0B0]">
                Avg Order
              </p>
              <p className="mt-1 text-[16px] font-semibold leading-none text-[#F59E0B]">
                $200
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.04em] text-[#A1A1AA]">
            Collected Items
          </p>

          <div className="flex flex-wrap gap-1.5">
            {["Electronics", "Metal Scraps", "Plastic"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#EAF8EE] px-2 py-[3px] text-[8px] font-medium text-[#2E9B4B]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[8px] border border-[#F0B95A] bg-[#FFF8EA] px-3 py-2.5">
          <p className="text-[8px] font-semibold text-[#A16207]">
            Next Collection
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#D97706]">
            <Calendar size={10} />
            <span>Sat, Oct 28, 2023</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}