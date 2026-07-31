import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCampaign } from "@/lib/landings";
import { REGISTRATION_COOKIE, verifyRegistrationToken } from "@/lib/registration";
import { getWhatsAppGroupUrl } from "@/lib/whatsapp";

export async function GET(request: Request) {
  const campaign = getCampaign("ia-desde-cero");
  const token = verifyRegistrationToken((await cookies()).get(REGISTRATION_COOKIE)?.value);
  const target = getWhatsAppGroupUrl(campaign.slug);
  if (!token || token.landingSlug !== campaign.slug || !target) return NextResponse.json({ ok: false }, { status: 403 });
  // El destino se obtiene solo del servidor y nunca de query params, evitando
  // que esta ruta se convierta en un open redirect.
  return NextResponse.redirect(target, { headers: { "Cache-Control": "no-store" } });
}
