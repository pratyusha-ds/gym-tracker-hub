import { Suspense } from 'react';
import CategoryList from './CategoryList';
import SearchBar from '@/components/categories/SearchBar';
import AddCategoryModal from '@/components/categories/AddCategoryModal';
import { Calendar } from 'lucide-react';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; date?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || '';
  const historyDate = params.date || '';

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto pt-10">
        <div className="flex flex-col mb-8 gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Your <span className="text-primary">Workouts</span>
            </h1>

            {historyDate && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                <Calendar size={12} />
                LOGGING: {historyDate}
              </div>
            )}
          </div>

          {historyDate && (
            <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest italic">
              You are adding sets to a past session.
            </p>
          )}
        </div>

        <SearchBar />

        <div className="mt-10 space-y-4">
          <Suspense
            key={`${query}-${historyDate}`}
            fallback={
              <div className="animate-pulse text-zinc-500 text-center py-10">
                Fetching Categories...
              </div>
            }
          >
            <CategoryList query={query} historyDate={historyDate} />
          </Suspense>
        </div>
      </div>
      <AddCategoryModal />
    </main>
  );
}
