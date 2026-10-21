import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TAREAS_REGISTRATION_COOKIE } from "@/lib/tareas-registration";

export const metadata: Metadata = {
  title: "Abriendo WhatsApp | Tareas con IA",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const registration = (await cookies()).get(TAREAS_REGISTRATION_COOKIE)?.value;
  redirect(
    registration === "confirmed"
      ? "/landings/tareas-con-ia/api/whatsapp/redirect"
      : "/landings/tareas-con-ia",
  );
}
