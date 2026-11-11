import { NextResponse } from "next/server";
import { landingConfig } from "../../../config";

export function GET() {
  // El grupo es el último paso que ActiveCampaign muestra tras enviar el formulario.
  return NextResponse.redirect(landingConfig.whatsappGroupUrl, {
    headers: { "Cache-Control": "no-store" },
  });
}
