import { NextResponse } from "next/server.js";
import { hasSafeRegistrationSecret } from "./env.ts";
import { getCampaign } from "./landings.ts";
import { createRegistrationNonce, REGISTRATION_COOKIE, REGISTRATION_NONCE_COOKIE, verifyRegistrationToken } from "./registration.ts";
import { getWhatsAppGroupUrl } from "./whatsapp.ts";

const MAX_BODY_BYTES = 2_048;
const sameOrigin = (request: Request) => request.headers.get("origin") === new URL(request.url).origin;

/** Emite el nonce del embudo sin aceptar landings arbitrarias. */
export async function handleRegistrationNonce(request: Request) {
  try {
    // El nonce reduce abuso casual, pero no certifica que ActiveCampaign guardó el contacto.
    if (request.headers.get("content-type")?.split(";")[0] !== "application/json" || !sameOrigin(request) || !hasSafeRegistrationSecret()) return NextResponse.json({ ok: false }, { status: 403 });
    if (Number(request.headers.get("content-length") || 0) > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });
    const body = JSON.parse(rawBody) as { landing?: string };
    if (body.landing !== "ia-desde-cero") return NextResponse.json({ ok: false }, { status: 400 });
    const nonce = createRegistrationNonce(body.landing);
    const response = NextResponse.json({ ok: true, nonce: nonce.data.nonce, expiresAt: nonce.data.expiresAt });
    response.cookies.set(REGISTRATION_NONCE_COOKIE, nonce.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: nonce.maxAge, path: "/" });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

const getCookie = (request: Request, name: string) => request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);

/** Redirige al destino configurado en servidor; nunca acepta un destino por query string. */
export async function handleWhatsAppRedirect(request: Request) {
  const campaign = getCampaign("ia-desde-cero");
  const token = verifyRegistrationToken(getCookie(request, REGISTRATION_COOKIE));
  const target = getWhatsAppGroupUrl(campaign.slug);
  if (!token || token.landingSlug !== campaign.slug || !target) return NextResponse.json({ ok: false }, { status: 403 });
  return NextResponse.redirect(target, { headers: { "Cache-Control": "no-store" } });
}
