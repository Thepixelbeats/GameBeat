import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

type AppShellProps = {
  children: ReactNode;
  playerName: string;
  playerEmail: string;
};

export function AppShell({ children, playerName, playerEmail }: AppShellProps) {
  return (
    <div className="bg-background min-h-screen">
      <div className="relative isolate min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(127,255,212,0.12),transparent_26%),radial-gradient(circle_at_right,rgba(76,160,255,0.08),transparent_24%)]" />

        <div className="relative flex min-h-screen">
          <AppSidebar />

          <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-72">
            <AppTopbar playerName={playerName} playerEmail={playerEmail} />

            <main className="flex-1 px-4 pt-4 pb-8 sm:px-6 sm:pt-5 lg:px-8 lg:pt-6">
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 lg:gap-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
