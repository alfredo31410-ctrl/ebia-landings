export type CampaignVariant = "class";

export type CampaignFact = { label: string; value: string };
export type CampaignOutcome = { title: string; description: string };

export type LandingCampaign = {
  slug: "ia-desde-cero";
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
  section: { eyebrow: string; title: string; outcomes: CampaignOutcome[] };
  integrations: {
    activeCampaignFormId: string;
    metaContentName: string;
  };
  thanks: { title: string; message: string; actionLabel: string };
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
      "Descubre cómo ordenar ideas, crear mejores instrucciones y aplicar herramientas de IA en tareas reales desde tu primera sesión.",
    primaryCta: "Reservar acceso gratuito",
    secondaryCta: "Explorar el contenido",
    microcopy: "Registro gratuito · Cupo sujeto a disponibilidad",
    facts: [
      { label: "Fecha", value: "29 de julio" },
      { label: "Horario", value: "12 a 1 PM" },
      { label: "Zona", value: "CDMX" },
      { label: "Modalidad", value: "En línea" },
    ],
    image: {
      src: "/landings/ia-desde-cero/instructora.png",
      alt: "Instructora de EBIA en la clase de Inteligencia Artificial",
      width: 1067,
      height: 600,
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
      activeCampaignFormId: "273",
      metaContentName: "IA desde cero",
    },
    thanks: {
      title: "Tu registro está listo",
      message:
        "Revisa tu correo para encontrar los datos de acceso y las indicaciones de la clase.",
      actionLabel: "Conocer EBIA",
    },
  },
} satisfies Record<string, LandingCampaign>;

export type CampaignSlug = keyof typeof campaigns;
export const getCampaign = (slug: CampaignSlug): LandingCampaign =>
  campaigns[slug];
