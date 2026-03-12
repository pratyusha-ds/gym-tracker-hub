export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-zinc-900 animate-pulse rounded-xl" />
          <div className="h-10 w-32 bg-zinc-900 animate-pulse rounded-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="h-96 w-full bg-zinc-900/40 animate-pulse rounded-[2rem] border border-zinc-800" />
          </div>

          <div className="lg:col-span-4">
            <div className="h-64 w-full bg-zinc-900/40 animate-pulse rounded-[2rem] border border-zinc-800" />
          </div>
        </div>
      </div>
    </main>
  );
}
