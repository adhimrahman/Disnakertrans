"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage?: number
  onPageChange?: (page: number) => void
  siblingsCount?: number
}

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage = 1,
  onPageChange = () => {},
  siblingsCount = 1,
}: PaginationProps) {
  const [page, setPage] = useState(currentPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    setPage(newPage)
    onPageChange(newPage)
  }

  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first and last page
    const firstPage = 1
    const lastPage = totalPages

    // Calculate range of pages to show
    let startPage = Math.max(firstPage, page - siblingsCount)
    let endPage = Math.min(lastPage, page + siblingsCount)

    // Adjust if we're near the start or end
    if (page <= siblingsCount + 1) {
      endPage = Math.min(lastPage, 2 * siblingsCount + 1)
    }

    if (page >= lastPage - siblingsCount) {
      startPage = Math.max(firstPage, lastPage - 2 * siblingsCount)
    }

    // Generate array of page numbers
    const pages = []

    // Add first page
    if (startPage > firstPage) {
      pages.push(firstPage)
      // Add ellipsis if there's a gap
      if (startPage > firstPage + 1) {
        pages.push("ellipsis-start")
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add last page
    if (endPage < lastPage) {
      // Add ellipsis if there's a gap
      if (endPage < lastPage - 1) {
        pages.push("ellipsis-end")
      }
      pages.push(lastPage)
    }

    return pages
  }

  const pages = generatePagination()

  return (
    <nav className="flex items-center justify-center space-x-1 py-4" aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-1">
        {pages.map((pageNum, index) => {
          if (pageNum === "ellipsis-start" || pageNum === "ellipsis-end") {
            return (
              <span key={`${pageNum}-${index}`} className="px-2">
                &hellip;
              </span>
            )
          }

          return (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(Number(pageNum))}
              aria-current={pageNum === page ? "page" : undefined}
              aria-label={`Page ${pageNum}`}
            >
              {pageNum}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
