import { LandingPage } from "@/app/components/LandingPage";
import { getCampaign } from "@/lib/landings";

const campaign = getCampaign("excel-con-inteligencia-artificial");

export const metadata = campaign.seo;

export default function Page() {
  return <LandingPage campaign={campaign} />;
}
