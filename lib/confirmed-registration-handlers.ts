import { NextResponse } from "next/server.js";
import { ATTRIBUTION_COOKIE } from "./attribution.ts";
import { getCampaign, getEventStatus } from "./landings.ts";
import {
  createRegistrationToken,
  getRegistrationNonceStatus,
  REGISTRATION_COOKIE,
  REGISTRATION_NONCE_COOKIE,
  sanitizeAttribution,
  verifyRegistrationNonce,
} from "./registration.ts";
import { getPublicOrigin } from "./public-origin.ts";

function cookieValue(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
}

export async function handleConfirmedRegistration(
  request: Request,
  now = new Date(),
) {
  const campaign = getCampaign("ia-desde-cero");
  const nonceCookie = cookieValue(request, REGISTRATION_NONCE_COOKIE);
  const status = getRegistrationNonceStatus(nonceCookie, campaign.slug);
  const nonce = verifyRegistrationNonce(nonceCookie, campaign.slug);

  if (
    !nonce ||
    status !== "valid" ||
    getEventStatus(campaign, now) !== "registration_open"
  ) {
    const response = NextResponse.redirect(
      new URL(
        "/landings/ia-desde-cero?registro=confirmacion_invalida",
        getPublicOrigin(request),
      ),
      303,
    );
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const attribution = sanitizeAttribution(
    Object.fromEntries(new URL(request.url).searchParams.entries()),
  );
  const token = createRegistrationToken(campaign.slug, attribution);
  const response = NextResponse.redirect(
    new URL("/landings/ia-desde-cero/gracias", getPublicOrigin(request)),
    303,
  );
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.cookies.set(
    REGISTRATION_COOKIE,
    token.value,
    cookieOptions(token.maxAge),
  );
  response.cookies.set(REGISTRATION_NONCE_COOKIE, "", cookieOptions(0));
  return response;
}

function teacherAttribution(request: Request) {
  const value = cookieValue(request, ATTRIBUTION_COOKIE);
  if (!value) return {};
  try {
    return JSON.parse(decodeURIComponent(value)) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function clearTeacherTemporaryCookies(response: NextResponse) {
  response.cookies.set(REGISTRATION_NONCE_COOKIE, "", cookieOptions(0));
  response.cookies.set(ATTRIBUTION_COOKIE, "", {
    ...cookieOptions(0),
    httpOnly: false,
  });
}

export async function handleTeacherConfirmedRegistration(
  request: Request,
  now = new Date(),
) {
  const campaign = getCampaign("ia-maestros");
  const nonceCookie = cookieValue(request, REGISTRATION_NONCE_COOKIE);
  const status = getRegistrationNonceStatus(nonceCookie, campaign.slug);
  const nonce = verifyRegistrationNonce(nonceCookie, campaign.slug);

  if (
    !nonce ||
    status !== "valid" ||
    getEventStatus(campaign, now) !== "registration_open"
  ) {
    const response = NextResponse.redirect(
      new URL(
        "/landings/ia-maestros?registro=confirmacion_invalida",
        getPublicOrigin(request),
      ),
      303,
    );
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    clearTeacherTemporaryCookies(response);
    return response;
  }

  const attribution = sanitizeAttribution({
    ...teacherAttribution(request),
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
  response.cookies.set(
    REGISTRATION_COOKIE,
    token.value,
    cookieOptions(token.maxAge),
  );
  clearTeacherTemporaryCookies(response);
  return response;
}
