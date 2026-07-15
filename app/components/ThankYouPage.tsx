"use client";

import { useEffect } from "react";
import type { LandingCampaign } from "@/lib/landings";
// Lightweight local fallback for tracking to avoid missing module errors
const trackEvent = (event: string, slug?: string) => {
  if (typeof window === "undefined") return;
  try {
    // Prefer gtag if available
    const anyWin = window as any;
    if (typeof anyWin.gtag === "function") {
      anyWin.gtag("event", event, { campaign: slug });
      return;
    }
    // Fallback to a generic analytics object if present
    if (anyWin.analytics && typeof anyWin.analytics.track === "function") {
      anyWin.analytics.track(event, { campaign: slug });
      return;
    }
  } catch (e) {
    // swallow errors in client tracking
  }
};
import { Brand } from "./Brand";

export function ThankYouPage({ campaign }: { campaign: LandingCampaign }) {
  useEffect(
    () => trackEvent("complete_registration", campaign.slug),
    [campaign.slug],
  );
  return (
    <main className={`campaign campaign--${campaign.variant} thanks`}>
      <section className="thanks-card">
        <div className="thanks-icon" aria-hidden="true">
          ✓
        </div>
        <Brand />
        <h1>{campaign.thanks.title}</h1>
        <p>{campaign.thanks.message}</p>
        <a
          className="button button--primary"
          href="https://ebiacapacitacion.com/"
        >
          {campaign.thanks.actionLabel}
          <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  );
}
