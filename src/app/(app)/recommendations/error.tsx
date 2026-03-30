"use client";

import { StatePanel } from "@/components/shared/state-panel";
import { Button } from "@/components/ui/button";

type RecommendationsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function RecommendationsError({
  error,
  reset,
}: RecommendationsErrorProps) {
  return (
    <StatePanel
      eyebrow="Recommendations Error"
      title="We couldn't load your recommendations"
      description={
        error.message ||
        "Try again in a moment and GameFlow will rebuild the recommendation list."
      }
      tone="error"
      actions={<Button onClick={reset}>Try again</Button>}
    />
  );
}
