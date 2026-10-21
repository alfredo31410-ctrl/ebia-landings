import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isTareasRegistrationId,
  TAREAS_REGISTRATION_COOKIE,
} from "@/lib/tareas-registration";
import { TareasThankYouRedirect } from "./TareasThankYouRedirect";

export const metadata: Metadata = {
  title: "Abriendo WhatsApp | Tareas con IA",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const registrationId = (await cookies()).get(TAREAS_REGISTRATION_COOKIE)?.value;
  if (!isTareasRegistrationId(registrationId)) {
    redirect("/landings/tareas-con-ia");
  }
  return <TareasThankYouRedirect registrationId={registrationId} />;
}
