import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TeacherWhatsAppRedirectPage } from "../TeacherWhatsAppRedirectPage";
import { getCampaign } from "@/lib/landings";
import {
  verifyRegistrationToken,
  WHATSAPP_ACCESS_COOKIE,
} from "@/lib/registration";
import { getWhatsAppGroupUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Acceso a WhatsApp | IA para Maestros",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const campaign = getCampaign("ia-maestros");
  const token = verifyRegistrationToken(
    (await cookies()).get(WHATSAPP_ACCESS_COOKIE)?.value,
  );
  const registration = token?.landingSlug === campaign.slug ? token : null;

  return (
    <TeacherWhatsAppRedirectPage
      campaign={campaign}
      registration={registration}
      whatsappConfigured={Boolean(getWhatsAppGroupUrl(campaign.slug))}
    />
  );
}
