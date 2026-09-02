import { NextResponse } from "next/server.js";
import {
  createConfirmedRegistrationToken,
  REGISTRATION_COOKIE,
  THANK_YOU_ACCESS_COOKIE,
  verifyRegistrationToken,
  WHATSAPP_ACCESS_COOKIE,
} from "../../../../../../lib/registration.ts";

const CAMPAIGN_SLUG = "ia-maestros";
const WHATSAPP_ACCESS_SECONDS = 60 * 30;
const THANK_YOU_ACCESS_SECONDS = 60 * 60 * 24 * 30;

function getCookie(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function clearRegistrationCookie(response: NextResponse) {
  response.cookies.set(REGISTRATION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

function clearThankYouAccessCookie(response: NextResponse) {
  response.cookies.set(THANK_YOU_ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const trusted =
    origin === "https://ebiacapacitacion.com" ||
    origin === "http://localhost:3000" ||
    origin === "http://localhost:3001" ||
    origin === "http://127.0.0.1:3000" ||
    origin === "http://127.0.0.1:3001";
  if (!trusted) return NextResponse.json({ ok: false }, { status: 403 });

  const rawThankYouToken = getCookie(request, THANK_YOU_ACCESS_COOKIE);
  const thankYouToken = verifyRegistrationToken(rawThankYouToken);
  const validThankYouToken =
    thankYouToken?.landingSlug === CAMPAIGN_SLUG ? thankYouToken : null;

  const rawRegistrationToken = getCookie(request, REGISTRATION_COOKIE);
  const registrationToken = verifyRegistrationToken(rawRegistrationToken);
  const validRegistrationToken =
    registrationToken?.landingSlug === CAMPAIGN_SLUG ? registrationToken : null;

  // Una confirmación nueva tiene prioridad sobre una visita anterior guardada
  // en el mismo navegador; una simple recarga solo trae la cookie de Gracias.
  const token = validRegistrationToken ?? validThankYouToken;
  if (!token) {
    const response = NextResponse.json({ ok: false }, { status: 403 });
    clearRegistrationCookie(response);
    clearThankYouAccessCookie(response);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const isFirstConfirmation = Boolean(validRegistrationToken);
  const confirmedAccess = validRegistrationToken
    ? createConfirmedRegistrationToken(validRegistrationToken)
    : { value: rawThankYouToken!, maxAge: THANK_YOU_ACCESS_SECONDS };

  const response = NextResponse.json({
    ok: true,
    registrationId: token.registrationId,
    shouldTrackCompleteRegistration: isFirstConfirmation,
  });
  clearRegistrationCookie(response);
  response.cookies.set(THANK_YOU_ACCESS_COOKIE, confirmedAccess.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: confirmedAccess.maxAge,
    path: "/",
  });
  response.cookies.set(WHATSAPP_ACCESS_COOKIE, confirmedAccess.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: WHATSAPP_ACCESS_SECONDS,
    path: "/",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
