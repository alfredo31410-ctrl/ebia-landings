import { NextResponse } from "next/server";
import {
  REGISTRATION_COOKIE,
  verifyRegistrationToken,
  WHATSAPP_ACCESS_COOKIE,
} from "@/lib/registration";

const CAMPAIGN_SLUG = "ia-maestros";
const WHATSAPP_ACCESS_SECONDS = 60 * 30;

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

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const trusted =
    origin === "https://ebiacapacitacion.com" ||
    origin === "http://localhost:3000" ||
    origin === "http://localhost:3001" ||
    origin === "http://127.0.0.1:3000" ||
    origin === "http://127.0.0.1:3001";
  if (!trusted) return NextResponse.json({ ok: false }, { status: 403 });

  const rawToken = getCookie(request, REGISTRATION_COOKIE);
  const token = verifyRegistrationToken(rawToken);
  if (!rawToken || !token || token.landingSlug !== CAMPAIGN_SLUG) {
    const response = NextResponse.json({ ok: false }, { status: 403 });
    clearRegistrationCookie(response);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const response = NextResponse.json({
    ok: true,
    registrationId: token.registrationId,
  });
  clearRegistrationCookie(response);
  response.cookies.set(WHATSAPP_ACCESS_COOKIE, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: WHATSAPP_ACCESS_SECONDS,
    path: "/",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
