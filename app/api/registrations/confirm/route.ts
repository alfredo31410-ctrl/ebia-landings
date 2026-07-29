import { NextResponse } from "next/server";
import { getCampaign, getEventStatus } from "@/lib/landings";
import { createRegistrationToken, REGISTRATION_COOKIE, REGISTRATION_NONCE_COOKIE, sanitizeAttribution, verifyRegistrationNonce } from "@/lib/registration";

const MAX_BODY_BYTES = 16_384;

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    // El embed solo aporta una señal visual de éxito; estas defensas reducen
    // llamadas arbitrarias, pero no convierten la confirmación en una consulta
    // server-side a ActiveCampaign. Esa limitación queda pendiente hasta contar
    // con API, webhook o una correlación verificable del formulario 297.
    if (request.headers.get("content-type")?.split(";")[0] !== "application/json" || !sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });
    const body = JSON.parse(rawBody) as { landingSlug?: string; nonce?: string; attribution?: Record<string, unknown> };
    const campaign = body.landingSlug === "ia-desde-cero" ? getCampaign("ia-desde-cero") : null;
    const nonceCookie = request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${REGISTRATION_NONCE_COOKIE}=`))?.slice(REGISTRATION_NONCE_COOKIE.length + 1);
    const nonce = verifyRegistrationNonce(nonceCookie, "ia-desde-cero");
    if (!campaign || !body.nonce || !nonce || body.nonce !== nonce.nonce || getEventStatus(campaign) !== "registration_open") return NextResponse.json({ ok: false }, { status: 400 });
    const token = createRegistrationToken(campaign.slug, sanitizeAttribution(body.attribution || {}));
    const response = NextResponse.json({ ok: true, registrationId: token.data.registrationId });
    response.cookies.set(REGISTRATION_COOKIE, token.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: token.maxAge, path: "/" });
    // Sin persistencia no podemos marcar consumo atómico entre dispositivos;
    // borrar la cookie sí evita el replay normal del mismo navegador.
    response.cookies.set(REGISTRATION_NONCE_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 0, path: "/" });
    return response;
  } catch { return NextResponse.json({ ok: false, message: "No se pudo validar el registro." }, { status: 400 }); }
}
