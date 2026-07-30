export type DirectSalesContent = {
  product: { name: string; shortName: string; level: string; format: string; dates: string };
  price: { amount: number; currency: "MXN"; formatted: string; paymentLabel: string };
  eyebrow: string;
  promise: string;
  audience: string[];
  outcomes: { title: string; text: string }[];
  howItWorks: string[];
  includes: string[];
  afterPurchase: string[];
  faqs: { question: string; answer: string }[];
  seller: string;
  checkoutName: string;
};

export const directSalesPage: DirectSalesContent = {
  product: {
    name: "Inteligencia Artificial: Reto Práctico de 3 Días",
    shortName: "Reto Práctico de IA",
    level: "Desde cero",
    format: "3 días en vivo",
    dates: "17 al 19 de agosto",
  },
  price: { amount: 197, currency: "MXN", formatted: "$197 MXN", paymentLabel: "Pago único" },
  eyebrow: "Reto práctico en vivo · Nivel inicial",
  promise: "Aprende a usar la IA desde cero para ahorrar tiempo, crear contenido y mejorar tu productividad.",
  audience: [
    "Personas que quieren empezar a usar inteligencia artificial desde cero.",
    "Personas que buscan ahorrar tiempo en tareas cotidianas.",
    "Personas que quieren crear contenido con más estructura.",
    "Personas que quieren mejorar su productividad mediante herramientas de IA.",
  ],
  outcomes: [
    { title: "Entender por dónde empezar", text: "Identifica cómo comenzar a usar herramientas de IA con una guía práctica y clara." },
    { title: "Ahorrar tiempo en tareas concretas", text: "Aplica IA como apoyo para resolver actividades cotidianas con más orden." },
    { title: "Crear contenido con estructura", text: "Utiliza la IA como apoyo para organizar ideas y avanzar en tu productividad." },
  ],
  howItWorks: [
    "Se realiza durante tres días.",
    "Las sesiones son en vivo.",
    "Está pensado para personas que empiezan desde cero.",
    "El enfoque es introductorio y práctico.",
  ],
  includes: [
    "Participación en el Reto Práctico de 3 Días.",
    "Tres días en vivo.",
    "Formación introductoria y práctica.",
    "Proceso de compra seguro mediante Hotmart.",
  ],
  afterPurchase: [
    "Completa el pago en Hotmart.",
    "Recibe la confirmación de compra en tu correo.",
    "Consulta las instrucciones de acceso enviadas para participar en el reto.",
  ],
  faqs: [
    { question: "¿Necesito experiencia previa?", answer: "No. El reto está planteado para personas que quieren comenzar a utilizar inteligencia artificial desde cero." },
    { question: "¿Cuándo se realiza?", answer: "Del 17 al 19 de agosto." },
    { question: "¿Cuál es la modalidad?", answer: "El reto se realiza en vivo durante tres días." },
    { question: "¿Cuánto cuesta?", answer: "El acceso tiene un precio de $197 MXN." },
    { question: "¿Cómo se procesa el pago?", answer: "El pago se procesa de forma segura mediante Hotmart para CEFIN - Contabilidad e Impuestos." },
    { question: "¿Cuándo recibiré las instrucciones?", answer: "Después de completar la compra, recibirás por correo la confirmación y las indicaciones disponibles para acceder al reto." },
  ],
  seller: "CEFIN - Contabilidad e Impuestos",
  checkoutName: "Inteligencia Artificial: Reto Práctico de 3 Días",
};
