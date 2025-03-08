"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataProvider, useData } from "@/context/data-context"
import { Search } from "@/components/search"
import { Loader2 } from "lucide-react"

// Create a wrapper component that uses the DataProvider
export default function InfiniteTablePage() {
  return (
    <DataProvider>
      <InfiniteTable />
    </DataProvider>
  )
}

// Inner component that uses the useData hook
function InfiniteTable() {
  const { data, loading, filteredData, searchTerm, setSearchTerm } = useData()

  const [visibleItems, setVisibleItems] = useState<typeof filteredData>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)
  const itemsPerLoad = 50

  // Load initial items
  useEffect(() => {
    if (filteredData.length > 0) {
      setVisibleItems(filteredData.slice(0, itemsPerLoad))
    }
  }, [filteredData])

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && visibleItems.length < filteredData.length && !loadingMore) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [visibleItems, filteredData, loadingMore])

  // Load more items function
  const loadMoreItems = useCallback(() => {
    setLoadingMore(true)

    // Simulate network delay
    setTimeout(() => {
      const nextItems = filteredData.slice(visibleItems.length, visibleItems.length + itemsPerLoad)

      setVisibleItems((prev) => [...prev, ...nextItems])
      setLoadingMore(false)
    }, 300)
  }, [filteredData, visibleItems])

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
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
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

      {/* Loader reference element */}
      {visibleItems.length < filteredData.length && (
        <div ref={loaderRef} className="flex justify-center p-4">
          <Loader2 className={`h-6 w-6 animate-spin ${loadingMore ? "opacity-100" : "opacity-0"}`} />
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Showing {visibleItems.length} of {filteredData.length} items
        {searchTerm && ` (filtered from ${data.length} total items)`}
      </div>
    </div>
  )
}