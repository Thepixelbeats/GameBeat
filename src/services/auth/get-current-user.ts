import { redirect } from "next/navigation";

import { findUserById } from "@/lib/db/users";
import { requireUserSession } from "@/lib/auth/session";

export async function getCurrentUser() {
  const session = await requireUserSession();

  if (!session.user?.id) {
    redirect("/login?error=SessionRequired");
  }

  const user = await findUserById(session.user.id);

  if (!user) {
    redirect("/login?error=SessionRequired");
  }

  return user;
}
