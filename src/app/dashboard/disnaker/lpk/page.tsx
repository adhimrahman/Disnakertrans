"use client"

import { useState } from "react"
import { Pagination } from "@/components/dashboard/Pagination"
import { BsBriefcaseFill } from "react-icons/bs";
import Card from "@/components/dashboard/Card"

export default function PaginationDemo() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalItems = 22
  const itemsPerPage = 9

  // Generate sample data
  const generateItems = () => {
    return Array.from({ length: totalItems }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      description: `This is a description for item ${i + 1}. Hover to see the blue ring effect.`,
    }))
  }

  const allItems = generateItems()

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-2xl font-bold">Card Items with Hover Effect</h1>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} items
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {currentItems.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            body={item.description}
            icon={<BsBriefcaseFill />}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center">
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          siblingsCount={1}
        />
      </div>
    </div>
  )
}