import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableHeader {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export interface TablePagination {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showText?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  header?: TableHeader;
  pagination?: TablePagination;
  mobileRender?: (item: T) => ReactNode;
  keyExtractor: (item: T) => string | number;
  className?: string;
}

export default function DataTable<T>({
  data,
  columns,
  header,
  pagination,
  mobileRender,
  keyExtractor,
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-[8px] border border-[#CFCFCF] bg-white">
       {header && (
  <div className="flex items-center justify-between border-b border-[#CFCFCF] px-[24px] py-[12px]">
    <div>
      <h2 className="text-[16px] font-bold leading-[24px] text-[#0C111D]">
        {header.title}
      </h2>
      {header.subtitle && (
        <p className="text-sm text-muted-foreground">{header.subtitle}</p>
      )}
    </div>

    {header.action && <div>{header.action}</div>}
  </div>
)}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead className="bg-[#FAFAFA]">
              <tr className="border-b border-[#CFCFCF]">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-sm font-medium text-[#9CA3AF] ${
                      column.headerClassName || ""
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr
                  key={keyExtractor(item)}
                  className={
                    index !== data.length - 1 ? "border-b border-[#CFCFCF]" : ""
                  }
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(item)
                        : (item as Record<string, ReactNode>)[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mobileRender && (
          <div className="divide-y lg:hidden">
            {data.map((item) => (
              <div key={keyExtractor(item)} className="p-4">
                {mobileRender(item)}
              </div>
            ))}
          </div>
        )}

        {pagination && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[#CFCFCF] bg-white px-4 py-4 sm:flex-row">
            {pagination.showText && (
              <p className="text-center text-sm text-muted-foreground sm:text-left">
                {pagination.showText}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-1">
              <Button
                variant="outline"
                className="h-10 min-w-0 px-3 text-sm"
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
              >
                ← Prev
              </Button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.currentPage ? "default" : "outline"}
                  className={`h-10 w-10 min-w-0 p-0 ${
                    page === pagination.currentPage ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => pagination.onPageChange(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                className="h-10 min-w-0 px-3 text-sm"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}