import { NextResponse } from "next/server.js";
import { ATTRIBUTION_COOKIE } from "../../../../lib/attribution.ts";
import { getCampaign, getEventStatus } from "../../../../lib/landings.ts";
import {
  createRegistrationToken,
  getRegistrationNonceStatus,
  REGISTRATION_COOKIE,
  REGISTRATION_NONCE_COOKIE,
  sanitizeAttribution,
  verifyRegistrationNonce,
} from "../../../../lib/registration.ts";
import { getPublicOrigin } from "../../../../lib/public-origin.ts";

const campaign = getCampaign("ia-maestros");

function cookieValue(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function storedAttribution(request: Request) {
  const value = cookieValue(request, ATTRIBUTION_COOKIE);
  if (!value) return {};
  try {
    return JSON.parse(decodeURIComponent(value)) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function clearTemporaryCookies(response: NextResponse) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
  response.cookies.set(REGISTRATION_NONCE_COOKIE, "", options);
  response.cookies.set(ATTRIBUTION_COOKIE, "", {
    ...options,
    httpOnly: false,
  });
}

function invalidRedirect(request: Request) {
  const response = NextResponse.redirect(
    new URL(
      "/landings/ia-maestros?registro=confirmacion_invalida",
      getPublicOrigin(request),
    ),
    303,
  );
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  clearTemporaryCookies(response);
  return response;
}

export async function handleTeacherConfirmedRegistration(
  request: Request,
  now = new Date(),
) {
  const nonceCookie = cookieValue(request, REGISTRATION_NONCE_COOKIE);
  const status = getRegistrationNonceStatus(nonceCookie, campaign.slug);
  const nonce = verifyRegistrationNonce(nonceCookie, campaign.slug);

  if (
    !nonce ||
    status !== "valid" ||
    getEventStatus(campaign, now) !== "registration_open"
  ) {
    return invalidRedirect(request);
  }

  const attribution = sanitizeAttribution({
    ...storedAttribution(request),
    ...Object.fromEntries(new URL(request.url).searchParams.entries()),
    landing_slug: campaign.slug,
    timestamp: new Date().toISOString(),
  });
  const token = createRegistrationToken(campaign.slug, attribution);
  const response = NextResponse.redirect(
    new URL("/landings/ia-maestros/gracias", getPublicOrigin(request)),
    303,
  );
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.cookies.set(REGISTRATION_COOKIE, token.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: token.maxAge,
    path: "/",
  });
  clearTemporaryCookies(response);
  return response;
}

export function GET(request: Request) {
  return handleTeacherConfirmedRegistration(request);
}
