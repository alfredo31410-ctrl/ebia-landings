"use client";
import { useEffect, useState } from "react";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";

export default function Page() {
  const [ready, setReady] = useState(false);
  useEffect(() => { void fetch("/landings/libro-con-ia/api/registrations/consume", { method: "POST", credentials: "same-origin" }).then(async (response) => {
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.ok) return;
    if (body.shouldTrackCompleteRegistration) trackMetaEventWhenReady("CompleteRegistration", `libro-con-ia:${body.registrationId}`, { content_name: "Tu primer libro con IA", content_category: "Registro ActiveCampaign", status: "completed" }, "persistent");
    setReady(true);
  }); }, []);
  return <main><h1>{ready ? "Tu registro está confirmado" : "Confirmando tu registro…"}</h1><p>{ready ? "Pronto recibirás la información de la clase y el acceso al grupo de WhatsApp." : ""}</p></main>;
}
