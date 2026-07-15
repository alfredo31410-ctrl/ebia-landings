import type { Metadata } from "next";
import { ThankYouPage } from "@/app/components/ThankYouPage";
import { getCampaign } from "@/lib/landings";
const campaign = getCampaign("ia-desde-cero");
export const metadata: Metadata = {
  title: `Último paso | ${campaign.seo.title}`,
  robots: { index: false, follow: false },
};
export default function Page() {
  return <ThankYouPage campaign={campaign} />;
}
