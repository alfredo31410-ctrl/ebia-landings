import { TeacherLandingPage } from "./TeacherLandingPage";
import { getCampaign } from "@/lib/landings";

const campaign = getCampaign("ia-maestros");
export const metadata = campaign.seo;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ registro?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <TeacherLandingPage
      campaign={campaign}
      registrationError={params.registro === "confirmacion_invalida"}
    />
  );
}
