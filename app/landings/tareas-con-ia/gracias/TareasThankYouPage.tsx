"use client";

import { useEffect } from "react";
import { Brand } from "@/app/components/Brand";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import styles from "./thanks.module.css";

const CAMPAIGN = "tareas-con-ia";

export function TareasThankYouPage({ registrationId }: { registrationId: string }) {
  useEffect(
    () =>
      trackMetaEventWhenReady(
        "CompleteRegistration",
        `${CAMPAIGN}:${registrationId}`,
        {
          content_name: "Haz la tarea de tus hijos con IA",
          content_category: "Registro ActiveCampaign",
          status: "completed",
          value: 0,
          currency: "MXN",
        },
        "persistent",
      ),
    [registrationId],
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Brand />
        <span>EDUCACIÓN + IA PARA FAMILIAS</span>
      </header>

      <section className={styles.card} aria-labelledby="thanks-title">
        <div className={styles.copy}>
          <span className={styles.check} aria-hidden="true">✓</span>
          <p className={styles.eyebrow}>REGISTRO CONFIRMADO</p>
          <h1 id="thanks-title">¡Tu lugar está listo!</h1>
          <p className={styles.lead}>
            Tus datos se guardaron correctamente. Ahora entra al grupo oficial de
            WhatsApp para recibir el enlace de acceso y los recordatorios de la clase.
          </p>

          <dl className={styles.details} aria-label="Datos de la clase">
            <div><dt>Fecha</dt><dd>29 de octubre de 2026</dd></div>
            <div><dt>Hora</dt><dd>12:00 p. m. CDMX</dd></div>
            <div><dt>Modalidad</dt><dd>En línea · Gratuita</dd></div>
          </dl>
        </div>

        <aside className={styles.nextStep} aria-label="Siguiente paso">
          <p className={styles.nextLabel}>ÚLTIMO PASO</p>
          <h2>Entra al grupo oficial de WhatsApp</h2>
          <p>
            Ahí compartiremos el acceso a la clase y cualquier aviso importante.
          </p>
          <a href="/landings/tareas-con-ia/api/whatsapp/redirect">
            ENTRAR AL GRUPO DE WHATSAPP <span aria-hidden="true">→</span>
          </a>
          <small>En WhatsApp, toca “Unirme al grupo” para terminar.</small>
        </aside>
      </section>
    </main>
  );
}
