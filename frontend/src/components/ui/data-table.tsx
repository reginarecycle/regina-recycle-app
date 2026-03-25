import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination, type TablePaginationProps } from "./table-pagination";
import { DataTableTabBar, type DataTableTabItem, type DataTableTabBarProps } from "./data-table-tab-bar";

// ─────────────────────────────────────────────────────────────────────────────
// Re-exports so consumers can import everything from one place
// ─────────────────────────────────────────────────────────────────────────────

export { TablePagination };
export type { TablePaginationProps };
export { DataTableTabBar };
export type { DataTableTabItem };

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY API — kept for backwards compatibility (default export)
// Consumers: requests-table, schedule-table, CollectorPricingTab
// ─────────────────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface LegacyDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  header?: { title: string; subtitle?: string; action?: ReactNode };
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showText?: string;
  };
  mobileRender?: (item: T) => ReactNode;
  keyExtractor: (item: T) => string | number;
  className?: string;
}

function LegacyDataTable<T>({
  data,
  columns,
  header,
  pagination,
  mobileRender,
  keyExtractor,
  className = "",
}: LegacyDataTableProps<T>) {
  return (
    <div className={`space-y-8 ${className}`}>
      {header && (
  <div className="flex items-center justify-between mb-2">
    <div>
      <h2 className="text-xl font-semibold mb-1">{header.title}</h2>
      {header.subtitle && <p className="text-sm text-muted-foreground">{header.subtitle}</p>}
    </div>
    {header.action && <div>{header.action}</div>}
  </div>
)}

      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAFA]">
              <tr className="border-b">
                {columns.map((col) => (
                  <th key={col.key} className={`text-left px-4 py-3 text-sm font-medium text-[#9CA3AF] ${col.headerClassName ?? ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={keyExtractor(item)} className={index !== data.length - 1 ? "border-b" : ""}>
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-4 ${col.className ?? ""}`}>
                      {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mobileRender && (
          <div className="lg:hidden divide-y">
            {data.map((item) => (
              <div key={keyExtractor(item)} className="p-4">{mobileRender(item)}</div>
            ))}
          </div>
        )}

        {pagination && (
          <div className="px-4 py-4 bg-white border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            {pagination.showText && (
              <p className="text-sm text-muted-foreground text-center sm:text-left">{pagination.showText}</p>
            )}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <Button variant="outline" className="h-10 px-3 min-w-0 text-sm"
                disabled={pagination.currentPage === 1}
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}>
                ← Prev
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button key={page}
                  variant={page === pagination.currentPage ? "default" : "outline"}
                  className={`h-10 w-10 p-0 min-w-0 ${page === pagination.currentPage ? "bg-primary text-white" : ""}`}
                  onClick={() => pagination.onPageChange(page)}>
                  {page}
                </Button>
              ))}
              <Button variant="outline" className="h-10 px-3 min-w-0 text-sm"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}>
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LegacyDataTable;

// ─────────────────────────────────────────────────────────────────────────────
// NEW API — DataTable super-component (named export)
// ─────────────────────────────────────────────────────────────────────────────

// ── Column Definition ─────────────────────────────────────────────────────────

export interface ColumnDef<T> {
  /** Unique key */
  key: string;
  /** Rendered in <th> */
  header: ReactNode;
  /** Rendered in <td> for each row */
  cell: (row: T, index: number) => ReactNode;
  /** Applied to both <th> and <td> */
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface DataTableProps<T> {
  // Data
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: (row: T) => string;

  // Header
  title?: ReactNode;
  /** Slot for search, filter buttons, or any action controls */
  headerRight?: ReactNode;
  showHeader?: boolean;
  headerClassName?: string;

  // Tabs — powered by DataTableTabBar (supports path / query / none routing)
  tabs?: DataTableTabItem[];
  showTabs?: boolean;
  tabBarClassName?: string;
  /** Forwarded to DataTableTabBar */
  tabBarProps?: Omit<DataTableTabBarProps, "tabs" | "className">;

  /** Slot rendered between the tab bar and the table (e.g. search + filter row) */
  subHeader?: ReactNode;

  // Table body
  emptyText?: string;
  minHeight?: string;
  tableClassName?: string;

  // Pagination
  page?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  paginationClassName?: string;

  // Container
  className?: string;

  // Loading
  isLoading?: boolean;
}

// ── DataTable ─────────────────────────────────────────────────────────────────

export function DataTable<T>({
  // data
  data,
  columns,
  rowKey,
  // header
  title,
  headerRight,
  showHeader = true,
  headerClassName,
  // tabs
  tabs,
  showTabs = true,
  tabBarClassName,
  tabBarProps,
  // subHeader
  subHeader,
  // table
  emptyText = "No records found",
  minHeight = "300px",
  tableClassName,
  // pagination
  page = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  showPagination = true,
  paginationClassName,
  // container
  className,
  // loading
  isLoading = false,
}: DataTableProps<T>) {
  const hasTabs       = showTabs && tabs && tabs.length > 0;
  const hasPagination = showPagination && !!onPageChange;

  return (
    <div className={cn("rounded-2xl bg-white border border-border shadow-sm flex flex-col min-h-0", className)}>

      {/* ── Header ── */}
      {showHeader && (title || headerRight) && (
        <div className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-border",
          headerClassName
        )}>
          {title && <h2 className="text-lg font-bold text-foreground shrink-0">{title}</h2>}
          {headerRight && (
            <div className="flex items-center gap-2 min-w-0">{headerRight}</div>
          )}
        </div>
      )}

      {/* ── Tabs ── */}
      {hasTabs && (
        <DataTableTabBar
          tabs={tabs!}
          className={tabBarClassName}
          {...tabBarProps}
        />
      )}

      {/* ── Sub-header (between tabs and table) ── */}
      {subHeader && (
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-border">
          {subHeader}
        </div>
      )}

      {/* ── Table ── */}
      <div style={{ minHeight }} className="flex-1 overflow-auto min-h-0">
        <Table className={tableClassName}>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "px-4 sm:px-6 py-3.5 text-xs font-medium text-muted-foreground h-auto whitespace-nowrap",
                    col.className,
                    col.headerClassName
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-border last:border-0 hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn("px-4 sm:px-6 py-4", col.className, col.cellClassName)}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center text-sm text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={rowKey(row)}
                  className="border-b border-border hover:bg-muted/30"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn("px-4 sm:px-6 py-4 align-middle", col.className, col.cellClassName)}
                    >
                      {col.cell(row, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {hasPagination && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          className={paginationClassName}
        />
      )}
    </div>
  );
}