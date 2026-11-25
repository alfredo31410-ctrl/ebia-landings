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
    if (body.shouldTrackCompleteRegistration) trackMetaEventWhenReady("CompleteRegistration", `libro-con-ia:${body.registrationId}`, { content_name: "Tu primer libro con IA", content_category: "Registro ActiveCampaign", status: "completed" }, "persistent");
    setReady(true);
  }); }, []);
  return <main className={styles.page}><header><Brand inverse /></header><section className={styles.card} aria-live="polite"><p>CLASE GRATUITA · TU PRIMER LIBRO CON IA</p><span>✓</span><h1>{ready ? "Tu registro está confirmado" : "Confirmando tu registro…"}</h1>{ready && <><p>Ya tienes tu lugar. Entra al grupo oficial para recibir el enlace de la clase y los recordatorios.</p><a href="https://chat.whatsapp.com/LRLf4nFVK6RIxyFljQniDw">ENTRAR AL GRUPO DE WHATSAPP →</a></>}</section></main>;
}
