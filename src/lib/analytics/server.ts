import { track } from "@vercel/analytics/server";

import type {
  AnalyticsProperties,
  GameFlowAnalyticsEvent,
} from "@/lib/analytics/events";

export async function trackServerEvent(
  eventName: GameFlowAnalyticsEvent,
  properties?: AnalyticsProperties
) {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  try {
    await track(eventName, properties);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[analytics] failed to send server event", error);
    }
  }
}
