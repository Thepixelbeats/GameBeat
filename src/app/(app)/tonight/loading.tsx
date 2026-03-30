import { SkeletonBlock } from "@/components/shared/skeleton-block";

export default function TonightLoading() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_1.5fr]">
        <SkeletonBlock className="h-[44rem] rounded-[1.75rem]" />
        <div className="grid gap-4">
          <SkeletonBlock className="h-56 rounded-[1.75rem]" />
          <SkeletonBlock className="h-44 rounded-[1.75rem]" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SkeletonBlock className="h-[26rem]" />
        <SkeletonBlock className="h-[26rem]" />
        <SkeletonBlock className="h-[26rem]" />
      </div>
    </div>
  );
}
