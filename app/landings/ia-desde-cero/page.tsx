import { LandingPage } from "@/app/components/LandingPage";
import { getCampaign, getEventStatus } from "@/lib/landings";
const campaign = getCampaign("ia-desde-cero");
export const metadata = campaign.seo;
export default function Page() {
  return (
    <>
      <LandingPage campaign={campaign} status={getEventStatus(campaign)} />
    </>
  );
}
