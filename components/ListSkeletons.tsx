export default function ListSkeletons() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex h-[60px] animate-pulse items-center gap-3 rounded-chip bg-surface-raised px-4">
          <div className="h-9 w-9 rounded-lg bg-surface-overlay" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-surface-overlay" />
            <div className="h-3 w-1/2 rounded bg-surface-overlay" />
          </div>
          <div className="h-6 w-20 rounded-full bg-surface-overlay" />
        </div>
      ))}
    </div>
  );
}
