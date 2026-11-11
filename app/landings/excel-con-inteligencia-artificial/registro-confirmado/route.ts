import { NextResponse } from "next/server";
import { getCampaign } from "@/lib/landings";
import { getPublicOrigin } from "@/lib/public-origin";

const campaign = getCampaign("excel-con-inteligencia-artificial");

export function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/landings/excel-con-inteligencia-artificial/gracias", getPublicOrigin(request)), 303);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
