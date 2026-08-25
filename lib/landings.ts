export type CampaignVariant = "class";
export type CampaignFact = { label: string; value: string };
export type CampaignOutcome = { title: string; description: string };
export type EventStatus =
  | "upcoming"
  | "registration_open"
  | "registration_closed"
  | "live"
  | "ended";

export type LandingCampaign = {
  slug: "ia-desde-cero" | "ia-maestros";
  variant: CampaignVariant;
  seo: { title: string; description: string };
  topbar: string;
  eyebrow: string;
  headline: string;
  highlightedHeadline: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  microcopy: string;
  facts: CampaignFact[];
  image: { src: string; alt: string; width: number; height: number };
  visualNotes: [string, string];
  section: {
    eyebrow: string;
    title: string;
    outcomes: CampaignOutcome[];
  };
  integrations: {
    activeCampaignFormId: string;
    metaContentName: string;
  };
  event: {
    startsAt: string;
    displayDate: string;
    displayTime: string;
    displayTimeZone: string;
    /** TODO: definir antes de producción; no se asume una duración. */
    endsAt: string | null;
    registrationClosesAt: string | null;
    timeZone: string;
    whatsappEnvKey: string;
  };
  thanks: { title: string; message: string; actionLabel: string };
  instructor?: {
    /** Completar cuando EBIA confirme la información pública de la instructora. */
    name: string | null;
    role: string | null;
    bio: string | null;
  };
};

