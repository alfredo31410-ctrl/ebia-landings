import { NextResponse } from "next/server.js";
import { getCampaign, getEventStatus } from "../../../../lib/landings.ts";
import { createRegistrationToken, getRegistrationNonceStatus, REGISTRATION_COOKIE, REGISTRATION_NONCE_COOKIE, sanitizeAttribution, verifyRegistrationNonce } from "../../../../lib/registration.ts";
import { getPublicOrigin } from "../../../../lib/public-origin.ts";

const campaign = getCampaign("ia-desde-cero");

function cookieValue(request: Request, name: string) {
  return request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

function invalidRedirect(request: Request) {
  const response = NextResponse.redirect(new URL("/landings/ia-desde-cero?registro=confirmacion_invalida", getPublicOrigin(request)), 303);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function GET(request: Request) {
  const nonceCookie = cookieValue(request, REGISTRATION_NONCE_COOKIE);
  const status = getRegistrationNonceStatus(nonceCookie, campaign.slug);
  const nonce = verifyRegistrationNonce(nonceCookie, campaign.slug);

  if (!nonce || status !== "valid" || getEventStatus(campaign) !== "registration_open") return invalidRedirect(request);

  // ActiveCampaign ya confirmó el registro; aquí solo convertimos el nonce
  // firmado en la cookie temporal que habilita la página de gracias.
  const attribution = sanitizeAttribution(Object.fromEntries(new URL(request.url).searchParams.entries()));
  const token = createRegistrationToken(campaign.slug, attribution);
  const response = NextResponse.redirect(new URL("/landings/ia-desde-cero/gracias", getPublicOrigin(request)), 303);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.cookies.set(REGISTRATION_COOKIE, token.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: token.maxAge, path: "/" });
  response.cookies.set(REGISTRATION_NONCE_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 0, path: "/" });
  return response;
}
