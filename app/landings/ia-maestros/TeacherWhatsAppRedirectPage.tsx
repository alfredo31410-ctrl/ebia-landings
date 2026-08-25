"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Brand } from "@/app/components/Brand";
import { trackJoinGroupWithTimeout } from "@/lib/integrations/meta-pixel";
import type { LandingCampaign } from "@/lib/landings";
import type { RegistrationToken } from "@/lib/registration";
import { getSameOriginUrl } from "@/lib/same-origin-url";
import styles from "./thanks.module.css";

export function TeacherWhatsAppRedirectPage({
  campaign,
  registration,
  whatsappConfigured,
}: {
  campaign: LandingCampaign;
  registration: RegistrationToken | null;
  whatsappConfigured: boolean;
}) {
  const [seconds, setSeconds] = useState(2);
  const trackingPromiseRef = useRef<Promise<boolean> | null>(null);
  const navigationStartedRef = useRef(false);
  const error = !whatsappConfigured || !registration;

  const ensureJoinGroupAttempt = useCallback(() => {
    if (!trackingPromiseRef.current && registration) {
      trackingPromiseRef.current = trackJoinGroupWithTimeout(
        campaign.slug,
        registration.registrationId,
        1_200,
      );
    }
    return trackingPromiseRef.current ?? Promise.resolve(false);
  }, [campaign.slug, registration]);

  const navigateOnce = useCallback(() => {
    if (navigationStartedRef.current) return;
    navigationStartedRef.current = true;
    window.location.assign(
      getSameOriginUrl(`/landings/${campaign.slug}/api/whatsapp/redirect`),
    );
  }, [campaign.slug]);

  const redirectAutomatically = useCallback(async () => {
    if (error) return;
    const startedAt = Date.now();
    await ensureJoinGroupAttempt();
    await new Promise((resolve) =>
      window.setTimeout(resolve, Math.max(0, 1_500 - (Date.now() - startedAt))),
    );
    navigateOnce();
  }, [ensureJoinGroupAttempt, error, navigateOnce]);

  const redirectManually = useCallback(async () => {
    if (error || navigationStartedRef.current) return;
    await ensureJoinGroupAttempt();
    navigateOnce();
  }, [ensureJoinGroupAttempt, error, navigateOnce]);

  useEffect(() => {
    if (error) return;
    const timer = window.setInterval(
      () => setSeconds((value) => Math.max(0, value - 1)),
      1_000,
    );
    void redirectAutomatically();
    return () => window.clearInterval(timer);
  }, [error, redirectAutomatically]);

  return (
    <main className={styles.page} data-campaign={campaign.slug}>
      <div className={styles.decorations} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className={styles.header}>
        <div className={styles.shell}>
          <Brand />
          <span className={styles.headerLabel}>EDUCACIÓN + IA</span>
        </div>
      </header>

      <div className={`${styles.shell} ${styles.redirectContainer}`}>
        <p className={styles.progress}>
          <span>ÚLTIMO PASO</span>
          <i aria-hidden="true" />
          <strong>{error ? "ACCESO PENDIENTE" : "ACCESO CONFIRMADO"}</strong>
        </p>

        <section className={styles.redirectCard} aria-live="polite">
          <div className={styles.redirectCopy}>
            <span
              className={error ? styles.redirectErrorSeal : styles.redirectSeal}
              aria-hidden="true"
            >
              {error ? "!" : "✓"}
            </span>
            <p className={styles.eyebrow}>
              {error ? "NO PUDIMOS CONTINUAR" : "TODO ESTÁ LISTO"}
            </p>
            <h1>
              {error ? (
                "No pudimos abrir el grupo"
              ) : (
                <>
                  Estamos abriendo <span>WhatsApp…</span>
                </>
              )}
            </h1>
            <p className={styles.redirectLead}>
              {error
                ? "El acceso no está disponible o tu registro ya expiró. Vuelve a la clase para registrarte nuevamente."
                : "En cuanto se abra la aplicación, toca “Unirme al grupo” para completar tu acceso a la clase."}
            </p>

            <div className={styles.redirectReminder}>
              <span aria-hidden="true">✦</span>
              <p>
                <strong>Recuerda:</strong> los avisos y el enlace de la clase se
                compartirán dentro del grupo oficial.
              </p>
            </div>
          </div>

          <aside className={styles.redirectBoard} aria-label="Estado de redirección">
            <span className={styles.tape} aria-hidden="true" />
            <p className={styles.boardLabel}>
              {error ? "ACCESO INTERRUMPIDO" : "GRUPO OFICIAL DE WHATSAPP"}
            </p>

            {error ? (
              <>
                <p className={styles.errorCode} aria-hidden="true">
                  INTENTA DE NUEVO
                </p>
                <h2>Regresa al inicio para recuperar tu acceso.</h2>
                <a
                  className={styles.redirectButtonSecondary}
                  href={`/landings/${campaign.slug}`}
                >
                  VOLVER A LA CLASE
                  <span aria-hidden="true">→</span>
                </a>
              </>
            ) : (
              <>
                <p className={styles.countdownLabel}>REDIRIGIENDO EN</p>
                <p className={styles.countdown} role="status" aria-atomic="true">
                  00:0{seconds}
                </p>
                <div className={styles.redirectTrack} aria-hidden="true">
                  <span />
                </div>
                <button
                  className={styles.redirectButton}
                  type="button"
                  onClick={() => void redirectManually()}
                >
                  ABRIR EL GRUPO AHORA
                  <span aria-hidden="true">→</span>
                </button>
                <p className={styles.privacyNote}>
                  Si WhatsApp no se abre automáticamente, utiliza este botón.
                </p>
              </>
            )}
          </aside>
        </section>

        <p className={styles.footerNote}>
          IA PARA MAESTROS · APRENDER, PROBAR Y ADAPTAR A TU AULA
        </p>
      </div>
    </main>
  );
}
