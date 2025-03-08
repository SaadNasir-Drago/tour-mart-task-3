import { DataTable } from "@/components/data-table"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Large Dataset Viewer</h1>
      <DataTable />
    </main>
  )
}

