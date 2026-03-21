import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  LayoutGrid,
  BadgeAlertIcon,
  AlertTriangle,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import LearnCard from "@/components/learn/LearnCard";
import Light from "@/assets/LightBulb.svg?react";
import Composite from "@/assets/composite-icon.svg?react";
import LearnFooter from "@/components/learn/LearnFooter";
import { useGetTip } from "@/api-hooks/useTips";
import { useGetMaterials } from "@/api-hooks/useMaterials";
import type { Category, RecyclingItem } from "@/constants/interface";
import useDebounce from "@/hooks/useDebounce";

const TYPE_META: Record<string, Omit<RecyclingItem, "id" | "image" | "title" | "item" | "tip" | "category">> = {
  recyclable: { label: "Recyclables", labelColor: "#618171", labelTextColor: "#fff", badgeColor: "#49B972", badgeIcon: "check" },
  hazardous:  { label: "Hazardous",   labelColor: "#fee2e2", labelTextColor: "#991b1b", badgeColor: "#ef4444", badgeIcon: "warning" },
  batteries:  { label: "Hazardous",   labelColor: "#fee2e2", labelTextColor: "#991b1b", badgeColor: "#ef4444", badgeIcon: "warning" },
  compost:    { label: "Compost",     labelColor: "#ca8a04", labelTextColor: "#fff", badgeColor: "#ca8a04", badgeIcon: "compost" },
  garbage:    { label: "Garbage",     labelColor: "#999ca0", labelTextColor: "#fff", badgeColor: "#999ca0", badgeIcon: "bin" },
};

const LIMIT = 10;

const filters: { label: string; value: Category; icon: React.ReactNode }[] = [
  { label: "All",         value: "all",        icon: <LayoutGrid className="size-3.5" /> },
  { label: "Recyclables", value: "recyclable", icon: <BadgeAlertIcon className="size-3.5" /> },
  { label: "Hazardous",   value: "hazardous",  icon: <AlertTriangle className="size-3.5" /> },
  { label: "Compost",     value: "compost",    icon: <Composite className="size-3.5" /> },
  { label: "Garbage",     value: "garbage",    icon: <Trash className="size-3.5" /> },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col animate-pulse">
      <div className="h-40 w-full bg-gray-200" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}

function LearnPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<RecyclingItem[]>([]);

  const debouncedSearch = useDebounce(search, 400);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data: tipResult, isLoading: tipsLoading } = useGetTip();
  const {
    data: materialsResult,
    isLoading: materialsLoading,
    isError: materialsError,
  } = useGetMaterials({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    type: activeFilter !== "all" ? activeFilter : undefined,
  });

  const hasNextPage = materialsResult?.data?.meta?.hasNextPage ?? false;

  useEffect(() => {
    setPage(1);
    setAllItems([]);
  }, [debouncedSearch, activeFilter]);

  useEffect(() => {
    const raw = materialsResult?.data?.data ?? [];
    const mapped: RecyclingItem[] = raw.map((m) => {
      const typeKey = m.type?.toLowerCase() ?? "garbage";
      const meta = TYPE_META[typeKey] ?? TYPE_META.garbage;
      return {
        id: m.materialId as unknown as number,
        image: m.photoUrl ?? "",
        title: m.name,
        item: m.name,
        tip: m.description ?? "",
        category: (
          meta.label === "Recyclables" ? "recyclable"
          : meta.label === "Hazardous" ? "hazardous"
          : meta.label === "Compost" ? "compost"
          : "garbage"
        ) as Category,
        ...meta,
      };
    });

    if (page === 1) {
      setAllItems(mapped);
    } else {
      setAllItems((prev) => [...prev, ...mapped]);
    }
  }, [materialsResult]);

  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !materialsLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
  }, [hasNextPage, materialsLoading]);

  useEffect(() => {
    setupObserver();
    return () => observerRef.current?.disconnect();
  }, [setupObserver]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (value: Category) => {
    setActiveFilter(value);
  };

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
                  Confused about what goes in the blue bin and what can be
                  picked up? We got you! Browse our categories to sort smart.
                </p>
              </div>

              {/* Tip of the Day */}
              <div className="border border-[#a16207] bg-[#faf9f1] rounded-xl p-4 relative overflow-hidden min-h-[100px]">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[#a16207] text-xs">⭐</span>
                  <span className="text-[#a16207] text-xs font-bold">
                    Tip of the day
                  </span>
                </div>
                {tipsLoading ? (
                  <div className="animate-pulse flex flex-col gap-2">
                    <div className="h-4 bg-yellow-100 rounded w-1/2" />
                    <div className="h-3 bg-yellow-100 rounded w-full" />
                    <div className="h-3 bg-yellow-100 rounded w-3/4" />
                  </div>
                ) : tipResult?.data ? (
                  <>
                    {tipResult.data.title && (
                      <p className="text-foreground text-sm font-semibold mb-1">
                        {tipResult.data.title}
                      </p>
                    )}
                    <p className="text-foreground text-xs leading-5">
                      {tipResult.data.content}
                    </p>
                  </>
                ) : (
                  <p className="text-xs leading-5 text-muted-foreground">
                    No tip available today.
                  </p>
                )}
                <div className="absolute -right-4 -top-4 opacity-20 text-6xl select-none pointer-events-none">
                  <Light />
                </div>
              </div>
            </motion.div>

            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <motion.div
                className="bg-white rounded-xl border border-border p-4 flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              >
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      className="pl-9 bg-card border-border w-full"
                      placeholder="Search for items (e.g. 'Aluminum Can', 'Battery')"
                      value={search}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Button size="lg" onClick={() => setSearch(search)}>Search</Button>
                </div>

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

              {materialsError && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-red-500 text-sm font-medium">
                    Failed to load materials. Please try again.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4 text-primary"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {materialsLoading && page === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: LIMIT }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {!materialsError && allItems.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {allItems.map((item) => (
                      <LearnCard key={item.id} item={item} />
                    ))}
                  </div>

                  {materialsLoading && page > 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  )}

                  <div ref={sentinelRef} className="h-4" />

                  {/* End of results */}
                  {!hasNextPage && (
                    <p className="text-center text-xs text-muted-foreground pb-4">
                      All materials loaded
                    </p>
                  )}
                </div>
              )}

              {!materialsLoading && !materialsError && allItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-muted-foreground text-base">
                    No items found{search ? ` for "${search}"` : ""}
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4 text-primary"
                    onClick={() => {
                      setSearch("");
                      setActiveFilter("all");
                      setPage(1);
                      setAllItems([]);
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