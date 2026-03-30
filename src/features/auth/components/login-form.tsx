"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { emailSignInSchema } from "@/lib/validations/auth";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Access was denied. Try another account.",
  Configuration: "Authentication is not fully configured yet.",
  OAuthAccountNotLinked:
    "That email is already linked to another sign-in method.",
  OAuthCallback: "Google sign-in could not be completed.",
  OAuthSignin: "Google sign-in could not be started.",
  SessionRequired: "Please sign in to continue.",
  Verification: "The email sign-in link is invalid or expired.",
};

type LoginFormProps = {
  canUseEmail: boolean;
  canUseGoogle: boolean;
};

export function LoginForm({ canUseEmail, canUseGoogle }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const rawError = searchParams.get("error");
  const searchError = rawError
    ? (AUTH_ERROR_MESSAGES[rawError] ?? "Unable to sign you in.")
    : null;

  function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = emailSignInSchema.safeParse({ email });

    if (!parsed.success) {
      setFeedback(null);
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email.");
      return;
    }

    setFeedback(null);
    setError(null);

    startTransition(async () => {
      const result = await signIn("email", {
        email: parsed.data.email,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "We could not send the sign-in link. Check your auth settings."
        );
        return;
      }

      setFeedback("Check your inbox for a magic sign-in link.");
      setEmail(parsed.data.email);
    });
  }

  function handleGoogleSignIn() {
    setFeedback(null);
    setError(null);

    startTransition(async () => {
      await signIn("google", { callbackUrl });
    });
  }

  const activeError = error ?? searchError;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(114,255,196,0.14),transparent_30%),linear-gradient(180deg,#0a0f17_0%,#090d13_100%)] px-6 py-16 sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl items-center">
        <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-center gap-6">
            <span className="text-muted-foreground text-xs font-medium tracking-[0.24em] uppercase">
              GameFlow Auth
            </span>
            <div className="flex max-w-2xl flex-col gap-4">
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Sign in and get your gaming backlog under control.
              </h1>
              <p className="text-muted-foreground text-base leading-7 sm:text-lg">
                {canUseEmail && canUseGoogle
                  ? "Use a magic link or Google to enter the MVP. Authenticated users are sent straight to the dashboard."
                  : canUseEmail
                    ? "Use a magic link to enter the MVP. Authenticated users are sent straight to the dashboard."
                    : canUseGoogle
                      ? "Use Google to enter the MVP. Authenticated users are sent straight to the dashboard."
                      : "Authentication is not configured yet. Add a sign-in provider to finish setup."}
              </p>
            </div>
          </div>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                {canUseEmail && canUseGoogle
                  ? "Keep it simple: email sign-in or Google OAuth."
                  : canUseEmail
                    ? "Keep it simple: email sign-in is ready to use."
                    : canUseGoogle
                      ? "Keep it simple: Google OAuth is ready to use."
                      : "No sign-in providers are enabled yet."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {canUseEmail ? (
                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleEmailSubmit}
                >
                  <FieldGroup>
                    <Field data-invalid={Boolean(activeError)}>
                      <FieldLabel htmlFor="email">Email address</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        aria-invalid={Boolean(activeError)}
                        disabled={isPending}
                      />
                      <FieldDescription>
                        We&apos;ll send you a secure magic link.
                      </FieldDescription>
                      <FieldError>{activeError}</FieldError>
                    </Field>
                  </FieldGroup>

                  {feedback ? (
                    <p className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
                      {feedback}
                    </p>
                  ) : null}

                  <Button type="submit" size="lg" disabled={isPending}>
                    <Mail data-icon="inline-start" />
                    {isPending ? "Sending link..." : "Email me a sign-in link"}
                  </Button>
                </form>
              ) : null}

              {canUseEmail && canUseGoogle ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="bg-border h-px flex-1" />
                    <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                      or
                    </span>
                    <div className="bg-border h-px flex-1" />
                  </div>
                </>
              ) : null}

              {canUseGoogle ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={isPending}
                    onClick={handleGoogleSignIn}
                  >
                    <Globe data-icon="inline-start" />
                    Continue with Google
                  </Button>
                </>
              ) : null}

              {!canUseEmail && !canUseGoogle ? (
                <p className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
                  Set `EMAIL_SERVER` and `EMAIL_FROM`, or `GOOGLE_CLIENT_ID` and
                  `GOOGLE_CLIENT_SECRET`, before deploying.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
