"use client";

import { useEffect, useState } from "react";
import type { LandingCampaign } from "@/lib/landings";
import type { RegistrationToken } from "@/lib/registration";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";

export function WhatsAppRedirectPage({ campaign, registration, whatsappConfigured }: { campaign: LandingCampaign; registration: RegistrationToken | null; whatsappConfigured: boolean }) {
  const [seconds, setSeconds] = useState(2);
  const [error, setError] = useState(!whatsappConfigured || !registration);
  useEffect(() => {
    if (!registration || !whatsappConfigured) { setError(true); return; }
    // Es un evento proxy: solo indica que alcanzó la redirección, no que se unió.
    const stop = trackMetaEventWhenReady("JoinGroup", `${campaign.slug}:${registration.registrationId}`, { content_name: campaign.integrations.metaContentName, whatsappRedirectReached: true }, "persistent");
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 500);
    // La URL externa solo se resuelve en el servidor; el navegador navega a
    // una ruta interna que valida cookie y configuración antes del 302.
    const redirect = window.setTimeout(() => { window.location.assign("/api/whatsapp/redirect"); }, 1500);
    return () => { stop(); window.clearInterval(timer); window.clearTimeout(redirect); };
  }, [campaign.integrations.metaContentName, campaign.slug, registration, whatsappConfigured]);
  return <main className="thanks-flow"><div className="shell thanks-container"><section className="thanks-panel" aria-live="polite">
    <p className="thanks-progress">ÚLTIMO PASO <span /></p><h1>{error ? "No pudimos abrir el grupo" : "Estamos abriendo el grupo oficial de WhatsApp…"}</h1>
    <p className="thanks-lead">{error ? "Regresa a la página anterior e inténtalo de nuevo. El enlace de acceso no está disponible o tu registro expiró." : "Cuando se abra WhatsApp, presiona “Unirme al grupo” para terminar."}</p>
    {!error && <p className="thanks-button-note">Redirigiendo en {seconds}…</p>}
    {!error && <a className="whatsapp-button" href="/api/whatsapp/redirect">ABRIR EL GRUPO MANUALMENTE</a>}
    {error && <a className="whatsapp-button" href={`/landings/${campaign.slug}/gracias`}>VOLVER A GRACIAS</a>}
  </section></div></main>;
}
