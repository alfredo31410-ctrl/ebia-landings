import type { Metadata } from "next";
import { TareasLandingPage } from "./TareasLandingPage";

export const metadata: Metadata = {
  title: "Haz la tarea de tus hijos con IA · Clase gratuita",
  description:
    "Aprende a usar Inteligencia Artificial para explicar, practicar y acompañar las tareas de tus hijos sin resolver todo por ellos.",
};

export default function Page() {
  return <TareasLandingPage />;
}
