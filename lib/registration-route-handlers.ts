import { NextResponse } from "next/server.js";
import { hasSafeRegistrationSecret } from "./env.ts";
import { getCampaign } from "./landings.ts";
import { createRegistrationNonce, REGISTRATION_COOKIE, REGISTRATION_NONCE_COOKIE, verifyRegistrationToken } from "./registration.ts";
import { getWhatsAppGroupUrl } from "./whatsapp.ts";

const MAX_BODY_BYTES = 2_048;
const ALLOWED_ORIGINS = new Set([
  "https://ebiacapacitacion.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
]);

const getAllowedOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  return origin && ALLOWED_ORIGINS.has(origin) ? origin : null;
};

const forbiddenResponse = () => {
  const response = NextResponse.json({ ok: false }, { status: 403 });
  response.headers.set("Vary", "Origin");
  return response;
};

const applyCorsHeaders = (response: Response, origin: string) => {
  // CORS devuelve un único origen exacto; nunca una lista separada por comas.
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Vary", "Origin");
  return response;
};

/** Emite el nonce del embudo sin aceptar landings arbitrarias. */
export async function handleRegistrationNonce(request: Request) {
  const origin = getAllowedOrigin(request);
  try {
    // El nonce reduce abuso casual, pero no certifica que ActiveCampaign guardó el contacto.
    if (!origin || request.headers.get("content-type")?.split(";")[0] !== "application/json" || !hasSafeRegistrationSecret()) return forbiddenResponse();
    if (Number(request.headers.get("content-length") || 0) > MAX_BODY_BYTES) return applyCorsHeaders(NextResponse.json({ ok: false }, { status: 413 }), origin);
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return applyCorsHeaders(NextResponse.json({ ok: false }, { status: 413 }), origin);
    const body = JSON.parse(rawBody) as { landing?: string };
    if (body.landing !== "ia-desde-cero") return NextResponse.json({ ok: false }, { status: 400 });
    const nonce = createRegistrationNonce(body.landing);
    const response = NextResponse.json({ ok: true, nonce: nonce.data.nonce, expiresAt: nonce.data.expiresAt });
    response.cookies.set(REGISTRATION_NONCE_COOKIE, nonce.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: nonce.maxAge, path: "/" });
    response.headers.set("Cache-Control", "no-store");
    return applyCorsHeaders(response, origin);
  } catch {
    const response = NextResponse.json({ ok: false }, { status: 400 });
    return origin ? applyCorsHeaders(response, origin) : response;
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
