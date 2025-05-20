import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {

  // Helper to create the page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Show first 2 pages, last 2 pages, current and neighbors, with ellipsis
      pages.push(1);
      if (currentPage > 4) pages.push('left-ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push('right-ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="Pagination" className="flex items-center space-x-2">
      {/* Prev button */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`rounded border px-2 py-0.5 text-lg font-semibold ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400 text-gray-500'}`}
        aria-label="Previous page"
      >
        &lt;
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) => {
        if (page === 'left-ellipsis' || page === 'right-ellipsis') {
          return (
            <span key={page + idx} className="px-2 select-none">
              &hellip;
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`rounded border px-3 py-1 font-semibold ${
              isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 text-gray-500'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`rounded border px-2 py-0.5 text-lg font-semibold ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 text-gray-500'
        }`}
        aria-label="Next page"
      >
        &gt;
      </button>
    </nav>
  );
}
