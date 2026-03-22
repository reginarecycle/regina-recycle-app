import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildPageNumbers(totalPages: number, page: number): (number | "...")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: TablePaginationProps) {
  const pageNumbers = React.useMemo(
    () => buildPageNumbers(totalPages, page),
    [totalPages, page]
  );

  const showFrom = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const showTo   = Math.min(page * pageSize, totalItems);
  const go       = (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages));

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-border", className)}>
      {/* Count label */}
      <span className="text-sm text-muted-foreground order-2 sm:order-1">
        Showing&nbsp;
        <span className="font-medium text-foreground">{showFrom}&nbsp;to&nbsp;{showTo}</span>
        &nbsp;of&nbsp;
        <span className="font-medium text-foreground">{totalItems}</span>
      </span>

      {/* Controls */}
      <div className="flex items-stretch border border-border rounded-xl overflow-hidden divide-x divide-border order-1 sm:order-2">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1.5 px-3 sm:px-4 h-9 sm:h-10 text-sm font-medium text-foreground bg-white disabled:opacity-40 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Previous</span>
        </button>

        {/* Full page numbers on sm+; just current/total on mobile */}
        <div className="hidden sm:contents">
          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span
                key={`el-${i}`}
                className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center text-sm text-muted-foreground bg-white select-none"
              >
                ···
              </span>
            ) : (
              <button
                key={p}
                onClick={() => go(p as number)}
                className={cn(
                  "w-9 sm:w-10 h-9 sm:h-10 text-sm font-medium transition-colors",
                  page === (p as number)
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-foreground hover:bg-muted"
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Mobile: "1 / 5" indicator */}
        <span className="sm:hidden px-4 h-9 flex items-center text-sm font-medium text-foreground bg-white select-none">
          {page}&nbsp;/&nbsp;{totalPages}
        </span>

        <button
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-1.5 px-3 sm:px-4 h-9 sm:h-10 text-sm font-medium text-foreground bg-white disabled:opacity-40 hover:bg-muted transition-colors"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
