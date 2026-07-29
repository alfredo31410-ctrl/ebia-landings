import { NextResponse } from "next/server";
import { createRegistrationToken, sanitizeAttribution, REGISTRATION_COOKIE } from "@/lib/registration";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { landingSlug?: string; attribution?: Record<string, unknown> };
    if (body.landingSlug !== "ia-desde-cero") return NextResponse.json({ ok: false }, { status: 400 });
    // La cookie httpOnly limita gracias a una confirmación emitida por el servidor,
    // y evita que datos personales o UTMs viajen en la URL.
    const token = createRegistrationToken(body.landingSlug, sanitizeAttribution(body.attribution || {}));
    const response = NextResponse.json({ ok: true, registrationId: token.data.registrationId });
    response.cookies.set(REGISTRATION_COOKIE, token.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: token.maxAge, path: "/" });
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: "No se pudo validar el registro." }, { status: 503 });
  }
}
