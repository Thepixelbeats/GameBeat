import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";

export async function getCurrentUserSession() {
  return getServerSession(authOptions);
}

export async function requireUserSession() {
  const session = await getCurrentUserSession();

  if (!session?.user) {
    redirect("/login?error=SessionRequired");
  }

  return session;
}
