import { NextResponse } from "next/server"
import type { DataItem } from "@/types/data"

// This is a mock API route that would normally fetch from a database
// For the purpose of this example, we're generating mock data
export async function GET() {
  // Generate 10,000 mock items
  const mockData: DataItem[] = Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}. It contains some details about the item.`,
  }))

  return NextResponse.json(mockData)
}

