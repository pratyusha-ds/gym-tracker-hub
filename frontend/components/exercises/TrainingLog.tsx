import { History, Calendar } from 'lucide-react';
import { SessionHistoryEntry } from '@/types';

export default function TrainingLog() {
  const detailedHistory: SessionHistoryEntry[] = [
    {
      date: 'Feb 12, 2026',
      totalVolume: '3,000kg',
      sets: [
        { kg: '100', reps: '10' },
        { kg: '100', reps: '10' },
        { kg: '100', reps: '10' },
      ],
    },
    {
      date: 'Feb 05, 2026',
      totalVolume: '2,850kg',
      sets: [
        { kg: '95', reps: '10' },
        { kg: '95', reps: '10' },
        { kg: '95', reps: '10' },
      ],
    },
  ];

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <History size={24} className="text-primary" />
        </div>
        <h2 className="text-2xl font-black uppercase italic tracking-tight">Full Training Log</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {detailedHistory.map((session, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-6 hover:border-zinc-700 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">{session.date}</span>
              </div>
              <span className="text-[10px] font-black bg-zinc-800 text-primary px-3 py-1 rounded-full italic">
                {session.totalVolume} VOL
              </span>
            </div>
            <div className="space-y-2">
              {session.sets.map((set, sIdx) => (
                <div
                  key={sIdx}
                  className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-zinc-800/50"
                >
                  <span className="text-xs font-black text-zinc-600 italic">SET {sIdx + 1}</span>
                  <span className="font-bold text-zinc-200">
                    {set.kg}kg <span className="text-zinc-500 mx-2">×</span> {set.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
