import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isTareasRegistrationId,
  TAREAS_REGISTRATION_COOKIE,
  TAREAS_THANK_YOU_COOKIE,
} from "@/lib/tareas-registration";
import { TareasThankYouPage } from "./TareasThankYouPage";

export const metadata: Metadata = {
  title: "Último paso | Tareas con IA",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const cookieStore = await cookies();
  const pending = cookieStore.get(TAREAS_REGISTRATION_COOKIE)?.value;
  const previous = cookieStore.get(TAREAS_THANK_YOU_COOKIE)?.value;
  if (!isTareasRegistrationId(pending) && !isTareasRegistrationId(previous)) {
    redirect("/landings/tareas-con-ia");
  }
  return <TareasThankYouPage />;
}
