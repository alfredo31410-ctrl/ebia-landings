"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/app/components/Brand";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import type { LandingCampaign } from "@/lib/landings";
import styles from "./thanks.module.css";

type State = "validating" | "ready" | "invalid";

function EventDetails({ campaign }: { campaign: LandingCampaign }) {
  return (
    <dl className={styles.eventDetails} aria-label="Datos de la clase">
      <div>
        <dt>Fecha</dt>
        <dd>{campaign.event.displayDate}</dd>
      </div>
      <div>
        <dt>Hora</dt>
        <dd>
          {campaign.event.displayTime} · {campaign.event.displayTimeZone}
        </dd>
      </div>
      <div>
        <dt>Modalidad</dt>
        <dd>En línea · Gratuita</dd>
      </div>
    </dl>
  );
}

export function TeacherThankYouPage({ campaign }: { campaign: LandingCampaign }) {
  const [state, setState] = useState<State>("validating");

  useEffect(() => {
    let cancelled = false;
    const consume = async () => {
      try {
        const response = await fetch(
          `/landings/${campaign.slug}/api/registrations/consume`,
          {
            method: "POST",
            credentials: "same-origin",
            cache: "no-store",
          },
        );
        const body = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          registrationId?: string;
        };
        if (!response.ok || !body.ok || !body.registrationId) {
          throw new Error("invalid_registration");
        }
        if (cancelled) return;
        setState("ready");
        return trackMetaEventWhenReady(
          "CompleteRegistration",
          `${campaign.slug}:${body.registrationId}`,
          {
            content_name: campaign.integrations.metaContentName,
            content_category: "Registro ActiveCampaign",
            status: "completed",
            value: 0,
            currency: "MXN",
          },
          "persistent",
        );
      } catch {
        if (!cancelled) setState("invalid");
      }
    };
    let stopTracking: void | (() => void);
    void consume().then((cleanup) => {
      stopTracking = cleanup;
    });
    return () => {
      cancelled = true;
      stopTracking?.();
    };
  }, [campaign.integrations.metaContentName, campaign.slug]);

  if (state === "invalid") {
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
        <div className={`${styles.shell} ${styles.invalidContainer}`}>
          <section className={styles.invalidCard} aria-labelledby="invalid-title">
            <span className={styles.invalidSeal} aria-hidden="true">
              !
            </span>
            <p className={styles.eyebrow}>REGISTRO NO CONFIRMADO</p>
            <h1 id="invalid-title">Este enlace ya no es válido</h1>
            <p>
              Esta página se habilita después de que el formulario confirma tu
              registro. Vuelve a la clase e inténtalo nuevamente.
            </p>
            <a className={styles.secondaryButton} href={`/landings/${campaign.slug}`}>
              VOLVER A LA CLASE
              <span aria-hidden="true">→</span>
            </a>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      className={styles.page}
      data-campaign={campaign.slug}
      aria-busy={state === "validating"}
    >
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

      <div className={`${styles.shell} ${styles.content}`}>
        <p className={styles.progress}>
          <span>PASO 2 DE 2</span>
          <i aria-hidden="true" />
          <strong>CASI TERMINAMOS</strong>
        </p>

        <section className={styles.paper} aria-live="polite">
          <div className={styles.mainCopy}>
            <span className={styles.successSeal} aria-hidden="true">
              ✓
            </span>
            <p className={styles.eyebrow}>REGISTRO CONFIRMADO</p>
            <h1>
              ¡Tu lugar está <span>reservado!</span>
            </h1>
            <p className={styles.lead}>
              <strong>{campaign.thanks.message}</strong> Ahora entra al grupo oficial
              para recibir el enlace de acceso, recordatorios y avisos de la clase.
            </p>

            <EventDetails campaign={campaign} />
          </div>

          <aside className={styles.nextStep} aria-label="Último paso del registro">
            <span className={styles.tape} aria-hidden="true" />
            <p className={styles.boardLabel}>TU SIGUIENTE TAREA</p>
            <h2>{campaign.thanks.title}</h2>
            <ol>
              <li>
                <span>1</span>
                Abre el grupo oficial.
              </li>
              <li>
                <span>2</span>
                En WhatsApp, toca “Unirme al grupo”.
              </li>
            </ol>

            {state === "ready" ? (
              <a
                className={styles.whatsappButton}
                href={`/landings/${campaign.slug}/unirse-whatsapp`}
              >
                {campaign.thanks.actionLabel}
                <span aria-hidden="true">→</span>
              </a>
            ) : (
              <div className={styles.validating} role="status">
                <span aria-hidden="true" />
                CONFIRMANDO TU REGISTRO…
              </div>
            )}

            <p className={styles.privacyNote}>
              El enlace de la clase se compartirá únicamente dentro del grupo.
            </p>
          </aside>
        </section>

        <p className={styles.footerNote}>
          IA PARA MAESTROS · APRENDER, PROBAR Y ADAPTAR A TU AULA
        </p>
      </div>
    </main>
  );
}
