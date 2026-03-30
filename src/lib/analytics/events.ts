export const analyticsEventNames = {
  signIn: "sign_in",
  backlogGameAdded: "backlog_game_added",
  backlogStatusUpdated: "backlog_status_updated",
  recommendationsViewed: "recommendations_viewed",
  tonightSuggestionsViewed: "tonight_suggestions_viewed",
} as const;

export type GameFlowAnalyticsEvent =
  (typeof analyticsEventNames)[keyof typeof analyticsEventNames];

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;
