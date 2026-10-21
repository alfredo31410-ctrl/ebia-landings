import { NextResponse } from "next/server.js";
import { getWhatsAppGroupUrl } from "../../../../../../lib/whatsapp.ts";
import { TAREAS_REGISTRATION_COOKIE } from "../../../../../../lib/tareas-registration.ts";

function cookieValue(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function GET(request: Request) {
  const confirmed =
    cookieValue(request, TAREAS_REGISTRATION_COOKIE) === "confirmed";
  const target = getWhatsAppGroupUrl("tareas-con-ia");

  if (!confirmed || !target) {
    return NextResponse.redirect(
      new URL("/landings/tareas-con-ia", request.url),
      303,
    );
  }

  const response = NextResponse.redirect(target, 307);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(TAREAS_REGISTRATION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
