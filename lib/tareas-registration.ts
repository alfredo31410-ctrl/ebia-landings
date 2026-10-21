export const TAREAS_REGISTRATION_COOKIE = "ebia_tareas_con_ia_registration";
export const TAREAS_NONCE_COOKIE = "ebia_tareas_con_ia_nonce";
export const TAREAS_THANK_YOU_COOKIE = "ebia_tareas_con_ia_thank_you";
export const TAREAS_WHATSAPP_COOKIE = "ebia_tareas_con_ia_whatsapp";

const REGISTRATION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createTareasRegistrationId() {
  return crypto.randomUUID();
}

export const createTareasNonce = createTareasRegistrationId;

export function isTareasRegistrationId(value: string | undefined): value is string {
  return Boolean(value && REGISTRATION_ID_PATTERN.test(value));
}
