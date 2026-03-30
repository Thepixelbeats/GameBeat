import { SkeletonBlock } from "@/components/shared/skeleton-block";

export default function BacklogLoading() {
  return (
    <div className="grid gap-6">
      <SkeletonBlock className="h-72 rounded-[1.75rem]" />
      <SkeletonBlock className="h-28 rounded-[1.75rem]" />
      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        <SkeletonBlock className="h-[30rem]" />
        <SkeletonBlock className="h-[30rem]" />
        <SkeletonBlock className="h-[30rem]" />
      </div>
    </div>
  );
}
