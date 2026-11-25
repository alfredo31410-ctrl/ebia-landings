"use client";

import { useCallback, useEffect } from "react";
import { Brand } from "@/app/components/Brand";
import { ActiveCampaignForm } from "@/app/components/forms/ActiveCampaignForm";
import { trackMetaEventWhenReady } from "@/lib/integrations/meta-pixel";
import styles from "./page.module.css";

const learnings = [
  ["01", "Distingue apoyo de sustitución", "Entiende qué puede resolver la IA y qué decisiones deben seguir siendo tuyas."],
  ["02", "Desarrolla una idea", "Usa ChatGPT para explorar premisas, personajes, conflictos y posibles caminos narrativos."],
  ["03", "Edita sin perder tu voz", "Pide observaciones concretas para mejorar claridad, ritmo y estructura de un texto propio."],
] as const;

const principles = [
  ["La IA pregunta y propone", "Tú eliges las respuestas, descartas lo que no encaja y marcas el rumbo de la historia."],
  ["Tu texto sigue siendo el centro", "Una herramienta puede señalar opciones; no conoce tu experiencia, intención ni sensibilidad."],
  ["El criterio no se delega", "Aprende a revisar una sugerencia antes de adoptarla, con tus lectores y tu propósito en mente."],
] as const;

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
}

export function LibroConIaLanding() {
  useEffect(() => trackMetaEventWhenReady("ViewContent", "libro-con-ia", { content_name: "Tu primer libro con IA", content_category: "Clase gratuita" }), []);
  const showForm = useCallback(() => {
    document.getElementById("registro")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.notice}>CLASE GRATUITA EN LÍNEA · EBIA</div>
      <header className={styles.header}><div className={styles.shell}><Brand /><nav><a href="#aprenderas">Lo que aprenderás</a><a href="#metodo">El enfoque</a><a href="#preguntas">Preguntas</a></nav><button onClick={showForm}>REGISTRARME GRATIS</button></div></header>

      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div>
            <p className={styles.eyebrow}>ESCRITURA + INTELIGENCIA ARTIFICIAL</p>
            <h1>La IA puede acompañar tu escritura. <em>No escribir por ti.</em></h1>
            <p className={styles.lead}>Descubre cómo utilizar ChatGPT para desarrollar una idea literaria, mejorar un texto y tomar mejores decisiones editoriales sin perder tu estilo.</p>
            <div className={styles.actions}><button className={styles.primary} onClick={showForm}>REGISTRARME GRATIS <Arrow /></button><span>En línea · Sin costo · Para escritores en cualquier etapa</span></div>
          </div>
          <div className={styles.heroVisual} aria-label="Una página de manuscrito con anotaciones editoriales">
            <div className={styles.paper}><small>BORRADOR · CAPÍTULO 1</small><p>La casa guardaba un silencio distinto desde que Clara se fue.</p><p>Tomás abrió la ventana. No buscaba aire: buscaba una señal.</p><i>¿Qué conflicto podría crecer aquí?</i><b>Tu decisión</b></div>
            <span className={styles.markOne}>✦</span><span className={styles.markTwo}>✦</span>
          </div>
        </div>
      </section>

      <section className={styles.learning} id="aprenderas"><div className={styles.shell}><p className={styles.sectionTag}>LO QUE VEREMOS EN LA CLASE</p><h2>Una herramienta para pensar mejor tu texto, <em>no para reemplazarlo.</em></h2><div className={styles.cardGrid}>{learnings.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className={styles.example}><div className={`${styles.shell} ${styles.exampleGrid}`}><div><p className={styles.sectionTag}>UN PROCESO QUE CONSERVA TU AUTORÍA</p><h2>No le pidas una novela. <em>Inicia una conversación.</em></h2><p>Una buena petición le da contexto a la IA y un papel limitado. Tú llevas el material, defines el objetivo y evalúas lo que vuelve.</p></div><div className={styles.flow}><article><small>TÚ PARTES DE</small><strong>“Quiero contar la historia de dos hermanas que vuelven a su pueblo.”</strong></article><div className={styles.flowLine}>↓</div><article className={styles.prompt}><small>PUEDES PEDIR</small><strong>“Hazme preguntas que me ayuden a encontrar el conflicto central. No propongas la historia por mí.”</strong></article><div className={styles.flowLine}>↓</div><article className={styles.result}><small>TÚ DECIDES</small><strong>Qué preguntas sirven, qué ideas transformar y cuál será tu historia.</strong></article></div></div></section>

      <section className={styles.principles} id="metodo"><div className={styles.shell}><p className={styles.sectionTag}>EL ENFOQUE</p><h2>La tecnología puede ampliar tu proceso. <em>Tu mirada lo vuelve literatura.</em></h2><div className={styles.principleGrid}>{principles.map(([title, copy], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className={styles.registration} id="registro"><div className={`${styles.shell} ${styles.registrationBox}`}><div><p className={styles.sectionTag}>CLASE GRATUITA EN LÍNEA</p><h2>Escribe con IA sin renunciar a tu voz.</h2><p>Regístrate para recibir tu acceso, la fecha y los recordatorios de la sesión.</p></div><div><ActiveCampaignForm formId="407" campaign="libro-con-ia" metaContentName="Tu primer libro con IA" confirmationPath="/landings/libro-con-ia/registro-confirmado" showIntro={false} /></div></div></section>

      <section className={styles.faq} id="preguntas"><div className={`${styles.shell} ${styles.faqGrid}`}><div><p className={styles.sectionTag}>PREGUNTAS FRECUENTES</p><h2>Para escribir con una herramienta, no bajo su sombra.</h2></div><div><details><summary>¿Necesito saber usar ChatGPT?<span>+</span></summary><p>No. Veremos formas claras de plantear una petición y evaluar una respuesta, desde cero.</p></details><details><summary>¿La IA puede escribir mi libro?<span>+</span></summary><p>Puede generar texto, pero no sustituye tu experiencia, intención ni criterio. La clase se enfoca en usarla como apoyo editorial.</p></details><details><summary>¿Sirve si ya tengo un borrador?<span>+</span></summary><p>Sí. Aprenderás a pedir ayuda puntual para revisar escenas, claridad, ritmo y alternativas de edición.</p></details></div></div></section>
      <footer className={styles.footer}><div className={styles.shell}><Brand inverse /><p>Inteligencia artificial clara, útil y aplicable.</p><small>© 2026 EBIA. Todos los derechos reservados.</small></div></footer>
    </main>
  );
}
