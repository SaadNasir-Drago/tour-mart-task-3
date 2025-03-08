"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import type { DataItem } from "@/types/data"
import datasetJson from "@/data/dataset.json"

interface DataContextType {
  data: DataItem[]
  loading: boolean
  filteredData: DataItem[]
  currentPage: number
  itemsPerPage: number
  totalPages: number
  searchTerm: string
  setCurrentPage: (page: number) => void
  setSearchTerm: (term: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 50

  // Load data from the local JSON file
  useEffect(() => {
    // Simulate a small delay to show loading state (optional)
    const timer = setTimeout(() => {
      try {
        // Cast the imported JSON to our DataItem type
        setData(datasetJson as DataItem[])
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data

    return data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [data, searchTerm])

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage)
  }, [filteredData, itemsPerPage])

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const value = {
    data,
    loading,
    filteredData,
    currentPage,
    itemsPerPage,
    totalPages,
    searchTerm,
    setCurrentPage,
    setSearchTerm,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

