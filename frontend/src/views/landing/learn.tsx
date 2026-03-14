import { useState } from "react";
import {
  Search,
  CheckCircle,
  LayoutGrid,
  BadgeAlertIcon,
  AlertTriangle,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import type { Category } from "@/constants/interface";
import { items } from "@/constants/data";
import LearnCard from "@/components/learn/LearnCard";
import Light from "@/assets/LightBulb.svg?react";
import Composite from "@/assets/composite-icon.svg?react";
import LearnFooter from "@/components/learn/LearnFooter";

const INITIAL_COUNT = 8;

const filters: { label: string; value: Category; icon: React.ReactNode }[] = [
  { label: "All", value: "all", icon: <LayoutGrid className="size-3.5" /> },
  {
    label: "Recyclables",
    value: "recyclable",
    icon: <BadgeAlertIcon className="size-3.5" />,
  },
  {
    label: "Hazardous",
    value: "hazardous",
    icon: <AlertTriangle className="size-3.5" />,
  },
  {
    label: "Compost",
    value: "compost",
    icon: <Composite className="size-3.5" />,
  },
  { label: "Garbage", value: "garbage", icon: <Trash className="size-3.5" /> },
];

function LearnPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setVisibleCount(INITIAL_COUNT);
  };

  const handleFilterChange = (value: Category) => {
    setActiveFilter(value);
    setVisibleCount(INITIAL_COUNT);
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.item.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      <div className="bg-[#fbfbfb] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Sidebar */}
            <motion.div
              className="flex flex-col gap-6 lg:w-72 shrink-0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-foreground">
                  What Can Be Recycled?
                </h1>
                <p className="text-muted-foreground text-sm leading-5">
                  Confused about what goes in the blue bin? and what can be
                  picked up or dropped off. Browse our categories to sort smart.
                </p>
              </div>

              {/* Tip of the Day */}
              <div className="border border-[#a16207] bg-[#faf9f1] rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[#a16207] text-xs">⭐</span>
                  <span className="text-[#a16207] text-xs font-bold">
                    Tip of the day
                  </span>
                </div>
                <p className="text-black font-bold text-base mb-2">
                  Pizza Boxes?
                </p>
                <p className="text-black text-xs leading-5">
                  Greasy pizza boxes belong in the compost, not recycling! Only
                  the clean lid can be recycled.
                </p>
                <div className="absolute -right-4 -top-4 opacity-20 text-6xl select-none pointer-events-none">
                  <Light />
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* Search + Filters white card */}
              <motion.div
                className="bg-white rounded-xl border border-border p-4 flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              >
                {/* Search row */}
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      className="pl-9 bg-card border-border w-full"
                      placeholder="Search for items (e.g. 'Milk Container', 'Battery')"
                      value={search}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Button size="lg">Search</Button>
                </div>

                {/* Filter chips */}
                <div className="flex gap-2 flex-wrap">
                  {filters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => handleFilterChange(f.value)}
                      className={`flex items-center gap-1.5 px-4 h-9 rounded-full text-xs font-medium transition-colors border ${
                        activeFilter === f.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {activeFilter === f.value && f.icon}

                      {f.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Cards Grid */}
              {filtered.length > 0 ? (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {visible.map((item) => (
                      <LearnCard key={item.id} item={item} />
                    ))}
                  </div>

                  {visibleCount < filtered.length && (
                    <div className="flex justify-center">
                      <Button
                        size="md"
                        variant="outlineprimary"
                        className="rounded-lg"
                        onClick={() => setVisibleCount((prev) => prev + 8)}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-muted-foreground text-base">
                    No items found for "{search}"
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4 text-primary"
                    onClick={() => {
                      setSearch("");
                      setActiveFilter("all");
                      setVisibleCount(INITIAL_COUNT);
                    }}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <LearnFooter />
    </>
  );
}

export default LearnPage;
