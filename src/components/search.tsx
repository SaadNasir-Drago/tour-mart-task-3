"use client"

import { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export function Search({ searchTerm, setSearchTerm }: SearchProps) {
  const [inputValue, setInputValue] = useState(searchTerm)

  // Debounce search input to prevent excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, setSearchTerm])

  // Reset search input
  const handleClear = useCallback(() => {
    setInputValue("")
    setSearchTerm("")
  }, [setSearchTerm])

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by name..."
        className="pl-8 pr-10"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {inputValue && (
        <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-9 w-9 p-0" onClick={handleClear}>
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}

