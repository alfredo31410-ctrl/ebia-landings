import { NextResponse } from "next/server";
import { createConfirmedRegistrationToken, REGISTRATION_COOKIE, THANK_YOU_ACCESS_COOKIE, verifyRegistrationToken } from "../../../../../../lib/registration";

const slug = "libro-con-ia";
const getCookie = (request: Request, name: string) => request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
const options = (maxAge: number) => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge, path: "/" });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin?.match(/^https:\/\/ebiacapacitacion\.com$|^http:\/\/(localhost|127\.0\.0\.1):300[0-2]$/)) return NextResponse.json({ ok: false }, { status: 403 });
  const fresh = verifyRegistrationToken(getCookie(request, REGISTRATION_COOKIE));
  const previous = verifyRegistrationToken(getCookie(request, THANK_YOU_ACCESS_COOKIE));
  const token = fresh?.landingSlug === slug ? fresh : previous?.landingSlug === slug ? previous : null;
  if (!token) return NextResponse.json({ ok: false }, { status: 403 });
  const response = NextResponse.json({ ok: true, registrationId: token.registrationId, shouldTrackCompleteRegistration: Boolean(fresh?.landingSlug === slug) });
  response.cookies.set(REGISTRATION_COOKIE, "", options(0));
  const confirmed = fresh?.landingSlug === slug ? createConfirmedRegistrationToken(fresh) : { value: getCookie(request, THANK_YOU_ACCESS_COOKIE)!, maxAge: 60 * 60 * 24 * 30 };
  response.cookies.set(THANK_YOU_ACCESS_COOKIE, confirmed.value, options(confirmed.maxAge));
  return response;
}
