"use client";

import { StatePanel } from "@/components/shared/state-panel";
import { Button } from "@/components/ui/button";

export default function BacklogError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatePanel
      eyebrow="Backlog Error"
      title="We couldn't load your backlog"
      description="Try the request again. If it keeps failing, the database connection or seed data may need attention."
      tone="error"
      actions={<Button onClick={reset}>Try again</Button>}
    />
  );
}
