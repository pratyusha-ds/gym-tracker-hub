import { Category } from '@/types';
import CategoryItem from './CategoryItem';
import { API_BASE_URL } from '@/lib/constants';
import { getAuthHeaders } from '@/lib/api-utils';
import { syncUserAction } from '@/app/categories/actions';
import { currentUser } from '@clerk/nextjs/server';

export default async function CategoryList({
  query,
  historyDate,
}: {
  query: string;
  historyDate?: string;
}) {
  try {
    const user = await currentUser();

    syncUserAction({
      email: user?.emailAddresses[0]?.emailAddress || '',
      name: user?.fullName || 'Stark User',
    });

    const headers = await getAuthHeaders();

    const url = new URL(`${API_BASE_URL}/categories`);
    if (query) url.searchParams.append('search', query);

    const res = await fetch(url.toString(), {
      cache: 'force-cache',
      headers,
      next: { tags: ['categories'] },
    });

    if (!res.ok) throw new Error('Failed to fetch');

    const categories: Category[] = await res.json();

    if (categories.length === 0) {
      return (
        <div className="text-center p-12 border-2 border-dashed border-zinc-900 rounded-3xl">
          <p className="text-zinc-500 font-medium italic">
            {query ? `No results found for "${query}"` : 'Your library is empty.'}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <CategoryItem key={cat.id} category={cat} historyDate={historyDate} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('CategoryList Error:', error);
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center">
        <p className="font-bold uppercase tracking-widest text-xs mb-2">System Offline</p>
        <p className="text-sm">Please try again after a while.</p>
      </div>
    );
  }
}
