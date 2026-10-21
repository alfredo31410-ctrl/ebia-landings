export const TAREAS_REGISTRATION_COOKIE = "ebia_tareas_con_ia_registration";

const REGISTRATION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createTareasRegistrationId() {
  return crypto.randomUUID();
}

export function isTareasRegistrationId(value: string | undefined): value is string {
  return Boolean(value && REGISTRATION_ID_PATTERN.test(value));
}
