import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TagPillProps = {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "cyan" | "emerald" | "amber";
};

const toneClasses = {
  neutral: "gf-pill",
  cyan: "rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100",
  emerald:
    "rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100",
  amber:
    "rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-100",
};

export function TagPill({
  children,
  className,
  tone = "neutral",
}: TagPillProps) {
  return <span className={cn(toneClasses[tone], className)}>{children}</span>;
}
