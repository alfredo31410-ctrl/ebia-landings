"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { LandingCampaign } from "@/lib/landings";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import styles from "./ThankYouPage.module.css";

const whatsappUrl =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ||
  "https://chat.whatsapp.com/IoQGp5ptv70CHR1CwQUJZD";

export function ThankYouPage({ campaign }: { campaign: LandingCampaign }) {
  useEffect(() => trackMetaEventWhenReady(
    "CompleteRegistration",
    campaign.slug,
    {
      content_name: campaign.integrations.metaContentName,
      content_category: "Registro ActiveCampaign",
      status: "completed",
      value: 0,
      currency: "MXN",
    },
    "session",
  ), [campaign.integrations.metaContentName, campaign.slug]);

  return (
    <main className={styles.page} data-campaign={campaign.slug}>
      <div className={styles.backdrop} aria-hidden="true" />
      <section className={styles.shell}>
        <a className={styles.logo} href="https://ebiacapacitacion.com/" aria-label="Volver a EBIA">
          <span className={styles.logoCrop}>
            <Image
              src="/landings/media/logos/Logo1.png"
              alt="EBIA, Escuela Básica de Inteligencia Artificial"
              width={1080}
              height={1080}
              className={styles.logoImage}
              priority
            />
          </span>
        </a>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Registro {campaign.seo.title}</p>
            <h1>Tu registro <span>está casi</span> completo</h1>
            <p className={styles.subtitle}>
              Último paso obligatorio: únete al grupo de WhatsApp para recibir
              el acceso, avisos e instrucciones de la clase.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <SparklesIcon /><span>Falta poco</span>
            </div>
            <div className={styles.progressBox}>
              <div className={styles.progressLabel}>
                <strong>Proceso de registro</strong><span>80%</span>
              </div>
              <div className={styles.progressTrack}><div className={styles.progressFill} /></div>
            </div>
            <h2>Ya casi terminas el proceso.</h2>
            <p>
              Para completar tu registro, entra al WhatsApp de EBIA. Ahí
              recibirás instrucciones, recordatorios y el acceso cuando esté disponible.
            </p>
            <a className={styles.whatsappButton} href={whatsappUrl} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Unirme al grupo
            </a>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.visualBrand}>
            <span>e</span><strong>EBIA</strong>
          </div>
          <div className={styles.visualMedia}>
            <Image
              src="/landings/media/ia-desde-cero/Foto2.png"
              alt={campaign.image.alt}
              width={1067}
              height={1600}
              sizes="(max-width: 560px) 92vw, (max-width: 980px) 70vw, 46vw"
              className={styles.visualImage}
              priority
            />
          </div>
          <div className={styles.visualBadge}>
            <CheckIcon /><span>Registro guardado en EBIA</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function SparklesIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3ZM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" /></svg>;
}
function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7c1.7.9 3.6 1.4 5.5 1.4 6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.4Zm-8.3 18.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.9 1 1-3.8-.2-.4a9.7 9.7 0 1 1 8.4 4.7Zm5.3-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.6l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.1.2 2.4 3.7 5.9 5.2 2.2.9 3 .9 4.1.8 1.3-.2 1.7-1 1.9-1.9.2-.9.2-1.6.1-1.8-.2-.1-.5-.2-.8-.3Z" /></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6L16.5 9"/></svg>;
}
