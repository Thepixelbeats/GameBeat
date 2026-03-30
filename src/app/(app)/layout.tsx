import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requireUserSession } from "@/lib/auth/session";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireUserSession();
  const playerName = session.user?.name?.trim() || "Player One";
  const playerEmail = session.user?.email?.trim() || "Signed in";

  return (
    <AppShell playerName={playerName} playerEmail={playerEmail}>
      {children}
    </AppShell>
  );
}
