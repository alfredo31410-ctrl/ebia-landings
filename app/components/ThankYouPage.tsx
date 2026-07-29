"use client";

import { useEffect } from "react";
import type { LandingCampaign } from "@/lib/landings";
import type { RegistrationToken } from "@/lib/registration";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";

export function ThankYouPage({ campaign, registration }: { campaign: LandingCampaign; registration: RegistrationToken | null }) {
  useEffect(() => {
    if (!registration) return;
    // El id del registro forma parte de la clave persistente: recargar o abrir
    // otra pestaña no vuelve a enviar CompleteRegistration para el mismo registro.
    return trackMetaEventWhenReady("CompleteRegistration", `${campaign.slug}:${registration.registrationId}`, { content_name: campaign.integrations.metaContentName, content_category: "Registro ActiveCampaign", status: "completed", value: 0, currency: "MXN" });
  }, [campaign.integrations.metaContentName, campaign.slug, registration]);

  if (!registration) return <InvalidThankYou campaign={campaign} />;
  const event = campaign.event;
  return <main className="thanks-flow" data-campaign={campaign.slug}>
    <div className="thanks-background" aria-hidden="true" />
    <div className="shell thanks-container"><section className="thanks-panel">
      <p className="thanks-progress">PASO 2 DE 2 · ÚLTIMO PASO <span /></p>
      <div className="thanks-check" aria-hidden="true"><CheckIcon /></div>
      <h1>{campaign.thanks.title}</h1>
      <p className="thanks-lead"><strong>{campaign.thanks.message}</strong><br />Entra ahora al grupo oficial para recibir el enlace de acceso, los recordatorios y los avisos importantes de la clase del {event.displayDate}.</p>
      <a className="whatsapp-button" href={`/landings/${campaign.slug}/unirse-whatsapp`}><WhatsAppIcon />{campaign.thanks.actionLabel}</a>
      <p className="thanks-button-note">Cuando se abra WhatsApp, toca “Unirme al grupo” para terminar.</p>
      <div className="thanks-alert"><strong>Tu proceso todavía no está completo.</strong> WhatsApp será el canal oficial de comunicación para esta clase.</div>
      <div className="thanks-steps"><article className="is-current"><small>Fecha</small><p>{event.displayDate}</p></article><article><small>Hora</small><p>{event.displayTime} · {event.displayTimeZone}</p></article><article><small>Modalidad</small><p>En línea · registro gratuito</p></article></div>
    </section></div>
  </main>;
}

function InvalidThankYou({ campaign }: { campaign: LandingCampaign }) {
  return <main className="thanks-flow"><div className="shell thanks-container"><section className="thanks-panel" aria-labelledby="invalid-title">
    <p className="thanks-progress">RECUPERACIÓN DEL REGISTRO <span /></p><h1 id="invalid-title">Este enlace ya no es válido</h1>
    <p className="thanks-lead">No podemos confirmar un registro desde una URL abierta directamente, expirada o que no corresponde a un registro válido. Vuelve a la landing para iniciar el proceso.</p>
    <a className="whatsapp-button" href={`/landings/${campaign.slug}`}>VOLVER A LA LANDING</a>
  </section></div></main>;
}

function CheckIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.6 2.6L16.5 9" /></svg>; }
function WhatsAppIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7c1.7.9 3.6 1.4 5.5 1.4 6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.5-8.4Zm-8.3 18.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.9 1 1-3.8-.2-.4a9.7 9.7 0 1 1 8.4 4.7Zm5.3-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.6l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.1.2 2.4 3.7 5.9 5.2 2.2.9 3 .9 4.1.8 1.3-.2 1.7-1 1.9-1.9.2-.9.2-1.6.1-1.8-.2-.1-.5-.2-.8-.3Z" /></svg>; }
