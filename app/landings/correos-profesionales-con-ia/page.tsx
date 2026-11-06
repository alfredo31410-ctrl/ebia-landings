import { CorreosLandingPage } from "./CorreosLandingPage";
import { getCampaign } from "@/lib/landings";

const campaign = getCampaign("correos-profesionales-con-ia");

export const metadata = campaign.seo;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ registro?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <CorreosLandingPage
      campaign={campaign}
      registrationError={params.registro === "confirmacion_invalida"}
    />
  );
}
