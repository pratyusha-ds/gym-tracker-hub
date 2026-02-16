import { Suspense } from "react";
import CategoryList from "./CategoryList";
import SearchBar from "@/app/components/SearchBar";
// import AddCategoryModal from '@/components/AddCategoryModal'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query || "";

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto pt-10">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
          Your <span className="text-primary">Workouts</span>
        </h1>
        <SearchBar />
        <div className="mt-10 space-y-4">
          <Suspense
            key={query}
            fallback={
              <div className="animate-pulse text-zinc-500">
                Fetching gains...
              </div>
            }
          >
            <CategoryList query={query} />
          </Suspense>
        </div>
      </div>
      {/* <AddCategoryModal /> */}
    </main>
  );
}
