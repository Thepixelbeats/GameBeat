"use client";

import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared/state-panel";

type SettingsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function SettingsError({ error, reset }: SettingsErrorProps) {
  return (
    <StatePanel
      eyebrow="Settings Error"
      title="We couldn't load your settings"
      description={
        error.message ||
        "Try again in a moment to get your account details back."
      }
      tone="error"
      actions={<Button onClick={reset}>Try again</Button>}
    />
  );
}
