import { NextResponse } from "next/server.js";
import {
  isTareasRegistrationId,
  TAREAS_REGISTRATION_COOKIE,
  TAREAS_THANK_YOU_COOKIE,
  TAREAS_WHATSAPP_COOKIE,
} from "../../../../../../lib/tareas-registration.ts";

const ALLOWED_ORIGINS = new Set([
  "https://ebiacapacitacion.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
]);
const THANK_YOU_SECONDS = 60 * 60 * 24 * 30;
const WHATSAPP_SECONDS = 60 * 30;

function cookieValue(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
}

export function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const pending = cookieValue(request, TAREAS_REGISTRATION_COOKIE);
  const previous = cookieValue(request, TAREAS_THANK_YOU_COOKIE);
  const registrationId = isTareasRegistrationId(pending)
    ? pending
    : isTareasRegistrationId(previous)
      ? previous
      : null;
  if (!registrationId) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const isFirstConfirmation = isTareasRegistrationId(pending);
  const response = NextResponse.json({
    ok: true,
    registrationId,
    shouldTrackCompleteRegistration: isFirstConfirmation,
  });
  response.cookies.set(TAREAS_REGISTRATION_COOKIE, "", cookieOptions(0));
  response.cookies.set(
    TAREAS_THANK_YOU_COOKIE,
    registrationId,
    cookieOptions(THANK_YOU_SECONDS),
  );
  response.cookies.set(
    TAREAS_WHATSAPP_COOKIE,
    registrationId,
    cookieOptions(WHATSAPP_SECONDS),
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}
