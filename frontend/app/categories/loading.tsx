export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto pt-10">
        <div className="h-10 w-48 bg-zinc-800 animate-pulse rounded mb-8" />
        <div className="h-14 w-full bg-zinc-900 animate-pulse rounded-2xl mb-10" />

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 w-full bg-zinc-900/50 animate-pulse rounded-xl border border-zinc-800"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
