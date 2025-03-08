"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataProvider, useData } from "@/context/data-context"
import { Pagination } from "@/components/pagination"
import { Search } from "@/components/search"

export function DataTable() {
  return (
    <DataProvider>
      <DataTableContent />
    </DataProvider>
  )
}

function DataTableContent() {
  const {
    data,
    loading,
    filteredData,
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
  } = useData()

  // Get current items for the current page
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  if (loading) {
    return <div className="flex justify-center p-8">Loading data...</div>
  }

  return (
    <div className="space-y-4">
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.description}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      <div className="text-sm text-muted-foreground">
        Showing {currentItems.length} of {filteredData.length} items
        {searchTerm && ` (filtered from ${data.length} total items)`}
      </div>
    </div>
  )
}

