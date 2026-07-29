import { NextResponse } from "next/server";
import { createRegistrationNonce, REGISTRATION_NONCE_COOKIE } from "@/lib/registration";

export async function GET(request: Request) {
  const landing = new URL(request.url).searchParams.get("landing");
  if (landing !== "ia-desde-cero") return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const nonce = createRegistrationNonce(landing);
    const response = NextResponse.json({ ok: true, nonce: nonce.data.nonce });
    response.cookies.set(REGISTRATION_NONCE_COOKIE, nonce.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: nonce.maxAge, path: "/" });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch { return NextResponse.json({ ok: false }, { status: 503 }); }
}
