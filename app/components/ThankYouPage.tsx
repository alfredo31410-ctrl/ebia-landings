"use client";

import { useEffect } from "react";
import type { LandingCampaign } from "@/lib/landings";
import { Brand } from "./Brand";
import styles from "./ThankYouPage.module.css";

const trackEvent = (event: string, slug?: string) => {
  if (typeof window === "undefined") return;
  try {
    const analyticsWindow = window as typeof window & {
      gtag?: (command: string, event: string, data: { campaign?: string }) => void;
      analytics?: { track?: (event: string, data: { campaign?: string }) => void };
    };
    if (typeof analyticsWindow.gtag === "function") {
      analyticsWindow.gtag("event", event, { campaign: slug });
      return;
    }
    analyticsWindow.analytics?.track?.(event, { campaign: slug });
  } catch {
    // Tracking must never prevent the confirmation page from rendering.
  }
};

export function ThankYouPage({ campaign }: { campaign: LandingCampaign }) {
  useEffect(
    () => trackEvent("complete_registration", campaign.slug),
    [campaign.slug],
  );

  return (
    <main
      className={styles.page}
      data-campaign={campaign.slug}
      data-variant={campaign.variant}
    >
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.glowPrimary} />
        <span className={styles.glowSecondary} />
        <span className={styles.grid} />
      </div>

      <header className={styles.header}>
        <Brand />
      </header>

      <section className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m5 12.5 4.2 4.2L19 7" />
            </svg>
          </div>
          <p className={styles.status}>
            <span /> Registro completado
          </p>
          <h1>{campaign.thanks.title}</h1>
          <p className={styles.message}>{campaign.thanks.message}</p>
          <a className={styles.action} href="https://ebiacapacitacion.com/">
            {campaign.thanks.actionLabel}
            <span aria-hidden="true">→</span>
          </a>
          <p className={styles.note}>
            Si no encuentras el correo, revisa las carpetas de promociones o spam.
          </p>
        </div>
      </section>
    </main>
  );
}
