import { NextResponse } from "next/server.js";
import { getPublicOrigin } from "../../../../lib/public-origin.ts";
import {
  createTareasRegistrationId,
  isTareasRegistrationId,
  TAREAS_REGISTRATION_COOKIE,
} from "../../../../lib/tareas-registration.ts";

function cookieValue(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function GET(request: Request) {
  const currentRegistrationId = cookieValue(request, TAREAS_REGISTRATION_COOKIE);
  const registrationId = isTareasRegistrationId(currentRegistrationId)
    ? currentRegistrationId
    : createTareasRegistrationId();
  const response = NextResponse.redirect(
    new URL("/landings/tareas-con-ia/gracias", getPublicOrigin(request)),
    303,
  );
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.cookies.set(TAREAS_REGISTRATION_COOKIE, registrationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 30,
    path: "/landings/tareas-con-ia",
  });
  return response;
}
