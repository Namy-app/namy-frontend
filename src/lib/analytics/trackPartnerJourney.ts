import { usePartnerStore } from "@/store/usePartnerStore";

import {
  buildPartnerJourneyEvent,
  type PartnerJourneyAction,
  type PartnerJourneyIds,
} from "./partner-journey";

import { analytics } from "./index";

export function trackPartnerJourney(
  action: PartnerJourneyAction,
  ids?: PartnerJourneyIds
): void {
  const event = buildPartnerJourneyEvent(
    action,
    usePartnerStore.getState(),
    ids
  );
  if (event) {
    analytics.track(event.name, event.properties);
  }
}
