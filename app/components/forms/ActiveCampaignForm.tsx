"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ACTIVE_CAMPAIGN_ERROR_SELECTOR, ACTIVE_CAMPAIGN_SUCCESS_SELECTOR, getActiveCampaignClassName, getActiveCampaignEmbedUrl } from "@/lib/integrations/active-campaign";
import { resetTrackedMetaEvent } from "@/lib/integrations/meta-pixel";

type Props = { formId: string; campaign: string; metaContentName: string; thankYouPath: string };
const TIMEOUT_MS = 15_000;

export function ActiveCampaignForm({ formId, campaign, thankYouPath }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const nonce = useRef<string | null>(null);
  const handled = useRef(false);
  const submitted = useRef(false);
  const timeout = useRef<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // El nonce se solicita antes del envío y no contiene datos personales;
    // limita llamadas directas al endpoint durante una ventana corta.
    void fetch(`/api/registrations/nonce?landing=${encodeURIComponent(campaign)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((body: { ok?: boolean; nonce?: string }) => { if (!cancelled && body.ok && body.nonce) nonce.current = body.nonce; })
      .catch(() => { if (!cancelled) setError("No pudimos preparar el formulario. Revisa tu conexión e inténtalo nuevamente."); });
    return () => { cancelled = true; if (timeout.current) window.clearTimeout(timeout.current); };
  }, [campaign]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const controls = () => element.querySelectorAll<HTMLButtonElement>("button, input[type=submit]");
    const restore = (message: string) => {
      if (timeout.current) window.clearTimeout(timeout.current);
      handled.current = false; submitted.current = false; setIsConfirming(false); setError(message);
      controls().forEach((button) => { button.disabled = false; });
    };
    const lockForm = (event: Event) => {
      if (!nonce.current) { event.preventDefault(); restore("No pudimos preparar el formulario. Revisa tu conexión e inténtalo nuevamente."); return; }
      // El bloqueo del navegador reduce doble clics; la cookie y el nonce son
      // defensas adicionales porque el cliente nunca puede considerarse confiable.
      submitted.current = true; setError(null); setIsConfirming(true); resetTrackedMetaEvent("CompleteRegistration", campaign, "session");
      controls().forEach((button) => { button.disabled = true; });
      timeout.current = window.setTimeout(() => restore("No pudimos confirmar tu registro. Revisa tu conexión e inténtalo nuevamente."), TIMEOUT_MS);
    };
    const getAttribution = () => {
      const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "campaign_id", "adset_id", "ad_id", "placement", "fbclid", "event_id"];
      return Object.fromEntries([...keys, "landing_slug", "timestamp"].flatMap((key) => {
        const value = key === "landing_slug" ? campaign : key === "timestamp" ? new Date().toISOString() : new URLSearchParams(window.location.search).get(key);
        return value ? [[key, value]] : [];
      }));
    };
    const checkState = () => {
      const success = element.querySelector<HTMLElement>(ACTIVE_CAMPAIGN_SUCCESS_SELECTOR);
      const errorNode = element.querySelector<HTMLElement>(ACTIVE_CAMPAIGN_ERROR_SELECTOR);
      const visible = (node: HTMLElement | null) => !!node && getComputedStyle(node).display !== "none" && getComputedStyle(node).visibility !== "hidden" && node.getClientRects().length > 0;
      if (submitted.current && visible(errorNode) && !visible(success)) { restore("No pudimos confirmar tu registro. Revisa tu conexión e inténtalo nuevamente."); return; }
      if (!submitted.current || handled.current || !visible(success) || !nonce.current) return;
      handled.current = true;
      if (timeout.current) window.clearTimeout(timeout.current);
      // Este éxito procede del DOM de ActiveCampaign: permite continuar UX,
      // pero sigue siendo una señal de cliente pendiente de verificación fuerte.
      void fetch("/api/registrations/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ landingSlug: campaign, nonce: nonce.current, attribution: getAttribution() }) })
        .then(async (response) => { const body = await response.json().catch(() => ({})); if (!response.ok || !body.ok) throw new Error(); })
        .then(() => window.location.assign(thankYouPath))
        .catch(() => restore("No pudimos confirmar tu registro. Revisa tu conexión e inténtalo nuevamente."));
    };
    const observer = new MutationObserver(checkState);
    observer.observe(element, { childList: true, subtree: true, attributes: true });
    element.addEventListener("submit", lockForm, true);
    return () => { observer.disconnect(); element.removeEventListener("submit", lockForm, true); if (timeout.current) window.clearTimeout(timeout.current); };
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
