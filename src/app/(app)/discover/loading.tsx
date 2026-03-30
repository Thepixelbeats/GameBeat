import { SkeletonBlock } from "@/components/shared/skeleton-block";

export default function DiscoverLoading() {
  return (
    <div className="grid gap-6">
      <SkeletonBlock className="h-28 rounded-[1.75rem]" />
      <SkeletonBlock className="h-28 rounded-[1.75rem]" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-[26rem]" />
        ))}
      </div>
    </div>
  );
}
