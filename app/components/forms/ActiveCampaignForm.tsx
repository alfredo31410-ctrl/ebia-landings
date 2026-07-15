"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { ACTIVE_CAMPAIGN_SUCCESS_SELECTOR, getActiveCampaignClassName, getActiveCampaignEmbedUrl } from "@/lib/integrations/active-campaign";
import { trackMetaEvent } from "@/lib/integrations/meta-pixel";

type Props = { formId: string; campaign: string; metaContentName: string; thankYouPath: string };

export function ActiveCampaignForm({ formId, campaign, metaContentName, thankYouPath }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const handled = useRef(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const checkSuccess = () => {
      const success = element.querySelector<HTMLElement>(ACTIVE_CAMPAIGN_SUCCESS_SELECTOR);
      if (!success) return;
      const style = window.getComputedStyle(success);
      const visible = style.display !== "none" && style.visibility !== "hidden" && success.getClientRects().length > 0;
      if (handled.current || !visible) return;
      handled.current = true;
      trackMetaEvent("CompleteRegistration", campaign, {
        content_name: metaContentName,
        content_category: "Formulario ActiveCampaign",
        status: "completed",
        value: 0,
        currency: "MXN",
      });
      window.setTimeout(() => window.location.assign(thankYouPath), 150);
    };
    const observer = new MutationObserver(checkSuccess);
    observer.observe(element, { childList: true, subtree: true, attributes: true });
    checkSuccess();
    return () => observer.disconnect();
  }, [campaign, metaContentName, thankYouPath]);
  return <><div ref={root} className={`${getActiveCampaignClassName(formId)} active-campaign-form`} /><Script id={`active-campaign-form-${formId}`} src={getActiveCampaignEmbedUrl(formId)} strategy="afterInteractive" charSet="utf-8" /></>;
}
