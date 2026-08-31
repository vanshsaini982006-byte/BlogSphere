export const CardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-ink/8 dark:border-white/8">
    <div className="skeleton aspect-[16/10]" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 w-24 rounded-full" />
      <div className="skeleton h-5 w-full" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  </div>
);

export const CardSkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const PostDetailSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
    <div className="skeleton h-4 w-32 rounded-full" />
    <div className="skeleton h-10 w-full" />
    <div className="skeleton h-10 w-2/3" />
    <div className="skeleton h-72 w-full rounded-2xl" />
    <div className="space-y-3 pt-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton h-4 w-full" />
      ))}
    </div>
  </div>
);
