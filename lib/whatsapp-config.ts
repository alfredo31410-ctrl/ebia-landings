import { landingConfig as correosProfesionalesConfig } from "../app/landings/correos-profesionales-con-ia/config.ts";
import { landingConfig as iaDesdeCeroConfig } from "../app/landings/ia-desde-cero/config.ts";
import { landingConfig as iaMaestrosConfig } from "../app/landings/ia-maestros/config.ts";
import { landingConfig as tareasConIaConfig } from "../app/landings/tareas-con-ia/config.ts";
import { landingConfig as excelConIaConfig } from "../app/landings/excel-con-inteligencia-artificial/config.ts";
import type { CampaignSlug } from "./landings.ts";

type LandingWhatsAppConfig = {
  whatsappGroupUrl: string | null;
};

const configs = {
  "ia-desde-cero": iaDesdeCeroConfig,
  "ia-maestros": iaMaestrosConfig,
  "tareas-con-ia": tareasConIaConfig,
  "correos-profesionales-con-ia": correosProfesionalesConfig,
  "excel-con-inteligencia-artificial": excelConIaConfig,
} satisfies Record<CampaignSlug, LandingWhatsAppConfig>;

export function getLandingWhatsAppConfig(slug: CampaignSlug) {
  return configs[slug];
}
