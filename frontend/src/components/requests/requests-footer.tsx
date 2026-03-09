import { useState } from "react";
import { CardFooter } from "../ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

type RequestsFooterProps = {
    totalRows: number;
    rowsPerPage: number;
    onPageChange?: (page: number) => void;
};

export function RequestsFooter({
    totalRows,
    rowsPerPage,
    onPageChange,
}: RequestsFooterProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        if (onPageChange) onPageChange(page);
    };

    const startRow = (currentPage - 1) * rowsPerPage + 1;

    const endRow = Math.min(currentPage * rowsPerPage, totalRows);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <CardFooter className="flex items-center justify-between border-t border-[#CFCFCF] !h-[48px]">

            <div className="text-sm text-muted-foreground">
                Showing {startRow} to {endRow} of {totalRows}
            </div>

            {/* Paging controls */}
            <nav className="inline-flex items-center space-x-1" aria-label="Pagination">
                <button
                    className="flex items-center justify-center rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>

                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded border px-2 py-1 text-center text-sm font-medium ${page === currentPage
                            ? "bg-gray-800 text-white border-gray-800"
                            : "border-gray-300 hover:bg-gray-100"
                            }`}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="flex items-center justify-center rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </nav>
        </CardFooter>
    );
}