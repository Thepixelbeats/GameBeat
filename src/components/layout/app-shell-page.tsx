import type { ReactNode } from "react";

type AppShellPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function AppShellPage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: AppShellPageProps) {
  return (
    <section className="gf-surface overflow-hidden">
      <div className="border-b border-white/8 px-5 py-5 sm:px-6 lg:px-8 lg:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold tracking-[0.24em] text-emerald-100/80 uppercase">
              {eyebrow}
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.4rem]">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                {description}
              </p>
            </div>
          </div>

          {actions ? (
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          ) : null}
        </div>
      </div>

      {children ? (
        <div className="px-5 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</div>
      ) : null}
    </section>
  );
}
