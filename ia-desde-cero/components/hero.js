import { landingContent } from '../data/content.js';

export function renderHero() {
  const { eyebrow, title, intro, primaryButtonLabel, secondaryButtonLabel, microcopy, eventItems, chips, visual } = landingContent;

  return `
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">
          <span></span>
          ${eyebrow}
        </div>

        <h1>
          ${title[0]}
          <span>${title[1]}</span>
        </h1>

        <p class="intro-card">${intro}</p>

        <div class="actions">
          <button class="primary-button" type="button" data-open-form>
            ${primaryButtonLabel}
            <span>→</span>
          </button>

          <a class="secondary-button" href="#aprendizaje">
            ${secondaryButtonLabel}
          </a>
        </div>

        <p class="microcopy">${microcopy}</p>

        <div class="event-grid" aria-label="Datos de la clase">
          ${eventItems
            .map(
              (item) => `
                <article>
                  <small>${item.label}</small>
                  <strong>${item.value}</strong>
                </article>
              `
            )
            .join('')}
        </div>

        <div class="tag-row">
          ${chips.map((chip) => `<span>${chip}</span>`).join('')}
        </div>
      </div>

      <div class="hero-visual" id="aprendizaje">
        <div class="hero-stage">
          <div class="hero-glow" aria-hidden="true"></div>
          <div class="hero-orbit orbit-one" aria-hidden="true"></div>
          <div class="hero-orbit orbit-two" aria-hidden="true"></div>

          <img
            class="hero-character"
            src="./assets/Foto1.png"
            alt="Instructora de EBIA para la clase gratuita de Inteligencia Artificial"
            fetchpriority="high"
          />

          <div class="floating-chip chip-top">${visual.floatingChips[0]}</div>
          <div class="floating-chip chip-middle">${visual.floatingChips[1]}</div>

          <div class="ai-panel visual-card">
            <div class="panel-heading">
              <strong>${visual.panelTitle}</strong>
              <span>${visual.panelLabel}</span>
            </div>

            ${visual.steps
              .map(
                (step) => `
                  <div class="panel-step">
                    <b>${step.number}</b>
                    <div>
                      <strong>${step.title}</strong>
                      <p>${step.description}</p>
                    </div>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}
