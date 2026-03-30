import { cn } from "@/lib/utils";

type GameCoverArtProps = {
  title: string;
  coverUrl: string | null;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  compact?: boolean;
  ratio?: "cover" | "poster" | "landscape";
};

export function GameCoverArt({
  title,
  coverUrl,
  className,
  imageClassName,
  fallbackClassName,
  compact = false,
  ratio = "cover",
}: GameCoverArtProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]",
        compact
          ? "h-24 w-[4.5rem]"
          : ratio === "landscape"
            ? "aspect-[16/9] w-full"
            : ratio === "poster"
              ? "aspect-[3/4] w-full"
            : "aspect-[4/5] w-full",
        className
      )}
    >
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={`${title} cover art`}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center px-3 text-center text-[0.65rem] font-semibold tracking-[0.24em] text-slate-400 uppercase",
            fallbackClassName
          )}
        >
          No Cover
        </div>
      )}
    </div>
  );
}
