import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThankYouPage } from "@/app/components/ThankYouPage";
import { getCampaign } from "@/lib/landings";
import { REGISTRATION_COOKIE, verifyRegistrationToken } from "@/lib/registration";
const campaign = getCampaign("ia-desde-cero");
export const metadata: Metadata = {
  title: `Último paso | ${campaign.seo.title}`,
  robots: { index: false, follow: false },
};
export default async function Page() {
  const token = (await cookies()).get(REGISTRATION_COOKIE)?.value;
  const registration = verifyRegistrationToken(token);
  return <ThankYouPage campaign={campaign} registration={registration?.landingSlug === campaign.slug ? registration : null} />;
}
