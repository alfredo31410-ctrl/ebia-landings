import type { Metadata } from "next";
import { TeacherThankYouPage } from "../TeacherThankYouPage";
import { getCampaign } from "@/lib/landings";

const campaign = getCampaign("ia-maestros");

export const metadata: Metadata = {
  title: `Último paso | ${campaign.seo.title}`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TeacherThankYouPage campaign={campaign} />;
}
