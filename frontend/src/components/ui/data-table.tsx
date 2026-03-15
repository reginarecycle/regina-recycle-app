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
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      {header && (
        <div>
          <h2 className="text-xl font-semibold mb-1">{header.title}</h2>
          {header.subtitle && (
            <p className="text-sm text-muted-foreground">{header.subtitle}</p>
          )}
        </div>
      )}

      {/* Table Container */}
<div className="overflow-hidden bg-white">
  {/* Desktop Table */}
  <div className="hidden lg:block overflow-x-auto">
    <table className="w-full">
   <thead>
  <tr className="border-b border-[#E5E7EB]">
    {columns.map((column) => (
      <th
        key={column.key}
        // Change px-4 to px-6:
className={`text-left px-6 py-3 text-sm font-medium text-[#9CA3AF] ${
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
                  className={index !== data.length - 1 ? "border-b" : ""}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(item)
                        : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        {mobileRender && (
          <div className="lg:hidden divide-y">
            {data.map((item) => (
              <div key={keyExtractor(item)} className="p-4">
                {mobileRender(item)}
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && (
          <div className="px-4 py-4 bg-white border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            {pagination.showText && (
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                {pagination.showText}
              </p>
            )}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <Button
                variant="outline"
                className="h-10 px-3 min-w-0 text-sm"
                disabled={pagination.currentPage === 1}
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              >
                ← Prev
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === pagination.currentPage ? "default" : "outline"}
                    className={`h-10 w-10 p-0 min-w-0 ${
                      page === pagination.currentPage
                        ? "bg-primary text-white"
                        : ""
                    }`}
                    onClick={() => pagination.onPageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                className="h-10 px-3 min-w-0 text-sm"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
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