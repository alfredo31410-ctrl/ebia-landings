import type { Metadata } from "next";
import { TeacherSalesPage } from "./TeacherSalesPage";

const title = "Inteligencia Artificial para Maestros: De Cero al Aula";
const description =
  "Curso en vivo para docentes los días 29 y 30 de septiembre y 1 de octubre a las 6:00 PM, hora CDMX. Aprende a crear videojuegos didácticos con IA.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: "https://ebiacapacitacion.com/landings/media/ia-desde-cero/Foto2.png",
        width: 1067,
        height: 1600,
        alt: "Instructora de EBIA para Inteligencia Artificial para Maestros",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://ebiacapacitacion.com/landings/media/ia-desde-cero/Foto2.png"],
  },
};

export default function Page() {
  return <TeacherSalesPage />;
}
