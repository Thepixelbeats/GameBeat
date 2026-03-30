"use client";

import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared/state-panel";

type TonightErrorProps = {
  error: Error;
  reset: () => void;
};

export default function TonightError({ error, reset }: TonightErrorProps) {
  return (
    <StatePanel
      eyebrow="Tonight Error"
      title="We couldn't build tonight's suggestions"
      description={
        error.message ||
        "Try again in a moment and GameFlow will re-run the picker."
      }
      tone="error"
      actions={<Button onClick={reset}>Try again</Button>}
    />
  );
}
