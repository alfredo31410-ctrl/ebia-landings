"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { persistAttributionCookie } from "@/lib/attribution";
import { getActiveCampaignClassName, getActiveCampaignEmbedUrl } from "@/lib/integrations/active-campaign";
import {
  resetTrackedMetaEvent,
  trackMetaEventWhenReady,
} from "@/lib/integrations/meta-pixel";
import { requestRegistrationNonce, type RegistrationNonceResponse } from "@/lib/registration-client";

type Props = {
  formId: string;
  campaign: string;
  metaContentName: string;
  confirmationPath: string;
  showIntro?: boolean;
};
const NONCE_RENEWAL_MARGIN_MS = 45_000;

export function ActiveCampaignForm({
  formId,
  campaign,
  metaContentName,
  confirmationPath,
  showIntro = true,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const nonce = useRef<RegistrationNonceResponse | null>(null);
  const nonceRequest = useRef<Promise<RegistrationNonceResponse> | null>(null);
  const nonceTimer = useRef<number | undefined>(undefined);
  const nonceReady = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const syncControls = (disabled: boolean) => {
    root.current?.querySelectorAll<HTMLButtonElement>("button, input[type=submit]").forEach((control) => {
      control.disabled = disabled;
    });
  };

  const refreshNonce = () => {
    if (nonceRequest.current) return nonceRequest.current;
    setIsPreparing(true);
    nonceRequest.current = requestRegistrationNonce(campaign)
      .then((fresh) => {
        nonce.current = fresh;
        nonceReady.current = true;
        setError(null);
        return fresh;
      })
      .catch((reason) => {
        nonce.current = null;
        nonceReady.current = false;
        setError("No pudimos preparar el formulario. Revisa tu conexión e inténtalo nuevamente.");
        throw reason;
      })
      .finally(() => {
        setIsPreparing(false);
        nonceRequest.current = null;
      });
    return nonceRequest.current;
  };

  useEffect(() => {
    if (
      campaign === "ia-maestros" ||
      campaign === "correos-profesionales-con-ia"
    )
      persistAttributionCookie();
  }, [campaign]);

  useEffect(() => {
    const previousCallback = window._form_callback;
    const redirectAfterSuccess = (id: string) => {
      previousCallback?.(id);
      const submittedForm = document.getElementById(`_form_${id}_`);
      if (!submittedForm || !root.current?.contains(submittedForm)) return;
      window.location.assign(confirmationPath);
    };
    window._form_callback = redirectAfterSuccess;
    return () => {
      if (window._form_callback === redirectAfterSuccess)
        window._form_callback = previousCallback;
    };
  }, [confirmationPath]);

  useEffect(() => {
    const scheduleRenewal = () => {
      if (nonceTimer.current) window.clearTimeout(nonceTimer.current);
      if (!nonce.current) return;
      const delay = Math.max(1_000, new Date(nonce.current.expiresAt).getTime() - Date.now() - NONCE_RENEWAL_MARGIN_MS);
      nonceTimer.current = window.setTimeout(() => { void refreshNonce().then(scheduleRenewal).catch(() => undefined); }, delay);
    };
    void refreshNonce().then(scheduleRenewal).catch(() => undefined);
    return () => { if (nonceTimer.current) window.clearTimeout(nonceTimer.current); };
  }, [campaign]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const applyState = () => syncControls(isPreparing || isSubmitting || !nonceReady.current);
    const lockForm = (event: Event) => {
      const current = nonce.current;
      if (!current || new Date(current.expiresAt).getTime() <= Date.now()) {
        event.preventDefault();
        nonceReady.current = false;
        setError("No pudimos preparar el formulario. Revisa tu conexión e inténtalo nuevamente.");
        void refreshNonce().catch(() => undefined);
        return;
      }
      // El nonce ya está firmado por el servidor; ActiveCampaign controla el envío
      // y su redirección posterior hacia registro-confirmado.
      if (
        campaign === "ia-maestros" ||
        campaign === "correos-profesionales-con-ia"
      )
        persistAttributionCookie();
      trackMetaEventWhenReady(
        "RegistrationStart",
        campaign,
        {
          content_name: metaContentName,
          content_category: "Formulario ActiveCampaign",
          trigger: "form_submit",
        },
        "session",
      );
      setError(null);
      setIsSubmitting(true);
      resetTrackedMetaEvent("CompleteRegistration", campaign, "session");
      applyState();
    };
    const observer = new MutationObserver(applyState);
    observer.observe(element, { childList: true, subtree: true });
    element.addEventListener("submit", lockForm, true);
    applyState();
    return () => { observer.disconnect(); element.removeEventListener("submit", lockForm, true); };
  }, [campaign, isPreparing, isSubmitting, metaContentName]);

  return <>
    {showIntro && <><p className="form-step" aria-live="polite">PASO 1 DE 2</p>
    <p className="form-instruction">Después de guardar tus datos pasarás al último paso: entrar al grupo oficial de WhatsApp.</p></>}
    {error && <><p className="form-error" role="alert">{error}</p><button className="form-retry" type="button" onClick={() => void refreshNonce().catch(() => undefined)} disabled={isPreparing}>REINTENTAR PREPARACIÓN</button></>}
    {isSubmitting && <p className="form-status" role="status">Procesando tu registro…</p>}
    <div ref={root} className={`${getActiveCampaignClassName(formId)} active-campaign-form`} aria-busy={isPreparing || isSubmitting} />
    <Script id={`active-campaign-form-${formId}`} src={getActiveCampaignEmbedUrl(formId)} strategy="afterInteractive" charSet="utf-8" />
  </>;
}
