import { LandingPage } from "@/app/components/LandingPage";
import { getCampaign } from "@/lib/landings";
const campaign = getCampaign("ia-desde-cero");
export const metadata = campaign.seo;
export default async function Page({ searchParams }: { searchParams: Promise<{ registro?: string | string[] }> }) {
  const params = await searchParams;
  return (
    <>
      <LandingPage campaign={campaign} registrationError={params.registro === "confirmacion_invalida"} />
    </>
  );
}
