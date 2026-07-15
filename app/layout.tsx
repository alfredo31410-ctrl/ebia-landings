import type { Metadata } from "next";
import { MetaPixel } from "@/app/components/analytics/MetaPixel";
import { getMetaPixelId } from "@/lib/env";
import "./globals.css";
import "./landing.css";

export const metadata: Metadata = {
  title: { default: "EBIA | Formación digital práctica", template: "%s | EBIA" },
  description: "Experiencias de aprendizaje práctico para desarrollar habilidades digitales.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}<MetaPixel pixelId={getMetaPixelId()} /></body></html>;
}
