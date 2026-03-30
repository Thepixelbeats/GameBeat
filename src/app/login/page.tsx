import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import {
  isEmailAuthEnabled,
  isGoogleAuthEnabled,
} from "@/lib/auth/auth-options";
import { getCurrentUserSession } from "@/lib/auth/session";

export default async function LoginPage() {
  const session = await getCurrentUserSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <LoginForm
      canUseEmail={isEmailAuthEnabled}
      canUseGoogle={isGoogleAuthEnabled}
    />
  );
}
