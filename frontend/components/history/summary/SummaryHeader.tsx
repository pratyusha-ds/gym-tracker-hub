import { ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

export function SummaryHeader({ formattedDate }: { formattedDate: string }) {
  return (
    <div className="flex items-center gap-6 mb-10">
      <Link
        href="/history"
        className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl border border-zinc-800"
      >
        <ChevronLeft size={24} className="text-zinc-400" />
      </Link>
      <div>
        <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
          Workout <span className="text-primary">Summary</span>
        </h1>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
          <CalendarIcon size={14} /> {formattedDate}
        </p>
      </div>
    </div>
  );
}
