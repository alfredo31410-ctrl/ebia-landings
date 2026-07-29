"use client";

import { useEffect, useRef, useState } from "react";
import type { LandingCampaign } from "@/lib/landings";
import type { RegistrationToken } from "@/lib/registration";
import { trackJoinGroupWithTimeout } from "@/lib/integrations/meta-pixel";

export function WhatsAppRedirectPage({ campaign, registration, whatsappConfigured }: { campaign: LandingCampaign; registration: RegistrationToken | null; whatsappConfigured: boolean }) {
  const [seconds, setSeconds] = useState(2);
  const [error, setError] = useState(!whatsappConfigured || !registration);
  const redirectStarted = useRef(false);
  const redirectToWhatsApp = async () => {
    if (redirectStarted.current || !registration || !whatsappConfigured) return;
    redirectStarted.current = true;
    const startedAt = Date.now();
    await trackJoinGroupWithTimeout(campaign.slug, registration.registrationId, 1_200);
    await new Promise((resolve) => window.setTimeout(resolve, Math.max(0, 1_500 - (Date.now() - startedAt))));
    window.location.assign("/api/whatsapp/redirect");
  };
  useEffect(() => {
    if (!registration || !whatsappConfigured) { setError(true); return; }
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 500);
    // JoinGroup es proxy: significa llegada a la redirección, no membresía.
    void redirectToWhatsApp();
    return () => window.clearInterval(timer);
  }, [campaign.slug, registration, whatsappConfigured]);
  return <main className="thanks-flow"><div className="shell thanks-container"><section className="thanks-panel" aria-live="polite">
    <p className="thanks-progress">ÚLTIMO PASO <span /></p><h1>{error ? "No pudimos abrir el grupo" : "Estamos abriendo el grupo oficial de WhatsApp…"}</h1>
    <p className="thanks-lead">{error ? "Regresa a la página anterior e inténtalo de nuevo. El enlace de acceso no está disponible o tu registro expiró." : "Cuando se abra WhatsApp, presiona “Unirme al grupo” para terminar."}</p>
    {!error && <p className="thanks-button-note">Redirigiendo en {seconds}…</p>}
    {!error && <button className="whatsapp-button" style={{ border: 0, cursor: "pointer" }} type="button" onClick={() => void redirectToWhatsApp()}>ABRIR EL GRUPO MANUALMENTE</button>}
    {error && <a className="whatsapp-button" href={`/landings/${campaign.slug}/gracias`}>VOLVER A GRACIAS</a>}
  </section></div></main>;
}
