import { getCampaign, type CampaignSlug } from "./landings.ts";

// Excepción autorizada para que el equipo pueda administrar este destino desde
// GitHub. La variable de entorno conserva prioridad cuando esté configurada.
const DEFAULT_WHATSAPP_GROUPS: Partial<Record<CampaignSlug, string>> = {
  "ia-maestros": "https://chat.whatsapp.com/LuSN8t1GP9C6RgFXDKeoT2",
};

export function getWhatsAppGroupUrl(slug: CampaignSlug) {
  const campaign = getCampaign(slug);
  const value =
    process.env[campaign.event.whatsappEnvKey] ?? DEFAULT_WHATSAPP_GROUPS[slug];
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "chat.whatsapp.com" && url.pathname.length > 1 && !url.search && !url.hash ? url.toString() : null;
  } catch { return null; }
}
