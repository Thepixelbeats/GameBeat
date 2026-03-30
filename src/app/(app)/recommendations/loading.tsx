import { SkeletonBlock } from "@/components/shared/skeleton-block";

export default function RecommendationsLoading() {
  return (
    <div className="grid gap-6">
      <SkeletonBlock className="h-56 rounded-[2rem]" />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_2fr]">
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-28" />
          ))}
        </div>

        <SkeletonBlock className="h-56 rounded-[1.75rem]" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-[22rem] rounded-[1.75rem]" />
        ))}
      </div>
    </div>
  );
}
