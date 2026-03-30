"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Clock3, LogOut, Mail, Sparkles, UserRound } from "lucide-react";

import { updateSettingsProfileAction } from "@/app/(app)/settings/actions";
import { LogoutButton } from "@/features/auth/components/logout-button";
import {
  initialSettingsActionState,
  type SettingsActionState,
} from "@/features/settings/action-state";
import { AppShellPage } from "@/components/layout/app-shell-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SettingsPageData } from "@/services/settings/types";

function formatJoinedDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function ProfileActionMessage({ state }: { state: SettingsActionState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <p
      className={cn(
        "text-sm leading-6",
        state.status === "error" ? "text-red-300" : "text-emerald-200"
      )}
    >
      {state.message}
    </p>
  );
}

function SaveProfileButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Saving..." : "Save display name"}
    </Button>
  );
}

type SettingsViewProps = {
  data: SettingsPageData;
};

export function SettingsView({ data }: SettingsViewProps) {
  const [state, formAction] = useActionState(
    updateSettingsProfileAction,
    initialSettingsActionState
  );

  return (
    <AppShellPage
      eyebrow="Settings"
      title="Keep your account simple"
      description="Review the basics, adjust how your name appears in GameFlow, and leave the rest lightweight for now."
      actions={<LogoutButton />}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <Card className="bg-transparent shadow-none">
            <CardHeader className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
                Account
              </p>
              <CardTitle>Basic account info</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="gf-surface-muted flex items-start gap-3 p-4">
                <span className="rounded-2xl border border-white/8 bg-white/[0.05] p-2 text-slate-100">
                  <UserRound className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Display name
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {data.displayName ?? "Player One"}
                  </p>
                </div>
              </div>

              <div className="gf-surface-muted flex items-start gap-3 p-4">
                <span className="rounded-2xl border border-white/8 bg-white/[0.05] p-2 text-slate-100">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Email
                  </p>
                  <p className="mt-2 text-sm font-medium break-all text-white">
                    {data.email}
                  </p>
                </div>
              </div>

              <div className="gf-surface-muted flex items-start gap-3 p-4">
                <span className="rounded-2xl border border-white/8 bg-white/[0.05] p-2 text-slate-100">
                  <Clock3 className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Member since
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {formatJoinedDate(data.createdAt)}
                  </p>
                </div>
              </div>

              <div className="gf-surface-muted flex items-start gap-3 p-4">
                <span className="rounded-2xl border border-white/8 bg-white/[0.05] p-2 text-slate-100">
                  <Sparkles className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Account status
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {data.emailVerifiedAt ? "Verified" : "Signed in"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {data.emailVerifiedAt
                      ? "Your email has already been confirmed."
                      : "Your current login is active and ready to use."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent shadow-none">
            <CardHeader className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
                Profile
              </p>
              <CardTitle>How your name shows up in GameFlow</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-5">
                <FieldGroup>
                  <Field data-invalid={state.status === "error"}>
                    <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                    <Input
                      id="displayName"
                      name="displayName"
                      defaultValue={data.displayName ?? ""}
                      placeholder="Player One"
                      maxLength={40}
                      aria-invalid={state.status === "error"}
                    />
                    <FieldDescription>
                      Keep it simple. This is the name used in greetings and
                      summary copy around the app.
                    </FieldDescription>
                    <FieldError>
                      {state.status === "error" ? state.message : null}
                    </FieldError>
                  </Field>
                </FieldGroup>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <ProfileActionMessage state={state} />
                  <SaveProfileButton />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="bg-transparent shadow-none">
            <CardHeader className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
                Session
              </p>
              <CardTitle>Sign out when you are done</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-slate-400">
                GameFlow keeps this page intentionally light. If you are on a
                shared machine, logging out here is the cleanest way to wrap up.
              </p>

              <div className="gf-surface-muted flex flex-col items-start gap-3 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <LogOut className="size-4 text-slate-300" />
                  End this session
                </div>
                <LogoutButton />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent shadow-none">
            <CardHeader className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.22em] text-emerald-100/80 uppercase">
                Lightweight by design
              </p>
              <CardTitle>Preferences stay simple in v1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="gf-surface-muted p-4">
                <p className="text-sm font-medium text-white">
                  Recommendations
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Your recommendations already adapt to the games you finish,
                  rate highly, and favor by genre. There is nothing extra to
                  configure for launch.
                </p>
              </div>

              <div className="gf-surface-muted p-4">
                <p className="text-sm font-medium text-white">Tonight picker</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Session length, mood, and play style are chosen when you use
                  the picker, so this page can stay focused on account basics.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShellPage>
  );
}
