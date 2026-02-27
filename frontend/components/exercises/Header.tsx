import { ChevronLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeaderProps } from '@/types';

export default function Header({ exerciseId, onFinish }: HeaderProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
      <div className="flex items-center gap-6">
        <Link
          href="/categories"
          className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl border border-zinc-800 transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
            {exerciseId.replace(/-/g, ' ')}
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/history/${today}`}>
          <Button
            variant="outline"
            className="border-zinc-800 hover:bg-zinc-900 text-zinc-400 font-bold px-6 py-6 rounded-2xl"
          >
            <LayoutDashboard className="mr-2 h-5 w-5" /> VIEW SUMMARY
          </Button>
        </Link>
        <Button
          onClick={onFinish}
          className="bg-primary hover:bg-primary/90 text-black font-black px-10 py-6 text-lg rounded-2xl shadow-lg shadow-primary/10"
        >
          FINISH WORKOUT
        </Button>
      </div>
    </div>
  );
}
