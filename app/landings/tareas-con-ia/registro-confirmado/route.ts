import { NextResponse } from "next/server.js";
import { getPublicOrigin } from "../../../../lib/public-origin.ts";
import { TAREAS_REGISTRATION_COOKIE } from "../../../../lib/tareas-registration.ts";

export function GET(request: Request) {
  const response = NextResponse.redirect(
    new URL("/landings/tareas-con-ia/gracias", getPublicOrigin(request)),
    303,
  );
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.cookies.set(TAREAS_REGISTRATION_COOKIE, "confirmed", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 30,
    path: "/",
  });
  return response;
}
