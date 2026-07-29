export type DirectSalesContent = {
  product: string;
  category: string;
  eyebrow: string;
  headline: string;
  accentHeadline: string;
  subheadline: string;
  audience: string;
  problem: string;
  mechanism: string;
  instructor: string;
  instructorRole: string;
  price: string;
  currency: string;
  payment: string;
  duration: string;
  level: string;
  modality: string;
  access: string;
  guarantee: string;
  support: string;
  checkoutName: string;
  benefits: { title: string; text: string; outcome: string }[];
  modules: { number: string; title: string; result: string; topics: string[] }[];
  bonuses: { title: string; text: string; use: string }[];
  faqs: { question: string; answer: string }[];
};

/** Datos provisionales: sustituir cuando el producto y sus condiciones reales estén definidos. */
export const directSalesPage: DirectSalesContent = {
  product: "Ecosistema IA desde cero",
  category: "Programa práctico",
  eyebrow: "Aprendizaje aplicado · datos provisionales",
  headline: "Convierte la inteligencia artificial en una forma más clara de trabajar",
  accentHeadline: "desde tu primer proyecto",
  subheadline: "Un recorrido guiado para entender qué herramientas usar, cómo pedir mejores resultados y cómo llevar la IA a tareas reales sin perderte entre tutoriales.",
  audience: "Personas que quieren empezar a usar IA con criterio, aunque todavía no tengan experiencia técnica.",
  problem: "Guardar herramientas y ver tutoriales sueltos no crea un sistema de trabajo. Sin una ruta, es fácil saltar entre novedades sin saber qué aplicar ni cómo evaluar el resultado.",
  mechanism: "Aprendes con una secuencia simple: entender el problema, elegir la herramienta, dar contexto, revisar la salida y convertirla en un proceso repetible.",
  instructor: "Equipo EBIA",
  instructorRole: "Formación digital práctica",
  price: "$1,490",
  currency: "MXN",
  payment: "Pago único",
  duration: "Acceso durante 12 meses",
  level: "Inicial",
  modality: "A tu ritmo",
  access: "Acceso digital después del pago",
  guarantee: "Garantía y condiciones por confirmar antes de publicar.",
  support: "Soporte por confirmar",
  checkoutName: "ecosistema-ia",
  benefits: [
    { title: "De la curiosidad a una tarea concreta", text: "Deja de probar herramientas al azar y parte de lo que necesitas resolver.", outcome: "Un punto de partida claro para cada uso." },
    { title: "Prompts que puedes revisar", text: "Aprende a dar contexto, pedir un formato y mejorar una respuesta paso a paso.", outcome: "Instrucciones más consistentes y útiles." },
    { title: "Un sistema que se puede repetir", text: "Organiza tus aprendizajes para volver a usarlos en contenidos, investigación y operación.", outcome: "Menos fricción en tareas frecuentes." },
  ],
  modules: [
    { number: "01", title: "El mapa de la IA útil", result: "Distingue qué problemas sí conviene resolver con IA.", topics: ["Casos de uso", "Límites y revisión", "Criterios para elegir"] },
    { number: "02", title: "La instrucción que da dirección", result: "Construye prompts con contexto, objetivo y formato.", topics: ["Estructura base", "Ejemplos", "Iteración"] },
    { number: "03", title: "Del resultado al proceso", result: "Convierte una respuesta aislada en un flujo de trabajo.", topics: ["Plantillas", "Control de calidad", "Documentación"] },
    { number: "04", title: "Tu primer sistema aplicado", result: "Diseña una aplicación concreta para tu contexto.", topics: ["Definición del problema", "Implementación", "Siguiente mejora"] },
  ],
  bonuses: [
    { title: "Biblioteca de plantillas", text: "Prompts base para empezar a practicar con estructura.", use: "Acelera tus primeros ejercicios." },
    { title: "Checklist de revisión", text: "Una guía corta para evaluar respuestas antes de usarlas.", use: "Reduce errores por copiar y pegar sin revisar." },
  ],
  faqs: [
    { question: "¿Necesito experiencia previa?", answer: "No. El recorrido está planteado para comenzar desde lo esencial y avanzar con ejemplos prácticos." },
    { question: "¿Puedo avanzar desde el móvil?", answer: "El contenido está pensado para consultarse en línea. La compatibilidad final y los requisitos de acceso deben confirmarse con los datos reales del producto." },
    { question: "¿Cuándo recibo acceso?", answer: "La intención es entregar acceso digital después del pago, sujeto a la configuración final de Hotmart." },
    { question: "¿Incluye soporte?", answer: "El tipo de soporte todavía está por confirmar. Esta sección debe actualizarse antes de publicar la oferta." },
    { question: "¿Tiene garantía?", answer: "Las condiciones reales de garantía aún no están definidas. No se debe comunicar una garantía específica hasta confirmarla." },
  ],
};
