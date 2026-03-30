import { SkeletonBlock } from "@/components/shared/skeleton-block";

export default function DashboardLoading() {
  return (
    <div className="grid gap-6">
      <SkeletonBlock className="h-56 rounded-[2rem]" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-40" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <SkeletonBlock className="h-[30rem] rounded-[1.75rem]" />
        <div className="grid gap-6">
          <SkeletonBlock className="h-80 rounded-[1.75rem]" />
          <SkeletonBlock className="h-64 rounded-[1.75rem]" />
        </div>
      </div>
    </div>
  );
}
