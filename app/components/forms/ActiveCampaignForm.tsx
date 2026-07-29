"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ACTIVE_CAMPAIGN_SUCCESS_SELECTOR, getActiveCampaignClassName, getActiveCampaignEmbedUrl } from "@/lib/integrations/active-campaign";
import { resetTrackedMetaEvent } from "@/lib/integrations/meta-pixel";

type Props = { formId: string; campaign: string; metaContentName: string; thankYouPath: string };

export function ActiveCampaignForm({ formId, campaign, thankYouPath }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const handled = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const prepareNewRegistration = () => resetTrackedMetaEvent("CompleteRegistration", campaign, "session");
    const lockForm = () => {
      // El bloqueo del navegador no sustituye la protección server-side, pero
      // evita el doble clic y dos solicitudes antes de que ActiveCampaign responda.
      element.querySelectorAll<HTMLButtonElement>("button, input[type=submit]").forEach((button) => { button.disabled = true; });
      setIsConfirming(true);
      prepareNewRegistration();
    };
    const getAttribution = () => {
      const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "campaign_id", "adset_id", "ad_id", "placement", "fbclid"];
      return Object.fromEntries(keys.flatMap((key) => { const value = new URLSearchParams(window.location.search).get(key); return value ? [[key, value]] : []; }));
    };
    const checkSuccess = () => {
      const success = element.querySelector<HTMLElement>(ACTIVE_CAMPAIGN_SUCCESS_SELECTOR);
      if (!success) return;
      const style = window.getComputedStyle(success);
      const visible = style.display !== "none" && style.visibility !== "hidden" && success.getClientRects().length > 0;
      if (handled.current || !visible) return;
      handled.current = true;
      setIsConfirming(true);
      // ActiveCampaign ya mostró su estado real de éxito; el servidor emite ahora
      // una cookie firmada para que una URL de gracias directa no confirme nada.
      void fetch("/api/registrations/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ landingSlug: campaign, attribution: getAttribution() }) })
        .then(async (response) => { const body = await response.json().catch(() => ({})); if (!response.ok || !body.ok) throw new Error(body.message || "No se pudo confirmar el registro."); return body; })
        .then(() => window.location.assign(thankYouPath))
        .catch(() => { handled.current = false; setIsConfirming(false); element.querySelectorAll<HTMLButtonElement>("button, input[type=submit]").forEach((button) => { button.disabled = false; }); setError("Guardamos tu información, pero no pudimos validar el siguiente paso. Intenta nuevamente en unos segundos."); });
    };
    const observer = new MutationObserver(checkSuccess);
    observer.observe(element, { childList: true, subtree: true, attributes: true });
    element.addEventListener("submit", lockForm, true);
    checkSuccess();
    return () => {
      observer.disconnect();
      element.removeEventListener("submit", lockForm, true);
    };
  }, [campaign, thankYouPath]);
  return <>
    <p className="form-step" aria-live="polite">PASO 1 DE 2</p>
    <p className="form-instruction">Después de guardar tus datos pasarás al último paso: entrar al grupo oficial de WhatsApp.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    {isConfirming && <p className="form-status" role="status">Validando tu registro…</p>}
    <div ref={root} className={`${getActiveCampaignClassName(formId)} active-campaign-form`} aria-busy={isConfirming} />
    <Script id={`active-campaign-form-${formId}`} src={getActiveCampaignEmbedUrl(formId)} strategy="afterInteractive" charSet="utf-8" />
  </>;
}
