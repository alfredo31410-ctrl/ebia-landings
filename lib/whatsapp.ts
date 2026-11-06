import { getCampaign, type CampaignSlug } from "./landings.ts";
import { getLandingWhatsAppConfig } from "./whatsapp-config.ts";
import { normalizeWhatsAppGroupUrl } from "./whatsapp-url.ts";

export function getLegacyWhatsAppGroupUrl(slug: CampaignSlug) {
  const campaign = getCampaign(slug);
  const value = campaign.event.whatsappEnvKey
    ? process.env[campaign.event.whatsappEnvKey]
    : undefined;
  return normalizeWhatsAppGroupUrl(value);
}

export async function getWhatsAppGroupUrl(slug: CampaignSlug) {
  const configured = normalizeWhatsAppGroupUrl(
    getLandingWhatsAppConfig(slug).whatsappGroupUrl,
  );
  return configured ?? getLegacyWhatsAppGroupUrl(slug);
}
