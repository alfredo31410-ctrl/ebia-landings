"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import { Brand } from "@/app/components/Brand";
import {
  hasTrackedMetaEvent,
  trackMetaEvent,
  trackMetaEventWhenReady,
} from "@/lib/integrations/meta-pixel";
import styles from "./thanks.module.css";

const CAMPAIGN = "tareas-con-ia";
type State = "validating" | "ready" | "invalid";

export function TareasThankYouPage() {
  const [state, setState] = useState<State>("validating");
  const registrationId = useRef<string | null>(null);
  const openingWhatsApp = useRef(false);

  useEffect(() => {
    let active = true;
    let stopTracking: void | (() => void);
    const consumeRegistration = async () => {
      try {
        const response = await fetch(
          "/landings/tareas-con-ia/api/registrations/consume",
          { method: "POST", credentials: "same-origin", cache: "no-store" },
        );
        const body = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          registrationId?: string;
        };
        if (!response.ok || !body.ok || !body.registrationId) {
          throw new Error("invalid_registration");
        }

        registrationId.current = body.registrationId;
        if (active) setState("ready");
        stopTracking = trackMetaEventWhenReady(
          "CompleteRegistration",
          `${CAMPAIGN}:${body.registrationId}`,
          {
            content_name: "Haz la tarea de tus hijos con IA",
            content_category: "Registro ActiveCampaign + WhatsApp",
            status: "completed",
            value: 0,
            currency: "MXN",
          },
          "persistent",
          40,
        );
      } catch {
        if (active) setState("invalid");
      }
    };
    void consumeRegistration();
    return () => {
      active = false;
      stopTracking?.();
    };
  }, []);

  const completeRegistration = async (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!registrationId.current) return;
    event.preventDefault();
    if (openingWhatsApp.current) return;
    openingWhatsApp.current = true;
    const target = event.currentTarget.href;
    const scope = `${CAMPAIGN}:${registrationId.current}`;
    const startedAt = Date.now();

    while (Date.now() - startedAt < 1_200) {
      const completed =
        trackMetaEvent(
          "CompleteRegistration",
          scope,
          {
            content_name: "Haz la tarea de tus hijos con IA",
            content_category: "Registro ActiveCampaign + WhatsApp",
            status: "completed",
            value: 0,
            currency: "MXN",
          },
          "persistent",
        ) || hasTrackedMetaEvent("CompleteRegistration", scope, "persistent");
      const joined =
        trackMetaEvent(
          "JoinGroup",
          scope,
          {
            content_name: "Haz la tarea de tus hijos con IA",
            whatsappRedirectReached: true,
          },
          "persistent",
        ) || hasTrackedMetaEvent("JoinGroup", scope, "persistent");
      if (completed && joined) break;
      await new Promise((resolve) => window.setTimeout(resolve, 100));
    }

    window.location.assign(target);
  };

  return (
    <main className={styles.page} aria-busy={state === "validating"}>
      <header className={styles.header}>
        <Brand />
        <span>EDUCACIÓN + IA PARA FAMILIAS</span>
      </header>

      <section className={styles.card} aria-labelledby="thanks-title">
        <div className={styles.copy}>
          <span className={styles.check} aria-hidden="true">!</span>
          <p className={styles.eyebrow}>ESPERA · AÚN NO HAS TERMINADO</p>
          <h1 id="thanks-title">Te falta un último paso</h1>
          <p className={styles.message}>
            Tus datos ya fueron guardados, pero debes entrar al grupo oficial de
            WhatsApp para completar tu registro y recibir el acceso a la clase.
          </p>

          <dl className={styles.details} aria-label="Datos de la clase">
            <div><dt>Fecha</dt><dd>29 de octubre de 2026</dd></div>
            <div><dt>Hora</dt><dd>12:00 p. m. CDMX</dd></div>
            <div><dt>Modalidad</dt><dd>En línea · Gratuita</dd></div>
          </dl>
        </div>

        <aside className={styles.nextStep} aria-label="Último paso obligatorio">
          <p className={styles.nextLabel}>PASO 2 DE 2 · OBLIGATORIO</p>
          <h2>Completa tu registro en WhatsApp</h2>
          <p>
            El enlace de acceso, los recordatorios y cualquier aviso importante se
            compartirán únicamente dentro del grupo.
          </p>

          {state === "ready" ? (
            <a
              href="/landings/tareas-con-ia/api/whatsapp/redirect"
              onClick={completeRegistration}
            >
              COMPLETAR MI REGISTRO EN WHATSAPP <span aria-hidden="true">→</span>
            </a>
          ) : state === "validating" ? (
            <div className={styles.validating} role="status">
              CONFIRMANDO TUS DATOS…
            </div>
          ) : (
            <a className={styles.retry} href="/landings/tareas-con-ia">
              VOLVER A INTENTAR EL REGISTRO <span aria-hidden="true">→</span>
            </a>
          )}

          <small>
            Importante: en WhatsApp toca “Unirme al grupo” para asegurar que recibas
            el enlace de la clase.
          </small>
        </aside>
      </section>
    </main>
  );
}
