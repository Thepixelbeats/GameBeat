import { SkeletonBlock } from "@/components/shared/skeleton-block";

export default function StatsLoading() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-40" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SkeletonBlock className="h-[30rem] rounded-[1.75rem]" />
        <SkeletonBlock className="h-[30rem] rounded-[1.75rem]" />
      </div>

      <SkeletonBlock className="h-56 rounded-[1.75rem]" />
    </div>
  );
}
