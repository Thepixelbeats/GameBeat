import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatePanelProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
  tone?: "default" | "error";
  size?: "default" | "compact";
};

const toneClasses = {
  default: "gf-surface",
  error: "border-rose-400/20 bg-rose-500/8",
};

export function StatePanel({
  eyebrow,
  title,
  description,
  actions,
  className,
  tone = "default",
  size = "default",
}: StatePanelProps) {
  return (
    <section
      className={cn(
        "rounded-[1.75rem] border text-center shadow-[0_24px_80px_rgba(3,8,20,0.24)] backdrop-blur-xl",
        toneClasses[tone],
        size === "compact" ? "px-5 py-6" : "px-6 py-14",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold tracking-[0.22em] uppercase",
            tone === "error" ? "text-rose-100" : "text-emerald-100/80"
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={cn(
          "font-semibold text-white",
          size === "compact" ? "mt-2 text-lg" : "mt-3 text-2xl"
        )}
      >
        {title}
      </h2>

      <p
        className={cn(
          "mx-auto max-w-2xl text-sm leading-6",
          tone === "error" ? "mt-3 text-slate-300" : "mt-3 text-slate-300"
        )}
      >
        {description}
      </p>

      {actions ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actions}
        </div>
      ) : null}
    </section>
  );
}
