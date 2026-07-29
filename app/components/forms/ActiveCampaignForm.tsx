"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ACTIVE_CAMPAIGN_ERROR_SELECTOR, ACTIVE_CAMPAIGN_SUCCESS_SELECTOR, getActiveCampaignClassName, getActiveCampaignEmbedUrl } from "@/lib/integrations/active-campaign";
import { resetTrackedMetaEvent } from "@/lib/integrations/meta-pixel";
import { requestRegistrationNonce, type RegistrationNonceResponse } from "@/lib/registration-client";

type Props = { formId: string; campaign: string; metaContentName: string; thankYouPath: string };
const TIMEOUT_MS = 15_000;
const NONCE_RENEWAL_MARGIN_MS = 45_000;

export function ActiveCampaignForm({ formId, campaign, thankYouPath }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const nonce = useRef<RegistrationNonceResponse | null>(null);
  const nonceRequest = useRef<Promise<RegistrationNonceResponse> | null>(null);
  const nonceTimer = useRef<number | undefined>(undefined);
  const handled = useRef(false);
  const submitted = useRef(false);
  const timeout = useRef<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const refreshNonce = () => {
    if (nonceRequest.current) return nonceRequest.current;
    nonceRequest.current = requestRegistrationNonce(campaign).then((fresh) => { nonce.current = fresh; return fresh; }).finally(() => { nonceRequest.current = null; });
    return nonceRequest.current;
  };

  useEffect(() => {
    let cancelled = false;
    const scheduleRenewal = () => {
      if (nonceTimer.current) window.clearTimeout(nonceTimer.current);
      if (!nonce.current) return;
      const delay = Math.max(1_000, new Date(nonce.current.expiresAt).getTime() - Date.now() - NONCE_RENEWAL_MARGIN_MS);
      nonceTimer.current = window.setTimeout(() => { void refreshNonce().then(scheduleRenewal).catch(() => undefined); }, delay);
    };
    // La renovación conserva la continuidad de UX sin transformar el éxito
    // visual del embed en una validación server-side de ActiveCampaign.
    void refreshNonce().then(scheduleRenewal).catch(() => { if (!cancelled) setError("No pudimos preparar el formulario. Revisa tu conexión e inténtalo nuevamente."); });
    return () => { cancelled = true; if (nonceTimer.current) window.clearTimeout(nonceTimer.current); if (timeout.current) window.clearTimeout(timeout.current); };
  }, [campaign]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const controls = () => element.querySelectorAll<HTMLButtonElement>("button, input[type=submit]");
    const restore = (message: string) => {
      if (timeout.current) window.clearTimeout(timeout.current);
      handled.current = false; submitted.current = false; setIsConfirming(false); setError(message); controls().forEach((button) => { button.disabled = false; });
      // Al recuperar un error se pide un nonce fresco para el siguiente intento.
      void refreshNonce().catch(() => undefined);
    };
    const lockForm = (event: Event) => {
      if (!nonce.current || new Date(nonce.current.expiresAt).getTime() <= Date.now()) { event.preventDefault(); void refreshNonce().catch(() => undefined); setError("No pudimos preparar el formulario. Revisa tu conexión e inténtalo nuevamente."); return; }
      // El bloqueo del cliente evita doble clic, pero no sustituye cookie/nonce.
      submitted.current = true; setError(null); setIsConfirming(true); resetTrackedMetaEvent("CompleteRegistration", campaign, "session"); controls().forEach((button) => { button.disabled = true; }); timeout.current = window.setTimeout(() => restore("No pudimos confirmar tu registro. Revisa tu conexión e inténtalo nuevamente."), TIMEOUT_MS);
    };
    const getAttribution = () => {
      const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "campaign_id", "adset_id", "ad_id", "placement", "fbclid", "event_id"];
      return Object.fromEntries([...keys, "landing_slug", "timestamp"].flatMap((key) => { const value = key === "landing_slug" ? campaign : key === "timestamp" ? new Date().toISOString() : new URLSearchParams(window.location.search).get(key); return value ? [[key, value]] : []; }));
    };
    const confirmRegistration = async () => {
      const submit = async (nonceValue: string) => { const response = await fetch("/api/registrations/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ landingSlug: campaign, nonce: nonceValue, attribution: getAttribution() }) }); const body = await response.json().catch(() => ({})) as { ok?: boolean; code?: string }; return { response, body }; };
      if (!nonce.current) throw new Error("nonce_unavailable");
      let result = await submit(nonce.current.nonce);
      if (!result.body.ok && result.body.code === "nonce_expired") { const fresh = await refreshNonce(); result = await submit(fresh.nonce); }
      if (!result.response.ok || !result.body.ok) throw new Error("confirmation_failed");
    };
    const checkState = () => {
      const success = element.querySelector<HTMLElement>(ACTIVE_CAMPAIGN_SUCCESS_SELECTOR);
      const errorNode = element.querySelector<HTMLElement>(ACTIVE_CAMPAIGN_ERROR_SELECTOR);
      const visible = (node: HTMLElement | null) => !!node && getComputedStyle(node).display !== "none" && getComputedStyle(node).visibility !== "hidden" && node.getClientRects().length > 0;
      if (submitted.current && visible(errorNode) && !visible(success)) { restore("No pudimos confirmar tu registro. Revisa tu conexión e inténtalo nuevamente."); return; }
      if (!submitted.current || handled.current || !visible(success) || !nonce.current) return;
      handled.current = true; if (timeout.current) window.clearTimeout(timeout.current);
      // Este éxito sigue siendo una señal cliente; el endpoint exige nonce.
      void confirmRegistration().then(() => window.location.assign(thankYouPath)).catch(() => restore("No pudimos confirmar tu registro. Revisa tu conexión e inténtalo nuevamente."));
    };
    const observer = new MutationObserver(checkState); observer.observe(element, { childList: true, subtree: true, attributes: true }); element.addEventListener("submit", lockForm, true);
    return () => { observer.disconnect(); element.removeEventListener("submit", lockForm, true); if (timeout.current) window.clearTimeout(timeout.current); };
  }, [campaign, thankYouPath]);

  return <><p className="form-step" aria-live="polite">PASO 1 DE 2</p><p className="form-instruction">Después de guardar tus datos pasarás al último paso: entrar al grupo oficial de WhatsApp.</p>{error && <p className="form-error" role="alert">{error}</p>}{isConfirming && <p className="form-status" role="status">Validando tu registro…</p>}<div ref={root} className={`${getActiveCampaignClassName(formId)} active-campaign-form`} aria-busy={isConfirming} /><Script id={`active-campaign-form-${formId}`} src={getActiveCampaignEmbedUrl(formId)} strategy="afterInteractive" charSet="utf-8" /></>;
}