export const campaigns = {
  "ia-desde-cero": {
    slug: "ia-desde-cero",
    variant: "class",
    seo: {
      title: "IA desde cero",
      description:
        "Clase introductoria en vivo para aprender a usar Inteligencia Artificial con claridad y sin tecnicismos.",
    },
    topbar: "Clase en vivo para principiantes",
    eyebrow: "Aprendizaje claro y aplicable",
    headline: "Aprende Inteligencia Artificial",
    highlightedHeadline: "sin ser experto",
    intro:
      "Descubre cómo ordenar tus ideas, crear mejores instrucciones y utilizar la IA en tareas reales de trabajo, estudio o negocio, aunque estés comenzando desde cero.",
    primaryCta: "RESERVAR MI LUGAR GRATIS",
    secondaryCta: "Explorar el contenido",
    microcopy: "Registro gratuito · Clase en línea para principiantes",
    facts: [
      { label: "Fecha", value: "12 DE AGOSTO DE 2026" },
      { label: "Hora", value: "11:00 A. M." },
      { label: "Zona", value: "hora de Ciudad de México" },
      { label: "Modalidad", value: "EN LÍNEA" },
    ],
    image: {
      src: "/landings/ia-desde-cero/instructora.png",
      alt: "Instructora de EBIA en la clase de Inteligencia Artificial",
      width: 1067,
      height: 1600,
    },
    visualNotes: ["Nivel inicial", "Ejercicios prácticos"],
    section: {
      eyebrow: "Lo que te llevarás",
      title: "Una base útil para empezar a trabajar con IA",
      outcomes: [
        {
          title: "Piensa con estructura",
          description:
            "Convierte dudas e ideas sueltas en instrucciones claras y accionables.",
        },
        {
          title: "Crea mejores prompts",
          description:
            "Aprende un método sencillo para obtener respuestas más relevantes.",
        },
        {
          title: "Aplica desde el día uno",
          description:
            "Lleva lo aprendido a actividades concretas de trabajo, estudio o negocio.",
        },
      ],
    },
    integrations: {
      activeCampaignFormId: "297",
      metaContentName: "IA desde cero",
    },
    event: {
      startsAt: "2026-08-12T11:00:00-06:00",
      displayDate: "12 de agosto de 2026",
      displayTime: "11:00 a. m.",
      displayTimeZone: "hora de Ciudad de México",
      endsAt: null,
      registrationClosesAt: null,
      timeZone: "America/Mexico_City",
      whatsappEnvKey: "WHATSAPP_GROUP_URL_IA_DESDE_CERO",
    },
    thanks: {
      title: "Solo falta entrar al grupo oficial de WhatsApp",
      message: "Tus datos fueron guardados correctamente.",
      actionLabel: "COMPLETAR MI ACCESO EN WHATSAPP",
    },
  },
  "ia-maestros": {
    slug: "ia-maestros",
    variant: "class",
    seo: {
      title: "IA para Maestros · Clase gratuita",
      description:
        "Aprende a utilizar Inteligencia Artificial en tu trabajo docente, desde cero y con ejemplos prácticos.",
    },
    topbar: "Clase gratuita en línea para docentes",
    eyebrow: "CLASE GRATUITA EN LÍNEA PARA DOCENTES",
    headline: "La IA no tiene que dar la clase por ti.",
    highlightedHeadline: "Puede ayudarte a empezar.",
    intro:
      "Aprende a utilizar Inteligencia Artificial en tu trabajo docente, desde cero y paso a paso, con ejemplos prácticos para tu día a día como maestro.",
    primaryCta: "RESERVAR MI LUGAR GRATIS",
    secondaryCta: "Ver qué aprenderás",
    microcopy:
      "Paso 1 de 2 · Después de registrarte entrarás al grupo oficial de WhatsApp para recibir tu acceso.",
    facts: [
      { label: "Fecha", value: "2 de septiembre" },
      { label: "Hora", value: "6:00 PM" },
      { label: "Zona", value: "Hora CDMX" },
      { label: "Modalidad", value: "En línea · Clase gratuita" },
    ],
    image: {
      src: "/landings/media/ia-desde-cero/Foto2.png",
      alt: "Instructora de EBIA que impartirá la clase de IA para maestros",
      width: 1067,
      height: 1600,
    },
    visualNotes: ["Sin experiencia previa", "Aplicado a la enseñanza"],
    section: {
      eyebrow: "Qué aprenderás",
      title: "Una forma simple de empezar a usar IA como maestro",
      outcomes: [
        {
          title: "Ideas para actividades",
          description:
            "Aprende a pedir propuestas que puedas adaptar a tu grupo y a tus objetivos.",
        },
        {
          title: "Explicaciones más claras",
          description:
            "Utiliza la IA como apoyo para explorar otras maneras de presentar un tema.",
        },
        {
          title: "Preguntas para repasar",
          description:
            "Genera puntos de partida para reforzar lo visto en clase sin perder tu criterio.",
        },
      ],
    },
    integrations: {
      activeCampaignFormId: "327",
      metaContentName: "IA para Maestros",
    },
    event: {
      startsAt: "2026-09-02T18:00:00-06:00",
      displayDate: "2 de septiembre de 2026",
      displayTime: "6:00 p. m.",
      displayTimeZone: "hora CDMX",
      endsAt: null,
      registrationClosesAt: null,
      timeZone: "America/Mexico_City",
      whatsappEnvKey: "WHATSAPP_GROUP_URL_IA_MAESTROS",
    },
    thanks: {
      title: "Solo falta entrar al grupo oficial de WhatsApp",
      message: "Tus datos ya fueron guardados correctamente.",
      actionLabel: "ENTRAR AL GRUPO DE WHATSAPP",
    },
    instructor: {
      name: "Miranda Medina",
      role: "Instructora EBIA",
      bio: null,
    },
  },
} satisfies Record<string, LandingCampaign>;

export type CampaignSlug = keyof typeof campaigns;
export const getCampaign = (slug: CampaignSlug): LandingCampaign =>
  campaigns[slug];

export function getEventStatus(
  campaign: LandingCampaign,
  now = new Date(),
): EventStatus {
  const time = now.getTime();
  const start = new Date(campaign.event.startsAt).getTime();
  const close = campaign.event.registrationClosesAt
    ? new Date(campaign.event.registrationClosesAt).getTime()
    : null;
  const end = campaign.event.endsAt
    ? new Date(campaign.event.endsAt).getTime()
    : null;
  if (end && time >= end) return "ended";
  if (time >= start) return "live";
  if (close && time >= close) return "registration_closed";
  return "registration_open";
}
