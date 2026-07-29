import type { Metadata } from "next";
import { cookies } from "next/headers";
import { WhatsAppRedirectPage } from "@/app/components/WhatsAppRedirectPage";
import { getCampaign } from "@/lib/landings";
import { REGISTRATION_COOKIE, verifyRegistrationToken } from "@/lib/registration";
import { getWhatsAppGroupUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Acceso a WhatsApp | IA desde cero", robots: { index: false, follow: false } };

export default async function Page() {
  const campaign = getCampaign("ia-desde-cero");
  const token = verifyRegistrationToken((await cookies()).get(REGISTRATION_COOKIE)?.value);
  const registration = token?.landingSlug === campaign.slug ? token : null;
  return <WhatsAppRedirectPage campaign={campaign} registration={registration} whatsappConfigured={Boolean(getWhatsAppGroupUrl())} />;
}
