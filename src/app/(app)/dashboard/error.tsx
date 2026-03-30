"use client";

import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared/state-panel";

type DashboardErrorProps = {
  error: Error;
  reset: () => void;
};

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  return (
    <StatePanel
      eyebrow="Dashboard Error"
      title="We couldn't load your dashboard"
      description={
        error.message ||
        "Something unexpected happened while pulling your latest library overview."
      }
      tone="error"
      actions={<Button onClick={reset}>Try again</Button>}
    />
  );
}
