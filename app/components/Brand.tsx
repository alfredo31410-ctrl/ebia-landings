import Image from "next/image";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return <a className={`brand-logo${inverse ? " brand-logo--inverse" : ""}`} href="https://ebiacapacitacion.com/" aria-label="Ir al sitio principal de EBIA"><Image src={inverse ? "/logos/Logo2.png" : "/logos/Logo1.png"} alt="EBIA, Escuela Básica de Inteligencia Artificial" width={1080} height={1080} priority={!inverse} /></a>;
}
