"use client";
import { useEffect, useState } from "react";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import { Brand } from "@/app/components/Brand";
import styles from "./thanks.module.css";

export default function Page() {
  const [ready, setReady] = useState(false);
  useEffect(() => { void fetch("/landings/libro-con-ia/api/registrations/consume", { method: "POST", credentials: "same-origin" }).then(async (response) => {
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.ok) return;
    if (body.shouldTrackCompleteRegistration) trackMetaEventWhenReady("Lead", `libro-con-ia:${body.registrationId}`, { content_name: "Tu primer libro con Inteligencia Artificial", content_category: "Registro ActiveCampaign", status: "completed" }, "persistent");
    setReady(true);
  }); }, []);
  return <main className={styles.page}><header><Brand inverse /></header><section className={styles.card} aria-live="polite"><p>CLASE GRATUITA · TU PRIMER LIBRO CON INTELIGENCIA ARTIFICIAL</p><span>✓</span><h1>{ready ? "Falta un paso para completar tu acceso" : "Confirmando tu registro…"}</h1>{ready && <><p>Tus datos ya se guardaron. Entra al grupo oficial de WhatsApp para completar tu acceso y recibir el enlace de la clase y los recordatorios.</p><a href="https://chat.whatsapp.com/LRLf4nFVK6RIxyFljQniDw">COMPLETAR MI ACCESO EN WHATSAPP →</a></>}</section></main>;
}
