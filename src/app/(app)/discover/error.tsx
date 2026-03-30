"use client";

import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared/state-panel";

type DiscoverErrorProps = {
  error: Error;
  reset: () => void;
};

export default function DiscoverError({ error, reset }: DiscoverErrorProps) {
  return (
    <StatePanel
      eyebrow="Discover Error"
      title="We couldn't open Discover"
      description={
        error.message ||
        "Try again in a moment to get search and backlog actions back."
      }
      tone="error"
      actions={<Button onClick={reset}>Try again</Button>}
    />
  );
}
