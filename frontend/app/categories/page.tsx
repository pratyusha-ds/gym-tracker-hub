import { Suspense } from 'react';
import CategoryList from './CategoryList';
import SearchBar from '@/components/categories/SearchBar';
import AddCategoryModal from '@/components/categories/AddCategoryModal';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query || '';

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto pt-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Your <span className="text-primary">Workouts</span>
          </h1>

          <Link
            href="/"
            className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all active:scale-95 group"
            title="Go Home"
          >
            <Home className="h-6 w-6 text-zinc-400 group-hover:text-primary transition-colors" />
          </Link>
        </div>

        <SearchBar />
        <div className="mt-10 space-y-4">
          <Suspense
            key={query}
            fallback={
              <div className="animate-pulse text-zinc-500 text-center py-10">
                Fetching Categories...
              </div>
            }
          >
            <CategoryList query={query} />
          </Suspense>
        </div>
      </div>
      <AddCategoryModal />
    </main>
  );
}
