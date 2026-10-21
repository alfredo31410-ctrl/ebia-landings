import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isTareasRegistrationId,
  TAREAS_REGISTRATION_COOKIE,
} from "@/lib/tareas-registration";
import { TareasThankYouPage } from "./TareasThankYouPage";

export const metadata: Metadata = {
  title: "Registro confirmado | Tareas con IA",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const registrationId = (await cookies()).get(TAREAS_REGISTRATION_COOKIE)?.value;
  if (!isTareasRegistrationId(registrationId)) {
    redirect("/landings/tareas-con-ia");
  }
  return <TareasThankYouPage registrationId={registrationId} />;
}
