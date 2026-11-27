export default function GearLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading gear">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/3] animate-pulse rounded-xl bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
