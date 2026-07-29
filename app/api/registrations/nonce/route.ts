import { NextResponse } from "next/server";
import { hasSafeRegistrationSecret } from "@/lib/env";
import { createRegistrationNonce, REGISTRATION_NONCE_COOKIE } from "@/lib/registration";

const MAX_BODY_BYTES = 2_048;
const sameOrigin = (request: Request) => request.headers.get("origin") === new URL(request.url).origin;

export async function POST(request: Request) {
  try {
    // El nonce reduce abuso casual, pero un cliente todavía puede solicitarlo
    // y llamar después a confirm; no certifica que AC guardó el contacto.
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
  } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
}
