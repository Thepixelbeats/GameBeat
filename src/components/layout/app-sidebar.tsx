"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  appIdentity,
  primaryNavItems,
  secondaryNavItems,
} from "@/components/layout/app-shell-nav";
import { cn } from "@/lib/utils";

function AppNavLink({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  pathname: string;
}) {
  const isActive =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-3 transition",
        isActive
          ? "bg-emerald-300/10 text-white shadow-[inset_0_0_0_1px_rgba(134,255,196,0.14)]"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border transition",
          isActive
            ? "border-emerald-300/20 bg-emerald-300/14 text-emerald-100"
            : "border-white/8 bg-white/[0.04] text-slate-400 group-hover:border-white/14 group-hover:text-white"
        )}
      >
        <Icon className="size-4" />
      </span>

      <span className="block text-sm font-medium">{label}</span>
    </Link>
  );
}

function AppSidebarContent() {
  const pathname = usePathname();
  const IdentityIcon = appIdentity.icon;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/8 px-5 py-5">
        <Link href="/dashboard" className="block">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(139,255,198,0.24),rgba(76,160,255,0.18))] text-white shadow-[0_16px_40px_rgba(76,160,255,0.16)] ring-1 ring-white/10">
              <IdentityIcon className="size-5" />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-white">
                {appIdentity.name}
              </h2>
              <p className="text-sm text-slate-400">
                Backlog, discovery, and tonight&apos;s pick.
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <nav className="space-y-2" aria-label="Primary">
          {primaryNavItems.map((item) => (
            <AppNavLink key={item.href} pathname={pathname} {...item} />
          ))}
        </nav>
      </div>

      <div className="border-t border-white/8 px-4 py-4">
        <nav className="space-y-2" aria-label="Secondary">
          {secondaryNavItems.map((item) => (
            <AppNavLink key={item.href} pathname={pathname} {...item} />
          ))}
        </nav>
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/8 bg-[linear-gradient(180deg,rgba(10,15,24,0.96),rgba(8,12,20,0.92))] backdrop-blur-xl lg:block">
        <AppSidebarContent />
      </aside>

      <div className="border-b border-white/8 bg-[linear-gradient(180deg,rgba(10,15,24,0.96),rgba(8,12,20,0.92))] px-4 py-3 lg:hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white marker:content-none">
            <span className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/8 bg-white/[0.05]">
                <Menu className="size-4" />
              </span>
              Open navigation
            </span>
            <span className="text-xs text-white/60 transition group-open:rotate-45">
              +
            </span>
          </summary>

          <div className="pt-3">
            <div className="overflow-hidden rounded-3xl border border-white/8 bg-[linear-gradient(180deg,rgba(12,18,29,0.98),rgba(9,13,22,0.95))] shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
              <AppSidebarContent />
            </div>
          </div>
        </details>
      </div>
    </>
  );
}
