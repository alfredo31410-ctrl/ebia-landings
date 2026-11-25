import { NextResponse } from "next/server";
import { createRegistrationToken, REGISTRATION_COOKIE, REGISTRATION_NONCE_COOKIE, sanitizeAttribution, verifyRegistrationNonce } from "../../../../lib/registration";
import { getPublicOrigin } from "../../../../lib/public-origin";

const slug = "libro-con-ia";
const cookie = (request: Request, name: string) => request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);

export function GET(request: Request) {
  const nonce = verifyRegistrationNonce(cookie(request, REGISTRATION_NONCE_COOKIE), slug);
  const target = nonce ? "/landings/libro-con-ia/gracias" : "/landings/libro-con-ia?registro=confirmacion_invalida";
  const response = NextResponse.redirect(new URL(target, getPublicOrigin(request)), 303);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  if (nonce) {
    const token = createRegistrationToken(slug, sanitizeAttribution({ ...Object.fromEntries(new URL(request.url).searchParams), landing_slug: slug, timestamp: new Date().toISOString() }));
    response.cookies.set(REGISTRATION_COOKIE, token.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: token.maxAge, path: "/" });
  }
  response.cookies.set(REGISTRATION_NONCE_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 0, path: "/" });
  return response;
}
