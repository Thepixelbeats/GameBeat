"use client";

import { StatePanel } from "@/components/shared/state-panel";
import { Button } from "@/components/ui/button";

type StatsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function StatsError({ error, reset }: StatsErrorProps) {
  return (
    <StatePanel
      eyebrow="Stats Error"
      title="We couldn't load your stats"
      description={
        error.message ||
        "Something unexpected happened while pulling your library data."
      }
      tone="error"
      actions={<Button onClick={reset}>Try again</Button>}
    />
  );
}
