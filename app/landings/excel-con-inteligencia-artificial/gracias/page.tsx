import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThankYouPage } from "@/app/components/ThankYouPage";
import { getCampaign } from "@/lib/landings";
import { REGISTRATION_COOKIE, verifyRegistrationToken } from "@/lib/registration";

const campaign = getCampaign("excel-con-inteligencia-artificial");

export const metadata: Metadata = {
  title: `Último paso | ${campaign.seo.title}`,
  robots: { index: false, follow: false },
};

export default async function Page() {
  const token = verifyRegistrationToken((await cookies()).get(REGISTRATION_COOKIE)?.value);
  return <ThankYouPage campaign={campaign} registration={token?.landingSlug === campaign.slug ? token : null} />;
}
