import type { Metadata } from "next";
import { CorreosThankYouPage } from "./CorreosThankYouPage";
import { getCampaign } from "@/lib/landings";

const campaign = getCampaign("correos-profesionales-con-ia");

export const metadata: Metadata = {
  title: `Último paso | ${campaign.seo.title}`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CorreosThankYouPage campaign={campaign} />;
}
