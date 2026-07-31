import { getCampaign, type CampaignSlug } from "./landings.ts";

export function getWhatsAppGroupUrl(slug: CampaignSlug) {
  const campaign = getCampaign(slug);
  const value = process.env[campaign.event.whatsappEnvKey];
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "chat.whatsapp.com" && url.pathname.length > 1 && !url.search && !url.hash ? url.toString() : null;
  } catch { return null; }
}
