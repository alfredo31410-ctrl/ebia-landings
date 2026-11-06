"use client";

import { useEffect, useRef, useState } from "react";
import { Brand } from "@/app/components/Brand";
import {
  trackMetaEvent,
  trackMetaEventWhenReady,
} from "@/lib/integrations/meta-pixel";
import type { LandingCampaign } from "@/lib/landings";
import styles from "./thanks.module.css";

type State = "validating" | "ready" | "invalid";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7c1.7.9 3.6 1.4 5.5 1.4 6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.4Zm-8.3 18.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.9 1 1-3.8-.2-.4a9.7 9.7 0 1 1 8.4 4.7Zm5.3-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.6l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.1.2 2.4 3.7 5.9 5.2 2.2.9 3 .9 4.1.8 1.3-.2 1.7-1 1.9-1.9.2-.9.2-1.6.1-1.8-.2-.1-.5-.2-.8-.3Z" />
    </svg>
  );
}

function MailConfirmation() {
  return (
    <div className={styles.mailConfirmation} aria-hidden="true">
      <div className={styles.mailBar}><i /><i /><i /></div>
      <div className={styles.mailBody}>
        <span className={styles.mailSubject} />
        <div className={styles.envelope}><span /></div>
        <span className={styles.mailLine} />
        <span className={styles.mailLineShort} />
      </div>
      <span className={styles.confirmationSeal}><CheckIcon /></span>
    </div>
  );
}

function EventDetails({ campaign }: { campaign: LandingCampaign }) {
  return (
    <dl className={styles.eventDetails} aria-label="Datos de la clase">
      <div><dt>Fecha</dt><dd>{campaign.event.displayDate}</dd></div>
      <div><dt>Hora</dt><dd>{campaign.event.displayTime} · {campaign.event.displayTimeZone}</dd></div>
      <div><dt>Modalidad</dt><dd>En línea · Gratuita</dd></div>
    </dl>
  );
}

export function CorreosThankYouPage({ campaign }: { campaign: LandingCampaign }) {
  const [state, setState] = useState<State>("validating");
  const registrationId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let stopTracking: void | (() => void);
    const consume = async () => {
      try {
        const response = await fetch(
          `/landings/${campaign.slug}/api/registrations/consume`,
          { method: "POST", credentials: "same-origin", cache: "no-store" },
        );
        const body = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          registrationId?: string;
          shouldTrackCompleteRegistration?: boolean;
        };
        if (!response.ok || !body.ok || !body.registrationId) {
          throw new Error("invalid_registration");
        }
        if (cancelled) return;
        registrationId.current = body.registrationId;
        setState("ready");
        if (!body.shouldTrackCompleteRegistration) return;
        stopTracking = trackMetaEventWhenReady(
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
    void consume();
    return () => {
      cancelled = true;
      stopTracking?.();
    };
  }, [campaign.integrations.metaContentName, campaign.slug]);

  const trackWhatsAppClick = () => {
    if (!registrationId.current) return;
    trackMetaEvent(
      "JoinGroup",
      `${campaign.slug}:${registrationId.current}`,
      {
        content_name: campaign.integrations.metaContentName,
        whatsappRedirectReached: true,
      },
      "persistent",
    );
  };

  if (state === "invalid") {
    return (
      <main className={styles.page} data-campaign={campaign.slug}>
        <div className={styles.gridGlow} aria-hidden="true" />
        <header className={styles.header}>
          <div className={styles.shell}><Brand inverse /><span>COMUNICACIÓN + IA</span></div>
        </header>
        <div className={`${styles.shell} ${styles.invalidContainer}`}>
          <section className={styles.invalidCard} aria-labelledby="invalid-title">
            <span className={styles.invalidSeal} aria-hidden="true">!</span>
            <p className={styles.eyebrow}>NO PUDIMOS RECUPERAR TU ACCESO</p>
            <h1 id="invalid-title">Revisa el enlace de confirmación</h1>
            <p>Si ya completaste el formulario, vuelve a abrir el enlace de confirmación que te mostró ActiveCampaign.</p>
            <a className={styles.secondaryButton} href={`/landings/${campaign.slug}`}>VOLVER A LA CLASE <ArrowIcon /></a>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page} data-campaign={campaign.slug} aria-busy={state === "validating"}>
      <div className={styles.gridGlow} aria-hidden="true" />
      <header className={styles.header}>
        <div className={styles.shell}><Brand inverse /><span>COMUNICACIÓN + IA</span></div>
      </header>

      <div className={`${styles.shell} ${styles.content}`}>
        <div className={styles.progress} aria-label="Paso 2 de 2">
          <span><CheckIcon /> DATOS GUARDADOS</span><i /><strong>2 DE 2 · ENTRAR AL GRUPO</strong>
        </div>

        <section className={styles.confirmationCard} aria-live="polite">
          <div className={styles.successCopy}>
            <p className={styles.eyebrow}><span />REGISTRO CONFIRMADO</p>
            <h1>Tu lugar está <span>reservado.</span></h1>
            <p className={styles.lead}><strong>{campaign.thanks.message}</strong> Para recibir el enlace, los recordatorios y los materiales, completa ahora el último paso.</p>
            <EventDetails campaign={campaign} />
            <MailConfirmation />
          </div>

          <aside className={styles.nextStep} aria-label="Último paso del registro">
            <p className={styles.stepLabel}>ÚLTIMO PASO</p>
            <span className={styles.whatsappSeal}><WhatsAppIcon /></span>
            <h2>Entra al grupo oficial de WhatsApp</h2>
            <p>Ahí compartiremos únicamente la información necesaria para que llegues listo a la clase.</p>
            <ol>
              <li><span>1</span><div><strong>Abre el grupo</strong><small>Usa el botón de esta página.</small></div></li>
              <li><span>2</span><div><strong>Confirma tu ingreso</strong><small>En WhatsApp, toca “Unirme al grupo”.</small></div></li>
            </ol>

            {state === "ready" ? (
              <a className={styles.whatsappButton} href={`/landings/${campaign.slug}/api/whatsapp/redirect`} onClick={trackWhatsAppClick}>
                <WhatsAppIcon />{campaign.thanks.actionLabel}<ArrowIcon />
              </a>
            ) : (
              <div className={styles.validating} role="status"><span aria-hidden="true" />CONFIRMANDO TU REGISTRO…</div>
            )}
            <p className={styles.privacyNote}>Tu enlace de acceso no se mostrará públicamente; se compartirá dentro del grupo oficial.</p>
          </aside>
        </section>

        <p className={styles.footerNote}>CORREOS PROFESIONALES · CLARIDAD, TONO Y SIGUIENTE PASO</p>
      </div>
    </main>
  );
}
