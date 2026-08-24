import { handleCampaignWhatsAppRedirect } from "@/lib/registration-route-handlers";

export function GET(request: Request) {
  return handleCampaignWhatsAppRedirect(request, "ia-maestros");
}
