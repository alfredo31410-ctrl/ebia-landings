import { NextResponse } from "next/server.js";
import {
  createTareasNonce,
  TAREAS_NONCE_COOKIE,
} from "../../../../../../lib/tareas-registration.ts";

const ALLOWED_ORIGINS = new Set([
  "https://ebiacapacitacion.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
]);
const NONCE_SECONDS = 60 * 5;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    landing?: string;
  } | null;
  if (body?.landing !== "tareas-con-ia") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const nonce = createTareasNonce();
  const expiresAt = new Date(Date.now() + NONCE_SECONDS * 1000).toISOString();
  const response = NextResponse.json({ ok: true, nonce, expiresAt });
  response.cookies.set(TAREAS_NONCE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: NONCE_SECONDS,
    path: "/",
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Vary", "Origin");
  return response;
}
