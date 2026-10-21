"use client";

import { useEffect, useRef, useState } from "react";
import { trackMetaEventWithTimeout } from "@/lib/integrations/meta-pixel";
import styles from "./thanks.module.css";

const CAMPAIGN = "tareas-con-ia";
const WHATSAPP_REDIRECT = "/landings/tareas-con-ia/api/whatsapp/redirect";

export function TareasThankYouRedirect({ registrationId }: { registrationId: string }) {
  const [seconds, setSeconds] = useState(2);
  const active = useRef(true);
  const navigationStarted = useRef(false);
  const tracking = useRef<Promise<boolean> | null>(null);

  const ensureLead = () => {
    if (!tracking.current) {
      tracking.current = trackMetaEventWithTimeout(
        "Lead",
        `${CAMPAIGN}:${registrationId}`,
        {
          content_name: "Haz la tarea de tus hijos con IA",
          content_category: "Registro ActiveCampaign",
          status: "completed",
          value: 0,
          currency: "MXN",
        },
        "persistent",
        1_200,
        `lead-${registrationId}`,
      );
    }
    return tracking.current;
  };

  const openWhatsApp = async (waitForMinimum = false) => {
    if (!active.current || navigationStarted.current) return;
    const startedAt = Date.now();
    await ensureLead();
    if (waitForMinimum) {
      await new Promise((resolve) =>
        window.setTimeout(resolve, Math.max(0, 1_500 - (Date.now() - startedAt))),
      );
    }
    if (!active.current || navigationStarted.current) return;
    navigationStarted.current = true;
    window.location.replace(WHATSAPP_REDIRECT);
  };

  useEffect(() => {
    active.current = true;
    const countdown = window.setInterval(
      () => setSeconds((current) => Math.max(0, current - 1)),
      1_000,
    );
    void openWhatsApp(true);
    return () => {
      active.current = false;
      window.clearInterval(countdown);
    };
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-live="polite">
        <span className={styles.check} aria-hidden="true">✓</span>
        <p className={styles.eyebrow}>REGISTRO CONFIRMADO</p>
        <h1>¡Listo! Estamos abriendo el grupo de WhatsApp.</h1>
        <p>
          Ahí recibirás el enlace de acceso y los recordatorios para la clase del
          <strong> 29 de octubre a las 12:00 p. m. CDMX.</strong>
        </p>
        <button type="button" onClick={() => void openWhatsApp()}>
          ABRIR WHATSAPP AHORA
        </button>
        <small>Redirigiendo en {seconds}…</small>
      </section>
    </main>
  );
}
