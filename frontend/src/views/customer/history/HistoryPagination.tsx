import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

function buildPageNumbers(totalPages: number, page: number): (number | "...")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

interface HistoryPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const HistoryPagination: React.FC<HistoryPaginationProps> = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const pageNumbers = React.useMemo(() => buildPageNumbers(totalPages, page), [totalPages, page]);
  const showFrom = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const showTo   = Math.min(page * pageSize, totalItems);
  const go       = (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-border">
      <span className="text-sm text-muted-foreground">
        Showing&nbsp;
        <span className="font-medium text-foreground">{showFrom} to {showTo}</span>
        &nbsp;of&nbsp;
        <span className="font-medium text-foreground">{totalItems}</span>
      </span>

      {/* Single bordered container — exactly like Figma */}
      <div className="flex items-stretch border border-border rounded-xl overflow-hidden divide-x divide-border">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1.5 px-4 h-10 text-sm font-medium text-foreground bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span key={`el-${i}`} className="w-10 h-10 flex items-center justify-center text-sm text-muted-foreground bg-white select-none">
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => go(p as number)}
              className={cn(
                "w-10 h-10 text-sm font-medium transition-colors",
                page === (p as number)
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-foreground hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-1.5 px-4 h-10 text-sm font-medium text-foreground bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
