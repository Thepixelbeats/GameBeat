import { SkeletonBlock } from "@/components/shared/skeleton-block";

export default function SettingsLoading() {
  return (
    <div className="grid gap-6">
      <SkeletonBlock className="h-56 rounded-[2rem]" />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <SkeletonBlock className="h-80 rounded-[1.75rem]" />
          <SkeletonBlock className="h-72 rounded-[1.75rem]" />
        </div>

        <div className="grid gap-6">
          <SkeletonBlock className="h-56 rounded-[1.75rem]" />
          <SkeletonBlock className="h-64 rounded-[1.75rem]" />
        </div>
      </div>
    </div>
  );
}
